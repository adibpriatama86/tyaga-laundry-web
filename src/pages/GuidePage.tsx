import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ClipboardList,
  FileSpreadsheet,
  KeyRound,
  LogOut,
  ReceiptText,
  Search,
  SlidersHorizontal,
  Tags,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Card } from '../components/ui/Card';

const steps = [
  {
    title: 'Masuk ke dashboard',
    icon: KeyRound,
    points: ['Masuk menggunakan email dan password yang sudah memiliki akses.', 'Jika belum memiliki akses, hubungi admin.'],
  },
  {
    title: 'Tambah transaksi dari nota manual',
    icon: ReceiptText,
    points: [
      'Buka menu Tambah Transaksi.',
      'Isi nomor nota, tanggal, pelanggan, layanan, jumlah/berat, harga, dan status pembayaran.',
      'Simpan transaksi.',
    ],
  },
  {
    title: 'Melihat rekap transaksi',
    icon: Search,
    points: [
      'Buka menu Rekap Transaksi.',
      'Pilih bulan dan tahun.',
      'Gunakan pencarian untuk mencari nomor nota, nama pelanggan, atau layanan.',
    ],
  },
  {
    title: 'Menggunakan filter lanjutan',
    icon: SlidersHorizontal,
    points: [
      'Filter lanjutan digunakan jika ingin melihat transaksi berdasarkan status pembayaran, metode pembayaran, layanan, atau status pesanan.',
    ],
  },
  {
    title: 'Export laporan bulanan',
    icon: FileSpreadsheet,
    points: ['Buka menu Rekap Bulanan.', 'Pilih bulan dan tahun.', 'Export laporan ke PDF atau Excel.'],
  },
  {
    title: 'Mengatur layanan dan harga',
    icon: Tags,
    points: [
      'Buka menu Layanan & Harga.',
      'Ubah harga default sesuai kebutuhan.',
      'Harga pada transaksi tetap bisa disesuaikan manual jika berbeda dari nota.',
    ],
  },
  {
    title: 'Logout',
    icon: LogOut,
    points: ['Gunakan tombol logout setelah selesai memakai dashboard.'],
  },
];

export function GuidePage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="space-y-5"
    >
      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm lg:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Panduan</p>
          <h1 className="mt-2 text-2xl font-bold text-ink lg:text-3xl">Panduan Penggunaan</h1>
          <p className="mt-3 text-sm leading-7 text-muted lg:text-base">
            Langkah singkat untuk menggunakan dashboard rekap Tyaga Laundry.
          </p>
        </div>
      </section>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const open = openIndex === index;

          return (
            <Card key={step.title} className="overflow-hidden p-0">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50"
                onClick={() => setOpenIndex(open ? -1 : index)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-muted">Langkah {index + 1}</p>
                  <h2 className="font-bold text-ink">{step.title}</h2>
                </div>
                <ChevronDown className={cn('h-5 w-5 text-muted transition', open && 'rotate-180')} />
              </button>
              {open ? (
                <div className="border-t border-line px-4 py-4">
                  <ul className="space-y-2 text-sm leading-6 text-muted">
                    {step.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <ClipboardList className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-ink">Catatan Penggunaan</h2>
        </div>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
          <li>Nota manual tetap dapat digunakan seperti biasa.</li>
          <li>Web ini digunakan untuk membantu rekap bulanan.</li>
          <li>Data demo dapat diganti dengan data transaksi asli setelah owner siap mencoba.</li>
        </ul>
      </Card>
    </motion.div>
  );
}
