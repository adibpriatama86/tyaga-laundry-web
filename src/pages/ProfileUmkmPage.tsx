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

export function ProfileUmkmPage() {
  return (
    <div className="space-y-6">
      <section className="border border-line bg-white p-5">
        <h1 className="text-xl font-semibold text-ink">Profil UMKM</h1>
        <p className="mt-2 text-sm text-muted">
          Informasi singkat mengenai Tyaga Laundry.
        </p>
      </section>

      <section className="border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">Data Singkat Tyaga Laundry</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {infoItems.map(([label, value]) => (
                <tr key={label} className="border-b border-line last:border-b-0">
                  <td className="w-48 py-3 pr-4 text-muted">{label}</td>
                  <td className="py-3 font-medium text-ink">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* <section className="border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">Kondisi Awal</h2>

        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
          <li>Transaksi dicatat menggunakan nota manual.</li>
          <li>Rekap transaksi dilakukan melalui buku rekap.</li>
          <li>Rekap biasanya dilakukan setiap bulan.</li>
        </ul>
      </section>

      <section className="border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">Tujuan Sistem</h2>

        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
          <li>Membantu proses rekap transaksi bulanan.</li>
          <li>Membantu melihat data pembayaran dan transaksi.</li>
          <li>Membantu membuat laporan dalam bentuk PDF atau Excel.</li>
          <li>Sistem ini tidak menggantikan nota manual yang sudah digunakan.</li>
        </ul>
      </section> */}
    </div>
  );
}