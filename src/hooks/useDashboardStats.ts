import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { DashboardStats, LaundryTransaction } from '../types/models';
import { getMonthRange } from '../utils/formatDate';
import { serviceDisplayName } from '../utils/serviceLabels';

export function useDashboardStats(businessId: string | null, month: number, year: number) {
  return useQuery({
    queryKey: ['dashboard-stats', businessId, month, year],
    enabled: !!businessId,
    queryFn: async (): Promise<DashboardStats> => {
      if (!businessId) {
        return {
          totalTransactions: 0,
          totalRevenue: 0,
          unpaidCount: 0,
          unpaidTotal: 0,
          averageTransaction: 0,
          topPaymentMethod: null,
          topService: null,
        };
      }

      const { start, end } = getMonthRange(month, year);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('business_id', businessId)
        .gte('date_in', start)
        .lte('date_in', end)
        .limit(1000);

      if (error) throw error;

      const transactions = (data ?? []) as LaundryTransaction[];
      const totalRevenue = transactions.reduce((sum, item) => sum + Number(item.total_price), 0);
      const unpaidItems = transactions.filter((item) => item.payment_status === 'unpaid');

      const methodCounts = new Map<string, number>();
      const serviceCounts = new Map<string, number>();
      transactions.forEach((item) => {
        if (item.payment_status === 'paid' && item.payment_method !== 'not_selected') {
          methodCounts.set(item.payment_method, (methodCounts.get(item.payment_method) ?? 0) + 1);
        }
        const serviceName = serviceDisplayName(item.service_code_snapshot, item.service_name_snapshot);
        serviceCounts.set(serviceName, (serviceCounts.get(serviceName) ?? 0) + 1);
      });

      const topPaymentMethod =
        Array.from(methodCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
      const topService = Array.from(serviceCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

      return {
        totalTransactions: transactions.length,
        totalRevenue,
        unpaidCount: unpaidItems.length,
        unpaidTotal: unpaidItems.reduce((sum, item) => sum + Number(item.total_price), 0),
        averageTransaction: transactions.length ? totalRevenue / transactions.length : 0,
        topPaymentMethod: topPaymentMethod as DashboardStats['topPaymentMethod'],
        topService,
      };
    },
  });
}
