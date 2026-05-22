const serviceNameByCode: Record<string, string> = {
  CKS: 'Cuci Kering Setrika',
  CK: 'Cuci Kering',
  SETRIKA: 'Setrika',
  BEDCOVER: 'Bed Cover',
  SEPATU: 'Sepatu',
  KARPET: 'Tikar / Karpet',
  'SELIMUT-B': 'Selimut Besar',
  'SELIMUT-K': 'Selimut Kecil',
  'SELIMUT-S': 'Selimut Sedang',
  BONEKA: 'Boneka / Bantal',
};

export function serviceDisplayName(code?: string | null, fallback?: string | null) {
  const normalizedCode = code?.trim().toUpperCase();
  const fallbackName = fallback?.trim();

  if (fallbackName && fallbackName.toUpperCase() !== normalizedCode) {
    return fallbackName;
  }

  if (normalizedCode && serviceNameByCode[normalizedCode]) {
    return serviceNameByCode[normalizedCode];
  }

  return fallbackName || '-';
}
