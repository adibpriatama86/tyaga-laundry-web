import { Link } from 'react-router-dom';
import { CheckCircle2, ReceiptText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBusinessAccess } from '../hooks/useBusinessAccess';
import { useServices } from '../hooks/useServices';
import { TransactionForm } from '../components/transaction/TransactionForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';

export function AddTransactionPage() {
  const { businessId } = useBusinessAccess();
  const services = useServices(businessId);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [saved]);

  if (!businessId) return null;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-primary">Transaksi baru</p>
        <h1 className="text-2xl font-bold text-ink lg:text-3xl">Tambah Transaksi</h1>
      </div>

      {saved ? (
        <Card className="border-emerald-100 bg-emerald-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-800">Transaksi berhasil disimpan.</p>
                <p className="text-sm text-emerald-700">Lanjut input transaksi lain atau cek rekap.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setSaved(false)}>
                Tambah Lagi
              </Button>
              <Link to="/transactions">
                <Button type="button">
                  <ReceiptText className="h-5 w-5" />
                  Lihat Rekap
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : null}

      {services.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : services.isError ? (
        <EmptyState title="Data gagal dimuat. Coba refresh halaman." />
      ) : services.data?.filter((service) => service.is_active).length ? (
        <TransactionForm
          businessId={businessId}
          services={services.data}
          mode="create"
          onSuccess={() => setSaved(true)}
        />
      ) : (
        <EmptyState title="Belum ada layanan aktif" description="Aktifkan layanan di halaman Layanan & Harga sebelum menambah transaksi." />
      )}
    </div>
  );
}
