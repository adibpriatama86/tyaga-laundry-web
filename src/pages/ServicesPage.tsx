import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Edit3, Plus, Tags } from 'lucide-react';
import type { DurationType, ServiceFormValues, ServiceWithPrices } from '../types/models';
import { useBusinessAccess } from '../hooks/useBusinessAccess';
import { useCreateService, useServices, useUpdateService } from '../hooks/useServices';
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

const durations: DurationType[] = ['one_day', 'two_days', 'three_days', 'four_days', 'five_days'];

const priceSchema = z.preprocess(
  (value) => (typeof value === 'number' && Number.isNaN(value) ? undefined : value),
  z.number({ required_error: 'Harga wajib diisi.', invalid_type_error: 'Harga wajib diisi.' }).min(0, 'Harga tidak boleh negatif.'),
);

const serviceSchema = z.object({
  code: z.string().trim().min(1, 'Kode layanan wajib diisi.').transform((value) => value.toUpperCase()),
  name: z.string().trim().min(1, 'Nama layanan wajib diisi.'),
  unit_type: z.enum(['kg', 'item']),
  is_active: z.boolean(),
  prices: z.object({
    one_day: priceSchema,
    two_days: priceSchema,
    three_days: priceSchema,
    four_days: priceSchema,
    five_days: priceSchema,
  }),
});

function emptyServiceValues(): ServiceFormValues {
  return {
    code: '',
    name: '',
    unit_type: 'item',
    is_active: true,
    prices: durations.reduce(
      (acc, duration) => ({
        ...acc,
        [duration]: 0,
      }),
      {} as Record<DurationType, number>,
    ),
  };
}

function getServiceFormError(error: unknown) {
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes('duplicate') || error.message.toLowerCase().includes('unique')) {
      return 'Kode layanan sudah digunakan.';
    }
    return error.message;
  }

  return 'Data layanan gagal disimpan.';
}

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

function ServiceCreator({ businessId, onClose }: { businessId: string; onClose: () => void }) {
  const createService = useCreateService(businessId);
  const { showToast } = useToast();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: emptyServiceValues(),
  });
  const codeField = register('code');

  const onSubmit = handleSubmit(async (values) => {
    setFormError('');
    try {
      await createService.mutateAsync(values);
      showToast('Layanan berhasil ditambahkan.');
      reset(emptyServiceValues());
      onClose();
    } catch (error) {
      const message = getServiceFormError(error);
      setFormError(message);
      showToast(message, 'error');
    }
  });

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
      {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{formError}</div> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Kode layanan"
          placeholder="Contoh: HELM"
          error={errors.code?.message}
          {...codeField}
          onChange={(event) => {
            event.target.value = event.target.value.toUpperCase();
            void codeField.onChange(event);
          }}
        />
        <Input label="Nama layanan" placeholder="Contoh: Cuci Helm" error={errors.name?.message} {...register('name')} />
        <Select label="Tipe unit" error={errors.unit_type?.message} {...register('unit_type')}>
          <option value="kg">kg</option>
          <option value="item">item</option>
        </Select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-ink">Harga per durasi</h3>
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
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onClose} disabled={createService.isPending}>
          Batal
        </Button>
        <Button type="submit" loading={createService.isPending}>
          Tambah Layanan
        </Button>
      </div>
    </form>
  );
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
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: serviceToValues(service),
  });
  const codeField = register('code');

  useEffect(() => {
    reset(serviceToValues(service));
    setFormError('');
  }, [reset, service]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError('');
    try {
      await updateService.mutateAsync({ service, values });
      showToast('Harga layanan berhasil diperbarui.');
      onClose();
    } catch (error) {
      const message = getServiceFormError(error);
      setFormError(message);
      showToast(message, 'error');
    }
  });

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
      {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{formError}</div> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Kode layanan"
          error={errors.code?.message}
          {...codeField}
          onChange={(event) => {
            event.target.value = event.target.value.toUpperCase();
            void codeField.onChange(event);
          }}
        />
        <Input label="Nama layanan" error={errors.name?.message} {...register('name')} />
        <Select label="Tipe unit" error={errors.unit_type?.message} {...register('unit_type')}>
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

function ServiceCard({ service, onEdit }: { service: ServiceWithPrices; onEdit: () => void }) {
  return (
    <Card animated>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Tags className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-primary">{service.code}</p>
            <h2 className="text-base font-bold text-ink">{serviceDisplayName(service.code, service.name)}</h2>
            <p className="text-sm text-muted">
              Unit {service.unit_type} - {service.is_active ? 'Aktif' : 'Nonaktif'}
            </p>
          </div>
        </div>
        <Button type="button" variant="secondary" size="icon" onClick={onEdit} aria-label="Edit layanan">
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
  );
}

export function ServicesPage() {
  const { businessId } = useBusinessAccess();
  const services = useServices(businessId);
  const [selected, setSelected] = useState<ServiceWithPrices | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const allServices = services.data ?? [];
  const serviceGroups = [
    {
      title: 'Kiloan',
      description: 'Layanan berbasis berat kg.',
      items: allServices.filter((service) => service.unit_type === 'kg'),
    },
    {
      title: 'Satuan / Item',
      description: 'Layanan berbasis jumlah item.',
      items: allServices.filter((service) => service.unit_type === 'item'),
    },
  ];

  if (!businessId) return null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Pengaturan layanan</p>
          <h1 className="text-2xl font-bold text-ink lg:text-3xl">Layanan & Harga</h1>
        </div>
        <Button type="button" className="w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
          <Plus className="h-5 w-5" />
          Tambah Layanan
        </Button>
      </div>

      {services.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
      ) : services.isError ? (
        <EmptyState title="Data gagal dimuat. Coba refresh halaman." />
      ) : allServices.length ? (
        <div className="space-y-6">
          {serviceGroups.map((group) =>
            group.items.length ? (
              <section key={group.title} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-ink">{group.title}</h2>
                    <p className="text-sm text-muted">{group.description}</p>
                  </div>
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                    {group.items.length} layanan
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((service) => (
                    <ServiceCard key={service.id} service={service} onEdit={() => setSelected(service)} />
                  ))}
                </div>
              </section>
            ) : null,
          )}
        </div>
      ) : (
        <EmptyState
          title="Belum ada layanan"
          description="Tambahkan layanan pertama untuk mulai mengatur harga Tyaga Laundry."
          action={
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <Plus className="h-5 w-5" />
              Tambah Layanan
            </Button>
          }
        />
      )}

      <Modal open={createOpen} title="Tambah Layanan" onClose={() => setCreateOpen(false)} className="sm:max-w-2xl">
        <ServiceCreator businessId={businessId} onClose={() => setCreateOpen(false)} />
      </Modal>

      <Modal open={!!selected} title="Edit Layanan & Harga" onClose={() => setSelected(null)} className="sm:max-w-2xl">
        {selected ? <ServiceEditor service={selected} businessId={businessId} onClose={() => setSelected(null)} /> : null}
      </Modal>
    </div>
  );
}
