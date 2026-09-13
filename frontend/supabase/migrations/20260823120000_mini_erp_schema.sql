-- ============================================
-- Mini ERP - Extended Schema
-- Adds: Expenses, Payments, Inventory tracking
-- ============================================

-- ============================================
-- 1. EXPENSES
-- ============================================
create table public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category text default 'other' not null,
  vendor text default '',
  amount numeric(12,2) default 0 not null,
  currency text default 'USD' not null,
  expense_date date default current_date not null,
  payment_method text default 'cash' check (payment_method in ('cash', 'card', 'bank_transfer', 'mobile_money', 'other')),
  notes text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_expenses_user_id on public.expenses(user_id);
create index idx_expenses_category on public.expenses(category);
create index idx_expenses_date on public.expenses(expense_date);

-- ============================================
-- 2. PAYMENTS (against invoices)
-- ============================================
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  invoice_id uuid references public.invoices(id) on delete cascade not null,
  amount numeric(12,2) default 0 not null,
  currency text default 'USD' not null,
  payment_method text default 'cash' check (payment_method in ('cash', 'card', 'bank_transfer', 'mobile_money', 'other')),
  payment_date date default current_date not null,
  reference text default '',
  notes text default '',
  created_at timestamptz default now() not null
);

create index idx_payments_user_id on public.payments(user_id);
create index idx_payments_invoice_id on public.payments(invoice_id);
create index idx_payments_date on public.payments(payment_date);

-- ============================================
-- 2b. DISCOUNT FIELD ON INVOICES
-- ============================================
alter table public.invoices
  add column if not exists discount_amount numeric(12,2) default 0 not null;

-- ============================================
-- 3. INVENTORY FIELDS ON PRODUCTS
-- ============================================
alter table public.products
  add column if not exists sku text default '',
  add column if not exists stock_quantity integer default 0 not null,
  add column if not exists low_stock_threshold integer default 5 not null,
  add column if not exists track_stock boolean default false not null;

create index if not exists idx_products_sku on public.products(sku);

-- ============================================
-- 4. EXPENSE CATEGORY CHECK (soft constraint via app layer)
-- Allowed categories:
-- rent, utilities, salaries, marketing, supplies,
-- software, travel, taxes, other
-- ============================================

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
create trigger update_expenses_updated_at before update on public.expenses
  for each row execute function update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.expenses enable row level security;
alter table public.payments enable row level security;

-- EXPENSES policies
create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- PAYMENTS policies
create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own payments"
  on public.payments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own payments"
  on public.payments for delete
  using (auth.uid() = user_id);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
grant all on public.expenses to anon, authenticated, service_role;
grant all on public.payments to anon, authenticated, service_role;