import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Edit3, Tags } from 'lucide-react';
import type { DurationType, ServiceFormValues, ServiceWithPrices } from '../types/models';
import { useBusinessAccess } from '../hooks/useBusinessAccess';
import { useServices, useUpdateService } from '../hooks/useServices';
import { durationLabels } from '../utils/calculateTransaction';
import { formatCurrency } from '../utils/formatCurrency';
import { serviceDisplayName } from '../utils/serviceLabels';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

const durations: DurationType[] = ['one_day', 'two_days', 'three_days', 'regular'];

const serviceSchema = z.object({
  code: z.string().min(1, 'Kode layanan wajib diisi.'),
  name: z.string().min(1, 'Nama layanan wajib diisi.'),
  unit_type: z.enum(['kg', 'item']),
  is_active: z.boolean(),
  prices: z.object({
    one_day: z.coerce.number().min(0, 'Harga tidak boleh negatif.'),
    two_days: z.coerce.number().min(0, 'Harga tidak boleh negatif.'),
    three_days: z.coerce.number().min(0, 'Harga tidak boleh negatif.'),
    regular: z.coerce.number().min(0, 'Harga tidak boleh negatif.'),
  }),
});

function serviceToValues(service: ServiceWithPrices): ServiceFormValues {
  return {
    code: service.code,
    name: service.name,
    unit_type: service.unit_type,
    is_active: service.is_active,
    prices: durations.reduce(
      (acc, duration) => ({
        ...acc,
        [duration]: Number(service.service_prices.find((price) => price.duration_type === duration)?.price ?? 0),
      }),
      {} as Record<DurationType, number>,
    ),
  };
}

function ServiceEditor({
  service,
  businessId,
  onClose,
}: {
  service: ServiceWithPrices;
  businessId: string;
  onClose: () => void;
}) {
  const updateService = useUpdateService(businessId);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: serviceToValues(service),
  });

  useEffect(() => {
    reset(serviceToValues(service));
  }, [reset, service]);

  const onSubmit = handleSubmit(async (values) => {
    await updateService.mutateAsync({ service, values });
    showToast('Harga layanan berhasil diperbarui.');
    onClose();
  });

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Kode layanan" error={errors.code?.message} {...register('code')} />
        <Input label="Nama layanan" error={errors.name?.message} {...register('name')} />
        <Select label="Unit" error={errors.unit_type?.message} {...register('unit_type')}>
          <option value="kg">kg</option>
          <option value="item">item</option>
        </Select>
        <label className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-ink">
          <input type="checkbox" {...register('is_active')} />
          Layanan aktif
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {durations.map((duration) => (
          <Input
            key={duration}
            label={`Harga ${durationLabels[duration]}`}
            type="number"
            min="0"
            error={errors.prices?.[duration]?.message}
            {...register(`prices.${duration}`, { valueAsNumber: true })}
          />
        ))}
      </div>
      <Button type="submit" loading={updateService.isPending} className="w-full sm:w-auto">
        Simpan Perubahan
      </Button>
    </form>
  );
}

export function ServicesPage() {
  const { businessId } = useBusinessAccess();
  const services = useServices(businessId);
  const [selected, setSelected] = useState<ServiceWithPrices | null>(null);

  if (!businessId) return null;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-primary">Pengaturan layanan</p>
        <h1 className="text-2xl font-bold text-ink lg:text-3xl">Layanan & Harga</h1>
      </div>

      {services.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
      ) : services.isError ? (
        <EmptyState title="Data gagal dimuat. Coba refresh halaman." />
      ) : services.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.data.map((service) => (
            <Card key={service.id} animated>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Tags className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-primary">{service.code}</p>
                    <h2 className="text-base font-bold text-ink">{serviceDisplayName(service.code, service.name)}</h2>
                    <p className="text-sm text-muted">
                      Unit {service.unit_type} · {service.is_active ? 'Aktif' : 'Nonaktif'}
                    </p>
                  </div>
                </div>
                <Button type="button" variant="secondary" size="icon" onClick={() => setSelected(service)} aria-label="Edit layanan">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 grid gap-2">
                {durations.map((duration) => (
                  <div key={duration} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                    <span className="font-semibold text-ink">{durationLabels[duration]}</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(service.service_prices.find((price) => price.duration_type === duration)?.price ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Belum ada layanan" description="Jalankan seed demo Supabase untuk mengisi daftar layanan Tyaga Laundry." />
      )}

      <Modal open={!!selected} title="Edit Layanan & Harga" onClose={() => setSelected(null)} className="sm:max-w-2xl">
        {selected ? <ServiceEditor service={selected} businessId={businessId} onClose={() => setSelected(null)} /> : null}
      </Modal>
    </div>
  );
}
