do $$
declare
  tyaga_business_id uuid := '11111111-1111-4111-8111-111111111111';
begin
  insert into public.businesses (id, name, owner_name, phone, address)
  values (
    tyaga_business_id,
    'Tyaga Laundry',
    'Ibu Tyaga',
    '0812-3456-7890',
    'Jl. Melati No. 12, Bandung'
  )
  on conflict (id) do update
    set name = excluded.name,
        owner_name = excluded.owner_name,
        phone = excluded.phone,
        address = excluded.address;

  insert into public.services (id, business_id, code, name, unit_type, is_active, display_order)
  values
    ('21111111-1111-4111-8111-111111111111', tyaga_business_id, 'CKS', 'Cuci Kering Setrika', 'kg', true, 1),
    ('21111111-1111-4111-8111-111111111112', tyaga_business_id, 'CK', 'Cuci Kering', 'kg', true, 2),
    ('21111111-1111-4111-8111-111111111113', tyaga_business_id, 'SETRIKA', 'Setrika', 'kg', true, 3),
    ('21111111-1111-4111-8111-111111111114', tyaga_business_id, 'BEDCOVER', 'Bed Cover', 'item', true, 4),
    ('21111111-1111-4111-8111-111111111115', tyaga_business_id, 'SEPATU', 'Sepatu', 'item', true, 5),
    ('21111111-1111-4111-8111-111111111116', tyaga_business_id, 'KARPET', 'Tikar / Karpet', 'item', true, 6),
    ('21111111-1111-4111-8111-111111111117', tyaga_business_id, 'SELIMUT-B', 'Selimut Besar', 'item', true, 7),
    ('21111111-1111-4111-8111-111111111118', tyaga_business_id, 'SELIMUT-K', 'Selimut Kecil', 'item', true, 8),
    ('21111111-1111-4111-8111-111111111119', tyaga_business_id, 'SELIMUT-S', 'Selimut Sedang', 'item', true, 9),
    ('21111111-1111-4111-8111-111111111120', tyaga_business_id, 'BONEKA', 'Boneka / Bantal', 'item', true, 10)
  on conflict (business_id, code) do update
    set name = excluded.name,
        unit_type = excluded.unit_type,
        is_active = excluded.is_active,
        display_order = excluded.display_order;

  insert into public.service_prices (service_id, duration_type, price, is_active)
  values
    ('21111111-1111-4111-8111-111111111111', 'one_day', 9000, true),
    ('21111111-1111-4111-8111-111111111111', 'two_days', 8000, true),
    ('21111111-1111-4111-8111-111111111111', 'three_days', 7000, true),
    ('21111111-1111-4111-8111-111111111111', 'regular', 6000, true),
    ('21111111-1111-4111-8111-111111111112', 'one_day', 7500, true),
    ('21111111-1111-4111-8111-111111111112', 'two_days', 6500, true),
    ('21111111-1111-4111-8111-111111111112', 'three_days', 5500, true),
    ('21111111-1111-4111-8111-111111111112', 'regular', 5000, true),
    ('21111111-1111-4111-8111-111111111113', 'one_day', 6500, true),
    ('21111111-1111-4111-8111-111111111113', 'two_days', 5500, true),
    ('21111111-1111-4111-8111-111111111113', 'three_days', 4500, true),
    ('21111111-1111-4111-8111-111111111113', 'regular', 4000, true),
    ('21111111-1111-4111-8111-111111111114', 'one_day', 45000, true),
    ('21111111-1111-4111-8111-111111111114', 'two_days', 40000, true),
    ('21111111-1111-4111-8111-111111111114', 'three_days', 35000, true),
    ('21111111-1111-4111-8111-111111111114', 'regular', 30000, true),
    ('21111111-1111-4111-8111-111111111115', 'one_day', 35000, true),
    ('21111111-1111-4111-8111-111111111115', 'two_days', 30000, true),
    ('21111111-1111-4111-8111-111111111115', 'three_days', 25000, true),
    ('21111111-1111-4111-8111-111111111115', 'regular', 22000, true),
    ('21111111-1111-4111-8111-111111111116', 'one_day', 65000, true),
    ('21111111-1111-4111-8111-111111111116', 'two_days', 55000, true),
    ('21111111-1111-4111-8111-111111111116', 'three_days', 45000, true),
    ('21111111-1111-4111-8111-111111111116', 'regular', 40000, true),
    ('21111111-1111-4111-8111-111111111117', 'one_day', 35000, true),
    ('21111111-1111-4111-8111-111111111117', 'two_days', 30000, true),
    ('21111111-1111-4111-8111-111111111117', 'three_days', 25000, true),
    ('21111111-1111-4111-8111-111111111117', 'regular', 22000, true),
    ('21111111-1111-4111-8111-111111111118', 'one_day', 22000, true),
    ('21111111-1111-4111-8111-111111111118', 'two_days', 18000, true),
    ('21111111-1111-4111-8111-111111111118', 'three_days', 15000, true),
    ('21111111-1111-4111-8111-111111111118', 'regular', 12000, true),
    ('21111111-1111-4111-8111-111111111119', 'one_day', 28000, true),
    ('21111111-1111-4111-8111-111111111119', 'two_days', 24000, true),
    ('21111111-1111-4111-8111-111111111119', 'three_days', 20000, true),
    ('21111111-1111-4111-8111-111111111119', 'regular', 17000, true),
    ('21111111-1111-4111-8111-111111111120', 'one_day', 30000, true),
    ('21111111-1111-4111-8111-111111111120', 'two_days', 26000, true),
    ('21111111-1111-4111-8111-111111111120', 'three_days', 22000, true),
    ('21111111-1111-4111-8111-111111111120', 'regular', 18000, true)
  on conflict (service_id, duration_type) do update
    set price = excluded.price,
        is_active = excluded.is_active;

  insert into public.customers (id, business_id, name, phone, notes)
  values
    ('31111111-1111-4111-8111-111111111111', tyaga_business_id, 'Siti Rahma', '081300000001', 'Pelanggan sekitar outlet'),
    ('31111111-1111-4111-8111-111111111112', tyaga_business_id, 'Budi Santoso', '081300000002', null),
    ('31111111-1111-4111-8111-111111111113', tyaga_business_id, 'Maya Putri', null, null),
    ('31111111-1111-4111-8111-111111111114', tyaga_business_id, 'Rian Saputra', '081300000004', null),
    ('31111111-1111-4111-8111-111111111115', tyaga_business_id, 'Dewi Lestari', '081300000005', null)
  on conflict (id) do update
    set name = excluded.name,
        phone = excluded.phone,
        notes = excluded.notes;

  insert into public.transactions (
    id, business_id, customer_id, service_id, receipt_number,
    customer_name_snapshot, customer_phone_snapshot,
    service_code_snapshot, service_name_snapshot, unit_type_snapshot,
    date_in, estimated_done_date, payment_date, duration_type,
    quantity, price_per_unit, total_price, is_manual_price, is_manual_total,
    payment_status, payment_method, order_status, notes, created_by
  )
  values
    ('41111111-1111-4111-8111-111111111111', tyaga_business_id, '31111111-1111-4111-8111-111111111111', '21111111-1111-4111-8111-111111111111', 'TYG-202605-001', 'Siti Rahma', '081300000001', 'CKS', 'Cuci Kering Setrika', 'kg', '2026-05-02', '2026-05-05', '2026-05-02', 'three_days', 3, 7000, 21000, false, false, 'paid', 'cash', 'done', 'Nota manual dimasukkan untuk rekap bulanan.', null),
    ('41111111-1111-4111-8111-111111111112', tyaga_business_id, '31111111-1111-4111-8111-111111111112', '21111111-1111-4111-8111-111111111112', 'TYG-202605-002', 'Budi Santoso', '081300000002', 'CK', 'Cuci Kering', 'kg', '2026-05-03', '2026-05-05', '2026-05-03', 'two_days', 4, 6500, 26000, false, false, 'paid', 'qris', 'done', null, null),
    ('41111111-1111-4111-8111-111111111113', tyaga_business_id, '31111111-1111-4111-8111-111111111113', '21111111-1111-4111-8111-111111111114', 'TYG-202605-003', 'Maya Putri', null, 'BEDCOVER', 'Bed Cover', 'item', '2026-05-04', '2026-05-07', null, 'regular', 1, 30000, 30000, false, false, 'unpaid', 'not_selected', 'done', 'Belum dibayar saat nota direkap.', null),
    ('41111111-1111-4111-8111-111111111114', tyaga_business_id, '31111111-1111-4111-8111-111111111114', '21111111-1111-4111-8111-111111111113', 'TYG-202605-004', 'Rian Saputra', '081300000004', 'SETRIKA', 'Setrika', 'kg', '2026-05-06', '2026-05-07', '2026-05-06', 'one_day', 2, 6500, 13000, false, false, 'paid', 'bank_transfer', 'done', null, null),
    ('41111111-1111-4111-8111-111111111115', tyaga_business_id, '31111111-1111-4111-8111-111111111115', '21111111-1111-4111-8111-111111111115', 'TYG-202605-005', 'Dewi Lestari', '081300000005', 'SEPATU', 'Sepatu', 'item', '2026-05-07', '2026-05-10', null, 'three_days', 2, 25000, 50000, false, false, 'unpaid', 'not_selected', 'done', 'Sepatu dua pasang.', null),
    ('41111111-1111-4111-8111-111111111116', tyaga_business_id, '31111111-1111-4111-8111-111111111111', '21111111-1111-4111-8111-111111111111', 'TYG-202604-021', 'Siti Rahma', '081300000001', 'CKS', 'Cuci Kering Setrika', 'kg', '2026-04-12', '2026-04-15', '2026-04-12', 'three_days', 5, 7000, 35000, false, false, 'paid', 'cash', 'done', null, null),
    ('41111111-1111-4111-8111-111111111117', tyaga_business_id, '31111111-1111-4111-8111-111111111112', '21111111-1111-4111-8111-111111111116', 'TYG-202604-022', 'Budi Santoso', '081300000002', 'KARPET', 'Tikar / Karpet', 'item', '2026-04-18', '2026-04-21', null, 'regular', 1, 40000, 40000, false, false, 'unpaid', 'not_selected', 'done', null, null),
    ('41111111-1111-4111-8111-111111111118', tyaga_business_id, '31111111-1111-4111-8111-111111111114', '21111111-1111-4111-8111-111111111120', 'TYG-202604-023', 'Rian Saputra', '081300000004', 'BONEKA', 'Boneka / Bantal', 'item', '2026-04-26', '2026-04-28', '2026-04-26', 'two_days', 2, 26000, 52000, false, false, 'paid', 'qris', 'done', null, null)
  on conflict (id) do update
    set receipt_number = excluded.receipt_number,
        payment_status = excluded.payment_status,
        payment_method = excluded.payment_method,
        notes = excluded.notes;
end $$;
