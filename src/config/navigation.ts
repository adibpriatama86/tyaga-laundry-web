import {
  BarChart3,
  Home,
  LayoutGrid,
  PlusCircle,
  ReceiptText,
  Settings,
  Tags,
} from 'lucide-react';

export const desktopNavigation = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Rekap Transaksi', path: '/transactions', icon: ReceiptText },
  { label: 'Tambah Transaksi', path: '/transactions/new', icon: PlusCircle },
  { label: 'Rekap Bulanan', path: '/monthly-report', icon: LayoutGrid },
  { label: 'Statistik', path: '/statistics', icon: BarChart3 },
  { label: 'Layanan & Harga', path: '/services', icon: Tags },
  { label: 'Pengaturan', path: '/settings', icon: Settings },
];

export const mobileNavigation = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Rekap', path: '/transactions', icon: ReceiptText },
  { label: 'Tambah', path: '/transactions/new', icon: PlusCircle },
  { label: 'Statistik', path: '/statistics', icon: BarChart3 },
];

export const moreNavigation = [
  { label: 'Rekap Bulanan', path: '/monthly-report', icon: LayoutGrid },
  { label: 'Layanan & Harga', path: '/services', icon: Tags },
  { label: 'Pengaturan', path: '/settings', icon: Settings },
];
