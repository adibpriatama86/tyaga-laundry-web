# Tyaga Laundry Web MVP

Tyaga Laundry adalah web app rekap bulanan transaksi laundry dari nota manual. Aplikasi ini tidak mengganti nota manual, tetapi membantu pemilik UMKM memasukkan data nota untuk melihat total transaksi, pendapatan, status pembayaran, metode pembayaran, layanan terpakai, serta export laporan bulanan ke PDF dan Excel.

## Tech Stack

- React + Vite + TypeScript
- Supabase Auth, PostgreSQL, dan Row Level Security
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form + Zod
- Recharts
- Framer Motion
- Lucide React
- jsPDF + jspdf-autotable
- xlsx

## Fitur MVP

- Login dan Sign Up demo/dev dengan email + password Supabase Auth.
- Access guard berbasis `business_members`; user tanpa membership diarahkan ke halaman no-access.
- Dashboard ringkasan bulan berjalan.
- Rekap transaksi dengan filter bulan/tahun, status pembayaran, metode pembayaran, status pesanan, layanan, search, sort, pagination, edit, hapus, dan bulk action.
- Tambah/edit transaksi dari nota manual dengan hitung harga otomatis, total manual, validasi pembayaran, dan snapshot data.
- Rekap bulanan dengan ringkasan, breakdown metode pembayaran, breakdown layanan, preview tabel, export PDF dan Excel.
- Statistik bulanan dengan grafik pendapatan harian dan jumlah transaksi per layanan.
- Layanan & Harga untuk edit nama, kode, unit, status aktif, dan harga per durasi.
- Pengaturan profil bisnis dan info akun.

## Fitur yang Sengaja Tidak Dibuat

- Upload foto nota.
- Printer thermal atau cetak nota customer.
- WhatsApp API.
- Inventory, payroll, customer app, multi-cabang.
- Dark mode.
- Backend terpisah.
- Service role key di frontend.

## Setup Supabase

1. Buat project baru di Supabase.
2. Buka SQL Editor.
3. Jalankan file `supabase/001_schema.sql`.
4. Jalankan file `supabase/002_rls_policies.sql`.
5. Jalankan file `supabase/003_seed_demo.sql`.
6. Buat user dummy melalui Supabase Auth dashboard atau halaman Sign Up aplikasi.
7. Ambil UUID user dari Supabase Auth.
8. Buka `supabase/004_add_owner_membership_template.sql`.
9. Ganti `<AUTH_USER_ID_HERE>` dengan UUID user.
10. Jalankan SQL tersebut.
11. Login ke aplikasi.

Catatan RLS: akses data bisnis, layanan, customer, harga, dan transaksi dibatasi oleh membership aktif di tabel `business_members`. Frontend tetap mengirim `business_id`, tetapi RLS adalah lapisan keamanan utama.

## Setup Env

Buat file `.env` dari `.env.example`.

```bash
VITE_SUPABASE_URL=https://PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=anon-key-dari-supabase
```

Jangan menyimpan service role key di frontend.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka URL yang muncul dari Vite, biasanya `http://localhost:5173`.

Build production:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Deploy ke Cloudflare Pages

1. Push project ke GitHub.
2. Connect repository ke Cloudflare Pages.
3. Build command: `npm run build`.
4. Build output directory: `dist`.
5. Tambahkan environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy.

File `public/_redirects` sudah disiapkan agar refresh route SPA tidak blank.

## Akun Dummy

Akun dummy dibuat melalui Supabase Auth atau halaman Sign Up. Aplikasi tidak menyimpan password manual dan tidak memiliki akun hardcode. Setelah user dibuat, tambahkan membership owner memakai file `supabase/004_add_owner_membership_template.sql`.

## Catatan Dependency Audit

`npm audit --omit=dev` saat implementasi melaporkan advisory dari dependency export: `xlsx` dan chain `jspdf`/`dompurify`. Library tersebut dipakai karena sesuai requirement export Excel dan PDF. Untuk demo kelas/UMKM, fitur bisa dipakai; sebelum production publik, evaluasi update mayor `jspdf` atau alternatif export Excel jika audit bersih menjadi syarat.

## Testing Checklist

- User belum login diarahkan ke login.
- User login tanpa membership diarahkan ke no-access.
- User login dengan membership bisa masuk dashboard.
- Dashboard menampilkan ringkasan bulan berjalan.
- Tambah transaksi berhasil.
- Edit transaksi berhasil.
- Hapus transaksi berhasil.
- Tandai Lunas berhasil.
- Tandai Belum Lunas berhasil.
- Filter bulan/tahun bekerja.
- Search nama pelanggan/nomor nota/jenis layanan bekerja.
- Export PDF berhasil.
- Export Excel berhasil.
- Edit harga layanan berhasil.
- Build production berhasil dengan `npm run build`.
