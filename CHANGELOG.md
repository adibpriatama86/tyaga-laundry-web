# Changelog Pengembangan Manual

## Revisi Setelah Evaluasi Dosen

- Menambahkan halaman Profil UMKM untuk menjelaskan konteks Tyaga Laundry, proses manual, dan tujuan sistem.
- Menambahkan halaman Panduan Penggunaan untuk membantu owner memahami alur pemakaian dashboard.
- Merapikan Dashboard dengan menghapus tombol duplikat dan mengurangi akses berulang ke filter belum lunas.
- Menjadikan card Belum Lunas sebagai akses utama ke transaksi yang belum lunas.
- Menyesuaikan insight metode pembayaran agar hanya menghitung transaksi yang sudah lunas.
- Menyederhanakan tampilan filter Rekap Transaksi di mobile dengan pola Filter Lanjutan.
- Menghapus teks edukatif dari halaman operasional agar UI terasa lebih final.
- Menambahkan auto scroll ke atas setelah transaksi berhasil ditambah atau diedit.
- Menurunkan prioritas status pesanan karena aplikasi berfokus pada rekap bulanan, bukan operasional harian penuh.

## Tujuan Revisi

Revisi ini dilakukan agar aplikasi lebih sesuai dengan kebutuhan UMKM, lebih mudah digunakan di perangkat mobile, dan lebih jelas menunjukkan kontribusi pengembangan manual setelah evaluasi.

## Revisi UI dan Navigasi

- Memperbaiki active state menu agar Tambah Transaksi tidak ikut memilih Rekap Transaksi.
- Menambahkan auto scroll ke atas setiap berpindah halaman.
- Merapikan label pencarian, tombol export, dan tampilan tabel rekap.
- Merapikan label metode pembayaran belum dipilih pada rekap bulanan.
- Meningkatkan keterbacaan grafik statistik dan label layanan.

## Revisi Final Sebelum Launch

- Memperbaiki toggle tampil/sembunyikan password agar konsisten di form Masuk dan Buat Akun.
- Memperbaiki checkbox harga satuan manual agar benar-benar mengunci atau membuka field Harga Satuan sesuai pilihan.
- Menghapus durasi Reguler dan menggantinya dengan pilihan 1 sampai 5 hari.
- Membersihkan wording demo/dev/development dari UI publik.
- Merapikan microcopy halaman auth agar lebih siap digunakan sebagai versi publik.
- Memastikan aplikasi tetap buildable sebelum publish.

## Tambah Layanan

- Menambahkan tombol dan modal Tambah Layanan pada halaman Layanan & Harga.
- Menambahkan insert layanan baru ke tabel services dan harga per durasi ke tabel service_prices.
- Menambahkan validasi kode layanan uppercase, harga tidak negatif, dan pencegahan kode layanan duplikat.
- Mengelompokkan tampilan layanan menjadi Kiloan dan Satuan / Item.

## Final Polishing Statistik dan Nota

- Menambahkan warna subtle untuk ringkasan Total Lunas dan Total Belum Lunas pada halaman Statistik.
- Mengubah perbandingan bulan sebelumnya dari persentase menjadi kalimat jumlah transaksi dan nominal rupiah.
- Membuat filter tahun dinamis dari 2010 sampai 10 tahun ke depan untuk Statistik, Rekap Bulanan, dan Rekap Transaksi.
- Menambahkan auto generate nomor nota harian saat Nomor Nota dikosongkan pada Tambah Transaksi.
