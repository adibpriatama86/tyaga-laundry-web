import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LogOut, Settings } from 'lucide-react';
import type { BusinessSettingsFormValues } from '../types/models';
import { useAuth } from '../hooks/useAuth';
import { useBusinessAccess, useUpdateBusiness } from '../hooks/useBusinessAccess';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

const businessSchema = z.object({
  name: z.string().min(1, 'Nama bisnis wajib diisi.'),
  owner_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export function SettingsPage() {
  const { business, member } = useBusinessAccess();
  const updateBusiness = useUpdateBusiness();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessSettingsFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: business?.name ?? '',
      owner_name: business?.owner_name ?? '',
      phone: business?.phone ?? '',
      address: business?.address ?? '',
    },
  });

  useEffect(() => {
    if (!business) return;
    reset({
      name: business.name,
      owner_name: business.owner_name ?? '',
      phone: business.phone ?? '',
      address: business.address ?? '',
    });
  }, [business, reset]);

  const submit = handleSubmit(async (values) => {
    await updateBusiness.mutateAsync(values);
    showToast('Pengaturan bisnis berhasil diperbarui.');
  });

  if (!business) return <EmptyState title="Data gagal dimuat. Coba refresh halaman." />;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-primary">Profil bisnis dan akun</p>
        <h1 className="text-2xl font-bold text-ink lg:text-3xl">Pengaturan</h1>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-ink">Profil Bisnis</h2>
              <p className="text-sm text-muted">Informasi ini tampil pada laporan rekap bulanan.</p>
            </div>
          </div>
          <form onSubmit={(event) => void submit(event)} className="space-y-3">
            <Input label="Nama bisnis" error={errors.name?.message} {...register('name')} />
            <Input label="Nama pemilik" error={errors.owner_name?.message} {...register('owner_name')} />
            <Input label="Nomor HP" error={errors.phone?.message} {...register('phone')} />
            <label className="block">
              <span className="field-label">Alamat</span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink transition hover:border-slate-300 focus:border-primary"
                {...register('address')}
              />
              {errors.address?.message ? <span className="field-error">{errors.address.message}</span> : null}
            </label>
            <Button type="submit" loading={updateBusiness.isPending}>
              Simpan Pengaturan
            </Button>
          </form>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="font-bold text-ink">Info Akun</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Email login</span>
                <span className="font-semibold text-ink">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Role</span>
                <span className="font-semibold text-ink">{member?.role || 'owner'}</span>
              </div>
            </div>
            <Button type="button" variant="secondary" className="mt-5 w-full" onClick={() => void signOut()}>
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </Card>

          <Card>
            <h2 className="font-bold text-ink">Info Aplikasi</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Nama</span>
                <span className="font-semibold text-ink">Tyaga Laundry</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Versi</span>
                <span className="font-semibold text-ink">1.0.0</span>
              </div>
              <p className="rounded-lg bg-primary-soft p-3 text-sm leading-6 text-primary">
                Web rekap bulanan transaksi laundry dari nota manual.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
