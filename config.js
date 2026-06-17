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
