export type UnitType = 'kg' | 'item';
export type DurationType = 'one_day' | 'two_days' | 'three_days' | 'four_days' | 'five_days';
export type PaymentStatus = 'paid' | 'unpaid';
export type PaymentMethod = 'cash' | 'qris' | 'bank_transfer' | 'not_selected';
export type OrderStatus = 'incoming' | 'process' | 'done';
export type MemberRole = 'owner';

export interface Business {
  id: string;
  name: string;
  owner_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BusinessMember {
  id: string;
  business_id: string;
  user_id: string;
  role: MemberRole;
  is_active: boolean;
  created_at: string | null;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Service {
  id: string;
  business_id: string;
  code: string;
  name: string;
  unit_type: UnitType;
  is_active: boolean;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ServicePrice {
  id: string;
  service_id: string;
  duration_type: DurationType;
  price: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ServiceWithPrices extends Service {
  service_prices: ServicePrice[];
}

export interface LaundryTransaction {
  id: string;
  business_id: string;
  customer_id: string | null;
  service_id: string;
  receipt_number: string | null;
  customer_name_snapshot: string;
  customer_phone_snapshot: string | null;
  service_code_snapshot: string;
  service_name_snapshot: string;
  unit_type_snapshot: UnitType;
  date_in: string;
  estimated_done_date: string | null;
  payment_date: string | null;
  duration_type: DurationType;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  is_manual_price: boolean;
  is_manual_total: boolean;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  order_status: OrderStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TransactionFilters {
  month: number;
  year: number;
  paymentStatus: 'all' | PaymentStatus;
  paymentMethod: 'all' | PaymentMethod;
  orderStatus: 'all' | OrderStatus;
  serviceId: 'all' | string;
  search: string;
  sort: 'date_desc' | 'date_asc';
}

export interface ReportFilters {
  month: number;
  year: number;
  paymentStatus: 'all' | PaymentStatus;
  paymentMethod: 'all' | PaymentMethod;
  serviceId: 'all' | string;
}

export interface DashboardStats {
  totalTransactions: number;
  totalRevenue: number;
  unpaidCount: number;
  unpaidTotal: number;
  averageTransaction: number;
  topPaymentMethod: PaymentMethod | null;
  topService: string | null;
}

export interface MonthlyReport {
  transactions: LaundryTransaction[];
  totalTransactions: number;
  totalRevenue: number;
  paidTotal: number;
  unpaidTotal: number;
  averageTransaction: number;
  byPaymentMethod: Array<{ key: PaymentMethod; label: string; total: number; count: number }>;
  byService: Array<{ key: string; label: string; total: number; count: number }>;
}

export interface TransactionFormValues {
  receipt_number: string;
  date_in: string;
  customer_name: string;
  customer_phone?: string;
  service_id: string;
  duration_type: DurationType;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  is_manual_price: boolean;
  is_manual_total: boolean;
  estimated_done_date?: string;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_date?: string;
  order_status: OrderStatus;
  notes?: string;
}

export interface ServiceFormValues {
  code: string;
  name: string;
  unit_type: UnitType;
  is_active: boolean;
  prices: Record<DurationType, number>;
}

export interface BusinessSettingsFormValues {
  name: string;
  owner_name?: string;
  phone?: string;
  address?: string;
}
