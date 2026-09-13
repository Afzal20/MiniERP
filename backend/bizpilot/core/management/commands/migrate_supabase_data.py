from __future__ import annotations

import datetime
import json
import logging
import os
import re
from decimal import Decimal
from typing import Any

from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from django.db import transaction
from django.utils import timezone

from bizpilot.erp.models import Client
from bizpilot.erp.models import Expense
from bizpilot.erp.models import Invoice
from bizpilot.erp.models import InvoiceItem
from bizpilot.erp.models import InvoiceSequence
from bizpilot.erp.models import Payment
from bizpilot.erp.models import Product
from bizpilot.orgs.models import Invite
from bizpilot.orgs.models import Membership
from bizpilot.orgs.models import Organization
from bizpilot.orgs.models import Role
from bizpilot.orgs.services import seed_permissions
from bizpilot.orgs.services import seed_system_roles_for_org
from bizpilot.users.models import Profile

logger = logging.getLogger(__name__)
User = get_user_model()


def strip_sql_comments(sql: str) -> str:
    """Remove SQL comments while preserving strings."""
    lines: list[str] = []
    for line in sql.splitlines():
        in_quotes = False
        clean_chars: list[str] = []
        i = 0
        n = len(line)
        while i < n:
            ch = line[i]
            if ch == "'":
                if in_quotes and i + 1 < n and line[i + 1] == "'":
                    clean_chars.append("''")
                    i += 2
                    continue
                in_quotes = not in_quotes
                clean_chars.append(ch)
                i += 1
            elif not in_quotes and ch == "-" and i + 1 < n and line[i + 1] == "-":
                break
            else:
                clean_chars.append(ch)
                i += 1
        lines.append("".join(clean_chars))
    return "\n".join(lines)


def parse_date_expression(expr: str, base_date: datetime.date | None = None) -> datetime.date:
    """Parse postgres date expressions like (now() - interval '5 months')::date."""
    if base_date is None:
        base_date = timezone.localdate()
    expr = expr.strip()
    if expr in ("now()", "now()::date", "current_date"):
        return base_date

    match = re.search(r"now\(\)\s*([+-])\s*interval\s*'([^']+)'", expr, re.IGNORECASE)
    if not match:
        clean = expr.strip("'\"")
        try:
            return datetime.date.fromisoformat(clean)
        except ValueError:
            return base_date

    operator = match.group(1)
    body = match.group(2).lower()
    delta = relativedelta()
    for part in re.finditer(r"(\d+)\s*(month|week|day|year)s?", body):
        val = int(part.group(1))
        unit = part.group(2)
        if unit == "month":
            delta += relativedelta(months=val)
        elif unit == "week":
            delta += relativedelta(weeks=val)
        elif unit == "day":
            delta += relativedelta(days=val)
        elif unit == "year":
            delta += relativedelta(years=val)

    return (base_date + delta) if operator == "+" else (base_date - delta)


def clean_cell_value(raw: str) -> Any:
    """Clean a raw SQL value token into a Python data type."""
    raw = raw.strip()
    if not raw or raw.lower() == "null":
        return None
    if raw.lower() == "true":
        return True
    if raw.lower() == "false":
        return False
    if raw.startswith("'") and raw.endswith("'"):
        # Quoted string - unescape ''
        inner = raw[1:-1]
        return inner.replace("''", "'")
    if "now()" in raw.lower():
        return parse_date_expression(raw)
    try:
        if "." in raw:
            return Decimal(raw)
        return int(raw)
    except (ValueError, ArithmeticError):
        return raw


def parse_values_block(values_str: str) -> list[list[str]]:
    """Parse SQL VALUES block (row1), (row2) into a list of row tokens."""
    rows: list[list[str]] = []
    i = 0
    n = len(values_str)
    while i < n:
        while i < n and values_str[i] != "(":
            i += 1
        if i >= n:
            break
        i += 1  # skip (

        current_row: list[str] = []
        cell_chars: list[str] = []
        in_quotes = False
        paren_depth = 0

        while i < n:
            ch = values_str[i]
            if ch == "'":
                if in_quotes:
                    if i + 1 < n and values_str[i + 1] == "'":
                        cell_chars.append("'")
                        i += 2
                        continue
                    in_quotes = False
                else:
                    in_quotes = True
                cell_chars.append(ch)
                i += 1
            elif not in_quotes:
                if ch == "(":
                    paren_depth += 1
                    cell_chars.append(ch)
                    i += 1
                elif ch == ")":
                    if paren_depth > 0:
                        paren_depth -= 1
                        cell_chars.append(ch)
                        i += 1
                    else:
                        current_row.append("".join(cell_chars).strip())
                        cell_chars = []
                        i += 1
                        break
                elif ch == "," and paren_depth == 0:
                    current_row.append("".join(cell_chars).strip())
                    cell_chars = []
                    i += 1
                else:
                    cell_chars.append(ch)
                    i += 1
            else:
                cell_chars.append(ch)
                i += 1

        if current_row:
            rows.append(current_row)

    return rows


class Command(BaseCommand):
    help = "Migrate Supabase data from a SQL seed/dump file or live PostgreSQL connection into Django."

    def add_arguments(self, parser: Any) -> None:
        parser.add_argument(
            "--file",
            type=str,
            default="",
            help="Path to Supabase SQL seed or dump file (default: invoive_generator-next/supabase/seed.sql)",
        )
        parser.add_argument(
            "--database-url",
            type=str,
            default="",
            help="Direct PostgreSQL connection URL for live Supabase database",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Parse and validate data without writing changes to the database",
        )
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing organizations and business data before migrating",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        file_path = options.get("file")
        db_url = options.get("database_url") or os.environ.get("SUPABASE_DATABASE_URL")
        dry_run = options.get("dry_run", False)
        reset = options.get("reset", False)
        if not file_path and not db_url:
            # Default to repo seed.sql path
            workspace_root = settings.BASE_DIR.parent
            default_seed = workspace_root / "frontend" / "supabase" / "seed.sql"
            if not default_seed.exists():
                default_seed = workspace_root / "invoive_generator-next" / "supabase" / "seed.sql"
            if default_seed.exists():
                file_path = str(default_seed)
            else:
                raise CommandError("No --file or --database-url specified, and default seed.sql not found.")

        self.stdout.write("Initializing Supabase to Django Data Migration")
        if dry_run:
            self.stdout.write("DRY-RUN MODE ENABLED - No changes will be committed.")

        tables_data: dict[str, list[dict[str, Any]]] = {}

        if db_url:
            self.stdout.write(f"Connecting to live database at {db_url.split('@')[-1]}...")
            tables_data = self._extract_from_database(db_url)
        else:
            if not file_path:
                raise CommandError("No SQL file path specified or found.")
            file_str = str(file_path)
            self.stdout.write(f"Parsing SQL file from {file_str}...")
            tables_data = self._extract_from_file(file_str)

        for tbl, rows in tables_data.items():
            self.stdout.write(f"  Extracted {len(rows)} records from {tbl}")

        if dry_run:
            self.stdout.write("Dry run completed successfully. Verification passed.")
            return

        with transaction.atomic():
            if reset:
                self.stdout.write("Reset requested: cleaning up existing organizations and ERP data...")
                Organization.objects.all().delete()
                # Users keep superusers, delete imported users
                User.objects.filter(is_superuser=False, is_staff=False).delete()

            counts = self._load_data(tables_data)

        self.stdout.write(self.style.SUCCESS("Migration completed successfully! Summary of imported records:"))
        for entity, count in counts.items():
            self.stdout.write(f"  - {entity}: {count}")

    def _extract_from_file(self, file_path: str) -> dict[str, list[dict[str, Any]]]:
        if not os.path.exists(file_path):
            raise CommandError(f"File not found: {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            content = strip_sql_comments(f.read())

        insert_pattern = re.compile(
            r"insert\s+into\s+([\w\.]+)\s*\(([^)]+)\)\s*values\s*([\s\S]+?)(?:on\s+conflict|;\s*--|;\s*$)",
            re.IGNORECASE | re.MULTILINE,
        )

        tables_data: dict[str, list[dict[str, Any]]] = {}

        for match in insert_pattern.finditer(content):
            table_name = match.group(1).lower()
            columns = [c.strip() for c in match.group(2).split(",")]
            raw_values_block = match.group(3)
            parsed_rows = parse_values_block(raw_values_block)

            if table_name not in tables_data:
                tables_data[table_name] = []

            for row in parsed_rows:
                if len(row) != len(columns):
                    continue
                row_dict = {}
                for col, val in zip(columns, row):
                    row_dict[col] = clean_cell_value(val)
                tables_data[table_name].append(row_dict)

        return tables_data

    def _extract_from_database(self, db_url: str) -> dict[str, list[dict[str, Any]]]:
        try:
            import psycopg
            from psycopg import sql
            from psycopg.rows import dict_row
        except ImportError as err:
            raise CommandError("psycopg is required for live database extraction.") from err

        tables_to_query = [
            ("auth.users", "id, email, encrypted_password, raw_user_meta_data"),
            ("public.profiles", "*"),
            ("public.organizations", "*"),
            ("public.team_members", "*"),
            ("public.clients", "*"),
            ("public.products", "*"),
            ("public.invoices", "*"),
            ("public.invoice_items", "*"),
            ("public.payments", "*"),
            ("public.expenses", "*"),
        ]

        tables_data: dict[str, list[dict[str, Any]]] = {}

        with psycopg.connect(db_url, row_factory=dict_row) as conn:
            with conn.cursor() as cur:
                for table, cols in tables_to_query:
                    try:
                        cur.execute(
                            sql.SQL("SELECT {} FROM {}").format(
                                sql.SQL(cols),
                                sql.SQL(table),
                            )
                        )
                        rows = cur.fetchall()
                        tables_data[table] = [dict(r) for r in rows]
                    except Exception as err:
                        self.stdout.write(self.style.WARNING(f"Could not read {table}: {err}"))
                        conn.rollback()

        return tables_data

    def _load_data(self, tables_data: dict[str, list[dict[str, Any]]]) -> dict[str, int]:
        counts = {
            "users": 0,
            "profiles": 0,
            "organizations": 0,
            "memberships": 0,
            "invites": 0,
            "clients": 0,
            "products": 0,
            "invoices": 0,
            "invoice_items": 0,
            "payments": 0,
            "expenses": 0,
        }

        # 1. Seed global permissions catalog
        seed_permissions()

        # 2. Migrate auth.users
        user_id_map: dict[str, Any] = {}
        for row in tables_data.get("auth.users", []):
            email = (row.get("email") or "").strip().lower()
            if not email:
                continue

            raw_meta = row.get("raw_user_meta_data")
            full_name = ""
            if isinstance(raw_meta, str) and raw_meta.startswith("{"):
                try:
                    meta_dict = json.loads(raw_meta)
                    full_name = meta_dict.get("full_name", "")
                except json.JSONDecodeError:
                    pass
            elif isinstance(raw_meta, dict):
                full_name = raw_meta.get("full_name", "")

            enc_pass = row.get("encrypted_password") or ""
            # Prepare bcrypt format for Django BCryptPasswordHasher
            if enc_pass.startswith("$2"):
                django_password = f"bcrypt$${enc_pass.lstrip('$')}"
            else:
                django_password = enc_pass

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "name": full_name,
                },
            )
            if django_password:
                user.password = django_password
                user.save(update_fields=["password"])

            if row.get("id"):
                user_id_map[str(row["id"])] = user
            if created:
                counts["users"] += 1

        # 3. Migrate profiles
        for row in tables_data.get("public.profiles", []):
            prof_id = str(row.get("id"))
            user = user_id_map.get(prof_id)
            if not user and row.get("company_email"):
                user = User.objects.filter(email=row["company_email"].lower()).first()

            if user:
                profile, _ = Profile.objects.get_or_create(user=user)
                profile.full_name = row.get("full_name") or profile.full_name
                profile.company_name = row.get("company_name") or ""
                profile.company_email = row.get("company_email") or ""
                profile.company_address = row.get("company_address") or ""
                profile.company_phone = row.get("company_phone") or ""
                profile.default_currency = row.get("default_currency") or "USD"
                profile.default_tax_rate = Decimal(str(row.get("default_tax_rate") or "0.00"))
                profile.default_notes = row.get("default_notes") or ""
                profile.default_terms = row.get("default_terms") or ""
                profile.save()
                counts["profiles"] += 1

        # 4. Migrate organizations
        org_map: dict[str, Organization] = {}
        for row in tables_data.get("public.organizations", []):
            org_id = str(row.get("id"))
            owner_id = str(row.get("owner_id"))
            owner = user_id_map.get(owner_id)
            if not owner:
                owner = User.objects.first()
                if not owner:
                    owner = User.objects.create(email="owner@bizpilot.app", name="Owner")

            org, created = Organization.objects.update_or_create(
                id=org_id,
                defaults={
                    "name": row.get("name") or "Imported Organization",
                    "owner": owner,
                    "company_email": row.get("company_email") or "",
                    "company_address": row.get("company_address") or "",
                    "company_phone": row.get("company_phone") or "",
                    "default_currency": row.get("default_currency") or "USD",
                    "default_tax_rate": Decimal(str(row.get("default_tax_rate") or "0.00")),
                    "default_notes": row.get("default_notes") or "",
                    "default_terms": row.get("default_terms") or "",
                },
            )
            # Seed system roles for this organization
            seed_system_roles_for_org(org)
            org_map[org_id] = org
            if created:
                counts["organizations"] += 1

        # 5. Migrate team_members (memberships and invites)
        for row in tables_data.get("public.team_members", []):
            org_id = str(row.get("organization_id"))
            org = org_map.get(org_id) or Organization.objects.filter(id=org_id).first()
            if not org:
                continue

            role_name = (row.get("role") or "viewer").lower()
            status = (row.get("status") or "active").lower()
            email = (row.get("email") or "").strip().lower()
            user_id = str(row.get("user_id")) if row.get("user_id") else None
            member_user = user_id_map.get(user_id) if user_id else User.objects.filter(email=email).first()

            role = Role.objects.filter(organization=org, name=role_name).first()

            if status == "active" and member_user:
                member_name = str(row.get("name") or getattr(member_user, "name", "") or "")
                membership, created = Membership.objects.update_or_create(
                    organization=org,
                    email=email,
                    defaults={
                        "user": member_user,
                        "name": member_name,
                        "department": row.get("department") or "",
                        "status": Membership.Status.ACTIVE,
                    },
                )
                if role:
                    membership.roles.add(role)
                if created:
                    counts["memberships"] += 1
            else:
                # Pending invitation
                expires_at = timezone.now() + datetime.timedelta(days=30)
                inviter = org.owner
                invite, created = Invite.objects.update_or_create(
                    organization=org,
                    email=email,
                    defaults={
                        "department": row.get("department") or "",
                        "invited_by": inviter,
                        "token": Invite.generate_token(),
                        "expires_at": expires_at,
                    },
                )
                if role:
                    invite.roles.add(role)
                if created:
                    counts["invites"] += 1

        # 6. Migrate clients
        client_map: dict[str, Client] = {}
        for row in tables_data.get("public.clients", []):
            client_id = str(row.get("id"))
            org_id = str(row.get("organization_id"))
            org = org_map.get(org_id) or Organization.objects.filter(id=org_id).first()
            if not org:
                continue

            client, created = Client.objects.update_or_create(
                id=client_id,
                defaults={
                    "organization": org,
                    "name": row.get("name") or "Unnamed Client",
                    "email": row.get("email") or "",
                    "phone": row.get("phone") or "",
                    "address": row.get("address") or "",
                    "company": row.get("company") or "",
                    "status": row.get("status") or "active",
                },
            )
            client_map[client_id] = client
            if created:
                counts["clients"] += 1

        # 7. Migrate products
        product_map: dict[str, Product] = {}
        for row in tables_data.get("public.products", []):
            product_id = str(row.get("id"))
            org_id = str(row.get("organization_id"))
            org = org_map.get(org_id) or Organization.objects.filter(id=org_id).first()
            if not org:
                continue

            product, created = Product.objects.update_or_create(
                id=product_id,
                defaults={
                    "organization": org,
                    "name": row.get("name") or "Product",
                    "description": row.get("description") or "",
                    "unit_price": Decimal(str(row.get("unit_price") or "0.00")),
                    "currency": row.get("currency") or "USD",
                    "category": row.get("category") or "",
                    "unit": row.get("unit") or "item",
                    "sku": row.get("sku") or "",
                    "stock_quantity": int(row.get("stock_quantity") or 0),
                    "low_stock_threshold": int(row.get("low_stock_threshold") or 5),
                    "track_stock": bool(row.get("track_stock", False)),
                    "is_active": bool(row.get("is_active", True)),
                },
            )
            product_map[product_id] = product
            if created:
                counts["products"] += 1

        # 8. Migrate invoices
        invoice_map: dict[str, Invoice] = {}
        max_invoice_num_by_org: dict[str, int] = {}

        for row in tables_data.get("public.invoices", []):
            inv_id = str(row.get("id"))
            org_id = str(row.get("organization_id"))
            org = org_map.get(org_id) or Organization.objects.filter(id=org_id).first()
            if not org:
                continue

            client_id = str(row.get("client_id")) if row.get("client_id") else None
            client = client_map.get(client_id) if client_id else None

            inv_number = row.get("invoice_number") or f"INV-2026-{inv_id[:6]}"
            # Parse sequence number if format INV-YYYY-NNN
            num_match = re.search(r"-(\d+)$", inv_number)
            if num_match:
                seq_num = int(num_match.group(1))
                max_invoice_num_by_org[org_id] = max(max_invoice_num_by_org.get(org_id, 0), seq_num)

            issue_date = row.get("issue_date") or timezone.localdate()
            if isinstance(issue_date, str):
                issue_date = parse_date_expression(issue_date)
            due_date = row.get("due_date") or issue_date
            if isinstance(due_date, str):
                due_date = parse_date_expression(due_date)

            invoice, created = Invoice.objects.update_or_create(
                id=inv_id,
                defaults={
                    "organization": org,
                    "client": client,
                    "invoice_number": inv_number,
                    "status": row.get("status") or "draft",
                    "issue_date": issue_date,
                    "due_date": due_date,
                    "currency": row.get("currency") or "USD",
                    "subtotal": Decimal(str(row.get("subtotal") or "0.00")),
                    "tax_rate": Decimal(str(row.get("tax_rate") or "0.00")),
                    "tax_amount": Decimal(str(row.get("tax_amount") or "0.00")),
                    "discount_amount": Decimal(str(row.get("discount_amount") or "0.00")),
                    "total": Decimal(str(row.get("total") or "0.00")),
                    "business_name": row.get("business_name") or org.name,
                    "business_email": row.get("business_email") or org.company_email,
                    "business_address": row.get("business_address") or org.company_address,
                    "business_phone": row.get("business_phone") or org.company_phone,
                    "client_name": row.get("client_name") or (client.name if client else ""),
                    "client_email": row.get("client_email") or (client.email if client else ""),
                    "client_address": row.get("client_address") or (client.address if client else ""),
                    "notes": row.get("notes") or "",
                    "terms": row.get("terms") or "",
                    "created_by": org.owner,
                },
            )
            invoice_map[inv_id] = invoice
            if created:
                counts["invoices"] += 1

        # Synchronize invoice sequences so next invoice starts at max + 1
        for org_id, max_num in max_invoice_num_by_org.items():
            org = org_map.get(org_id)
            if org:
                year = timezone.localdate().year
                InvoiceSequence.objects.update_or_create(
                    organization=org,
                    year=year,
                    defaults={"last_number": max_num},
                )

        # 9. Migrate invoice_items
        for row in tables_data.get("public.invoice_items", []):
            inv_id = str(row.get("invoice_id"))
            invoice = invoice_map.get(inv_id) or Invoice.objects.filter(id=inv_id).first()
            if not invoice:
                continue

            quantity = Decimal(str(row.get("quantity") or "1.00"))
            rate = Decimal(str(row.get("rate") or row.get("unit_price") or "0.00"))
            amount = Decimal(str(row.get("amount") or (quantity * rate)))

            desc = row.get("description") or "Item"
            # Try to match product by name if possible
            matched_product = None
            for prod in product_map.values():
                if (
                    getattr(prod, "organization_id", None)
                    == getattr(invoice, "organization_id", None)
                    and prod.name == desc
                ):
                    matched_product = prod
                    break

            _item = InvoiceItem.objects.create(
                invoice=invoice,
                product=matched_product,
                description=desc,
                quantity=quantity,
                rate=rate,
                amount=amount,
            )
            counts["invoice_items"] += 1

        # 10. Migrate payments
        for row in tables_data.get("public.payments", []):
            inv_id = str(row.get("invoice_id"))
            invoice = invoice_map.get(inv_id) or Invoice.objects.filter(id=inv_id).first()
            if not invoice:
                continue

            pay_date = row.get("payment_date") or timezone.localdate()
            if isinstance(pay_date, str):
                pay_date = parse_date_expression(pay_date)

            _payment = Payment.objects.create(
                organization=invoice.organization,
                invoice=invoice,
                amount=Decimal(str(row.get("amount") or "0.00")),
                currency=row.get("currency") or invoice.currency,
                payment_method=row.get("payment_method") or "bank_transfer",
                notes=row.get("notes") or "",
            )
            counts["payments"] += 1

        # 11. Migrate expenses
        for row in tables_data.get("public.expenses", []):
            org_id = str(row.get("organization_id"))
            org = org_map.get(org_id) or Organization.objects.filter(id=org_id).first()
            if not org:
                continue

            exp_date = row.get("expense_date") or timezone.localdate()
            if isinstance(exp_date, str):
                exp_date = parse_date_expression(exp_date)

            cat = (row.get("category") or "other").lower()
            valid_cats = {c.value for c in Expense.Category}
            if cat not in valid_cats:
                cat = "other"

            _expense = Expense.objects.create(
                organization=org,
                title=row.get("title") or "Expense",
                category=cat,
                vendor=row.get("vendor") or "",
                amount=Decimal(str(row.get("amount") or "0.00")),
                currency=row.get("currency") or "USD",
                expense_date=exp_date,
                payment_method=row.get("payment_method") or "card",
                notes=row.get("notes") or "",
            )
            counts["expenses"] += 1

        return counts
