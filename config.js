// ╔══════════════════════════════════════════╗
// ║       CONFIG — Kemana Kamu Pergi? 🌸     ║
// ╚══════════════════════════════════════════╝

const CONFIG = {
  // ── Nama Pasangan ──────────────────────────
  namaPacar: "Sayang",           // Ganti nama pacarmu di sini
  namaMu: "Aku",                 // Nama kamu

  // ── Pesan Utama ────────────────────────────
  pesanRindu:
    "Kamu lagi kemana sih? Aku udah nunggu dari tadi 🥺",

  pesanKecil: [
    "HP-mu kenapa nggak dibales? 📱",
    "Aku nyariin kamu kemana-mana lho...",
    "Semua tempat aku cek, kamu nggak ada 🥺",
    "Sini dong, aku kangen banget sama kamu 💕",
    "Makan belum? Aku khawatir tau nggak sih...",
    "Balikin aku pesannya dong yaaa 🌸",
    "Online sebentar gapapa kan? Cuma mau bilang kangen 💗",
    "Kamu baik-baik aja kan? Aku sayang kamu 💖",
  ],

  // ── Lokasi yang Sudah Dicek ─────────────────
  lokasiDicek: [
    { nama: "WhatsApp",   icon: "💬", status: "Nggak aktif" },
    { nama: "Instagram",  icon: "📸", status: "Nggak aktif" },
    { nama: "TikTok",     icon: "🎵", status: "Sepi banget" },
    { nama: "Twitter/X",  icon: "🐦", status: "Nggak ketemu" },
    { nama: "Discord",   icon: "🌸", status: "Nggak ada" },
    { nama: "Di Echo",   icon: "🛋️", status: "Nggak ada" },
    { nama: "Handphone",      icon: "📱", status: "Nggak online" },
    { nama: "Hati Aku",   icon: "💖", status: "Ada di sini ♾️" },
  ],

  // ── Konfigurasi Animasi ─────────────────────
  animasi: {
    jumlahHati: 18,          // Jumlah hati yang beterbangan
    jumlahBintang: 22,       // Jumlah bintang dekorasi
    kecepatanTik: 2000,      // Interval ganti pesan kecil (ms)
    durasiSearch: 1200,      // Durasi animasi search bar (ms)
  },

  // ── Warna Tema ──────────────────────────────
  warna: {
    utama:       "#FF6B9D",
    muda:        "#FFB3CC",
    sangat_muda: "#FFE4EE",
    aksen:       "#FF3D7F",
    kuning:      "#FFD93D",
    ungu:        "#C77DFF",
    putih:       "#FFFFFF",
  },
};
