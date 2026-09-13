-- ============================================================
-- Multi-Organization SaaS + RLS
-- Every user owns a personal organization on signup.
-- All business data is scoped to organizations, not users.
-- Roles: owner > admin > editor > viewer
--   viewer : read-only
--   editor : create/update/delete operational data
--   admin  : everything + team management + org settings
--   owner  : admin + org deletion
-- ============================================================

-- ------------------------------------------------------------
-- 1. ORGANIZATIONS: business-level fields (invoice snapshots)
-- ------------------------------------------------------------
alter table public.organizations
  add column if not exists company_email text default '',
  add column if not exists company_address text default '',
  add column if not exists company_phone text default '',
  add column if not exists default_currency text default 'USD',
  add column if not exists default_tax_rate numeric(5,2) default 0,
  add column if not exists default_notes text default '',
  add column if not exists default_terms text default '';

-- ------------------------------------------------------------
-- 2. TEAM MEMBERS: roles + invite flow
-- ------------------------------------------------------------
alter table public.team_members
  add column if not exists invited_by uuid references auth.users(id) on delete set null;

-- Widen role check to include 'owner'
alter table public.team_members drop constraint if exists team_members_role_check;
alter table public.team_members drop constraint if exists team_members_role_check1;
alter table public.team_members
  add constraint team_members_role_check
  check (role in ('owner', 'admin', 'editor', 'viewer'));

-- Normalize status: invites are 'pending'
do $$
begin
  alter table public.team_members drop constraint if exists team_members_status_check;
exception when others then null;
end $$;
update public.team_members set status = 'pending' where status = 'inactive';
alter table public.team_members drop constraint if exists team_members_status_check;
alter table public.team_members
  add constraint team_members_status_check check (status in ('pending', 'active'));

create unique index if not exists idx_team_members_org_email
  on public.team_members (organization_id, lower(email));

-- ------------------------------------------------------------
-- 3. ORGANIZATION COLUMNS ON BUSINESS TABLES
-- ------------------------------------------------------------
alter table public.clients   add column if not exists organization_id uuid references public.organizations(id) on delete cascade;
alter table public.products  add column if not exists organization_id uuid references public.organizations(id) on delete cascade;
alter table public.invoices  add column if not exists organization_id uuid references public.organizations(id) on delete cascade;
alter table public.expenses  add column if not exists organization_id uuid references public.organizations(id) on delete cascade;
alter table public.payments  add column if not exists organization_id uuid references public.organizations(id) on delete cascade;

-- ------------------------------------------------------------
-- 4. BACKFILL: personal org for every existing user
-- ------------------------------------------------------------

-- 4a. Make sure every existing organization has an owner membership
insert into public.team_members (organization_id, user_id, email, name, role, status, joined_at)
select o.id, o.owner_id, au.email, coalesce(p.full_name, split_part(au.email, '@', 1)), 'owner', 'active', now()
from public.organizations o
join auth.users au on au.id = o.owner_id
left join public.profiles p on p.id = o.owner_id
where not exists (
  select 1 from public.team_members t
  where t.organization_id = o.id and t.user_id = o.owner_id and t.role = 'owner'
);

-- 4b. Create a personal org for every user that has none yet
do $$
declare
  u record;
  v_org uuid;
  v_name text;
  v_email text;
begin
  for u in
    select p.id, p.full_name, p.company_name, p.company_email,
           p.company_address, p.company_phone,
           p.default_currency, p.default_tax_rate, p.default_notes, p.default_terms
    from public.profiles p
    where not exists (select 1 from public.team_members tm where tm.user_id = p.id)
  loop
    select email into v_email from auth.users where id = u.id;

    -- Reuse an org the user already owns (from the old team feature), else create one
    select id into v_org from public.organizations where owner_id = u.id limit 1;

    if v_org is null then
      v_name := nullif(u.company_name, '');
      if v_name is null then
        v_name := case
          when nullif(u.full_name, '') is not null then u.full_name || '''s Business'
          else 'My Business'
        end;
      end if;

      insert into public.organizations (
        name, owner_id, company_email, company_address, company_phone,
        default_currency, default_tax_rate, default_notes, default_terms
      ) values (
        v_name, u.id, coalesce(u.company_email, coalesce(v_email, '')),
        coalesce(u.company_address, ''), coalesce(u.company_phone, ''),
        coalesce(nullif(u.default_currency, ''), 'USD'),
        coalesce(u.default_tax_rate, 0),
        coalesce(u.default_notes, ''), coalesce(u.default_terms, '')
      ) returning id into v_org;
    end if;

    insert into public.team_members (organization_id, user_id, email, name, role, status, joined_at)
    values (v_org, u.id, coalesce(v_email, ''), coalesce(u.full_name, ''), 'owner', 'active', now());

    update public.clients   set organization_id = v_org where user_id = u.id and organization_id is null;
    update public.products  set organization_id = v_org where user_id = u.id and organization_id is null;
    update public.invoices  set organization_id = v_org where user_id = u.id and organization_id is null;
    update public.expenses  set organization_id = v_org where user_id = u.id and organization_id is null;
    update public.payments  set organization_id = v_org where user_id = u.id and organization_id is null;
  end loop;
end $$;

-- 4c. Any stragglers: map rows by their user's owned org
update public.clients   c set organization_id = o.id from public.organizations o where o.owner_id = c.user_id  and c.organization_id is null;
update public.products  p set organization_id = o.id from public.organizations o where o.owner_id = p.user_id  and p.organization_id is null;
update public.invoices  i set organization_id = o.id from public.organizations o where o.owner_id = i.user_id  and i.organization_id is null;
update public.expenses  e set organization_id = o.id from public.organizations o where o.owner_id = e.user_id  and e.organization_id is null;
update public.payments  m set organization_id = o.id from public.organizations o where o.owner_id = m.user_id  and m.organization_id is null;

alter table public.clients  alter column organization_id set not null;
alter table public.products alter column organization_id set not null;
alter table public.invoices alter column organization_id set not null;
alter table public.expenses alter column organization_id set not null;
alter table public.payments alter column organization_id set not null;

create index if not exists idx_clients_organization_id  on public.clients(organization_id);
create index if not exists idx_products_organization_id on public.products(organization_id);
create index if not exists idx_invoices_organization_id on public.invoices(organization_id);
create index if not exists idx_expenses_organization_id on public.expenses(organization_id);
create index if not exists idx_payments_organization_id on public.payments(organization_id);
create index if not exists idx_team_members_user_id_active on public.team_members(user_id) where status = 'active';

-- ------------------------------------------------------------
-- 5. HELPER FUNCTIONS (security definer avoids RLS recursion)
-- ------------------------------------------------------------
create or replace function public.is_org_member(p_org uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.team_members
    where organization_id = p_org
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.org_role(p_org uuid)
returns text
language sql stable security definer set search_path = public as $$
  select tm.role from public.team_members tm
  where tm.organization_id = p_org
    and tm.user_id = auth.uid()
    and tm.status = 'active'
  limit 1;
$$;

create or replace function public.can_write_org(p_org uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.org_role(p_org) in ('owner','admin','editor'), false);
$$;

create or replace function public.can_manage_org(p_org uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.org_role(p_org) in ('owner','admin'), false);
$$;

grant execute on function public.is_org_member(uuid) to authenticated, anon;
grant execute on function public.org_role(uuid) to authenticated, anon;
grant execute on function public.can_write_org(uuid) to authenticated, anon;
grant execute on function public.can_manage_org(uuid) to authenticated, anon;

-- ------------------------------------------------------------
-- 6. AUTO-PROVISION PERSONAL ORG ON SIGNUP
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_org uuid;
  v_full_name text := coalesce(new.raw_user_meta_data ->> 'full_name', '');
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, v_full_name, coalesce(new.raw_user_meta_data ->> 'avatar_url', ''));

  insert into public.organizations (name, owner_id, company_email)
  values (
    case
      when nullif(v_full_name, '') is not null then v_full_name || '''s Business'
      else 'My Business'
    end,
    new.id,
    coalesce(new.email, '')
  )
  returning id into v_org;

  insert into public.team_members (organization_id, user_id, email, name, role, status, joined_at)
  values (v_org, new.id, new.email, v_full_name, 'owner', 'active', now());

  return new;
end;
$$;

-- ------------------------------------------------------------
-- 7. REPLACE RLS POLICIES (org-membership based)
-- ------------------------------------------------------------
alter table public.clients enable row level security;
alter table public.products enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.expenses enable row level security;
alter table public.payments enable row level security;
alter table public.organizations enable row level security;
alter table public.team_members enable row level security;
alter table public.profiles enable row level security;

-- Drop all legacy per-user policies
drop policy if exists "Users can view their own clients"            on public.clients;
drop policy if exists "Users can insert their own clients"          on public.clients;
drop policy if exists "Users can update their own clients"          on public.clients;
drop policy if exists "Users can delete their own clients"          on public.clients;
drop policy if exists "Users can view their own invoices"           on public.invoices;
drop policy if exists "Users can insert their own invoices"         on public.invoices;
drop policy if exists "Users can update their own invoices"         on public.invoices;
drop policy if exists "Users can delete their own invoices"         on public.invoices;
drop policy if exists "Users can view invoice items for their invoices"   on public.invoice_items;
drop policy if exists "Users can insert invoice items for their invoices" on public.invoice_items;
drop policy if exists "Users can update invoice items for their invoices" on public.invoice_items;
drop policy if exists "Users can delete invoice items for their invoices" on public.invoice_items;
drop policy if exists "Users can view their own products"           on public.products;
drop policy if exists "Users can insert their own products"         on public.products;
drop policy if exists "Users can update their own products"         on public.products;
drop policy if exists "Users can delete their own products"         on public.products;
drop policy if exists "Users can view their own organizations"      on public.organizations;
drop policy if exists "Users can insert their own organizations"    on public.organizations;
drop policy if exists "Users can update their own organizations"    on public.organizations;
drop policy if exists "Users can delete their own organizations"    on public.organizations;
drop policy if exists "Users can view team members in their org"    on public.team_members;
drop policy if exists "Users can manage team members in their org"  on public.team_members;
drop policy if exists "Users can view their own expenses"           on public.expenses;
drop policy if exists "Users can insert their own expenses"         on public.expenses;
drop policy if exists "Users can update their own expenses"         on public.expenses;
drop policy if exists "Users can delete their own expenses"         on public.expenses;
drop policy if exists "Users can view their own payments"           on public.payments;
drop policy if exists "Users can insert their own payments"         on public.payments;
drop policy if exists "Users can update their own payments"         on public.payments;
drop policy if exists "Users can delete their own payments"         on public.payments;

-- ---------- generic business tables ----------
create policy "org members can view clients"
  on public.clients for select using (public.is_org_member(organization_id));
create policy "org editors can insert clients"
  on public.clients for insert with check (public.can_write_org(organization_id));
create policy "org editors can update clients"
  on public.clients for update using (public.can_write_org(organization_id));
create policy "org editors can delete clients"
  on public.clients for delete using (public.can_write_org(organization_id));

create policy "org members can view products"
  on public.products for select using (public.is_org_member(organization_id));
create policy "org editors can insert products"
  on public.products for insert with check (public.can_write_org(organization_id));
create policy "org editors can update products"
  on public.products for update using (public.can_write_org(organization_id));
create policy "org editors can delete products"
  on public.products for delete using (public.can_write_org(organization_id));

create policy "org members can view expenses"
  on public.expenses for select using (public.is_org_member(organization_id));
create policy "org editors can insert expenses"
  on public.expenses for insert with check (public.can_write_org(organization_id));
create policy "org editors can update expenses"
  on public.expenses for update using (public.can_write_org(organization_id));
create policy "org editors can delete expenses"
  on public.expenses for delete using (public.can_write_org(organization_id));

create policy "org members can view payments"
  on public.payments for select using (public.is_org_member(organization_id));
create policy "org editors can insert payments"
  on public.payments for insert with check (public.can_write_org(organization_id));
create policy "org editors can update payments"
  on public.payments for update using (public.can_write_org(organization_id));
create policy "org editors can delete payments"
  on public.payments for delete using (public.can_write_org(organization_id));

-- ---------- invoices ----------
create policy "org members can view invoices"
  on public.invoices for select using (public.is_org_member(organization_id));
create policy "org editors can insert invoices"
  on public.invoices for insert with check (public.can_write_org(organization_id));
create policy "org editors can update invoices"
  on public.invoices for update using (public.can_write_org(organization_id));
create policy "org editors can delete invoices"
  on public.invoices for delete using (public.can_write_org(organization_id));

-- ---------- invoice items (org derived via parent invoice) ----------
create policy "org members can view invoice items"
  on public.invoice_items for select using (
    exists (select 1 from public.invoices i
            where i.id = invoice_items.invoice_id
              and public.is_org_member(i.organization_id))
  );
create policy "org editors can insert invoice items"
  on public.invoice_items for insert with check (
    exists (select 1 from public.invoices i
            where i.id = invoice_items.invoice_id
              and public.can_write_org(i.organization_id))
  );
create policy "org editors can update invoice items"
  on public.invoice_items for update using (
    exists (select 1 from public.invoices i
            where i.id = invoice_items.invoice_id
              and public.can_write_org(i.organization_id))
  );
create policy "org editors can delete invoice items"
  on public.invoice_items for delete using (
    exists (select 1 from public.invoices i
            where i.id = invoice_items.invoice_id
              and public.can_write_org(i.organization_id))
  );

-- ---------- organizations ----------
create policy "org members can view organization"
  on public.organizations for select using (public.is_org_member(id));
create policy "users can create organizations"
  on public.organizations for insert with check (auth.uid() = owner_id);
create policy "org admins can update organization"
  on public.organizations for update using (public.can_manage_org(id));
create policy "org owners can delete organization"
  on public.organizations for delete using (org_role(id) = 'owner');

-- ---------- team members ----------
create policy "org members can view team"
  on public.team_members for select using (public.is_org_member(organization_id));
create policy "org admins can invite members"
  on public.team_members for insert with check (public.can_manage_org(organization_id));
create policy "org admins can update team or self-claim pending invite"
  on public.team_members for update using (
    public.can_manage_org(organization_id)
    or (
      status = 'pending' and user_id is null
      and email = coalesce(auth.jwt() ->> 'email', '')
    )
  );
create policy "org admins can remove members"
  on public.team_members for delete using (public.can_manage_org(organization_id));

-- profiles keep their per-user policies (unchanged)

-- ------------------------------------------------------------
-- 8. PERMISSIONS
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
