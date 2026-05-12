import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Download, PlusCircle, ReceiptText, WalletCards } from 'lucide-react';
import { useBusinessAccess } from '../hooks/useBusinessAccess';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useMonthlyReport } from '../hooks/useMonthlyReport';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { formatCurrency } from '../utils/formatCurrency';
import { formatMonthYear, getCurrentMonthYear } from '../utils/formatDate';
import { paymentMethodLabels } from '../utils/calculateTransaction';
import { exportMonthlyReportPdf } from '../utils/exportPdf';

export function DashboardPage() {
  const { business, businessId } = useBusinessAccess();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { month, year } = getCurrentMonthYear();
  const stats = useDashboardStats(businessId, month, year);
  const report = useMonthlyReport(businessId, {
    month,
    year,
    paymentStatus: 'all',
    paymentMethod: 'all',
    serviceId: 'all',
  });

  const summary = stats.data;

  const exportCurrentMonth = () => {
    if (!business || !report.data) return;
    exportMonthlyReportPdf(business, report.data, {
      month,
      year,
      paymentStatus: 'all',
      paymentMethod: 'all',
      serviceId: 'all',
    });
    showToast('Export berhasil dibuat.');
  };

  if (stats.isError) {
    return <EmptyState title="Data gagal dimuat. Coba refresh halaman." />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Halo, {business?.name || 'Tyaga Laundry'}</p>
          <h1 className="text-2xl font-bold text-ink lg:text-3xl">Ringkasan bulan {formatMonthYear(month, year)}</h1>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Link to="/transactions/new">
            <Button className="w-full">
              <PlusCircle className="h-5 w-5" />
              Tambah Transaksi
            </Button>
          </Link>
          <Button type="button" variant="secondary" loading={report.isLoading} onClick={exportCurrentMonth}>
            <Download className="h-5 w-5" />
            Export Rekap Bulan Ini
          </Button>
        </div>
      </div>

      {stats.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : summary?.totalTransactions ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card animated>
              <p className="text-sm font-semibold text-muted">Total Transaksi Bulan Ini</p>
              <p className="mt-3 text-3xl font-bold text-ink">
                <AnimatedNumber value={summary.totalTransactions} />
              </p>
            </Card>
            <Card animated>
              <p className="text-sm font-semibold text-muted">Total Pendapatan Bulan Ini</p>
              <p className="mt-3 text-3xl font-bold text-ink">
                <AnimatedNumber value={summary.totalRevenue} formatter={formatCurrency} />
              </p>
            </Card>
            <button
              type="button"
              onClick={() => navigate('/transactions?payment=unpaid')}
              className="rounded-lg border border-line bg-white p-4 text-left shadow-sm transition hover:border-amber-200 hover:bg-amber-50"
            >
              <p className="text-sm font-semibold text-muted">Belum Lunas</p>
              <p className="mt-3 text-3xl font-bold text-amber-600">
                <AnimatedNumber value={summary.unpaidCount} />
              </p>
              <p className="mt-1 text-xs font-semibold text-amber-700">{formatCurrency(summary.unpaidTotal)}</p>
            </button>
            <Card animated>
              <p className="text-sm font-semibold text-muted">Rata-rata Nilai Transaksi</p>
              <p className="mt-3 text-3xl font-bold text-ink">
                <AnimatedNumber value={summary.averageTransaction} formatter={formatCurrency} />
              </p>
            </Card>
          </div>

          {summary.unpaidCount > 0 ? (
            <button
              type="button"
              onClick={() => navigate('/transactions?payment=unpaid')}
              className="flex w-full items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-left text-amber-800 transition hover:bg-amber-100"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">Ada {summary.unpaidCount} transaksi belum lunas pada bulan ini.</span>
            </button>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card animated>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <WalletCards className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted">Metode pembayaran terbanyak</p>
                  <p className="text-lg font-bold text-ink">
                    {summary.topPaymentMethod ? paymentMethodLabels[summary.topPaymentMethod] : '-'}
                  </p>
                </div>
              </div>
            </Card>
            <Card animated>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <ReceiptText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted">Layanan paling sering digunakan</p>
                  <p className="text-lg font-bold text-ink">{summary.topService || '-'}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Link to="/transactions/new">
              <Button className="w-full" size="lg">
                <PlusCircle className="h-5 w-5" />
                Tambah Transaksi
              </Button>
            </Link>
            <Button type="button" variant="secondary" size="lg" loading={report.isLoading} onClick={exportCurrentMonth}>
              <Download className="h-5 w-5" />
              Export Rekap Bulan Ini
            </Button>
            <Button type="button" variant="soft" size="lg" onClick={() => navigate('/transactions?payment=unpaid')}>
              Lihat Belum Lunas
            </Button>
          </div>
        </>
      ) : (
        <EmptyState
          title="Belum ada transaksi bulan ini"
          description="Masukkan data dari nota manual saat pemilik ingin mulai rekap bulanan."
          action={
            <Link to="/transactions/new">
              <Button>
                <PlusCircle className="h-5 w-5" />
                Tambah Transaksi
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
