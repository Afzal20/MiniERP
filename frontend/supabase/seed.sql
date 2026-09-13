-- ============================================================
-- BizPilot Demo Seed Data
-- Creates one realistic demo organization with clients,
-- products, invoices, expenses, and team members.
--
-- Usage (local Supabase):
--   npx supabase db reset   (applies migrations + this seed)
-- Or run once against an existing instance:
--   psql $DATABASE_URL -f supabase/seed.sql
--
-- The seed creates a real auth user so the demo is
-- immediately usable. Change email/password as needed.
-- ============================================================

-- Prevent running twice by checking for the demo org
do $$
begin
  if exists (select 1 from public.organizations where name = 'Acme Solutions Demo') then
    raise notice 'Demo seed already applied — skipping.';
    return;
  end if;
end $$;

-- ------------------------------------------------------------
-- 1. DEMO AUTH USER
-- ------------------------------------------------------------
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  is_sso_user, is_anonymous
) values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'demo@bizpilot.app',
  -- password: demo1234  (bcrypt)
  '$2b$12$.LF2C/H97ILFa8CtnkFUieMFVcNHiz9/RCu7mdhKA60uYD5amQ3WC',
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Alex Morgan"}',
  '', '', '', '',
  false, false
) on conflict (id) do nothing;

insert into auth.identities (
  id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at,
  provider_id
) values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"demo@bizpilot.app"}',
  'email', now(), now(), now(),
  '00000000-0000-0000-0000-000000000001'
) on conflict (provider, provider_id) do nothing;

-- ------------------------------------------------------------
-- 2. PROFILE
-- ------------------------------------------------------------
insert into public.profiles (
  id, full_name, company_name, company_email,
  company_address, company_phone,
  default_currency, default_tax_rate,
  default_notes, default_terms
) values (
  '00000000-0000-0000-0000-000000000001',
  'Alex Morgan',
  'Acme Solutions',
  'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102',
  '+1 (415) 555-0190',
  'USD', 10.00,
  'Thank you for your business!',
  'Payment due within 30 days.'
) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 3. ORGANIZATION
-- ------------------------------------------------------------
insert into public.organizations (
  id, owner_id, name,
  company_email, company_address, company_phone,
  default_currency, default_tax_rate,
  default_notes, default_terms
) values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Acme Solutions Demo',
  'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102',
  '+1 (415) 555-0190',
  'USD', 10.00,
  'Thank you for your business!',
  'Payment due within 30 days. Late payments subject to 1.5% monthly interest.'
) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 4. TEAM MEMBERS
-- ------------------------------------------------------------
-- Owner
insert into public.team_members (
  id, organization_id, user_id, email, name,
  role, status, joined_at
) values (
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'demo@bizpilot.app', 'Alex Morgan',
  'owner', 'active', now()
) on conflict (id) do nothing;

-- Admin (invited, pending)
insert into public.team_members (
  id, organization_id, email, name, role, status,
  invited_by, department
) values (
  '20000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  'admin@acmesolutions.co', 'Jordan Kim',
  'admin', 'pending',
  '00000000-0000-0000-0000-000000000001',
  'Finance'
) on conflict (id) do nothing;

-- Editor (invited, pending)
insert into public.team_members (
  id, organization_id, email, name, role, status,
  invited_by, department
) values (
  '20000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  'editor@acmesolutions.co', 'Riley Chen',
  'editor', 'pending',
  '00000000-0000-0000-0000-000000000001',
  'Sales'
) on conflict (id) do nothing;

-- Viewer (invited, pending)
insert into public.team_members (
  id, organization_id, email, name, role, status,
  invited_by, department
) values (
  '20000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000001',
  'viewer@acmesolutions.co', 'Sam Patel',
  'viewer', 'pending',
  '00000000-0000-0000-0000-000000000001',
  'Operations'
) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 5. CLIENTS
-- ------------------------------------------------------------
insert into public.clients (
  id, organization_id, user_id, name, email,
  phone, address, company, status
) values
(
  '30000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Wayne Enterprises', 'accounts@wayneenterprises.com',
  '+1 (212) 555-0100',
  '1007 Mountain Drive, Gotham City, NJ 07001',
  'Wayne Enterprises Inc.',
  'active'
),
(
  '30000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Stark Industries', 'billing@starkindustries.com',
  '+1 (310) 555-0200',
  '10880 Malibu Point, Malibu, CA 90265',
  'Stark Industries LLC',
  'active'
),
(
  '30000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Daily Planet', 'finance@dailyplanet.com',
  '+1 (617) 555-0300',
  '1000 Broadway, Metropolis, NY 10001',
  'Daily Planet Media Group',
  'active'
)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 6. PRODUCTS
-- ------------------------------------------------------------
insert into public.products (
  id, organization_id, user_id, name, description,
  unit_price, currency, category, unit, sku,
  stock_quantity, low_stock_threshold, track_stock, is_active
) values
(
  '40000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Web Development (hourly)', 'Full-stack web development services',
  150.00, 'USD', 'Services', 'hour', 'SVC-WEB-001',
  0, 0, false, true
),
(
  '40000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'UI/UX Design (hourly)', 'User interface and experience design',
  120.00, 'USD', 'Services', 'hour', 'SVC-UX-001',
  0, 0, false, true
),
(
  '40000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Brand Strategy Package', 'Complete brand identity package',
  2500.00, 'USD', 'Services', 'package', 'PKG-BRAND-001',
  0, 0, false, true
),
(
  '40000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Ergonomic Keyboard', 'Mechanical ergonomic keyboard, wireless',
  189.99, 'USD', 'Hardware', 'unit', 'HW-KB-2024',
  23, 10, true, true
),
(
  '40000000-0000-0000-0000-000000000005',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'USB-C Hub (7-in-1)', 'Multiport USB-C hub with HDMI, USB3, SD',
  59.99, 'USD', 'Hardware', 'unit', 'HW-HUB-001',
  7, 10, true, true
),
(
  '40000000-0000-0000-0000-000000000006',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '4K Monitor (27")', 'IPS 4K monitor, 60Hz, USB-C PD',
  549.00, 'USD', 'Hardware', 'unit', 'HW-MON-001',
  3, 5, true, true
),
(
  '40000000-0000-0000-0000-000000000007',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'SEO Audit Report', 'Comprehensive site SEO audit and recommendations',
  800.00, 'USD', 'Consulting', 'report', 'SVC-SEO-001',
  0, 0, false, true
),
(
  '40000000-0000-0000-0000-000000000008',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Wireless Mouse', 'Ergonomic wireless optical mouse',
  49.99, 'USD', 'Hardware', 'unit', 'HW-MS-001',
  2, 5, true, true
)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 7. INVOICES  (12 across all statuses, spread over 6 months)
-- ------------------------------------------------------------

-- INV-2026-001: paid, Wayne Enterprises, 5 months ago
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'INV-2026-001', 'paid',
  (now() - interval '5 months')::date,
  (now() - interval '4 months 1 day')::date,
  'USD',
  4500.00, 10.00, 450.00, 0.00, 4950.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Wayne Enterprises', 'accounts@wayneenterprises.com',
  '1007 Mountain Drive, Gotham City, NJ 07001',
  'Thank you for your business!',
  'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values
  ('50000000-0000-0000-0000-000000000001', 'Web Development', 20, 150.00, 3000.00),
  ('50000000-0000-0000-0000-000000000001', 'UI/UX Design', 12, 120.00, 1440.00),
  ('50000000-0000-0000-0000-000000000001', 'Project Management', 4, 90.00, 360.00)
on conflict do nothing;

insert into public.payments (
  organization_id, user_id, invoice_id, amount, currency,
  payment_method, payment_date
) values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000001',
  4950.00, 'USD', 'bank_transfer',
  (now() - interval '4 months')::date
) on conflict do nothing;

-- INV-2026-002: paid, Stark Industries, 4 months ago
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  'INV-2026-002', 'paid',
  (now() - interval '4 months')::date,
  (now() - interval '3 months 1 day')::date,
  'USD',
  2500.00, 10.00, 250.00, 0.00, 2750.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Stark Industries', 'billing@starkindustries.com',
  '10880 Malibu Point, Malibu, CA 90265',
  'Thank you for your business!', 'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values ('50000000-0000-0000-0000-000000000002', 'Brand Strategy Package', 1, 2500.00, 2500.00)
on conflict do nothing;

insert into public.payments (
  organization_id, user_id, invoice_id, amount, currency,
  payment_method, payment_date
) values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000002',
  2750.00, 'USD', 'card',
  (now() - interval '3 months')::date
) on conflict do nothing;

-- INV-2026-003: paid, Daily Planet, 4 months ago
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000003',
  'INV-2026-003', 'paid',
  (now() - interval '4 months 15 days')::date,
  (now() - interval '3 months 15 days')::date,
  'USD',
  800.00, 10.00, 80.00, 0.00, 880.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Daily Planet', 'finance@dailyplanet.com',
  '1000 Broadway, Metropolis, NY 10001',
  'SEO improvements delivered on schedule.', 'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values ('50000000-0000-0000-0000-000000000003', 'SEO Audit Report', 1, 800.00, 800.00)
on conflict do nothing;

insert into public.payments (
  organization_id, user_id, invoice_id, amount, currency,
  payment_method, payment_date
) values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000003',
  880.00, 'USD', 'bank_transfer',
  (now() - interval '3 months 10 days')::date
) on conflict do nothing;

-- INV-2026-004: paid, Wayne Enterprises, 3 months ago
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'INV-2026-004', 'paid',
  (now() - interval '3 months')::date,
  (now() - interval '2 months 1 day')::date,
  'USD',
  6000.00, 10.00, 600.00, 500.00, 6100.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Wayne Enterprises', 'accounts@wayneenterprises.com',
  '1007 Mountain Drive, Gotham City, NJ 07001',
  'Loyalty discount applied.', 'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values
  ('50000000-0000-0000-0000-000000000004', 'Web Development', 30, 150.00, 4500.00),
  ('50000000-0000-0000-0000-000000000004', 'UI/UX Design', 12, 120.00, 1440.00),
  ('50000000-0000-0000-0000-000000000004', 'SEO Audit Report', 1, 60.00, 60.00)
on conflict do nothing;

insert into public.payments (
  organization_id, user_id, invoice_id, amount, currency,
  payment_method, payment_date
) values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000004',
  6100.00, 'USD', 'bank_transfer',
  (now() - interval '2 months')::date
) on conflict do nothing;

-- INV-2026-005: paid, Stark Industries, 2 months ago
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000005',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  'INV-2026-005', 'paid',
  (now() - interval '2 months')::date,
  (now() - interval '1 month 1 day')::date,
  'USD',
  1800.00, 10.00, 180.00, 0.00, 1980.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Stark Industries', 'billing@starkindustries.com',
  '10880 Malibu Point, Malibu, CA 90265',
  'Q2 hardware supply.', 'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values
  ('50000000-0000-0000-0000-000000000005', 'Ergonomic Keyboard', 5, 189.99, 949.95),
  ('50000000-0000-0000-0000-000000000005', '4K Monitor (27")', 1, 549.00, 549.00),
  ('50000000-0000-0000-0000-000000000005', 'USB-C Hub (7-in-1)', 5, 59.99, 299.95)
on conflict do nothing;

insert into public.payments (
  organization_id, user_id, invoice_id, amount, currency,
  payment_method, payment_date
) values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000005',
  1980.00, 'USD', 'card',
  (now() - interval '1 month')::date
) on conflict do nothing;

-- INV-2026-006: paid, Daily Planet, last month
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000006',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000003',
  'INV-2026-006', 'paid',
  (now() - interval '6 weeks')::date,
  (now() - interval '3 weeks')::date,
  'USD',
  3600.00, 10.00, 360.00, 0.00, 3960.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Daily Planet', 'finance@dailyplanet.com',
  '1000 Broadway, Metropolis, NY 10001',
  'Website redesign phase 1 complete.', 'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values
  ('50000000-0000-0000-0000-000000000006', 'Web Development', 16, 150.00, 2400.00),
  ('50000000-0000-0000-0000-000000000006', 'UI/UX Design', 10, 120.00, 1200.00)
on conflict do nothing;

insert into public.payments (
  organization_id, user_id, invoice_id, amount, currency,
  payment_method, payment_date
) values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000006',
  3960.00, 'USD', 'bank_transfer',
  (now() - interval '2 weeks')::date
) on conflict do nothing;

-- INV-2026-007: pending (sent), Wayne Enterprises, due in 10 days
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000007',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'INV-2026-007', 'pending',
  now()::date,
  (now() + interval '10 days')::date,
  'USD',
  5400.00, 10.00, 540.00, 0.00, 5940.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Wayne Enterprises', 'accounts@wayneenterprises.com',
  '1007 Mountain Drive, Gotham City, NJ 07001',
  'Q3 development sprint.', 'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values
  ('50000000-0000-0000-0000-000000000007', 'Web Development', 24, 150.00, 3600.00),
  ('50000000-0000-0000-0000-000000000007', 'UI/UX Design', 15, 120.00, 1800.00)
on conflict do nothing;

-- INV-2026-008: pending (sent), Stark Industries, due in 20 days
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000008',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  'INV-2026-008', 'pending',
  (now() - interval '10 days')::date,
  (now() + interval '20 days')::date,
  'USD',
  1099.75, 10.00, 109.98, 0.00, 1209.73,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Stark Industries', 'billing@starkindustries.com',
  '10880 Malibu Point, Malibu, CA 90265',
  'Hardware accessories order.', 'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values
  ('50000000-0000-0000-0000-000000000008', 'Ergonomic Keyboard', 3, 189.99, 569.97),
  ('50000000-0000-0000-0000-000000000008', 'Wireless Mouse', 3, 49.99, 149.97),
  ('50000000-0000-0000-0000-000000000008', 'USB-C Hub (7-in-1)', 3, 59.99, 179.97),
  ('50000000-0000-0000-0000-000000000008', 'SEO Audit Report', 0.25, 800.00, 199.84)
on conflict do nothing;

-- INV-2026-009: overdue, Daily Planet (was due last month)
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000009',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000003',
  'INV-2026-009', 'overdue',
  (now() - interval '6 weeks')::date,
  (now() - interval '1 week')::date,
  'USD',
  2400.00, 10.00, 240.00, 0.00, 2640.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Daily Planet', 'finance@dailyplanet.com',
  '1000 Broadway, Metropolis, NY 10001',
  'Phase 2 website development.', 'Payment due within 30 days. Late fee applies.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values
  ('50000000-0000-0000-0000-000000000009', 'Web Development', 16, 150.00, 2400.00)
on conflict do nothing;

-- INV-2026-010: partially paid, Wayne Enterprises
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000010',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'INV-2026-010', 'pending',
  (now() - interval '3 weeks')::date,
  (now() + interval '1 week')::date,
  'USD',
  7200.00, 10.00, 720.00, 0.00, 7920.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Wayne Enterprises', 'accounts@wayneenterprises.com',
  '1007 Mountain Drive, Gotham City, NJ 07001',
  'Q3 full-stack platform build.', 'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values
  ('50000000-0000-0000-0000-000000000010', 'Web Development', 32, 150.00, 4800.00),
  ('50000000-0000-0000-0000-000000000010', 'UI/UX Design', 20, 120.00, 2400.00)
on conflict do nothing;

-- Partial payment: client paid half upfront
insert into public.payments (
  organization_id, user_id, invoice_id, amount, currency,
  payment_method, payment_date, notes
) values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000010',
  4000.00, 'USD', 'bank_transfer',
  (now() - interval '2 weeks')::date,
  'Upfront deposit - 50% milestone payment'
) on conflict do nothing;

-- INV-2026-011: draft, Stark Industries
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000011',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  'INV-2026-011', 'draft',
  now()::date,
  (now() + interval '30 days')::date,
  'USD',
  3200.00, 10.00, 320.00, 0.00, 3520.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Stark Industries', 'billing@starkindustries.com',
  '10880 Malibu Point, Malibu, CA 90265',
  'Draft — pending internal review.', 'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values
  ('50000000-0000-0000-0000-000000000011', 'Web Development', 12, 150.00, 1800.00),
  ('50000000-0000-0000-0000-000000000011', 'Brand Strategy Package', 0.5, 2500.00, 1250.00),
  ('50000000-0000-0000-0000-000000000011', 'UI/UX Design', 1.25, 120.00, 150.00)
on conflict do nothing;

-- INV-2026-012: draft, Daily Planet
insert into public.invoices (
  id, organization_id, user_id, client_id,
  invoice_number, status, issue_date, due_date, currency,
  subtotal, tax_rate, tax_amount, discount_amount, total,
  business_name, business_email, business_address, business_phone,
  client_name, client_email, client_address,
  notes, terms
) values (
  '50000000-0000-0000-0000-000000000012',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000003',
  'INV-2026-012', 'draft',
  now()::date,
  (now() + interval '30 days')::date,
  'USD',
  800.00, 10.00, 80.00, 0.00, 880.00,
  'Acme Solutions', 'billing@acmesolutions.co',
  '42 Innovation Drive, San Francisco, CA 94102', '+1 (415) 555-0190',
  'Daily Planet', 'finance@dailyplanet.com',
  '1000 Broadway, Metropolis, NY 10001',
  'Ongoing SEO retainer — draft.', 'Payment due within 30 days.'
) on conflict (id) do nothing;

insert into public.invoice_items (invoice_id, description, quantity, rate, amount)
values ('50000000-0000-0000-0000-000000000012', 'SEO Audit Report', 1, 800.00, 800.00)
on conflict do nothing;

-- ------------------------------------------------------------
-- 8. EXPENSES (5 categories, spread over 6 months)
-- ------------------------------------------------------------
insert into public.expenses (
  organization_id, user_id, title, category, vendor,
  amount, currency, expense_date, payment_method, notes
) values
-- Rent
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Office Rent — August 2026', 'rent', 'WeWork SF',
  2200.00, 'USD', (now() - interval '5 days')::date,
  'bank_transfer', 'Co-working space, 3 desks'
),
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Office Rent — July 2026', 'rent', 'WeWork SF',
  2200.00, 'USD', (now() - interval '5 weeks')::date,
  'bank_transfer', 'Co-working space, 3 desks'
),
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Office Rent — June 2026', 'rent', 'WeWork SF',
  2200.00, 'USD', (now() - interval '9 weeks')::date,
  'bank_transfer', 'Co-working space, 3 desks'
),
-- Software
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Figma Team Subscription', 'software', 'Figma Inc',
  45.00, 'USD', (now() - interval '2 days')::date,
  'card', 'Monthly team plan, 3 seats'
),
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'GitHub Teams', 'software', 'GitHub Inc',
  24.00, 'USD', (now() - interval '2 days')::date,
  'card', 'Monthly, 3 seats'
),
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Linear Project Management', 'software', 'Linear',
  24.00, 'USD', (now() - interval '2 days')::date,
  'card', 'Monthly team subscription'
),
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Vercel Pro Plan', 'software', 'Vercel Inc',
  20.00, 'USD', (now() - interval '3 days')::date,
  'card', 'Hosting and deployments'
),
-- Salaries
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Contractor — Jordan Kim (admin)', 'salaries', 'Jordan Kim',
  4500.00, 'USD', (now() - interval '1 week')::date,
  'bank_transfer', 'Monthly retainer — finance & admin'
),
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Contractor — Riley Chen (sales)', 'salaries', 'Riley Chen',
  3200.00, 'USD', (now() - interval '1 week')::date,
  'bank_transfer', 'Monthly retainer — sales support'
),
-- Marketing
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Google Ads — Q3 Campaign', 'marketing', 'Google LLC',
  850.00, 'USD', (now() - interval '3 weeks')::date,
  'card', 'Lead generation for Q3'
),
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'LinkedIn Sponsored Posts', 'marketing', 'LinkedIn Corp',
  320.00, 'USD', (now() - interval '4 weeks')::date,
  'card', 'B2B outreach campaign'
),
-- Supplies
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Office Supplies (Q3)', 'supplies', 'Staples',
  156.40, 'USD', (now() - interval '10 days')::date,
  'card', 'Paper, pens, sticky notes, cables'
),
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Coffee Machine + Supplies', 'supplies', 'Amazon',
  289.00, 'USD', (now() - interval '6 weeks')::date,
  'card', 'Nespresso machine + 3 months pods'
)
on conflict do nothing;
