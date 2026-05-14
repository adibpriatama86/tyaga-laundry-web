import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Business, MonthlyReport, ReportFilters } from '../types/models';
import { formatCurrency } from './formatCurrency';
import { formatDate, formatMonthYear } from './formatDate';
import { paymentStatusLabels, reportPaymentMethodLabels } from './calculateTransaction';
import { serviceDisplayName } from './serviceLabels';

function slugMonth(month: number, year: number) {
  return formatMonthYear(month, year).toLowerCase().replace(/\s+/g, '-');
}

export function exportMonthlyReportPdf(
  business: Business,
  report: MonthlyReport,
  filters: ReportFilters,
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const period = formatMonthYear(filters.month, filters.year);

  doc.setFontSize(16);
  doc.text('Laporan Rekap Transaksi Tyaga Laundry', 14, 16);
  doc.setFontSize(10);
  doc.text(`Nama bisnis: ${business.name}`, 14, 24);
  doc.text(`Periode: ${period}`, 14, 30);
  doc.text(`Tanggal export: ${formatDate(new Date())}`, 14, 36);

  autoTable(doc, {
    startY: 43,
    head: [['Ringkasan', 'Nilai']],
    body: [
      ['Total transaksi', String(report.totalTransactions)],
      ['Total pendapatan', formatCurrency(report.totalRevenue)],
      ['Total lunas', formatCurrency(report.paidTotal)],
      ['Total belum lunas', formatCurrency(report.unpaidTotal)],
      ['Rata-rata transaksi', formatCurrency(report.averageTransaction)],
    ],
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 14, right: 14 },
  });

  const afterSummaryY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 70;

  autoTable(doc, {
    startY: afterSummaryY + 6,
    head: [['Metode pembayaran', 'Jumlah transaksi', 'Total']],
    body: report.byPaymentMethod.map((item) => [item.label, item.count, formatCurrency(item.total)]),
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [56, 189, 248] },
    margin: { left: 14, right: 150 },
  });

  autoTable(doc, {
    startY: afterSummaryY + 6,
    head: [['Layanan', 'Jumlah transaksi', 'Total']],
    body: report.byService.map((item) => [item.label, item.count, formatCurrency(item.total)]),
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 150, right: 14 },
  });

  const afterBreakdownY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 100;

  autoTable(doc, {
    startY: afterBreakdownY + 8,
    head: [['No. Nota', 'Tanggal', 'Pelanggan', 'Layanan', 'Qty', 'Total', 'Status', 'Metode', 'Catatan']],
    body: report.transactions.map((item) => [
      item.receipt_number || '-',
      formatDate(item.date_in),
      item.customer_name_snapshot,
      serviceDisplayName(item.service_code_snapshot, item.service_name_snapshot),
      `${item.quantity} ${item.unit_type_snapshot}`,
      formatCurrency(item.total_price),
      paymentStatusLabels[item.payment_status],
      reportPaymentMethodLabels[item.payment_method],
      item.notes || '-',
    ]),
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [15, 23, 42] },
    margin: { left: 14, right: 14 },
  });

  doc.save(`rekap-tyaga-laundry-${slugMonth(filters.month, filters.year)}.pdf`);
}
