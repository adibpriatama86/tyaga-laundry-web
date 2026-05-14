begin;

update public.transactions
set duration_type = 'three_days'
where duration_type = 'regular';

insert into public.service_prices (service_id, duration_type, price, is_active)
select service_id, 'three_days', price, is_active
from public.service_prices
where duration_type = 'regular'
on conflict (service_id, duration_type) do nothing;

do $$
declare
  constraint_row record;
begin
  for constraint_row in
    select conname
    from pg_constraint
    where conrelid = 'public.service_prices'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%duration_type%'
  loop
    execute format('alter table public.service_prices drop constraint %I', constraint_row.conname);
  end loop;

  for constraint_row in
    select conname
    from pg_constraint
    where conrelid = 'public.transactions'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%duration_type%'
  loop
    execute format('alter table public.transactions drop constraint %I', constraint_row.conname);
  end loop;
end $$;

with base_prices as (
  select
    services.id as service_id,
    coalesce(
      max(service_prices.price) filter (where service_prices.duration_type = 'three_days'),
      max(service_prices.price) filter (where service_prices.duration_type = 'regular'),
      max(service_prices.price),
      0
    ) as base_price,
    coalesce(
      bool_or(service_prices.is_active) filter (where service_prices.duration_type in ('three_days', 'regular')),
      true
    ) as is_active
  from public.services
  left join public.service_prices on service_prices.service_id = services.id
  group by services.id
),
new_prices as (
  select
    service_id,
    'four_days'::text as duration_type,
    greatest(base_price - case when base_price >= 10000 then 1000 else 500 end, 0) as price,
    is_active
  from base_prices
  union all
  select
    service_id,
    'five_days'::text as duration_type,
    greatest(base_price - case when base_price >= 10000 then 2000 else 1000 end, 0) as price,
    is_active
  from base_prices
)
insert into public.service_prices (service_id, duration_type, price, is_active)
select service_id, duration_type, price, is_active
from new_prices
on conflict (service_id, duration_type) do nothing;

delete from public.service_prices
where duration_type = 'regular';

alter table public.service_prices
add constraint service_prices_duration_type_check
check (duration_type in ('one_day', 'two_days', 'three_days', 'four_days', 'five_days'));

alter table public.transactions
add constraint transactions_duration_type_check
check (duration_type in ('one_day', 'two_days', 'three_days', 'four_days', 'five_days'));

commit;
