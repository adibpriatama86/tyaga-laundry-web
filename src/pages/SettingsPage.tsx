import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { BusinessSettingsFormValues } from '../types/models';
import { useAuth } from '../hooks/useAuth';
import { useBusinessAccess, useUpdateBusiness } from '../hooks/useBusinessAccess';
import { Button } from '../components/ui/Button';
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

  if (!business) {
    return <EmptyState title="Data gagal dimuat. Coba refresh halaman." />;
  }

  return (
    <div className="space-y-5">
      <section className="border border-line bg-white p-4 sm:p-5">
        <h1 className="text-xl font-semibold text-ink">Pengaturan</h1>
        <p className="mt-1 text-sm text-muted">
          Halaman ini digunakan untuk mengubah data bisnis dan melihat informasi akun.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="border border-line bg-white p-4 sm:p-5">
          <h2 className="text-base font-semibold text-ink">Profil Bisnis</h2>
          <p className="mt-1 text-sm text-muted">
            Informasi ini digunakan pada laporan rekap bulanan.
          </p>

          <form onSubmit={(event) => void submit(event)} className="mt-4 space-y-3">
            <Input label="Nama bisnis" error={errors.name?.message} {...register('name')} />
            <Input label="Nama pemilik" error={errors.owner_name?.message} {...register('owner_name')} />
            <Input label="Nomor HP" error={errors.phone?.message} {...register('phone')} />

            <label className="block">
              <span className="field-label">Alamat</span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink transition focus:border-primary"
                {...register('address')}
              />
              {errors.address?.message ? <span className="field-error">{errors.address.message}</span> : null}
            </label>

            <Button type="submit" loading={updateBusiness.isPending} className="w-full sm:w-auto">
              Simpan Pengaturan
            </Button>
          </form>
        </section>

        <div className="space-y-5">
          <section className="border border-line bg-white p-4 sm:p-5">
            <h2 className="text-base font-semibold text-ink">Info Akun</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-muted">Email login</p>
                <p className="mt-1 break-all font-medium text-ink">{user?.email}</p>
              </div>

              <div>
                <p className="text-muted">Role</p>
                <p className="mt-1 font-medium text-ink">{member?.role || 'owner'}</p>
              </div>
            </div>

            <Button type="button" variant="secondary" className="mt-5 w-full" onClick={() => void signOut()}>
              Logout
            </Button>
          </section>

          <section className="border border-line bg-white p-4 sm:p-5">
            <h2 className="text-base font-semibold text-ink">Info Aplikasi</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-muted">Nama aplikasi</p>
                <p className="mt-1 font-medium text-ink">Tyaga Laundry</p>
              </div>

              <div>
                <p className="text-muted">Versi</p>
                <p className="mt-1 font-medium text-ink">1.0.0</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}