import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { MobileMoreMenu } from './MobileMoreMenu';
import { useBusinessAccess } from '../../hooks/useBusinessAccess';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Rekap Transaksi',
  '/transactions/new': 'Tambah Transaksi',
  '/monthly-report': 'Rekap Bulanan',
  '/statistics': 'Statistik',
  '/services': 'Layanan & Harga',
  '/settings': 'Pengaturan',
};

export function AppLayout() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const { business } = useBusinessAccess();
  const title = pageTitles[location.pathname] ?? 'Tyaga Laundry';

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{business?.name || 'Tyaga Laundry'}</p>
          <h1 className="text-lg font-bold text-ink">{title}</h1>
        </header>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="container-page"
        >
          <Outlet />
        </motion.main>
      </div>
      <BottomNav onMore={() => setMoreOpen(true)} />
      <MobileMoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />
    </div>
  );
}
