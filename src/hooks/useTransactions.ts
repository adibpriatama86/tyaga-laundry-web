import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type {
  Customer,
  LaundryTransaction,
  ServiceWithPrices,
  TransactionFilters,
  TransactionFormValues,
} from '../types/models';
import { useAuth } from './useAuth';
import { getMonthRange } from '../utils/formatDate';

interface TransactionPageResult {
  transactions: LaundryTransaction[];
  count: number;
}

async function findOrCreateCustomer(
  businessId: string,
  name: string,
  phone: string | null,
): Promise<Customer | null> {
  let existingQuery = supabase.from('customers').select('*').eq('business_id', businessId).limit(1);
  existingQuery = phone
    ? existingQuery.eq('phone', phone)
    : existingQuery.ilike('name', name.trim());

  const { data: existing, error: existingError } = await existingQuery.maybeSingle();
  if (existingError) throw existingError;
  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from('customers')
    .insert({
      business_id: businessId,
      name: name.trim(),
      phone,
      notes: null,
    })
    .select()
    .single();

  if (createError) throw createError;
  return created;
}

function buildTransactionPayload(
  businessId: string,
  values: TransactionFormValues,
  service: ServiceWithPrices,
  customer: Customer | null,
  userId: string | null,
) {
  const phone = values.customer_phone?.trim() || null;
  const paymentStatus = values.payment_status;

  return {
    business_id: businessId,
    customer_id: customer?.id ?? null,
    service_id: service.id,
    receipt_number: values.receipt_number.trim(),
    customer_name_snapshot: values.customer_name.trim(),
    customer_phone_snapshot: phone,
    service_code_snapshot: service.code,
    service_name_snapshot: service.name,
    unit_type_snapshot: service.unit_type,
    date_in: values.date_in,
    estimated_done_date: values.estimated_done_date || null,
    payment_date: paymentStatus === 'paid' ? values.payment_date || null : null,
    duration_type: values.duration_type,
    quantity: Number(values.quantity),
    price_per_unit: Number(values.price_per_unit),
    total_price: Number(values.total_price),
    is_manual_price: values.is_manual_price,
    is_manual_total: values.is_manual_total,
    payment_status: paymentStatus,
    payment_method: paymentStatus === 'paid' ? values.payment_method : 'not_selected',
    order_status: values.order_status,
    notes: values.notes?.trim() || null,
    created_by: userId,
  };
}

export function useTransactions(
  businessId: string | null,
  filters: TransactionFilters,
  page: number,
  pageSize = 20,
) {
  return useQuery({
    queryKey: ['transactions', businessId, filters, page, pageSize],
    enabled: !!businessId,
    queryFn: async (): Promise<TransactionPageResult> => {
      if (!businessId) return { transactions: [], count: 0 };
      const { start, end } = getMonthRange(filters.month, filters.year);
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('business_id', businessId)
        .gte('date_in', start)
        .lte('date_in', end);

      if (filters.paymentStatus !== 'all') query = query.eq('payment_status', filters.paymentStatus);
      if (filters.paymentMethod !== 'all') query = query.eq('payment_method', filters.paymentMethod);
      if (filters.orderStatus !== 'all') query = query.eq('order_status', filters.orderStatus);
      if (filters.serviceId !== 'all') query = query.eq('service_id', filters.serviceId);
      if (filters.search.trim()) {
        const safeSearch = filters.search.trim().replace(/[%(),]/g, '');
        query = query.or(
          `customer_name_snapshot.ilike.%${safeSearch}%,receipt_number.ilike.%${safeSearch}%,service_name_snapshot.ilike.%${safeSearch}%`,
        );
      }

      const { data, error, count } = await query
        .order('date_in', { ascending: filters.sort === 'date_asc' })
        .order('created_at', { ascending: filters.sort === 'date_asc' })
        .range(from, to);

      if (error) throw error;
      return { transactions: (data ?? []) as LaundryTransaction[], count: count ?? 0 };
    },
  });
}

export function useTransactionMutations(businessId: string | null, services: ServiceWithPrices[]) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['transactions', businessId] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', businessId] }),
      queryClient.invalidateQueries({ queryKey: ['monthly-report', businessId] }),
      queryClient.invalidateQueries({ queryKey: ['services', businessId] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      if (!businessId) throw new Error('Business belum tersedia.');
      const service = services.find((item) => item.id === values.service_id);
      if (!service) throw new Error('Layanan tidak ditemukan.');

      const phone = values.customer_phone?.trim() || null;
      const customer = await findOrCreateCustomer(businessId, values.customer_name, phone);
      const payload = buildTransactionPayload(businessId, values, service, customer, user?.id ?? null);

      const { data, error } = await supabase.from('transactions').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: TransactionFormValues }) => {
      if (!businessId) throw new Error('Business belum tersedia.');
      const service = services.find((item) => item.id === values.service_id);
      if (!service) throw new Error('Layanan tidak ditemukan.');

      const phone = values.customer_phone?.trim() || null;
      const customer = await findOrCreateCustomer(businessId, values.customer_name, phone);
      const payload = buildTransactionPayload(businessId, values, service, customer, user?.id ?? null);

      const { data, error } = await supabase
        .from('transactions')
        .update(payload)
        .eq('id', id)
        .eq('business_id', businessId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      if (!businessId) throw new Error('Business belum tersedia.');
      const { error } = await supabase.from('transactions').delete().eq('business_id', businessId).in('id', ids);
      if (error) throw error;
      return ids;
    },
    onSuccess: invalidate,
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: 'paid' | 'unpaid' }) => {
      if (!businessId) throw new Error('Business belum tersedia.');
      const today = new Date().toISOString().slice(0, 10);
      const { error } = await supabase
        .from('transactions')
        .update({
          payment_status: status,
          payment_method: status === 'paid' ? 'cash' : 'not_selected',
          payment_date: status === 'paid' ? today : null,
        })
        .eq('business_id', businessId)
        .in('id', ids);
      if (error) throw error;
      return ids;
    },
    onSuccess: invalidate,
  });

  return {
    createTransaction: createMutation,
    updateTransaction: updateMutation,
    deleteTransactions: deleteMutation,
    updatePaymentStatus: updatePaymentStatusMutation,
  };
}
