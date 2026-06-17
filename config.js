// ============================================
// KONFIGURASI GALAXY LOVE
// Ubah nilai di bawah ini untuk kustomisasi
// ============================================

const config = {
  // Nama pembuat (tampil di pojok kanan bawah)
  creatorName: "Create by Miko",

  // Deskripsi planet (teks yang berputar mengelilingi planet)
  // Tambahkan / ubah teks sesuai keinginan
  ringTexts: [
    'Galaxy of love From ...', // untuk deskripsi planet layer 1
    "I love you",               // untuk deskripsi planet layer 2
    "♡Happy Girlfriend day♡",   // untuk deskripsi planet layer 3
    "01/08/2025",               // untuk deskripsi planet layer 4
  ],

  // Foto yang akan ditampilkan membentuk galaxy (pakai LINK foto, bukan file lokal)
  //
  // CARA DAPAT LINK FOTO:
  // 1. Buka https://imgbb.com atau https://postimages.org
  // 2. Upload foto kamu
  // 3. Copy "Direct link" (link yang diakhiri .jpg/.png, BUKAN link halaman web)
  // 4. Tempel link itu di antara tanda kutip di bawah ini
  //
  // Bisa isi 2 foto atau lebih, sesuai kebutuhan
  heartImages: [
    "https://i.ibb.co/GANTI-DENGAN-LINK-FOTO-1.jpg",
    "https://i.ibb.co/GANTI-DENGAN-LINK-FOTO-2.jpg"
  ],

  // Pengaturan musik (YouTube)
  music: {
    videoId: 'd4OMqGKBl6E',
    startTime: 227,
    endTime: 261,
    loopSeekTo: 90
  }
};

// Ekspos ke window agar bisa diakses oleh script.js (non-module) dan index.html
window.appConfig = config;
