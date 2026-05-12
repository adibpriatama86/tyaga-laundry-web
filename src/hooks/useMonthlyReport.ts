import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { LaundryTransaction, MonthlyReport, ReportFilters } from '../types/models';
import { getMonthRange } from '../utils/formatDate';
import { summarizeTransactions } from '../utils/calculateTransaction';

export function useMonthlyReport(businessId: string | null, filters: ReportFilters) {
  return useQuery({
    queryKey: ['monthly-report', businessId, filters],
    enabled: !!businessId,
    queryFn: async (): Promise<MonthlyReport> => {
      if (!businessId) return summarizeTransactions([]);
      const { start, end } = getMonthRange(filters.month, filters.year);

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('business_id', businessId)
        .gte('date_in', start)
        .lte('date_in', end)
        .order('date_in', { ascending: true })
        .limit(1000);

      if (filters.paymentStatus !== 'all') query = query.eq('payment_status', filters.paymentStatus);
      if (filters.paymentMethod !== 'all') query = query.eq('payment_method', filters.paymentMethod);
      if (filters.serviceId !== 'all') query = query.eq('service_id', filters.serviceId);

      const { data, error } = await query;
      if (error) throw error;
      return summarizeTransactions((data ?? []) as LaundryTransaction[]);
    },
  });
}
