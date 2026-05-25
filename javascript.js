/* ============================================
   BUCIN SCRIPT — javascript.js
   "Dreamy Luxury Kawaii" Edition 💕
   ============================================ */
"use strict";

// ── State ──────────────────────────────────
const S = {
  cfg: null,
  msgIdx: 0,
  msgTimer: null,
  loaded: false,
  clicks: 0,
  popMsgIdx: 0,
};

// ── Bootstrap ─────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  S.cfg = await loadConfig();
  populate();
  initCanvas();
  initFloaters();
  initObserver();
  startCarousel();
  startCounter();
  initClickFX();
  initPopup();
  animateReasons();

  // Dismiss loader
  setTimeout(() => {
    const el = document.getElementById('loading-screen');
    el.classList.add('hide');
    setTimeout(() => el.remove(), 1100);
    // Reveal hero with slight delay
    setTimeout(() => document.getElementById('hero')?.classList.add('visible'), 150);
  }, 1900);

  // Scroll btn
  document.getElementById('scroll-btn')?.addEventListener('click', () => {
    document.getElementById('sec-counter')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Config ────────────────────────────────
async function loadConfig() {
  try {
    const r = await fetch('config.json');
    return await r.json();
  } catch {
    return FALLBACK_CONFIG;
  }
}

// ── Populate DOM ──────────────────────────
function populate() {
  const c = S.cfg;

  // Badge
  setText('hero-badge', `💌 Dari ${c.person.from} untuk ${c.person.to}`);

  // Titles
  const titleEl = document.querySelector('.line-1');
  if (titleEl) titleEl.innerHTML = c.app.title.replace(',', ',<br>');

  // Letter sig
  setText('letter-sig', `${c.person.from} 💕`);

  // Carousel text
  setText('carousel-text', c.messages[0]);

  // Carousel dots
  const dotsEl = document.getElementById('carousel-dots');
  if (dotsEl) {
    dotsEl.innerHTML = c.messages
      .map((_, i) => `<div class="c-dot${i===0?' active':''}" data-i="${i}" role="tab" aria-label="Pesan ${i+1}" aria-selected="${i===0}"></div>`)
      .join('');
    dotsEl.addEventListener('click', e => {
      const t = e.target.closest('.c-dot');
      if (t) jumpTo(+t.dataset.i);
    });
  }

  // Bento grid (reasons)
  const bento = document.getElementById('bento-grid');
  if (bento) {
    bento.innerHTML = c.reasons.map((r, i) => `
      <div class="reason-tile" style="transition-delay:${i*60}ms" role="listitem">
        <div class="reason-emoji-wrap" aria-hidden="true">${r.emoji}</div>
        <div class="reason-text">${r.text}</div>
      </div>
    `).join('');
  }

  // Timeline (memories)
  const timeline = document.getElementById('timeline');
  if (timeline) {
    const tags = ['Kenangan Indah', 'Momen Manis', 'Tak Terlupakan', 'Terindah'];
    timeline.innerHTML = c.memories.map((m, i) => `
      <div class="memory-item">
        <div class="memory-dot-wrap">
          <div class="memory-dot" aria-hidden="true">${m.icon}</div>
        </div>
        <div class="memory-body">
          <div class="memory-title">${m.title}</div>
          <div class="memory-desc">${m.desc}</div>
          <span class="memory-tag">${tags[i % tags.length]}</span>
        </div>
      </div>
    `).join('');
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Background Canvas ─────────────────────
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let hearts = [];

  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize();
  addEventListener('resize', resize);

  const mk = () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + 40,
    r: 8 + Math.random() * 14,
    vy: 0.4 + Math.random() * 0.9,
    vx: (Math.random() - 0.5) * 0.5,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.015,
    alpha: 0.05 + Math.random() * 0.09,
    hue: 340 + Math.random() * 20,
  });

  for (let i = 0; i < 14; i++) {
    const h = mk(); h.y = Math.random() * canvas.height; hearts.push(h);
  }

  const drawH = (h) => {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rot);
    ctx.globalAlpha = h.alpha;
    ctx.fillStyle = `hsl(${h.hue},80%,65%)`;
    ctx.beginPath();
    const r = h.r;
    ctx.moveTo(0, -r * 0.3);
    ctx.bezierCurveTo( r * 0.5, -r * 0.9,  r * 1.1,  r * 0.1, 0,  r * 0.65);
    ctx.bezierCurveTo(-r * 1.1,  r * 0.1, -r * 0.5, -r * 0.9, 0, -r * 0.3);
    ctx.fill();
    ctx.restore();
  };

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach((h, i) => {
      h.y -= h.vy; h.x += h.vx; h.rot += h.vr;
      if (h.y < -50) hearts[i] = mk();
      drawH(h);
    });
    if (Math.random() < 0.015 && hearts.length < 22) hearts.push(mk());
    requestAnimationFrame(loop);
  })();
}

// ── Floating Emojis ───────────────────────
function initFloaters() {
  const set = ['💕','🌸','✨','💖','🦋','🌺','💝','⭐','💓','🌹','✿','꩜'];
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('div');
    el.className = 'float-emoji';
    el.textContent = set[i % set.length];
    el.style.setProperty('--x', `${4 + Math.random() * 92}%`);
    el.style.setProperty('--dur', `${7 + Math.random() * 8}s`);
    el.style.setProperty('--delay', `${Math.random() * 9}s`);
    el.style.setProperty('--fs', `${13 + Math.random() * 14}px`);
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }
}

// ── Scroll Reveal ─────────────────────────
function initObserver() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.section').forEach(el => io.observe(el));
}

// ── Reason Cards Stagger ──────────────────
function animateReasons() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.reason-tile').forEach((t, i) => {
          setTimeout(() => t.classList.add('pop'), i * 70);
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  const g = document.getElementById('bento-grid');
  if (g) io.observe(g);
}

// ── Message Carousel ──────────────────────
function startCarousel() {
  S.msgTimer = setInterval(() => jumpTo((S.msgIdx + 1) % S.cfg.messages.length), 4500);

  const card = document.getElementById('carousel-card');
  card?.addEventListener('click', () => { clearInterval(S.msgTimer); jumpTo((S.msgIdx + 1) % S.cfg.messages.length); S.msgTimer = setInterval(() => jumpTo((S.msgIdx + 1) % S.cfg.messages.length), 4500); });
  card?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
}

function jumpTo(idx) {
  const txt = document.getElementById('carousel-text');
  const dots = document.querySelectorAll('.c-dot');
  txt.classList.add('out');
  setTimeout(() => {
    S.msgIdx = idx;
    txt.textContent = S.cfg.messages[idx];
    txt.classList.remove('out');
  }, 320);
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === idx);
    d.setAttribute('aria-selected', i === idx);
  });
}
window.jumpTo = jumpTo;

// ── Love Counter ──────────────────────────
const prev = {};
function startCounter() {
  const since = new Date(S.cfg.person.since);
  const tick = () => {
    const d = Date.now() - since;
    setNum('count-days',  Math.floor(d / 86400000));
    setNum('count-hours', Math.floor((d % 86400000) / 3600000));
    setNum('count-mins',  Math.floor((d % 3600000) / 60000));
    setNum('count-secs',  Math.floor((d % 60000) / 1000));
  };
  tick();
  setInterval(tick, 1000);
}

function setNum(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  const s = val.toLocaleString();
  if (prev[id] === s) return;
  prev[id] = s;
  el.textContent = s;
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'counterPop 0.4s ease';
}

// ── Click FX ─────────────────────────────
const FX_EMOJIS = ['💖','✨','🌸','💕','⭐','🦋','💝','🌺','💫','🎀'];
function initClickFX() {
  document.addEventListener('click', e => {
    if (!S.loaded) return;
    S.clicks++;
    spawnSparkle(e.clientX, e.clientY);
    if (S.clicks % 8 === 0) toast('Terima kasih sudah perhatiin aku 💕');
  });
}

function spawnSparkle(x, y) {
  const el = document.createElement('div');
  el.className = 'sparkle';
  el.textContent = FX_EMOJIS[Math.floor(Math.random() * FX_EMOJIS.length)];
  el.style.left = `${x - 9}px`;
  el.style.top  = `${y - 9}px`;
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 750);
}

// Heart burst (many particles)
function heartBurst(x, y) {
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.textContent = FX_EMOJIS[Math.floor(Math.random() * FX_EMOJIS.length)];
    el.setAttribute('aria-hidden', 'true');
    const angle = (i / 14) * Math.PI * 2;
    const dist  = 55 + Math.random() * 45;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    el.style.cssText = `left:${x-9}px;top:${y-9}px;font-size:${16+Math.random()*14}px;animation:none;opacity:1;transition:all 0.75s cubic-bezier(0.25,0.46,0.45,0.94);`;
    document.body.appendChild(el);
    void el.offsetWidth;
    el.style.opacity = '0';
    el.style.transform = `translate(${tx}px,${ty}px) scale(0.4) rotate(${Math.random()*360}deg)`;
    setTimeout(() => el.remove(), 800);
  }
}

// ── Toast ─────────────────────────────────
function toast(msg) {
  const el = document.getElementById('toast');
  const tx = document.getElementById('toast-text');
  if (!el || !tx) return;
  tx.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

// ── Popup ─────────────────────────────────
const POPUP_MSGS = [
  'Kamu tuh beneran bikin hari-hariku jadi jauh lebih cerah dan bermakna. Makasih ya udah mau ada buat aku. Kamu special banget 💖',
  'Tau gak, setiap kali inget kamu, hatiku langsung ikutan senyum sendiri. Semoga kamu juga ngerasain betapa sayangnya aku sama kamu 🌸',
  'Kamu itu kayak morning coffee buat aku — bikin semangat, hangat, dan gak bisa sehari tanpa kamu. Jangan pernah berubah ya! ✨',
];

function initPopup() {
  const btn     = document.getElementById('love-btn');
  const overlay = document.getElementById('popup-overlay');
  const closeEl = document.getElementById('popup-close');
  const actionEl = document.getElementById('popup-action');
  const bodyEl  = document.getElementById('popup-body');

  const open = () => {
    if (bodyEl) bodyEl.textContent = POPUP_MSGS[S.popMsgIdx % POPUP_MSGS.length];
    S.popMsgIdx++;
    overlay?.classList.add('open');
    overlay?.removeAttribute('aria-hidden');
    // burst from button
    const r = btn?.getBoundingClientRect();
    if (r) heartBurst(r.left + r.width / 2, r.top + r.height / 2);
  };
  const close = () => {
    overlay?.classList.remove('open');
    overlay?.setAttribute('aria-hidden', 'true');
  };

  btn?.addEventListener('click', open);
  closeEl?.addEventListener('click', close);
  actionEl?.addEventListener('click', () => { close(); setTimeout(() => toast('Aku juga sayang kamu banget! 💕'), 400); });
  overlay?.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Mark loaded after first interaction grace period
  setTimeout(() => { S.loaded = true; }, 2200);
}

// ── Fallback Config ───────────────────────
const FALLBACK_CONFIG = {
  app: { title: 'Buat Kamu, Sayangku', subtitle: 'sebuah pesan kecil dari hatiku' },
  person: { from: 'Aku', to: 'Kamu ✨', since: '2024-01-01' },
  messages: [
    'Kamu adalah alasan aku tersenyum setiap hari 🌸',
    'Setiap detik bersamamu adalah kenangan terindah 💖',
    'Kamu bukan bintang favoritku… kamu adalah seluruh galaksiku ✨',
    'Pelukmu adalah rumah ternyamanku di dunia 🏠',
    'Aku jatuh cinta padamu setiap hari, berkali-kali 💝',
    'Hidupku jauh lebih berwarna sejak ada kamu 🌈',
  ],
  reasons: [
    { emoji: '😊', text: 'Senyummu yang mencairkan hatiku' },
    { emoji: '🧠', text: 'Kecerdasanmu yang membuatku kagum' },
    { emoji: '💪', text: 'Semangatmu yang selalu menginspirasi' },
    { emoji: '🤝', text: 'Ketulusanmu dalam setiap hal' },
    { emoji: '😂', text: 'Tawamu yang menjadi lagu favoritku' },
    { emoji: '🌟', text: 'Cahayamu yang menerangi hariku' },
    { emoji: '🌸', text: 'Lembutmu yang membuatku aman' },
    { emoji: '💌', text: 'Caramu mencintaiku dengan tulus' },
  ],
  memories: [
    { icon: '☕', title: 'Kopi Pertama', desc: 'Pertama kali ngopi bareng, nervous banget!' },
    { icon: '🌅', title: 'Sunset Indah', desc: 'Nonton sunset bareng, syahdu banget rasanya' },
    { icon: '🎂', title: 'Ulang Tahunmu', desc: 'Aku ingat setiap detail hari spesialmu' },
    { icon: '🌧️', title: 'Hujan Bareng', desc: 'Kehujanan tapi malah jadi momen termanis' },
  ],
};
