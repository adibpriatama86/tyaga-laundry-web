import { Link } from 'react-router-dom';
import {
  BarChart3,
  ClipboardCheck,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const values = [
  {
    title: 'Mudah Dipakai',
    description: 'Pemilik laundry bisa mencatat transaksi dan melihat rekap tanpa perlu rumus manual.',
    icon: ClipboardCheck,
  },
  {
    title: 'Membantu UMKM',
    description: 'Aplikasi ini dibuat untuk membantu usaha kecil mengelola data bulanan dengan lebih rapi.',
    icon: HeartHandshake,
  },
  {
    title: 'Data Lebih Jelas',
    description: 'Rekap pendapatan, transaksi, dan status pembayaran dapat dilihat dalam satu tempat.',
    icon: BarChart3,
  },
];

const goals = [
  'Mengurangi pencatatan manual yang rawan hilang atau salah hitung.',
  'Membantu pemilik laundry melihat pemasukan bulanan dengan cepat.',
  'Menyediakan tampilan sederhana agar mudah digunakan oleh pengguna non-teknis.',
];

export function AboutPage() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm lg:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">Tentang Kami</p>
          <h1 className="mt-2 text-2xl font-bold text-ink lg:text-3xl">
            Aplikasi Rekap Bulanan untuk Laundry UMKM
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted lg:text-base">
            Website ini dibuat untuk membantu pemilik usaha laundry mencatat transaksi harian,
            memantau pembayaran pelanggan, dan membuat rekap bulanan dengan lebih mudah.
            Tujuannya sederhana: membuat proses administrasi laundry jadi lebih rapi,
            cepat, dan tidak terlalu bergantung pada catatan manual.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/dashboard">
              <Button className="w-full sm:w-auto">
                <Sparkles className="h-5 w-5" />
                Lihat Dashboard
              </Button>
            </Link>

            <Link to="/transactions">
              <Button variant="secondary" className="w-full sm:w-auto">
                Lihat Transaksi
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {values.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} animated>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card animated>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted">Fokus Pengembangan</p>
              <h2 className="text-lg font-bold text-ink">Kenapa aplikasi ini dibuat?</h2>
            </div>
          </div>

          <ul className="mt-4 space-y-3">
            {goals.map((goal) => (
              <li key={goal} className="flex gap-3 text-sm leading-6 text-muted">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card animated>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted">Komitmen Sistem</p>
              <h2 className="text-lg font-bold text-ink">Sederhana, jelas, dan berguna</h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-muted">
            Aplikasi ini tidak dibuat untuk menggantikan seluruh proses bisnis laundry,
            tetapi sebagai alat bantu agar pemilik usaha bisa mencatat dan membaca data
            transaksi dengan lebih nyaman. Tampilan dibuat ringan supaya pengguna dapat
            langsung memahami fungsi utama tanpa perlu belajar terlalu lama.
          </p>

          <div className="mt-5 rounded-lg border border-line bg-slate-50 p-4">
            <p className="text-sm font-semibold text-ink">Catatan Pengembang</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Halaman ini dibuat sebagai bagian dari pengembangan mandiri untuk melengkapi
              fitur utama pada website rekap bulanan laundry.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}