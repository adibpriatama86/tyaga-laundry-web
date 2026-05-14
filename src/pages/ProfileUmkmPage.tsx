import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  FileSpreadsheet,
  ReceiptText,
  SearchCheck,
  Sparkles,
  Store,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { Card } from '../components/ui/Card';

const infoItems = [
  ['Nama UMKM', 'Tyaga Laundry'],
  ['Pemilik', 'Ibu Yuli'],
  ['Jenis usaha', 'Laundry kiloan dan satuan'],
  ['Media pencatatan awal', 'Nota manual dan buku rekap'],
  ['Periode rekap', 'Bulanan'],
];

const beforeFlow = ['Nota manual', 'Buku rekap', 'Hitung manual', 'Laporan manual'];
const afterFlow = ['Nota manual', 'Input ke web', 'Rekap otomatis', 'Export PDF/Excel'];

const benefits = [
  {
    title: 'Rekap lebih rapi',
    description: 'Transaksi bulanan tersusun dalam tabel yang mudah dibaca.',
    icon: ClipboardList,
  },
  {
    title: 'Data lebih mudah dicari',
    description: 'Owner bisa mencari nomor nota, pelanggan, atau layanan.',
    icon: SearchCheck,
  },
  {
    title: 'Belum lunas lebih terlihat',
    description: 'Transaksi yang belum dibayar tidak tercampur dengan data lunas.',
    icon: WalletCards,
  },
  {
    title: 'Laporan lebih mudah dibuat',
    description: 'Rekap bulanan dapat diexport ke PDF atau Excel.',
    icon: FileSpreadsheet,
  },
];

function FlowCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <div className="mt-4 grid gap-2">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-ink">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs text-primary">
              {index + 1}
            </span>
            <span className="flex-1">{item}</span>
            {index < items.length - 1 ? <ArrowRight className="h-4 w-4 text-muted" /> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ProfileUmkmPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="space-y-5"
    >
      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm lg:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Profil UMKM</p>
          <h1 className="mt-2 text-2xl font-bold text-ink lg:text-3xl">Tyaga Laundry</h1>
          <p className="mt-3 text-sm leading-7 text-muted lg:text-base">
            Tyaga Laundry adalah UMKM jasa laundry yang masih menggunakan nota manual dan buku rekap bulanan
            dalam proses pencatatan transaksi.
          </p>
        </div>
      </section>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted">Informasi UMKM</p>
            <h2 className="text-lg font-bold text-ink">Data Singkat Tyaga Laundry</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {infoItems.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-1 font-bold text-ink">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card animated className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <ReceiptText className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-ink">Kondisi Awal</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <li>Transaksi dicatat melalui nota manual.</li>
            <li>Rekap dilakukan ke buku rekap.</li>
            <li>Rekap biasanya dilakukan satu bulan sekali.</li>
            <li>Jika transaksi menumpuk, proses rekap membutuhkan waktu lebih lama.</li>
          </ul>
        </Card>

        <Card animated className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-ink">Tujuan Sistem</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <li>Sistem membantu proses rekap bulanan dari nota manual.</li>
            <li>Sistem membantu melihat total transaksi, pendapatan, status pembayaran, dan metode pembayaran.</li>
            <li>Sistem membantu export laporan bulanan ke PDF/Excel.</li>
            <li>Sistem tidak menggantikan nota manual yang sudah berjalan.</li>
          </ul>
        </Card>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-ink">Alur Sebelum dan Sesudah</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <FlowCard title="Sebelum" items={beforeFlow} />
          <FlowCard title="Sesudah dibantu sistem" items={afterFlow} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <Card key={benefit.title} animated className="p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-ink">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{benefit.description}</p>
            </Card>
          );
        })}
      </section>

      <Card className="p-5">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <UsersRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-ink">Dasar Kebutuhan</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Sumber kebutuhan sistem berasal dari observasi proses transaksi dan komunikasi dengan pemilik UMKM.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
