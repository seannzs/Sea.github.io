// ============================================================
//  CONFIG.JS — Semua pengaturan yang bisa kamu ubah ada di sini
// ============================================================

const CONFIG = {

  // ----------------------------------------------------------
  //  FOTO-FOTO (link URL atau path lokal)
  //  Tambah atau hapus link foto sesukamu
  // ----------------------------------------------------------
  heartImages: [
    "images/img1.jpg",   // Foto 1
    "images/img2.jpg",   // Foto 2
    // "https://i.imgur.com/contoh.jpg",  // Contoh link dari internet
    // "images/img3.jpg",                 // Tambah foto ke-3 jika mau
  ],

  // ----------------------------------------------------------
  //  TEKS CINCIN DI SEKITAR PLANET
  //  Setiap baris = satu cincin teks yang mengelilingi planet
  // ----------------------------------------------------------
  ringTexts: [
    "Galaxy of love From ...",  // Cincin 1 (terdalam)
    "I love you",               // Cincin 2
    "♡Happy Girlfriend day♡",   // Cincin 3
    "01/08/2025",               // Cincin 4 (terluar)
  ],

  // ----------------------------------------------------------
  //  TEKS YANG TAMPIL DI ATAS PLANET (hint text)
  // ----------------------------------------------------------
  hintText: "Happy Girlfriend Day!",

  // ----------------------------------------------------------
  //  MUSIK (YouTube)
  // ----------------------------------------------------------
  music: {
    videoId: "d4OMqGKBl6E",   // ID video YouTube
    startTime: 227,            // Mulai di detik ke-berapa
    endTime: 261,              // Berhenti di detik ke-berapa (0 = sampai habis)
    buttonLabel: "Mainkan Musik 🎵",
  },

  // ----------------------------------------------------------
  //  NAMA KREATOR (pojok kanan bawah)
  // ----------------------------------------------------------
  creatorName: "Create by Miko",

  // ----------------------------------------------------------
  //  WARNA GALAKSI
  // ----------------------------------------------------------
  galaxy: {
    insideColor: "#d63ed6",   // Warna bagian dalam galaksi
    outsideColor: "#48b8b8",  // Warna bagian luar galaksi
    starCount: 100000,        // Jumlah bintang
    arms: 6,                  // Jumlah lengan galaksi
  },

};
