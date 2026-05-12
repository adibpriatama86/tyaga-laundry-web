import { Download, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import type { ReportFilters } from '../types/models';
import { useBusinessAccess } from '../hooks/useBusinessAccess';
import { useMonthlyReport } from '../hooks/useMonthlyReport';
import { useServices } from '../hooks/useServices';
import { durationLabels, paymentMethodLabels, paymentStatusLabels } from '../utils/calculateTransaction';
import { exportMonthlyReportExcel } from '../utils/exportExcel';
import { exportMonthlyReportPdf } from '../utils/exportPdf';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, formatMonthYear, getCurrentMonthYear, monthNames } from '../utils/formatDate';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

function defaultReportFilters(): ReportFilters {
  const { month, year } = getCurrentMonthYear();
  return {
    month,
    year,
    paymentStatus: 'all',
    paymentMethod: 'all',
    serviceId: 'all',
  };
}

export function MonthlyReportPage() {
  const { business, businessId } = useBusinessAccess();
  const services = useServices(businessId);
  const [filters, setFilters] = useState<ReportFilters>(defaultReportFilters);
  const report = useMonthlyReport(businessId, filters);
  const { showToast } = useToast();
  const years = Array.from({ length: 7 }, (_, index) => new Date().getFullYear() - 4 + index);

  const exportPdf = () => {
    if (!business || !report.data) return;
    exportMonthlyReportPdf(business, report.data, filters);
    showToast('Export berhasil dibuat.');
  };

  const exportExcel = () => {
    if (!business || !report.data) return;
    exportMonthlyReportExcel(business, report.data, filters);
    showToast('Export berhasil dibuat.');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Laporan rekap bulanan</p>
          <h1 className="text-2xl font-bold text-ink lg:text-3xl">Rekap Bulanan</h1>
          <p className="mt-1 text-sm text-muted">Periode {formatMonthYear(filters.month, filters.year)}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" onClick={exportPdf} loading={report.isLoading}>
            <Download className="h-5 w-5" />
            Export PDF
          </Button>
          <Button type="button" variant="secondary" onClick={exportExcel} loading={report.isLoading}>
            <FileSpreadsheet className="h-5 w-5" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Select label="Bulan" value={filters.month} onChange={(event) => setFilters({ ...filters, month: Number(event.target.value) })}>
            {monthNames.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </Select>
          <Select label="Tahun" value={filters.year} onChange={(event) => setFilters({ ...filters, year: Number(event.target.value) })}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          <Select
            label="Status pembayaran"
            value={filters.paymentStatus}
            onChange={(event) => setFilters({ ...filters, paymentStatus: event.target.value as ReportFilters['paymentStatus'] })}
          >
            <option value="all">Semua</option>
            <option value="paid">{paymentStatusLabels.paid}</option>
            <option value="unpaid">{paymentStatusLabels.unpaid}</option>
          </Select>
          <Select
            label="Metode pembayaran"
            value={filters.paymentMethod}
            onChange={(event) => setFilters({ ...filters, paymentMethod: event.target.value as ReportFilters['paymentMethod'] })}
          >
            <option value="all">Semua</option>
            <option value="cash">{paymentMethodLabels.cash}</option>
            <option value="qris">{paymentMethodLabels.qris}</option>
            <option value="bank_transfer">{paymentMethodLabels.bank_transfer}</option>
            <option value="not_selected">{paymentMethodLabels.not_selected}</option>
          </Select>
          <Select label="Jenis layanan" value={filters.serviceId} onChange={(event) => setFilters({ ...filters, serviceId: event.target.value })}>
            <option value="all">Semua</option>
            {(services.data ?? []).map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {report.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-64" />
        </div>
      ) : report.isError ? (
        <EmptyState title="Data gagal dimuat. Coba refresh halaman." />
      ) : report.data?.totalTransactions ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              ['Total transaksi', report.data.totalTransactions.toString()],
              ['Total pendapatan', formatCurrency(report.data.totalRevenue)],
              ['Total lunas', formatCurrency(report.data.paidTotal)],
              ['Total belum lunas', formatCurrency(report.data.unpaidTotal)],
              ['Rata-rata transaksi', formatCurrency(report.data.averageTransaction)],
            ].map(([label, value]) => (
              <Card key={label} animated>
                <p className="text-sm font-semibold text-muted">{label}</p>
                <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="mb-3 text-base font-bold text-ink">Total per metode pembayaran</h2>
              <div className="space-y-2">
                {report.data.byPaymentMethod.map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                    <span className="font-semibold text-ink">{item.label}</span>
                    <span className="text-muted">
                      {item.count} transaksi · {formatCurrency(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h2 className="mb-3 text-base font-bold text-ink">Total per jenis layanan</h2>
              <div className="space-y-2">
                {report.data.byService.map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                    <span className="font-semibold text-ink">{item.label}</span>
                    <span className="text-muted">
                      {item.count} transaksi · {formatCurrency(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h2 className="mb-3 text-base font-bold text-ink">Preview tabel transaksi</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-muted">
                  <tr>
                    <th className="px-3 py-3">Nomor nota</th>
                    <th className="px-3 py-3">Tanggal</th>
                    <th className="px-3 py-3">Nama pelanggan</th>
                    <th className="px-3 py-3">Layanan</th>
                    <th className="px-3 py-3">Durasi</th>
                    <th className="px-3 py-3">Berat/Jumlah</th>
                    <th className="px-3 py-3">Total</th>
                    <th className="px-3 py-3">Status bayar</th>
                    <th className="px-3 py-3">Metode</th>
                    <th className="px-3 py-3">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {report.data.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-3 py-3 font-semibold text-ink">{transaction.receipt_number || '-'}</td>
                      <td className="px-3 py-3 text-muted">{formatDate(transaction.date_in)}</td>
                      <td className="px-3 py-3 text-muted">{transaction.customer_name_snapshot}</td>
                      <td className="px-3 py-3 text-muted">{transaction.service_name_snapshot}</td>
                      <td className="px-3 py-3 text-muted">{durationLabels[transaction.duration_type]}</td>
                      <td className="px-3 py-3 text-muted">
                        {transaction.quantity} {transaction.unit_type_snapshot}
                      </td>
                      <td className="px-3 py-3 font-bold text-ink">{formatCurrency(transaction.total_price)}</td>
                      <td className="px-3 py-3 text-muted">{paymentStatusLabels[transaction.payment_status]}</td>
                      <td className="px-3 py-3 text-muted">{paymentMethodLabels[transaction.payment_method]}</td>
                      <td className="px-3 py-3 text-muted">{transaction.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <EmptyState
          title="Belum ada data rekap pada periode ini"
          description="Pilih periode lain atau tambahkan transaksi dari nota manual terlebih dahulu."
        />
      )}
    </div>
  );
}
