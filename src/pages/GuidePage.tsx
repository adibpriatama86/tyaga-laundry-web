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
    points: [
      'Masuk menggunakan email dan password yang sudah memiliki akses.',
      'Jika belum memiliki akses, hubungi admin.',
    ],
  },
  {
    title: 'Tambah transaksi',
    points: [
      'Buka menu Tambah Transaksi.',
      'Isi data transaksi sesuai nota manual.',
      'Simpan transaksi.',
    ],
  },
  {
    title: 'Melihat rekap transaksi',
    points: [
      'Buka menu Rekap Transaksi.',
      'Pilih bulan dan tahun.',
      'Gunakan pencarian jika diperlukan.',
    ],
  },
  {
    title: 'Filter data',
    points: [
      'Gunakan filter untuk melihat transaksi berdasarkan status pembayaran, metode pembayaran, layanan, atau status pesanan.',
    ],
  },
  {
    title: 'Export laporan',
    points: [
      'Buka menu Rekap Bulanan.',
      'Pilih bulan dan tahun.',
      'Export laporan ke PDF atau Excel.',
    ],
  },
  {
    title: 'Mengatur layanan dan harga',
    points: [
      'Buka menu Layanan & Harga.',
      'Ubah harga layanan jika diperlukan.',
      'Harga transaksi tetap bisa disesuaikan manual.',
    ],
  },
  {
    title: 'Logout',
    points: ['Gunakan tombol logout setelah selesai menggunakan dashboard.'],
  },
];

export function GuidePage() {
  return (
    <div className="space-y-6">
      <section className="border border-line bg-white p-5">
        <h1 className="text-xl font-semibold text-ink">Panduan Penggunaan</h1>
        <p className="mt-2 text-sm text-muted">
          Halaman ini berisi langkah singkat penggunaan dashboard Tyaga Laundry.
        </p>
      </section>

      <section className="border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">Langkah Penggunaan</h2>

        <div className="mt-4 space-y-5">
          {steps.map((step, index) => (
            <div key={step.title}>
              <h3 className="text-sm font-semibold text-ink">
                {index + 1}. {step.title}
              </h3>

              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
                {step.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* <section className="border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">Catatan</h2>

        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
          <li>Nota manual tetap dapat digunakan seperti biasa.</li>
          <li>Web ini digunakan untuk membantu rekap bulanan.</li>
          <li>Data demo dapat diganti dengan data transaksi asli jika sudah siap digunakan.</li>
        </ul>
      </section> */}
    </div>
  );
}