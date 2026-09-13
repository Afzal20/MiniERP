-- ============================================
-- Invoice Generator - Database Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. CLIENTS
-- ============================================
create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text default '',
  address text default '',
  company text default '',
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Index for faster lookups by user
create index idx_clients_user_id on public.clients(user_id);
create index idx_clients_status on public.clients(status);

-- ============================================
-- 2. INVOICES
-- ============================================
create table public.invoices (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete set null,
  invoice_number text not null,
  status text default 'draft' check (status in ('draft', 'pending', 'paid', 'overdue', 'cancelled')),
  issue_date date default current_date not null,
  due_date date not null,
  currency text default 'USD' not null,
  subtotal numeric(12,2) default 0 not null,
  tax_rate numeric(5,2) default 0 not null,
  tax_amount numeric(12,2) default 0 not null,
  total numeric(12,2) default 0 not null,
  notes text default '',
  terms text default '',
  business_name text default '',
  business_email text default '',
  business_address text default '',
  business_phone text default '',
  client_name text default '',
  client_email text default '',
  client_address text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes for faster lookups
create index idx_invoices_user_id on public.invoices(user_id);
create index idx_invoices_client_id on public.invoices(client_id);
create index idx_invoices_status on public.invoices(status);
create index idx_invoices_issue_date on public.invoices(issue_date);
create index idx_invoices_invoice_number on public.invoices(invoice_number);

-- Unique constraint: invoice number per user
alter table public.invoices add constraint unique_invoice_number_per_user unique (user_id, invoice_number);

-- ============================================
-- 3. INVOICE ITEMS
-- ============================================
create table public.invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references public.invoices(id) on delete cascade not null,
  description text not null,
  quantity numeric(10,2) default 1 not null,
  rate numeric(12,2) default 0 not null,
  amount numeric(12,2) default 0 not null,
  created_at timestamptz default now() not null
);

-- Index for faster lookups by invoice
create index idx_invoice_items_invoice_id on public.invoice_items(invoice_id);

-- ============================================
-- 4. PRODUCTS (Catalog)
-- ============================================
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text default '',
  unit_price numeric(12,2) default 0 not null,
  currency text default 'USD' not null,
  category text default '',
  unit text default 'item',
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index idx_products_user_id on public.products(user_id);
create index idx_products_category on public.products(category);
create index idx_products_is_active on public.products(is_active);

-- ============================================
-- 5. ORGANIZATIONS
-- ============================================
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_id uuid references auth.users(id) on delete cascade not null,
  logo_url text default '',
  website text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_organizations_owner_id on public.organizations(owner_id);

-- ============================================
-- 6. TEAM MEMBERS
-- ============================================
create table public.team_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  department text default '',
  status text default 'active' check (status in ('active', 'inactive')),
  invited_at timestamptz default now(),
  joined_at timestamptz,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_team_members_organization_id on public.team_members(organization_id);
create index idx_team_members_user_id on public.team_members(user_id);
create index idx_team_members_email on public.team_members(email);

-- ============================================
-- 7. USER PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text default '',
  avatar_url text default '',
  company_name text default '',
  company_email text default '',
  company_address text default '',
  company_phone text default '',
  default_currency text default 'USD',
  default_tax_rate numeric(5,2) default 0,
  default_notes text default '',
  default_terms text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply trigger to all tables with updated_at
create trigger update_clients_updated_at before update on public.clients
  for each row execute function update_updated_at_column();

create trigger update_invoices_updated_at before update on public.invoices
  for each row execute function update_updated_at_column();

create trigger update_products_updated_at before update on public.products
  for each row execute function update_updated_at_column();

create trigger update_organizations_updated_at before update on public.organizations
  for each row execute function update_updated_at_column();

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at_column();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.clients enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.products enable row level security;
alter table public.organizations enable row level security;
alter table public.team_members enable row level security;
alter table public.profiles enable row level security;

-- CLIENTS policies
create policy "Users can view their own clients"
  on public.clients for select
  using (auth.uid() = user_id);

create policy "Users can insert their own clients"
  on public.clients for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own clients"
  on public.clients for update
  using (auth.uid() = user_id);

create policy "Users can delete their own clients"
  on public.clients for delete
  using (auth.uid() = user_id);

-- INVOICES policies
create policy "Users can view their own invoices"
  on public.invoices for select
  using (auth.uid() = user_id);

create policy "Users can insert their own invoices"
  on public.invoices for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own invoices"
  on public.invoices for update
  using (auth.uid() = user_id);

create policy "Users can delete their own invoices"
  on public.invoices for delete
  using (auth.uid() = user_id);

-- INVOICE ITEMS policies (access via invoice ownership)
create policy "Users can view invoice items for their invoices"
  on public.invoice_items for select
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_items.invoice_id
      and invoices.user_id = auth.uid()
    )
  );

create policy "Users can insert invoice items for their invoices"
  on public.invoice_items for insert
  with check (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_items.invoice_id
      and invoices.user_id = auth.uid()
    )
  );

create policy "Users can update invoice items for their invoices"
  on public.invoice_items for update
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_items.invoice_id
      and invoices.user_id = auth.uid()
    )
  );

create policy "Users can delete invoice items for their invoices"
  on public.invoice_items for delete
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_items.invoice_id
      and invoices.user_id = auth.uid()
    )
  );

-- PRODUCTS policies
create policy "Users can view their own products"
  on public.products for select
  using (auth.uid() = user_id);

create policy "Users can insert their own products"
  on public.products for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = user_id);

create policy "Users can delete their own products"
  on public.products for delete
  using (auth.uid() = user_id);

-- ORGANIZATIONS policies
create policy "Users can view their own organizations"
  on public.organizations for select
  using (auth.uid() = owner_id);

create policy "Users can insert their own organizations"
  on public.organizations for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own organizations"
  on public.organizations for update
  using (auth.uid() = owner_id);

create policy "Users can delete their own organizations"
  on public.organizations for delete
  using (auth.uid() = owner_id);

-- TEAM MEMBERS policies
create policy "Users can view team members in their org"
  on public.team_members for select
  using (
    exists (
      select 1 from public.organizations
      where organizations.id = team_members.organization_id
      and organizations.owner_id = auth.uid()
    )
  );

create policy "Users can manage team members in their org"
  on public.team_members for all
  using (
    exists (
      select 1 from public.organizations
      where organizations.id = team_members.organization_id
      and organizations.owner_id = auth.uid()
    )
  );

-- PROFILES policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
