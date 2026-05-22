import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ReportFilters } from '../types/models';
import { useBusinessAccess } from '../hooks/useBusinessAccess';
import { useMonthlyReport } from '../hooks/useMonthlyReport';
import { formatCurrency } from '../utils/formatCurrency';
import { formatMonthYear, getCurrentMonthYear, monthNames } from '../utils/formatDate';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';

function filterFor(month: number, year: number): ReportFilters {
  return { month, year, paymentStatus: 'all', paymentMethod: 'all', serviceId: 'all' };
}

function previousMonth(month: number, year: number) {
  return month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year };
}

function percentage(current: number, previous: number) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

export function StatisticsPage() {
  const { businessId } = useBusinessAccess();
  const current = getCurrentMonthYear();
  const [month, setMonth] = useState(current.month);
  const [year, setYear] = useState(current.year);
  const previous = previousMonth(month, year);
  const report = useMonthlyReport(businessId, filterFor(month, year));
  const previousReport = useMonthlyReport(businessId, filterFor(previous.month, previous.year));
  const years = Array.from({ length: 7 }, (_, index) => new Date().getFullYear() - 4 + index);

  const dailyRevenue = useMemo(() => {
    const days = new Date(year, month, 0).getDate();
    const rows = Array.from({ length: days }, (_, index) => ({
      day: `${index + 1}`,
      pendapatan: 0,
      transaksi: 0,
    }));
    report.data?.transactions.forEach((transaction) => {
      const day = Number(transaction.date_in.slice(8, 10));
      const row = rows[day - 1];
      if (row) {
        row.pendapatan += Number(transaction.total_price);
        row.transaksi += 1;
      }
    });
    return rows;
  }, [month, report.data?.transactions, year]);

  const serviceCounts = useMemo(
    () => {
      const sorted = [...(report.data?.byService ?? [])].sort((a, b) => b.count - a.count);
      const topServices = sorted.slice(0, 5).map((item) => ({
        layanan: item.label,
        jumlah: item.count,
      }));
      const otherCount = sorted.slice(5).reduce((sum, item) => sum + item.count, 0);

      return otherCount > 0 ? [...topServices, { layanan: 'Lainnya', jumlah: otherCount }] : topServices;
    },
    [report.data?.byService],
  );

  const transactionChange = percentage(
    report.data?.totalTransactions ?? 0,
    previousReport.data?.totalTransactions ?? 0,
  );
  const revenueChange = percentage(report.data?.totalRevenue ?? 0, previousReport.data?.totalRevenue ?? 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Statistik bulanan</p>
          <h1 className="text-2xl font-bold text-ink lg:text-3xl">Statistik</h1>
          <p className="mt-1 text-sm text-muted">{formatMonthYear(month, year)}</p>
        </div>
        <Card className="w-full lg:w-auto">
          <div className="grid gap-3 sm:grid-cols-2">
            <Select label="Bulan" value={month} onChange={(event) => setMonth(Number(event.target.value))}>
              {monthNames.map((item, index) => (
                <option key={item} value={index + 1}>
                  {item}
                </option>
              ))}
            </Select>
            <Select label="Tahun" value={year} onChange={(event) => setYear(Number(event.target.value))}>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </Card>
      </div>

      {report.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-80" />
        </div>
      ) : report.isError ? (
        <EmptyState title="Data gagal dimuat. Coba refresh halaman." />
      ) : report.data?.totalTransactions ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Total transaksi', report.data.totalTransactions.toString()],
              ['Total pendapatan', formatCurrency(report.data.totalRevenue)],
              ['Total lunas', formatCurrency(report.data.paidTotal)],
              ['Total belum lunas', formatCurrency(report.data.unpaidTotal)],
            ].map(([label, value]) => (
              <Card key={label} animated>
                <p className="text-sm font-semibold text-muted">{label}</p>
                <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
              </Card>
            ))}
          </div>

          <Card>
            <h2 className="text-base font-bold text-ink">Perbandingan dengan bulan sebelumnya</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-muted">Perubahan total transaksi</p>
                <p className="mt-2 text-xl font-bold text-ink">
                  {transactionChange === null ? 'Data pembanding belum cukup' : `${transactionChange >= 0 ? '+' : ''}${transactionChange.toFixed(1)}%`}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-muted">Perubahan total pendapatan</p>
                <p className="mt-2 text-xl font-bold text-ink">
                  {revenueChange === null ? 'Data pembanding belum cukup' : `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-base font-bold text-ink">Pendapatan per hari</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyRevenue} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(label) => `Tanggal ${label}`} />
                    <Line type="monotone" dataKey="pendapatan" stroke="#2563EB" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-base font-bold text-ink">Jumlah transaksi per layanan</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={serviceCounts}
                    layout="vertical"
                    margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="layanan"
                      width={116}
                      tick={{ fontSize: 11 }}
                      interval={0}
                    />
                    <Tooltip />
                    <Bar dataKey="jumlah" fill="#38BDF8" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <EmptyState title="Belum ada data statistik" description="Tambahkan transaksi pada periode ini untuk melihat grafik." />
      )}
    </div>
  );
}