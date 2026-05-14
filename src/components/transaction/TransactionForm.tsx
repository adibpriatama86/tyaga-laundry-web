import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Save } from 'lucide-react';
import type { LaundryTransaction, ServiceWithPrices, TransactionFormValues } from '../../types/models';
import {
  calculateEstimatedDone,
  calculateTotal,
  durationLabels,
  getServicePrice,
  orderStatusLabels,
  paymentMethodLabels,
  paymentStatusLabels,
} from '../../utils/calculateTransaction';
import { formatCurrency } from '../../utils/formatCurrency';
import { toDateInputValue } from '../../utils/formatDate';
import { serviceDisplayName } from '../../utils/serviceLabels';
import { useTransactionMutations } from '../../hooks/useTransactions';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';

const schema = z
  .object({
    receipt_number: z.string().min(1, 'Nomor nota wajib diisi.'),
    date_in: z.string().min(1, 'Tanggal masuk wajib diisi.'),
    customer_name: z.string().min(1, 'Nama pelanggan wajib diisi.'),
    customer_phone: z.string().optional(),
    service_id: z.string().min(1, 'Jenis layanan wajib dipilih.'),
    duration_type: z.enum(['one_day', 'two_days', 'three_days', 'regular']),
    quantity: z.coerce.number().positive('Berat/jumlah harus lebih dari 0.'),
    price_per_unit: z.coerce.number().min(0, 'Harga satuan tidak boleh negatif.'),
    total_price: z.coerce.number().min(0, 'Total harga tidak boleh negatif.'),
    is_manual_price: z.boolean(),
    is_manual_total: z.boolean(),
    estimated_done_date: z.string().optional(),
    payment_status: z.enum(['paid', 'unpaid']),
    payment_method: z.enum(['cash', 'qris', 'bank_transfer', 'not_selected']),
    payment_date: z.string().optional(),
    order_status: z.enum(['incoming', 'process', 'done']),
    notes: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.payment_status === 'paid') {
      if (value.payment_method === 'not_selected') {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['payment_method'],
          message: 'Metode pembayaran wajib dipilih jika transaksi lunas.',
        });
      }
      if (!value.payment_date) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['payment_date'],
          message: 'Tanggal pembayaran wajib diisi jika transaksi lunas.',
        });
      }
    }
  });

function transactionToValues(transaction?: LaundryTransaction): TransactionFormValues {
  return {
    receipt_number: transaction?.receipt_number ?? '',
    date_in: transaction?.date_in ?? toDateInputValue(),
    customer_name: transaction?.customer_name_snapshot ?? '',
    customer_phone: transaction?.customer_phone_snapshot ?? '',
    service_id: transaction?.service_id ?? '',
    duration_type: transaction?.duration_type ?? 'three_days',
    quantity: Number(transaction?.quantity ?? 1),
    price_per_unit: Number(transaction?.price_per_unit ?? 0),
    total_price: Number(transaction?.total_price ?? 0),
    is_manual_price: Boolean(transaction?.is_manual_price ?? false),
    is_manual_total: Boolean(transaction?.is_manual_total ?? false),
    estimated_done_date: transaction?.estimated_done_date ?? '',
    payment_status: transaction?.payment_status ?? 'unpaid',
    payment_method: transaction?.payment_method ?? 'not_selected',
    payment_date: transaction?.payment_date ?? '',
    order_status: transaction?.order_status ?? 'done',
    notes: transaction?.notes ?? '',
  };
}

interface TransactionFormProps {
  businessId: string;
  services: ServiceWithPrices[];
  mode?: 'create' | 'edit';
  transaction?: LaundryTransaction;
  onSuccess?: () => void;
}

export function TransactionForm({ businessId, services, mode = 'create', transaction, onSuccess }: TransactionFormProps) {
  const { showToast } = useToast();
  const { createTransaction, updateTransaction } = useTransactionMutations(businessId, services);
  const activeServices = mode === 'create' ? services.filter((service) => service.is_active) : services;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: transactionToValues(transaction),
  });

  const selectedServiceId = watch('service_id');
  const selectedDuration = watch('duration_type');
  const dateIn = watch('date_in');
  const quantity = Number(watch('quantity') || 0);
  const pricePerUnit = Number(watch('price_per_unit') || 0);
  const isManualPrice = watch('is_manual_price');
  const isManualTotal = watch('is_manual_total');
  const paymentStatus = watch('payment_status');
  const totalPrice = Number(watch('total_price') || 0);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [selectedServiceId, services],
  );

  useEffect(() => {
    if (!selectedServiceId && activeServices[0]) {
      setValue('service_id', activeServices[0].id);
    }
  }, [activeServices, selectedServiceId, setValue]);

  useEffect(() => {
    if (selectedService && !isManualPrice) {
      setValue('price_per_unit', getServicePrice(selectedService, selectedDuration), { shouldValidate: true });
    }
  }, [isManualPrice, selectedDuration, selectedService, setValue]);

  useEffect(() => {
    if (!isManualTotal) {
      setValue('total_price', calculateTotal(quantity, pricePerUnit), { shouldValidate: true });
    }
  }, [isManualTotal, pricePerUnit, quantity, setValue]);

  useEffect(() => {
    if (dateIn) {
      setValue('estimated_done_date', calculateEstimatedDone(dateIn, selectedDuration));
    }
  }, [dateIn, selectedDuration, setValue]);

  useEffect(() => {
    if (paymentStatus === 'paid') {
      if (watch('payment_method') === 'not_selected') setValue('payment_method', 'cash');
      if (!watch('payment_date')) setValue('payment_date', toDateInputValue());
    } else {
      setValue('payment_method', 'not_selected');
      setValue('payment_date', '');
    }
  }, [paymentStatus, setValue, watch]);

  const submit = handleSubmit(async (values) => {
    if (mode === 'edit' && transaction) {
      await updateTransaction.mutateAsync({ id: transaction.id, values });
      showToast('Transaksi berhasil diedit.');
      onSuccess?.();
      return;
    }

    await createTransaction.mutateAsync(values);
    showToast('Transaksi berhasil ditambahkan.');
    reset(transactionToValues());
    onSuccess?.();
  });

  const loading = createTransaction.isPending || updateTransaction.isPending;

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          <Card>
            <h2 className="mb-4 text-base font-bold text-ink">Informasi Nota</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Tanggal masuk" type="date" error={errors.date_in?.message} {...register('date_in')} />
              <Input label="Nomor nota" placeholder="Contoh: TYG-202605-001" error={errors.receipt_number?.message} {...register('receipt_number')} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-bold text-ink">Data Pelanggan</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Nama pelanggan" error={errors.customer_name?.message} {...register('customer_name')} />
              <Input label="Nomor HP" placeholder="Opsional" error={errors.customer_phone?.message} {...register('customer_phone')} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-bold text-ink">Detail Layanan</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Jenis layanan" error={errors.service_id?.message} {...register('service_id')}>
                {activeServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {serviceDisplayName(service.code, service.name)}
                  </option>
                ))}
              </Select>
              <Select label="Durasi" error={errors.duration_type?.message} {...register('duration_type')}>
                {Object.entries(durationLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Input
                label={selectedService?.unit_type === 'item' ? 'Jumlah Item' : 'Berat (kg)'}
                type="number"
                step="0.1"
                min="0"
                error={errors.quantity?.message}
                {...register('quantity', { valueAsNumber: true })}
              />
              <Input
                label="Estimasi selesai"
                type="date"
                error={errors.estimated_done_date?.message}
                {...register('estimated_done_date')}
              />
              <Input
                label="Harga satuan"
                type="number"
                min="0"
                error={errors.price_per_unit?.message}
                {...register('price_per_unit', { valueAsNumber: true })}
              />
              <Input
                label="Total harga"
                type="number"
                min="0"
                disabled={!isManualTotal}
                error={errors.total_price?.message}
                {...register('total_price', { valueAsNumber: true })}
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-ink">
                <input type="checkbox" {...register('is_manual_price')} />
                Harga satuan diubah manual
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-ink">
                <input type="checkbox" {...register('is_manual_total')} />
                Gunakan total manual
              </label>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-bold text-ink">Pembayaran</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Status pembayaran" error={errors.payment_status?.message} {...register('payment_status')}>
                <option value="paid">{paymentStatusLabels.paid}</option>
                <option value="unpaid">{paymentStatusLabels.unpaid}</option>
              </Select>
              <Select label="Metode pembayaran" error={errors.payment_method?.message} {...register('payment_method')} disabled={paymentStatus === 'unpaid'}>
                <option value="cash">{paymentMethodLabels.cash}</option>
                <option value="qris">{paymentMethodLabels.qris}</option>
                <option value="bank_transfer">{paymentMethodLabels.bank_transfer}</option>
                <option value="not_selected">{paymentMethodLabels.not_selected}</option>
              </Select>
              <Input label="Tanggal pembayaran" type="date" disabled={paymentStatus === 'unpaid'} error={errors.payment_date?.message} {...register('payment_date')} />
              <Select label="Status pesanan" error={errors.order_status?.message} {...register('order_status')}>
                {Object.entries(orderStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-bold text-ink">Catatan</h2>
            <textarea
              className="min-h-24 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-primary"
              placeholder="Opsional"
              {...register('notes')}
            />
          </Card>
        </div>

        <div className="xl:sticky xl:top-8 xl:self-start">
          <Card className="bg-primary-soft">
            <h2 className="text-base font-bold text-ink">Ringkasan</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Layanan</span>
                <span className="text-right font-semibold text-ink">
                  {selectedService ? serviceDisplayName(selectedService.code, selectedService.name) : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Durasi</span>
                <span className="font-semibold text-ink">{durationLabels[selectedDuration]}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">{selectedService?.unit_type === 'item' ? 'Jumlah' : 'Berat'}</span>
                <span className="font-semibold text-ink">
                  {quantity || 0} {selectedService?.unit_type || ''}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Harga satuan</span>
                <span className="font-semibold text-ink">{formatCurrency(pricePerUnit)}</span>
              </div>
              <div className="border-t border-blue-200 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-ink">Total harga</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Status bayar</span>
                <span className="font-semibold text-ink">{paymentStatusLabels[paymentStatus]}</span>
              </div>
            </div>
          </Card>

          <Button type="submit" size="lg" loading={loading} className="mt-4 w-full">
            <Save className="h-5 w-5" />
            {mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Transaksi'}
          </Button>
        </div>
      </div>
    </form>
  );
}
