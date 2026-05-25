/* ============================================
   BUCIN SCRIPT - javascript.js
   Pink Kawaii Theme 💕
   ============================================ */

"use strict";

// ============================================
// APP STATE
// ============================================
const AppState = {
  config: null,
  currentMessage: 0,
  messageInterval: null,
  countInterval: null,
  loaded: false,
  clickCount: 0,
};

// ============================================
// LOAD CONFIG
// ============================================
async function loadConfig() {
  try {
    const res = await fetch('config.json');
    AppState.config = await res.json();
  } catch (e) {
    // Fallback config jika fetch gagal (misal buka langsung file://)
    AppState.config = {
      app: { title: "💕 Buat Kamu, Sayangku 💕", subtitle: "Sebuah pesan kecil dari hatiku" },
      person: { from: "Aku", to: "Kamu ✨", since: "2024-01-01" },
      messages: [
        "Kamu adalah alasan aku tersenyum setiap hari 🌸",
        "Setiap detik bersamamu adalah kenangan terindah 💖",
        "Kamu bukan bintang favoritku... kamu adalah seluruh galaksiku ✨",
        "Pelukmu adalah rumah ternyamanku di dunia 🏠",
        "Aku jatuh cinta padamu setiap hari, berkali-kali 💝",
        "Hidupku jauh lebih berwarna sejak ada kamu 🌈",
      ],
      reasons: [
        { emoji: "😊", text: "Senyummu yang mencairkan hatiku" },
        { emoji: "🧠", text: "Kecerdasanmu yang membuatku kagum" },
        { emoji: "💪", text: "Semangatmu yang selalu menginspirasi" },
        { emoji: "🤝", text: "Ketulusanmu dalam setiap hal" },
        { emoji: "😂", text: "Tawamu yang menjadi lagu favoritku" },
        { emoji: "🌟", text: "Cahayamu yang menerangi hariku" },
        { emoji: "🌸", text: "Lembutmu yang membuatku aman" },
        { emoji: "💌", text: "Caramu mencintaiku dengan tulus" },
      ],
      memories: [
        { icon: "☕", title: "Kopi Pertama", desc: "Pertama kali ngopi bareng, nervous banget!" },
        { icon: "🌅", title: "Sunset Indah", desc: "Nonton sunset bareng, syahdu banget rasanya" },
        { icon: "🎂", title: "Ulang Tahunmu", desc: "Aku ingat setiap detail hari spesialmu" },
        { icon: "🌧️", title: "Hujan Bareng", desc: "Kehujanan tapi malah jadi momen termanis" },
      ],
      animations: { heartCount: 20, floatDuration: 6 }
    };
  }
}

// ============================================
// INIT
// ============================================
window.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();
  populateContent();
  initBgCanvas();
  initFloatingEmojis();
  setupIntersectionObserver();
  startMessageCarousel();
  startLoveCounter();
  setupClickSparkle();
  setupPopup();
  popReasonCards();

  // Hide loading screen
  setTimeout(() => {
    const loading = document.getElementById('loading-screen');
    loading.classList.add('hide');
    setTimeout(() => { loading.style.display = 'none'; }, 900);
    // Show hero
    setTimeout(() => {
      document.querySelector('.hero')?.classList.add('visible');
    }, 200);
    AppState.loaded = true;
  }, 1800);
});

// ============================================
// POPULATE CONTENT FROM CONFIG
// ============================================
function populateContent() {
  const cfg = AppState.config;

  // Title
  const titleEl = document.getElementById('app-title');
  if (titleEl) titleEl.textContent = cfg.app.title;
  document.title = cfg.app.title;

  const subEl = document.getElementById('app-subtitle');
  if (subEl) subEl.textContent = cfg.app.subtitle;

  // To/from badge
  const badgeEl = document.getElementById('hero-badge');
  if (badgeEl) badgeEl.textContent = `💌 Dari ${cfg.person.from} untuk ${cfg.person.to}`;

  // Messages
  const msgEl = document.getElementById('message-text');
  if (msgEl) msgEl.textContent = cfg.messages[0];

  // Message dots
  const dotsContainer = document.getElementById('message-dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = cfg.messages.map((_, i) =>
      `<div class="msg-dot ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="goToMessage(${i})"></div>`
    ).join('');
  }

  // Reasons
  const reasonsGrid = document.getElementById('reasons-grid');
  if (reasonsGrid) {
    reasonsGrid.innerHTML = cfg.reasons.map((r, i) =>
      `<div class="reason-card" style="--delay:${i * 0.3}s">
        <span class="reason-emoji">${r.emoji}</span>
        <span class="reason-text">${r.text}</span>
      </div>`
    ).join('');
  }

  // Memories
  const memoriesList = document.getElementById('memories-list');
  if (memoriesList) {
    memoriesList.innerHTML = cfg.memories.map(m =>
      `<div class="memory-item">
        <span class="memory-icon">${m.icon}</span>
        <div>
          <div class="memory-title">${m.title}</div>
          <div class="memory-desc">${m.desc}</div>
        </div>
      </div>`
    ).join('');
  }

  // Love note signature
  const sigEl = document.getElementById('love-sig');
  if (sigEl) sigEl.textContent = `— ${cfg.person.from} 💕`;
}

// ============================================
// BACKGROUND CANVAS (Floating Hearts)
// ============================================
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let hearts = [];
  let raf;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createHeart() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 40,
      size: 12 + Math.random() * 20,
      speed: 0.5 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 0.8,
      opacity: 0.08 + Math.random() * 0.12,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    };
  }

  function drawHeart(ctx, x, y, size, rotation, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#FF6B9D';
    ctx.beginPath();
    const s = size * 0.07;
    ctx.moveTo(0, -size * 0.3);
    ctx.bezierCurveTo(size * 0.5, -size * 0.85, size * 1.1, size * 0.1, 0, size * 0.6);
    ctx.bezierCurveTo(-size * 1.1, size * 0.1, -size * 0.5, -size * 0.85, 0, -size * 0.3);
    ctx.fill();
    ctx.restore();
  }

  // Init hearts
  for (let i = 0; i < 15; i++) {
    const h = createHeart();
    h.y = Math.random() * canvas.height;
    hearts.push(h);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach((h, i) => {
      h.y -= h.speed;
      h.x += h.drift;
      h.rotation += h.rotSpeed;
      if (h.y < -50) {
        hearts[i] = createHeart();
      }
      drawHeart(ctx, h.x, h.y, h.size, h.rotation, h.opacity);
    });

    // Add new hearts occasionally
    if (Math.random() < 0.02 && hearts.length < 25) {
      hearts.push(createHeart());
    }
    raf = requestAnimationFrame(animate);
  }
  animate();
}

// ============================================
// FLOATING EMOJI ELEMENTS
// ============================================
function initFloatingEmojis() {
  const emojis = ['💕', '🌸', '✨', '💖', '🦋', '🌺', '💝', '⭐', '💓', '🌹'];
  const container = document.body;

  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.setProperty('--left', `${5 + Math.random() * 90}%`);
    el.style.setProperty('--dur', `${5 + Math.random() * 7}s`);
    el.style.setProperty('--delay', `${Math.random() * 8}s`);
    el.style.setProperty('--size', `${14 + Math.random() * 18}px`);
    container.appendChild(el);
  }
}

// ============================================
// INTERSECTION OBSERVER (scroll reveal)
// ============================================
function setupIntersectionObserver() {
  const targets = document.querySelectorAll(
    '.counter-section, .message-section, .reasons-section, .memories-section, .love-note'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => observer.observe(t));
}

// ============================================
// MESSAGE CAROUSEL
// ============================================
function startMessageCarousel() {
  AppState.messageInterval = setInterval(() => {
    const cfg = AppState.config;
    if (!cfg) return;
    const next = (AppState.currentMessage + 1) % cfg.messages.length;
    goToMessage(next);
  }, 4000);

  // Click card to next
  const card = document.getElementById('message-card');
  if (card) {
    card.addEventListener('click', () => {
      const cfg = AppState.config;
      clearInterval(AppState.messageInterval);
      goToMessage((AppState.currentMessage + 1) % cfg.messages.length);
      AppState.messageInterval = setInterval(() => {
        goToMessage((AppState.currentMessage + 1) % cfg.messages.length);
      }, 4000);
    });
  }
}

function goToMessage(index) {
  const cfg = AppState.config;
  const msgEl = document.getElementById('message-text');
  const dots = document.querySelectorAll('.msg-dot');

  msgEl.classList.add('fade-out');
  setTimeout(() => {
    AppState.currentMessage = index;
    msgEl.textContent = cfg.messages[index];
    msgEl.classList.remove('fade-out');
    msgEl.classList.add('fade-in');
    setTimeout(() => msgEl.classList.remove('fade-in'), 400);
  }, 300);

  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

// ============================================
// LOVE COUNTER (days/hours/mins/secs since)
// ============================================
function startLoveCounter() {
  const cfg = AppState.config;
  const since = new Date(cfg.person.since);

  function update() {
    const now = new Date();
    const diff = now - since;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    setCounter('count-days', days);
    setCounter('count-hours', hours);
    setCounter('count-mins', mins);
    setCounter('count-secs', secs);
  }

  update();
  AppState.countInterval = setInterval(update, 1000);
}

const counterPrevValues = {};
function setCounter(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  const formatted = val.toLocaleString();
  if (counterPrevValues[id] !== formatted) {
    counterPrevValues[id] = formatted;
    el.textContent = formatted;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'counterPop 0.4s ease';
  }
}

// ============================================
// REASON CARDS POP ANIMATION
// ============================================
function popReasonCards() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const cards = e.target.querySelectorAll('.reason-card');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('pop'), i * 100);
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  const grid = document.getElementById('reasons-grid');
  if (grid) observer.observe(grid);
}

// ============================================
// CLICK SPARKLE EFFECT
// ============================================
function setupClickSparkle() {
  const sparkEmojis = ['💖', '✨', '🌸', '💕', '⭐', '🦋', '💝', '🌺'];
  document.addEventListener('click', (e) => {
    if (!AppState.loaded) return;
    AppState.clickCount++;

    // Sparkle
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.textContent = sparkEmojis[Math.floor(Math.random() * sparkEmojis.length)];
    el.style.left = `${e.clientX - 12}px`;
    el.style.top = `${e.clientY - 12}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);

    // Every 10 clicks show toast
    if (AppState.clickCount % 10 === 0) {
      showToast('Makasih udah sayang aku 💕');
    }
  });
}

// ============================================
// TOAST
// ============================================
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================
// POPUP (love button)
// ============================================
function setupPopup() {
  const btn = document.getElementById('love-btn');
  const overlay = document.getElementById('popup-overlay');
  const closeBtn = document.getElementById('popup-close');
  const popupBtn = document.getElementById('popup-btn');
  const popupText = document.getElementById('popup-text');

  const msgs = [
    "Aku suka banget sama kamu! Kamu tuh selalu bikin hari-hariku jadi lebih indah dan berwarna. Makasih ya udah mau jadi bagian dari hidupku! 💖",
    "Tau gak? Tiap kali inget kamu, hatiku langsung happy banget! Kamu emang spesial banget di hidupku. Love you! 🌸",
    "Kamu itu kayak matahari pagi buat aku — hangat, cerah, dan selalu bikin semangat. Jangan pernah berhenti jadi dirimu ya! ✨",
  ];
  let msgIdx = 0;

  if (btn) btn.addEventListener('click', () => {
    if (popupText) popupText.textContent = msgs[msgIdx % msgs.length];
    msgIdx++;
    overlay?.classList.add('show');
    spawnHeartBurst();
  });

  function closePopup() { overlay?.classList.remove('show'); }
  closeBtn?.addEventListener('click', closePopup);
  popupBtn?.addEventListener('click', () => { closePopup(); showToast('Makasih! Aku juga sayang kamu 💕'); });
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });
}

// ============================================
// HEART BURST on button click
// ============================================
function spawnHeartBurst() {
  const btn = document.getElementById('love-btn');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const emojis = ['💖', '💕', '💗', '💓', '💝', '🌸', '✨'];

  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = (i / 12) * Math.PI * 2;
    const dist = 60 + Math.random() * 40;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    el.style.left = `${cx - 12}px`;
    el.style.top = `${cy - 12}px`;
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
    el.style.animation = 'none';
    el.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    el.style.opacity = '1';
    el.style.fontSize = `${18 + Math.random() * 14}px`;
    document.body.appendChild(el);

    // Force reflow
    void el.offsetWidth;
    el.style.opacity = '0';
    el.style.transform = `translate(${tx}px, ${ty}px) scale(0.5)`;
    setTimeout(() => el.remove(), 900);
  }
}

// ============================================
// UTILITY: Expose goToMessage globally
// ============================================
window.goToMessage = goToMessage;
