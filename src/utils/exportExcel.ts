import * as XLSX from 'xlsx';
import type { Business, MonthlyReport, ReportFilters } from '../types/models';
import { formatCurrency } from './formatCurrency';
import { formatDate, formatMonthYear } from './formatDate';
import { paymentStatusLabels, reportPaymentMethodLabels } from './calculateTransaction';
import { serviceDisplayName } from './serviceLabels';

function slugMonth(month: number, year: number) {
  return formatMonthYear(month, year).toLowerCase().replace(/\s+/g, '-');
}

export function exportMonthlyReportExcel(
  business: Business,
  report: MonthlyReport,
  filters: ReportFilters,
) {
  const period = formatMonthYear(filters.month, filters.year);
  const workbook = XLSX.utils.book_new();

  const summaryRows = [
    ['Nama Bisnis', business.name],
    ['Periode', period],
    ['Tanggal Export', formatDate(new Date())],
    ['Total Transaksi', report.totalTransactions],
    ['Total Pendapatan', formatCurrency(report.totalRevenue)],
    ['Total Lunas', formatCurrency(report.paidTotal)],
    ['Total Belum Lunas', formatCurrency(report.unpaidTotal)],
    ['Rata-rata Transaksi', formatCurrency(report.averageTransaction)],
  ];
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summaryRows), 'Ringkasan');

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      report.transactions.map((item) => ({
        'Nomor Nota': item.receipt_number || '',
        Tanggal: formatDate(item.date_in),
        Pelanggan: item.customer_name_snapshot,
        Layanan: serviceDisplayName(item.service_code_snapshot, item.service_name_snapshot),
        'Berat/Jumlah': `${item.quantity} ${item.unit_type_snapshot}`,
        'Harga Satuan': Number(item.price_per_unit),
        Total: Number(item.total_price),
        'Status Bayar': paymentStatusLabels[item.payment_status],
        'Metode Pembayaran': reportPaymentMethodLabels[item.payment_method],
        Catatan: item.notes || '',
      })),
    ),
    'Transaksi',
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      report.byPaymentMethod.map((item) => ({
        'Metode Pembayaran': item.label,
        'Jumlah Transaksi': item.count,
        Total: item.total,
      })),
    ),
    'Per Metode Pembayaran',
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      report.byService.map((item) => ({
        Layanan: item.label,
        'Jumlah Transaksi': item.count,
        Total: item.total,
      })),
    ),
    'Per Layanan',
  );

  XLSX.writeFile(workbook, `rekap-tyaga-laundry-${slugMonth(filters.month, filters.year)}.xlsx`);
}
