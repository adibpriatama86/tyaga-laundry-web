import type {
  DurationType,
  LaundryTransaction,
  MonthlyReport,
  PaymentMethod,
  ServiceWithPrices,
} from '../types/models';
import { addDays } from './formatDate';

export const durationLabels: Record<DurationType, string> = {
  one_day: '1 Hari',
  two_days: '2 Hari',
  three_days: '3 Hari',
  regular: 'Reguler',
};

export const paymentStatusLabels = {
  paid: 'Lunas',
  unpaid: 'Belum Lunas',
} as const;

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: 'Tunai',
  qris: 'QRIS',
  bank_transfer: 'Transfer Bank',
  not_selected: 'Belum Dipilih',
};

export const orderStatusLabels = {
  incoming: 'Masuk',
  process: 'Proses',
  done: 'Selesai',
} as const;

export function durationToDays(duration: DurationType): number {
  if (duration === 'one_day') return 1;
  if (duration === 'two_days') return 2;
  return 3;
}

export function calculateEstimatedDone(dateIn: string, duration: DurationType): string {
  return addDays(dateIn, durationToDays(duration));
}

export function getServicePrice(service: ServiceWithPrices | undefined, duration: DurationType): number {
  if (!service) return 0;
  return Number(service.service_prices.find((price) => price.duration_type === duration)?.price ?? 0);
}

export function calculateTotal(quantity: number, pricePerUnit: number): number {
  return Math.max(0, Number(quantity || 0) * Number(pricePerUnit || 0));
}

export function summarizeTransactions(transactions: LaundryTransaction[]): MonthlyReport {
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, item) => sum + Number(item.total_price), 0);
  const paidTotal = transactions
    .filter((item) => item.payment_status === 'paid')
    .reduce((sum, item) => sum + Number(item.total_price), 0);
  const unpaidTotal = transactions
    .filter((item) => item.payment_status === 'unpaid')
    .reduce((sum, item) => sum + Number(item.total_price), 0);

  const byPayment = new Map<PaymentMethod, { total: number; count: number }>();
  const byService = new Map<string, { label: string; total: number; count: number }>();

  transactions.forEach((item) => {
    const payment = byPayment.get(item.payment_method) ?? { total: 0, count: 0 };
    payment.total += Number(item.total_price);
    payment.count += 1;
    byPayment.set(item.payment_method, payment);

    const serviceKey = item.service_code_snapshot || item.service_id;
    const service = byService.get(serviceKey) ?? {
      label: item.service_name_snapshot,
      total: 0,
      count: 0,
    };
    service.total += Number(item.total_price);
    service.count += 1;
    byService.set(serviceKey, service);
  });

  return {
    transactions,
    totalTransactions,
    totalRevenue,
    paidTotal,
    unpaidTotal,
    averageTransaction: totalTransactions ? totalRevenue / totalTransactions : 0,
    byPaymentMethod: Array.from(byPayment.entries()).map(([key, value]) => ({
      key,
      label: paymentMethodLabels[key],
      ...value,
    })),
    byService: Array.from(byService.entries()).map(([key, value]) => ({
      key,
      ...value,
    })),
  };
}
