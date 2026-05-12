-- Ganti <AUTH_USER_ID_HERE> dengan UUID user dari Supabase Auth.
-- Business ID ini berasal dari seed Tyaga Laundry di 003_seed_demo.sql.

insert into public.business_members (business_id, user_id, role, is_active)
values ('11111111-1111-4111-8111-111111111111', '<AUTH_USER_ID_HERE>', 'owner', true)
on conflict (business_id, user_id) do update
  set role = 'owner',
      is_active = true;
