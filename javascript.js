/* ===================================================
   NEXUS HUB — javascript.js
=================================================== */

// ────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────

const channels = [
  {
    name: "general",
    icon: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M14 2H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2l2 2 2-2h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM3 5h10v1H3zm0 2h10v1H3zm0 2h6v1H3z"/></svg>`,
    desc: "Chat with the community",
    count: "1,250"
  },
  {
    name: "gaming",
    icon: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 7H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zM14 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 7h-4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"/></svg>`,
    desc: "Find teammates and play together",
    count: "980"
  },
  {
    name: "media",
    icon: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="10" rx="1"/><path d="M5 14h6l-3-3z" opacity=".5"/></svg>`,
    desc: "Share your content & creations",
    count: "640"
  },
  {
    name: "bot-commands",
    icon: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062z"/></svg>`,
    desc: "Interact with bots",
    count: "320"
  },
  {
    name: "events",
    icon: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M14 0H2a1 1 0 0 0-1 1v2h14V1a1 1 0 0 0-1-1zM1 4v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm4 3h2v2H5V7zm0 3h2v2H5v-2zm3-3h2v2H8V7zm0 3h2v2H8v-2zm3-3h2v2h-2V7z"/></svg>`,
    desc: "Stay updated with server events",
    count: "250"
  }
];

const events = [
  {
    month: "JUN",
    day: "15",
    title: "Nexus Game Night",
    desc: "Join us for a night of fun games and amazing prizes!",
    time: "7:00 PM",
    dayName: "Saturday",
    color: "#3b0764"
  },
  {
    month: "JUN",
    day: "22",
    title: "Art Showcase Stream",
    desc: "Community members show off their best artwork and creations live.",
    time: "5:00 PM",
    dayName: "Saturday",
    color: "#1e3a5f"
  },
  {
    month: "JUL",
    day: "4",
    title: "Summer Giveaway",
    desc: "Massive giveaway event with exclusive prizes for all members!",
    time: "8:00 PM",
    dayName: "Friday",
    color: "#1a1a2e"
  }
];

const activities = [
  {
    initials: "N",
    name: "Nova#1234",
    action: "joined the server",
    channel: null,
    time: "2m ago",
    color: "#7c3aed"
  },
  {
    initials: "G",
    name: "GamerPro",
    action: "sent a message in",
    channel: "#general",
    time: "5m ago",
    color: "#5865F2"
  },
  {
    initials: "E",
    name: "EventBot",
    action: "created an event",
    channel: null,
    time: "10m ago",
    color: "#22c55e"
  }
];

// ────────────────────────────────────────────
// RENDER CHANNELS
// ────────────────────────────────────────────

function renderChannels() {
  const list = document.getElementById("channelList");
  if (!list) return;

  list.innerHTML = channels.map(ch => `
    <div class="channel-row" tabindex="0" role="button" aria-label="Channel ${ch.name}">
      <span class="channel-hash">#</span>
      <span class="channel-name">${ch.name}</span>
      <span class="channel-desc">
        ${ch.icon}
        ${ch.desc}
      </span>
      <span class="channel-count">${ch.count}</span>
    </div>
  `).join("");

  // Click feedback
  list.querySelectorAll(".channel-row").forEach(row => {
    row.addEventListener("click", () => {
      const name = row.querySelector(".channel-name").textContent;
      showToast(`Opening #${name}`);
    });
    row.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") row.click();
    });
  });
}

// ────────────────────────────────────────────
// RENDER EVENTS SLIDER
// ────────────────────────────────────────────

let currentSlide = 0;

function renderEvents() {
  const slider = document.getElementById("eventsSlider");
  const dots   = document.getElementById("sliderDots");
  if (!slider || !dots) return;

  slider.innerHTML = events.map((ev, i) => `
    <div class="event-slide ${i === 0 ? "active" : ""}" data-index="${i}">
      <div class="event-img" style="background: linear-gradient(135deg, ${ev.color}, #0d0d12);">
        <svg viewBox="0 0 24 24" fill="#a855f7"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0 0 10 9.87v4.263a1 1 0 0 0 1.555.832l3.197-2.132a1 1 0 0 0 0-1.664z"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
      </div>
      <div class="event-date-badge">
        <div class="event-month">${ev.month}</div>
        <div class="event-day">${ev.day}</div>
      </div>
      <div class="event-body">
        <div class="event-title">${ev.title}</div>
        <div class="event-desc">${ev.desc}</div>
        <div class="event-time-row">
          <div>
            <div class="event-time">${ev.time}</div>
            <div class="event-day-name">${ev.dayName}</div>
          </div>
          <button class="btn-interested" data-event="${i}">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.448a1 1 0 0 0-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.952 2.878c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 0 0-.364-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69l1.285-3.957z"/></svg>
            Interested
          </button>
        </div>
      </div>
    </div>
  `).join("");

  dots.innerHTML = events.map((_, i) => `
    <button class="slider-dot ${i === 0 ? "active" : ""}" data-dot="${i}" aria-label="Event ${i + 1}"></button>
  `).join("");

  // Dot click
  dots.querySelectorAll(".slider-dot").forEach(dot => {
    dot.addEventListener("click", () => goToSlide(Number(dot.dataset.dot)));
  });

  // Interested button toggle
  slider.querySelectorAll(".btn-interested").forEach(btn => {
    btn.addEventListener("click", e => {
      btn.classList.toggle("active");
      const isActive = btn.classList.contains("active");
      showToast(isActive ? "Marked as Interested!" : "Removed from Interested");
    });
  });
}

function goToSlide(index) {
  const slides = document.querySelectorAll(".event-slide");
  const dots   = document.querySelectorAll(".slider-dot");
  if (!slides.length) return;

  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");
  currentSlide = index;
  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

// Auto-advance slider
setInterval(() => {
  const nextIndex = (currentSlide + 1) % events.length;
  goToSlide(nextIndex);
}, 6000);

// ────────────────────────────────────────────
// RENDER ACTIVITY
// ────────────────────────────────────────────

function renderActivity() {
  const list = document.getElementById("activityList");
  if (!list) return;

  list.innerHTML = activities.map((act, i) => `
    <div class="activity-item" style="animation-delay: ${i * 0.1}s">
      <div class="activity-avatar" style="background: linear-gradient(135deg, ${act.color}, ${act.color}99)">
        ${act.initials}
      </div>
      <div class="activity-text">
        <div class="activity-msg">
          <strong>${act.name}</strong> ${act.action}
          ${act.channel ? `<span class="mention">${act.channel}</span>` : ""}
        </div>
        <div class="activity-time">${act.time}</div>
      </div>
    </div>
  `).join("");
}

// ────────────────────────────────────────────
// DONUT CHART (Canvas)
// ────────────────────────────────────────────

function drawDonut() {
  const canvas = document.getElementById("donutChart");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  const cx = 80, cy = 80, r = 60, lineW = 14;
  const total   = 12540;
  const online  = 1250;
  const offline = 11290;
  const onlinePct  = online  / total;
  const offlinePct = offline / total;

  // Clear
  ctx.clearRect(0, 0, 160, 160);

  // Track (background ring)
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#252535";
  ctx.lineWidth = lineW;
  ctx.stroke();

  // Offline segment (grey)
  const startAngle = -Math.PI / 2;
  const onlineEnd  = startAngle + onlinePct * Math.PI * 2;
  const offlineEnd = onlineEnd  + offlinePct * Math.PI * 2;

  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, offlineEnd);
  ctx.strokeStyle = "#374151";
  ctx.lineWidth = lineW;
  ctx.stroke();

  // Online segment (purple gradient)
  const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  grad.addColorStop(0, "#a855f7");
  grad.addColorStop(1, "#7c3aed");

  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, onlineEnd);
  ctx.strokeStyle = grad;
  ctx.lineWidth = lineW;
  ctx.lineCap = "round";
  ctx.stroke();
}

// ────────────────────────────────────────────
// NAVBAR SCROLL EFFECT
// ────────────────────────────────────────────

function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,.5)";
    } else {
      navbar.style.boxShadow = "none";
    }
  });
}

// ────────────────────────────────────────────
// HAMBURGER MENU
// ────────────────────────────────────────────

function initHamburger() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("mobileNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    nav.classList.toggle("open");
  });

  // Close on link click
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      btn.classList.remove("open");
      nav.classList.remove("open");
    });
  });
}

// ────────────────────────────────────────────
// JOIN DISCORD BUTTONS
// ────────────────────────────────────────────

function initDiscordButtons() {
  const btns = document.querySelectorAll("#joinDiscordBtn, #joinDiscordBtn2");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      showToast("Discord link not connected yet — coming soon!");
    });
  });
}

// ────────────────────────────────────────────
// SHARE INVITE
// ────────────────────────────────────────────

function initShareInvite() {
  const btn = document.getElementById("shareInviteBtn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "NEXUS HUB", url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Invite link copied!");
      }
    } catch {
      showToast("Could not copy link");
    }
  });
}

// ────────────────────────────────────────────
// LIVE ACTIVITY SIMULATOR
// ────────────────────────────────────────────

const simulatedUsers = [
  { name: "Shadow#7291", action: "joined the server", channel: null, color: "#7c3aed" },
  { name: "ByteWolf",    action: "sent a message in", channel: "#gaming", color: "#5865F2" },
  { name: "PixelQueen",  action: "sent a message in", channel: "#media",  color: "#ec4899" },
  { name: "CodeNinja",   action: "joined the server", channel: null, color: "#22c55e" },
  { name: "StarGazer",   action: "sent a message in", channel: "#general", color: "#f97316" },
];

let simIndex = 0;

function simulateActivity() {
  const list = document.getElementById("activityList");
  if (!list) return;

  const user = simulatedUsers[simIndex % simulatedUsers.length];
  simIndex++;

  const item = document.createElement("div");
  item.className = "activity-item";
  item.innerHTML = `
    <div class="activity-avatar" style="background: linear-gradient(135deg, ${user.color}, ${user.color}99)">
      ${user.name[0]}
    </div>
    <div class="activity-text">
      <div class="activity-msg">
        <strong>${user.name}</strong> ${user.action}
        ${user.channel ? `<span class="mention">${user.channel}</span>` : ""}
      </div>
      <div class="activity-time">just now</div>
    </div>
  `;

  // Prepend new activity
  list.insertBefore(item, list.firstChild);

  // Update times for older items
  list.querySelectorAll(".activity-time").forEach((el, idx) => {
    if (idx === 0) el.textContent = "just now";
  });

  // Keep max 5 items
  while (list.children.length > 5) {
    list.removeChild(list.lastChild);
  }
}

setInterval(simulateActivity, 12000);

// ────────────────────────────────────────────
// TOAST NOTIFICATION
// ────────────────────────────────────────────

let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// ────────────────────────────────────────────
// COUNTER ANIMATION
// ────────────────────────────────────────────

function animateCounters() {
  const targets = [
    { el: document.querySelector(".donut-number"), target: 12540, suffix: "," },
  ];

  targets.forEach(({ el, target }) => {
    if (!el) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// ────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  renderChannels();
  renderEvents();
  renderActivity();
  drawDonut();
  initNavbarScroll();
  initHamburger();
  initDiscordButtons();
  initShareInvite();

  // Animate counters after a short delay
  setTimeout(animateCounters, 300);

  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".activity-item").forEach(el => {
      el.style.animation = "none";
    });
  }
});
