export function formatCurrency(value: number | null | undefined): string {
  const safeValue = Number(value ?? 0);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(safeValue)
    .replace(/\s/g, '');
}
