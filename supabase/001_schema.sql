create extension if not exists "pgcrypto";

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_name text,
  phone text,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  is_active boolean default true,
  created_at timestamptz default now(),
  constraint business_members_role_check check (role in ('owner')),
  constraint business_members_business_user_unique unique (business_id, user_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  phone text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  code text not null,
  name text not null,
  unit_type text not null,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint services_unit_type_check check (unit_type in ('kg', 'item')),
  constraint services_business_code_unique unique (business_id, code)
);

create table if not exists public.service_prices (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  duration_type text not null,
  price numeric not null default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint service_prices_duration_type_check check (duration_type in ('one_day', 'two_days', 'three_days', 'four_days', 'five_days')),
  constraint service_prices_price_check check (price >= 0),
  constraint service_prices_service_duration_unique unique (service_id, duration_type)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  service_id uuid not null references public.services(id) on delete restrict,
  receipt_number text,
  customer_name_snapshot text not null,
  customer_phone_snapshot text,
  service_code_snapshot text not null,
  service_name_snapshot text not null,
  unit_type_snapshot text not null,
  date_in date not null,
  estimated_done_date date,
  payment_date date,
  duration_type text not null,
  quantity numeric not null,
  price_per_unit numeric not null,
  total_price numeric not null,
  is_manual_price boolean default false,
  is_manual_total boolean default false,
  payment_status text not null,
  payment_method text not null,
  order_status text not null default 'done',
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint transactions_unit_type_check check (unit_type_snapshot in ('kg', 'item')),
  constraint transactions_duration_type_check check (duration_type in ('one_day', 'two_days', 'three_days', 'four_days', 'five_days')),
  constraint transactions_quantity_check check (quantity > 0),
  constraint transactions_price_per_unit_check check (price_per_unit >= 0),
  constraint transactions_total_price_check check (total_price >= 0),
  constraint transactions_payment_status_check check (payment_status in ('paid', 'unpaid')),
  constraint transactions_payment_method_check check (payment_method in ('cash', 'qris', 'bank_transfer', 'not_selected')),
  constraint transactions_order_status_check check (order_status in ('incoming', 'process', 'done'))
);

create index if not exists customers_business_id_idx on public.customers (business_id);
create index if not exists customers_business_phone_idx on public.customers (business_id, phone);
create index if not exists services_business_id_idx on public.services (business_id);
create index if not exists service_prices_service_id_idx on public.service_prices (service_id);
create index if not exists transactions_business_date_idx on public.transactions (business_id, date_in desc);
create index if not exists transactions_business_payment_idx on public.transactions (business_id, payment_status);
create index if not exists transactions_business_service_idx on public.transactions (business_id, service_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_businesses_updated_at on public.businesses;
create trigger set_businesses_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_service_prices_updated_at on public.service_prices;
create trigger set_service_prices_updated_at
before update on public.service_prices
for each row execute function public.set_updated_at();

drop trigger if exists set_transactions_updated_at on public.transactions;
create trigger set_transactions_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
