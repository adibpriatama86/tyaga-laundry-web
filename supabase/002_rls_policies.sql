create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.user_id = auth.uid()
      and bm.is_active = true
  );
$$;

create or replace function public.is_business_owner(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.user_id = auth.uid()
      and bm.role = 'owner'
      and bm.is_active = true
  );
$$;

alter table public.businesses enable row level security;
alter table public.profiles enable row level security;
alter table public.business_members enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.service_prices enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "businesses_select_member" on public.businesses;
create policy "businesses_select_member"
on public.businesses for select
using (public.is_business_member(id));

drop policy if exists "businesses_update_owner" on public.businesses;
create policy "businesses_update_owner"
on public.businesses for update
using (public.is_business_owner(id))
with check (public.is_business_owner(id));

drop policy if exists "business_members_select_own" on public.business_members;
create policy "business_members_select_own"
on public.business_members for select
using (user_id = auth.uid());

drop policy if exists "customers_select_member" on public.customers;
create policy "customers_select_member"
on public.customers for select
using (public.is_business_member(business_id));

drop policy if exists "customers_insert_member" on public.customers;
create policy "customers_insert_member"
on public.customers for insert
with check (public.is_business_member(business_id));

drop policy if exists "customers_update_member" on public.customers;
create policy "customers_update_member"
on public.customers for update
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

drop policy if exists "customers_delete_member" on public.customers;
create policy "customers_delete_member"
on public.customers for delete
using (public.is_business_member(business_id));

drop policy if exists "services_select_member" on public.services;
create policy "services_select_member"
on public.services for select
using (public.is_business_member(business_id));

drop policy if exists "services_insert_member" on public.services;
create policy "services_insert_member"
on public.services for insert
with check (public.is_business_member(business_id));

drop policy if exists "services_update_member" on public.services;
create policy "services_update_member"
on public.services for update
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

drop policy if exists "services_delete_member" on public.services;
create policy "services_delete_member"
on public.services for delete
using (public.is_business_member(business_id));

drop policy if exists "service_prices_select_member" on public.service_prices;
create policy "service_prices_select_member"
on public.service_prices for select
using (
  exists (
    select 1 from public.services s
    where s.id = service_prices.service_id
      and public.is_business_member(s.business_id)
  )
);

drop policy if exists "service_prices_insert_member" on public.service_prices;
create policy "service_prices_insert_member"
on public.service_prices for insert
with check (
  exists (
    select 1 from public.services s
    where s.id = service_prices.service_id
      and public.is_business_member(s.business_id)
  )
);

drop policy if exists "service_prices_update_member" on public.service_prices;
create policy "service_prices_update_member"
on public.service_prices for update
using (
  exists (
    select 1 from public.services s
    where s.id = service_prices.service_id
      and public.is_business_member(s.business_id)
  )
)
with check (
  exists (
    select 1 from public.services s
    where s.id = service_prices.service_id
      and public.is_business_member(s.business_id)
  )
);

drop policy if exists "service_prices_delete_member" on public.service_prices;
create policy "service_prices_delete_member"
on public.service_prices for delete
using (
  exists (
    select 1 from public.services s
    where s.id = service_prices.service_id
      and public.is_business_member(s.business_id)
  )
);

drop policy if exists "transactions_select_member" on public.transactions;
create policy "transactions_select_member"
on public.transactions for select
using (public.is_business_member(business_id));

drop policy if exists "transactions_insert_member" on public.transactions;
create policy "transactions_insert_member"
on public.transactions for insert
with check (public.is_business_member(business_id));

drop policy if exists "transactions_update_member" on public.transactions;
create policy "transactions_update_member"
on public.transactions for update
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

drop policy if exists "transactions_delete_member" on public.transactions;
create policy "transactions_delete_member"
on public.transactions for delete
using (public.is_business_member(business_id));
