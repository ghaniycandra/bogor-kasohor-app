# Bogor Kasohor

**Bogor Kasohor** adalah medium untuk berbagi cerita, pengalaman, dan foto menarik seputar wilayah Bogor. 

## Fitur Utama

Aplikasi ini memiliki fitur-fitur modern web:

1. ***Progressive Web App* (PWA) & *Offline-First***
   - Aplikasi dapat diinstal ke layar utama (*Home Screen*) perangkat pengguna.
   - Menggunakan **Service Worker** dan strategi *Caching* agar aplikasi tetap dapat diakses meskipun koneksi internet terputus (*Offline*).

2. **Penyimpanan Cerita Favorit (IndexedDB)**
   - Pengguna dapat menyimpan cerita favorit mereka ke dalam brankas perangkat secara lokal menggunakan IndexedDB (via *package* `idb`).
   - Halaman "Cerita Favorit" yang dapat diakses dengan cepat dan aman untuk menjaga privasi pengguna (data akan dikosongkan saat pengguna *logout*).

3. ***Web Push Notification***
   - Terintegrasi dengan fitur berlangganan (*Subscribe/Unsubscribe*) notifikasi dari API.
   - Mampu menerima pembaruan cerita terbaru langsung ke perangkat pengguna.

4. ***Routing & Single Page Application* (SPA)**
   - Navigasi mulus tanpa *reload* halaman menggunakan pendekatan *Hash Routing*.
   - Arsitektur berbasis *Class* dan modular (Vanilla JavaScript).

5. **Peta Digital Interaktif (Leaflet.js)**
   - Menampilkan daftar cerita dari API beserta *marker* lokasi dan *popup* deskripsi.
   - **Multiple Tile Layer** (Peta Standar & Peta Topografi) dengan layer control.
   - Fitur *Smart UX*: Pengguna dapat mengeklik peta di Beranda untuk langsung menuju halaman "Tambah Cerita" dengan koordinat yang terbawa otomatis.

6. **Manajemen Cerita & Form Lanjutan**
   - Integrasi penuh dengan **Dicoding Story API** (Daftar, Login, *Fetch* Cerita, *Post* Cerita).
   - Fitur akses **Kamera Langsung** (*MediaDevices* API) dan unggah galeri.
   - Input koordinat lokasi (*Latitude/Longitude*) otomatis melalui tombol GPS (*Geolocation* API) atau dengan **mengeklik peta secara langsung**.

7. **Aksesibilitas & Responsif**
   - Struktur HTML Semantik dan penerapan *ARIA labels*.
   - Fitur **Skip to Content** dan dukungan navigasi penuh menggunakan *Keyboard* (`tabindex`).
   - Tampilan responsif dan proporsional di ukuran layar *Mobile*, *Tablet*, dan *Desktop*.

## Teknologi yang Digunakan

- **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Database Lokal:** [idb](https://www.npmjs.com/package/idb) (IndexedDB Wrapper)
- **Maps:** [Leaflet.js](https://leafletjs.com/) & OpenStreetMap
- **API:** Fetch API (Terhubung dengan *Dicoding Story API*)
- **Code Formatter:** [Prettier](https://prettier.io/)
- **Deployment:** GitHub Pages (via folder `docs`)

## Cara Menjalankan Proyek (Instalasi)

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di komputer Anda.

1. **Ekstrak repositori ini** ke dalam komputer Anda.

2. Buka terminal dan arahkan ke folder proyek ini.

3. Instal semua *dependencies* yang dibutuhkan dengan perintah:
   ```bash
   npm install
   ```
    
4. Jalankan aplikasi di mode pengembangan (development) dengan perintah:
    ```bash
    npm run dev
    ```


5. Buka tautan localhost yang muncul di terminal melalui browser Anda.

## *Scripts*

- `npm run build`: Membuat build production menggunakan Vite.
- `npm run dev`: Menjalankan server development menggunakan Vite.
- `npm run format`: Memformat ulang kode menggunakan Prettier.


## Struktur Proyek

```text
 Bogor Kasohor
├── .gitignore               # Mengabaikan berkas yang tidak perlu di Git
├── .prettierrc              # Konfigurasi perapian kode otomatis
├── package.json             # Informasi dependensi proyek
├── package-lock.json        # File lock untuk dependensi
├── README.md                # Dokumentasi proyek
├── vite.config.js           # Konfigurasi Vite
└── src                      # Direktori utama untuk kode sumber
    ├── index.html           # Berkas HTML utama
    ├── public               # Direktori aset publik
    │   ├── favicon.ico      # Ikon situs (favicon)
	|	├── manifest.json    # Metadata PWA (Nama, ikon, dan warna tema aplikasi)
	|	├── sw.js            # Service Worker (Logika caching & kapabilitas offline)
    │   └── images           # Direktori gambar yang digunakan dalam proyek
    │    	├── icons        # Direktori ikon situs (PWA)
    │    	├── logo.ico     # Gambar logo
    │    	└── logo.png     # Gambar logo
    ├── scripts              # Direktori untuk kode JavaScript
    │   ├── data             # Folder untuk API atau sumber data
    │   ├── pages            # Halaman-halaman utama
    │   ├── routes           # Pengaturan routing
    │   ├── utils            # Helper dan utilitas
    │   ├── config.js        # Konfigurasi proyek
    │   └── index.js         # Entry point aplikasi
    └── styles               # Direktori berkas CSS
        └── styles.css       # Gaya umum
```

## Catatan
- API Key Peta: Aplikasi ini menggunakan Leaflet.js dengan penyedia tile dari komunitas OpenStreetMap (OSM) dan OpenTopoMap. Oleh karena itu, aplikasi ini tidak membutuhkan API eksternal tambahan untuk menjalankan layanan pemetaan.

- Kredensial: Anda dapat membuat akun baru melalui halaman "Daftar", atau menggunakan akun yang sudah Anda miliki di Dicoding Story API untuk melakukan pengujian fitur.

- Privasi: Data IndexedDB dikonfigurasi untuk dibersihkan secara otomatis saat pengguna melakukan Logout demi menjaga privasi.

## Profil Pengembang

**Muhammad Ghaniy Candra Mahendra**, ID