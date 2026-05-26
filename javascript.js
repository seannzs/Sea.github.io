/**
 * GALACTIC LOVE — javascript.js
 * Hand gesture detection + photo constellation system
 */

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
const State = {
  config: null,
  photos: [],          // {id, src, el} loaded photo elements
  activeGesture: null, // 'random' | 'text' | 'heart' | null
  gestureHoldTimer: null,
  cameraActive: false,
  lastGesture: null,
  gestureConfidence: 0,
  hands: null,
  camera: null,
};

// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════
async function loadConfig() {
  try {
    const r = await fetch('config.json');
    State.config = await r.json();
  } catch {
    // fallback config
    State.config = {
      theme: { primary: '#E91E8C' },
      gestures: {
        open_hand: { emoji: '🖐️', label: 'Open Hand', action: 'random' },
        snap:      { emoji: '🫰', label: 'Snap', action: 'text' },
        fist:      { emoji: '✊', label: 'Fist', action: 'heart' },
      },
      animation: { gestureHoldMs: 800 },
      handDetection: { minDetectionConfidence: 0.7, minTrackingConfidence: 0.5, maxNumHands: 1, modelComplexity: 1 }
    };
  }
}

// ═══════════════════════════════════════════
// GALAXY CANVAS — Stars & Nebula Particles
// ═══════════════════════════════════════════
function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Generate stars
  const stars = Array.from({ length: 220 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.7 + 0.2,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinklePhase: Math.random() * Math.PI * 2,
    hue: Math.random() > 0.7 ? 320 + Math.random() * 30 : 0, // some pink stars
  }));

  // Generate nebula wisps
  const wisps = Array.from({ length: 6 }, () => ({
    x: Math.random(),
    y: Math.random(),
    rx: 0.15 + Math.random() * 0.25,
    ry: 0.08 + Math.random() * 0.15,
    angle: Math.random() * Math.PI,
    alpha: 0.03 + Math.random() * 0.05,
    hue: 280 + Math.random() * 80,
    drift: { x: (Math.random() - 0.5) * 0.00005, y: (Math.random() - 0.5) * 0.00005 },
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // Draw nebula wisps
    wisps.forEach(w => {
      w.x += w.drift.x;
      w.y += w.drift.y;
      if (w.x < -0.2) w.x = 1.2;
      if (w.x > 1.2)  w.x = -0.2;
      if (w.y < -0.2) w.y = 1.2;
      if (w.y > 1.2)  w.y = -0.2;

      const grd = ctx.createRadialGradient(
        w.x * canvas.width, w.y * canvas.height, 0,
        w.x * canvas.width, w.y * canvas.height,
        w.rx * canvas.width
      );
      grd.addColorStop(0, `hsla(${w.hue}, 70%, 50%, ${w.alpha})`);
      grd.addColorStop(1, `hsla(${w.hue}, 70%, 50%, 0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.save();
      ctx.translate(w.x * canvas.width, w.y * canvas.height);
      ctx.rotate(w.angle);
      ctx.scale(1, w.ry / w.rx);
      ctx.arc(0, 0, w.rx * canvas.width, 0, Math.PI * 2);
      ctx.restore();
      ctx.fill();
    });

    // Draw stars
    stars.forEach(s => {
      const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinklePhase) * 0.35 + 0.65;
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      if (s.hue) {
        ctx.fillStyle = `hsla(${s.hue}, 80%, 85%, ${s.alpha * twinkle})`;
      } else {
        ctx.fillStyle = `rgba(255, 214, 236, ${s.alpha * twinkle})`;
      }
      ctx.fill();

      // Glow for brighter stars
      if (s.r > 1.2) {
        const grd = ctx.createRadialGradient(
          s.x * canvas.width, s.y * canvas.height, 0,
          s.x * canvas.width, s.y * canvas.height, s.r * 4
        );
        grd.addColorStop(0, `rgba(255, 107, 181, ${0.15 * twinkle})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ═══════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    // Ring lags slightly
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    }, 80);
  });

  document.addEventListener('mousedown', () => {
    cursor.style.width  = '8px';
    cursor.style.height = '8px';
  });
  document.addEventListener('mouseup', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
  });
}

// ═══════════════════════════════════════════
// AMBIENT PARTICLES
// ═══════════════════════════════════════════
function initAmbientParticles() {
  const count = 12;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'ambient-particle';
    const size = 3 + Math.random() * 6;
    const duration = 15 + Math.random() * 20;
    const delay = Math.random() * 20;
    const maxOpacity = 0.15 + Math.random() * 0.25;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}vw;
      top: ${Math.random() * 100}vh;
      background: radial-gradient(circle, rgba(233,30,140,0.9), transparent);
      box-shadow: 0 0 ${size * 3}px rgba(233,30,140,0.5);
      --duration: ${duration}s;
      --max-opacity: ${maxOpacity};
      --dx1: ${(Math.random()-0.5)*15}vw;
      --dy1: ${(Math.random()-0.5)*15}vh;
      --dx2: ${(Math.random()-0.5)*20}vw;
      --dy2: ${(Math.random()-0.5)*20}vh;
      --dx3: ${(Math.random()-0.5)*10}vw;
      --dy3: ${(Math.random()-0.5)*10}vh;
      animation-delay: -${delay}s;
    `;
    document.body.appendChild(p);
  }
}

// ═══════════════════════════════════════════
// PHOTO MANAGEMENT
// ═══════════════════════════════════════════
function createDemoPhotos() {
  // Create gradient placeholder photos when no real photos uploaded
  const colors = [
    ['#E91E8C','#FF6BB5'], ['#C2185B','#E91E8C'], ['#FF4DB8','#FFB3D9'],
    ['#9C0055','#E91E8C'], ['#FF6BB5','#FFD6EC'], ['#C2185B','#FF4DB8'],
    ['#E91E8C','#9C0055'], ['#FF4DB8','#C2185B'], ['#FFB3D9','#E91E8C'],
    ['#D81B60','#FF80C0'], ['#F06292','#C2185B'], ['#880E4F','#E91E8C'],
  ];

  const symbols = ['♡','✦','◈','❋','✿','⊹','✧','◇','⬡','✶','❂','⟡'];

  return colors.map((pair, i) => {
    const canvas = document.createElement('canvas');
    canvas.width  = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    const grd = ctx.createRadialGradient(100, 80, 0, 100, 100, 140);
    grd.addColorStop(0, pair[0]);
    grd.addColorStop(1, pair[1]);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 200, 200);

    // Add noise texture
    for (let n = 0; n < 2000; n++) {
      const nx = Math.random() * 200;
      const ny = Math.random() * 200;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
      ctx.fillRect(nx, ny, 1, 1);
    }

    // Symbol
    ctx.font = '60px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillText(symbols[i % symbols.length], 100, 100);

    return canvas.toDataURL();
  });
}

let photoSrcs = [];

function initPhotos() {
  const saved = localStorage.getItem('galaxy_love_photos');
  if (saved) {
    photoSrcs = JSON.parse(saved);
  } else {
    photoSrcs = createDemoPhotos();
  }
}

function getPhotoSrc(index) {
  if (!photoSrcs.length) return null;
  return photoSrcs[index % photoSrcs.length];
}

// ═══════════════════════════════════════════
// PHOTO FORMATIONS
// ═══════════════════════════════════════════

// Clear all photo elements from stage
function clearPhotos(animate = true) {
  const stage = document.getElementById('photo-stage');
  const items = stage.querySelectorAll('.photo-item');
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform += ' scale(0.5)';
    setTimeout(() => el.remove(), animate ? 600 : 0);
  });
}

// Create a photo element
function createPhotoEl(src, w, h) {
  const el = document.createElement('div');
  el.className = 'photo-item';
  el.style.width  = w + 'px';
  el.style.height = h + 'px';
  el.style.opacity = '0';

  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  img.loading = 'lazy';
  el.appendChild(img);
  return el;
}

// Place element at position with animation delay
function placePhoto(el, x, y, delay = 0, extraClass = '') {
  const stage = document.getElementById('photo-stage');
  if (extraClass) el.classList.add(extraClass);
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  el.style.transform = 'translate(-50%, -50%) scale(0.3) rotate(' + (Math.random()*20-10) + 'deg)';
  stage.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translate(-50%, -50%) scale(1) rotate(' + (Math.random()*6-3) + 'deg)';
  }, delay + 50);
}

// ── RANDOM scatter ──
function formationRandom() {
  clearPhotos();
  const stage = document.getElementById('photo-stage');
  const W = stage.offsetWidth;
  const H = stage.offsetHeight;

  const count = Math.min(photoSrcs.length, 12);
  const sizes = ['size-sm', 'size-md', 'size-lg'];

  for (let i = 0; i < count; i++) {
    const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
    const dim = sizeClass === 'size-sm' ? 100 : sizeClass === 'size-md' ? 130 : 160;
    const el = createPhotoEl(getPhotoSrc(i), dim, dim);
    el.classList.add(sizeClass);

    const pad = dim / 2 + 20;
    const x = pad + Math.random() * (W - pad * 2);
    const y = pad + Math.random() * (H - pad * 2);

    placePhoto(el, x, y, i * 80);
  }
}

// ── I LOVE YOU text formation ──
const ILY_PIXELS = {
  // Each letter as a grid of 5-row bitmaps
  I: [
    [1,1,1],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [1,1,1],
  ],
  ' ': [
    [0],
    [0],
    [0],
    [0],
    [0],
  ],
  L: [
    [1,0,0],
    [1,0,0],
    [1,0,0],
    [1,0,0],
    [1,1,1],
  ],
  O: [
    [1,1,1],
    [1,0,1],
    [1,0,1],
    [1,0,1],
    [1,1,1],
  ],
  V: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,1,0,0],
  ],
  E: [
    [1,1,1],
    [1,0,0],
    [1,1,0],
    [1,0,0],
    [1,1,1],
  ],
  Y: [
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  U: [
    [1,0,1],
    [1,0,1],
    [1,0,1],
    [1,0,1],
    [1,1,1],
  ],
};

function formationText() {
  clearPhotos();

  const stage = document.getElementById('photo-stage');
  const W = stage.offsetWidth;
  const H = stage.offsetHeight;

  const word = ['I',' ','L','O','V','E',' ','Y','O','U'];
  const cellSize = Math.min(32, W / 32);
  const photoSize = Math.max(20, cellSize - 4);

  // Build list of all photo positions
  const positions = [];
  let cursorX = 0;

  word.forEach(ch => {
    const bitmap = ILY_PIXELS[ch] || ILY_PIXELS[' '];
    const cols = bitmap[0].length;

    bitmap.forEach((row, r) => {
      row.forEach((on, c) => {
        if (on) {
          positions.push({ gx: cursorX + c, gy: r });
        }
      });
    });
    cursorX += cols + 1;
  });

  // Center calculation
  const totalCols = cursorX;
  const totalRows = 5;
  const offsetX = (W - totalCols * cellSize) / 2;
  const offsetY = (H - totalRows * cellSize) / 2;

  let photoIdx = 0;
  positions.forEach((pos, i) => {
    const src = getPhotoSrc(photoIdx % photoSrcs.length);
    photoIdx++;
    const el = createPhotoEl(src, photoSize, photoSize);
    const x = offsetX + pos.gx * cellSize + cellSize / 2;
    const y = offsetY + pos.gy * cellSize + cellSize / 2;
    placePhoto(el, x, y, i * 12, 'letter-mode');
  });
}

// ── HEART formation ──
function formationHeart() {
  clearPhotos();

  const stage = document.getElementById('photo-stage');
  const W = stage.offsetWidth;
  const H = stage.offsetHeight;

  // Parametric heart points
  const photoSize = Math.min(70, W / 14);
  const scale = Math.min(W, H) * 0.36;
  const cx = W / 2;
  const cy = H / 2 + scale * 0.08;

  const points = [];
  const steps = Math.min(photoSrcs.length * 2, 60);

  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    // Heart parametric: x = 16sin³(t), y = -(13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t))
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({
      x: cx + hx * (scale / 17),
      y: cy + hy * (scale / 17),
    });
  }

  // Fill interior too
  const innerPoints = [];
  for (let r = 0.3; r < 0.85; r += 0.28) {
    const innerSteps = Math.floor(steps * r);
    for (let i = 0; i < innerSteps; i++) {
      const t = (i / innerSteps) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      innerPoints.push({
        x: cx + hx * r * (scale / 17),
        y: cy + hy * r * (scale / 17),
      });
    }
  }

  const allPoints = [...points, ...innerPoints];
  const usedCount = Math.min(allPoints.length, photoSrcs.length * 2, 55);

  for (let i = 0; i < usedCount; i++) {
    const pt = allPoints[i];
    const src = getPhotoSrc(i % photoSrcs.length);
    const el = createPhotoEl(src, photoSize, photoSize);
    placePhoto(el, pt.x, pt.y, i * 25, 'heart-mode');
  }
}

// ═══════════════════════════════════════════
// GESTURE SYSTEM
// ═══════════════════════════════════════════
function showGestureIndicator(emoji, label) {
  const ind = document.getElementById('gesture-indicator');
  ind.querySelector('.g-emoji').textContent = emoji;
  ind.querySelector('.g-label').textContent = label;
  ind.classList.add('visible');
  clearTimeout(ind._hideTimer);
  ind._hideTimer = setTimeout(() => ind.classList.remove('visible'), 3000);
}

function updateStatusDot(active) {
  const dot = document.querySelector('.status-dot');
  if (active) dot.classList.add('active');
  else        dot.classList.remove('active');
}

function updateHeaderStatus(text) {
  const el = document.querySelector('.header-status span');
  if (el) el.textContent = text;
}

function triggerGesture(action) {
  if (action === State.activeGesture) return;
  State.activeGesture = action;

  const idle = document.getElementById('idle-message');
  idle.classList.add('hidden');

  if (action === 'random') {
    showGestureIndicator('🖐️', 'Random Memories');
    formationRandom();
    showToast('Showing your memories ✦');
  } else if (action === 'text') {
    showGestureIndicator('🫰', 'I Love You');
    formationText();
    showToast('I Love You ♡');
  } else if (action === 'heart') {
    showGestureIndicator('✊', 'Heart Formation');
    formationHeart();
    showToast('Heart of memories ♥');
  }
}

function resetGesture() {
  State.activeGesture = null;
  const idle = document.getElementById('idle-message');
  idle.classList.remove('hidden');
  clearPhotos();
}

// ═══════════════════════════════════════════
// HAND DETECTION (MediaPipe Hands)
// ═══════════════════════════════════════════
function countExtendedFingers(landmarks) {
  // Finger tip landmark indices: [4, 8, 12, 16, 20]
  // Finger pip indices:          [3, 6, 10, 14, 18]
  let count = 0;

  // Thumb (compare x for left/right hand)
  if (landmarks[4].x < landmarks[3].x) count++; // right hand heuristic

  // Other 4 fingers: tip y < pip y means extended
  const tips = [8, 12, 16, 20];
  const pips = [6, 10, 14, 18];
  tips.forEach((tip, i) => {
    if (landmarks[tip].y < landmarks[pips[i]].y) count++;
  });

  return count;
}

function detectGestureFromLandmarks(landmarks) {
  const extended = countExtendedFingers(landmarks);

  if (extended >= 4) return 'random';    // 🖐️ open hand
  if (extended === 2) return 'text';     // 🫰 snap / peace-like
  if (extended <= 0) return 'heart';     // ✊ fist

  return null;
}

function drawHandLandmarks(landmarks, canvasEl, videoEl) {
  const ctx = canvasEl.getContext('2d');
  canvasEl.width  = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  // Draw connections
  const connections = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [5,9],[9,10],[10,11],[11,12],
    [9,13],[13,14],[14,15],[15,16],
    [13,17],[17,18],[18,19],[19,20],
    [0,17],
  ];

  ctx.strokeStyle = 'rgba(255, 107, 181, 0.7)';
  ctx.lineWidth = 1.5;
  connections.forEach(([a, b]) => {
    const pa = landmarks[a];
    const pb = landmarks[b];
    ctx.beginPath();
    ctx.moveTo(pa.x * canvasEl.width, pa.y * canvasEl.height);
    ctx.lineTo(pb.x * canvasEl.width, pb.y * canvasEl.height);
    ctx.stroke();
  });

  // Draw joints
  landmarks.forEach((lm, i) => {
    const isTip = [4, 8, 12, 16, 20].includes(i);
    ctx.beginPath();
    ctx.arc(lm.x * canvasEl.width, lm.y * canvasEl.height, isTip ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = isTip ? 'rgba(233, 30, 140, 0.9)' : 'rgba(255, 180, 220, 0.8)';
    ctx.fill();
  });
}

async function initHandDetection() {
  const video = document.getElementById('webcam');
  const handCanvas = document.getElementById('hand-canvas');

  // Check if MediaPipe is available
  if (typeof Hands === 'undefined') {
    console.warn('MediaPipe Hands not loaded; using keyboard fallback only');
    updateHeaderStatus('keyboard mode');
    return;
  }

  const hands = new Hands({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  const cfg = State.config?.handDetection || {};
  hands.setOptions({
    maxNumHands: cfg.maxNumHands || 1,
    modelComplexity: cfg.modelComplexity || 1,
    minDetectionConfidence: cfg.minDetectionConfidence || 0.7,
    minTrackingConfidence: cfg.minTrackingConfidence || 0.5,
  });

  let gestureBuffer = [];
  const BUFFER_SIZE = 6;

  hands.onResults(results => {
    if (!results.multiHandLandmarks?.length) {
      gestureBuffer = [];
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    drawHandLandmarks(landmarks, handCanvas, video);

    const detected = detectGestureFromLandmarks(landmarks);
    if (!detected) return;

    gestureBuffer.push(detected);
    if (gestureBuffer.length > BUFFER_SIZE) gestureBuffer.shift();

    // Majority vote
    const counts = {};
    gestureBuffer.forEach(g => { counts[g] = (counts[g] || 0) + 1; });
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

    if (dominant && dominant[1] >= Math.ceil(BUFFER_SIZE * 0.6)) {
      if (dominant[0] !== State.lastGesture) {
        State.lastGesture = dominant[0];
        triggerGesture(dominant[0]);
      }
    }
  });

  // Camera
  const camInstance = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 320,
    height: 240,
  });

  try {
    await camInstance.start();
    State.cameraActive = true;
    updateStatusDot(true);
    updateHeaderStatus('hand detection active');
    showToast('Camera ready — show your hand ✦');
  } catch (err) {
    console.warn('Camera access denied:', err);
    updateHeaderStatus('camera denied');
    showToast('Camera denied — use buttons below');
  }

  State.hands = hands;
  State.camera = camInstance;
}

// ═══════════════════════════════════════════
// PHOTO UPLOAD
// ═══════════════════════════════════════════
function initUpload() {
  const modal     = document.getElementById('upload-modal');
  const zone      = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const preview   = document.getElementById('preview-grid');
  const btnOpen   = document.getElementById('btn-upload');
  const btnClose  = document.getElementById('btn-modal-close');
  const btnSave   = document.getElementById('btn-modal-save');

  let pendingPhotos = [];

  function openModal() {
    modal.classList.add('open');
    pendingPhotos = [...photoSrcs];
    renderPreview();
  }

  function closeModal() {
    modal.classList.remove('open');
  }

  function renderPreview() {
    preview.innerHTML = '';
    pendingPhotos.forEach((src, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'preview-thumb';
      const img = document.createElement('img');
      img.src = src;
      const rm = document.createElement('button');
      rm.className = 'remove-btn';
      rm.innerHTML = '×';
      rm.onclick = () => {
        pendingPhotos.splice(i, 1);
        renderPreview();
      };
      thumb.append(img, rm);
      preview.appendChild(thumb);
    });
  }

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        pendingPhotos.push(e.target.result);
        renderPreview();
      };
      reader.readAsDataURL(file);
    });
  }

  zone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => handleFiles(e.target.files));

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });

  btnOpen.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  btnSave.addEventListener('click', () => {
    photoSrcs = [...pendingPhotos];
    try { localStorage.setItem('galaxy_love_photos', JSON.stringify(photoSrcs)); } catch {}
    closeModal();
    showToast(`${photoSrcs.length} photos saved ✦`);
    // Re-trigger current gesture if active
    if (State.activeGesture) {
      const prev = State.activeGesture;
      State.activeGesture = null;
      triggerGesture(prev);
    }
  });
}

// ═══════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ═══════════════════════════════════════════
// INTRO ANIMATION
// ═══════════════════════════════════════════
function initIntro() {
  // Generate intro stars
  const burst = document.querySelector('.intro-star-burst');
  const canvas = document.createElement('canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  burst.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  let prog = 0;
  const introStars = Array.from({ length: 180 }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 2.5,
    size:  0.8 + Math.random() * 1.8,
    color: Math.random() > 0.5 ? '#FF6BB5' : '#FFD6EC',
  }));

  function drawIntro() {
    if (prog >= 1) return;
    prog += 0.008;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    introStars.forEach(s => {
      const dist = prog * s.speed * Math.min(canvas.width, canvas.height) * 0.7;
      const x = cx + Math.cos(s.angle) * dist;
      const y = cy + Math.sin(s.angle) * dist;
      const alpha = (1 - prog) * 0.8;

      const grd = ctx.createRadialGradient(x, y, 0, x, y, s.size * (1 + prog * 2));
      grd.addColorStop(0, s.color.replace(')', `, ${alpha})`.replace('rgb', 'rgba')));
      grd.addColorStop(0, s.color + Math.round(alpha * 255).toString(16).padStart(2,'0'));
      grd.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(x, y, s.size * (1 + prog * 2), 0, Math.PI * 2);
      ctx.fillStyle = s.color + Math.round(alpha * 255).toString(16).padStart(2,'0');
      ctx.fill();
    });
    requestAnimationFrame(drawIntro);
  }
  drawIntro();

  // Hide intro after animation
  setTimeout(() => {
    const overlay = document.getElementById('intro-overlay');
    overlay.style.pointerEvents = 'none';
  }, 4000);
}

// ═══════════════════════════════════════════
// TOGGLE CAMERA VISIBILITY
// ═══════════════════════════════════════════
function initCameraToggle() {
  const btn = document.getElementById('btn-camera');
  const wrapper = document.getElementById('video-wrapper');

  btn.addEventListener('click', () => {
    wrapper.classList.toggle('hidden-cam');
    btn.classList.toggle('active');
    btn.textContent = wrapper.classList.contains('hidden-cam') ? 'Show Cam' : 'Hide Cam';
  });
}

// ═══════════════════════════════════════════
// KEYBOARD GESTURE BUTTONS
// ═══════════════════════════════════════════
function initKeyboardControls() {
  document.getElementById('kbd-random').addEventListener('click', () => triggerGesture('random'));
  document.getElementById('kbd-text').addEventListener('click', () => triggerGesture('text'));
  document.getElementById('kbd-heart').addEventListener('click', () => triggerGesture('heart'));

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === '1') triggerGesture('random');
    if (e.key === '2') triggerGesture('text');
    if (e.key === '3') triggerGesture('heart');
    if (e.key === 'Escape') resetGesture();
  });
}

// ═══════════════════════════════════════════
// RESIZE HANDLER
// ═══════════════════════════════════════════
function initResize() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (State.activeGesture) {
        const g = State.activeGesture;
        State.activeGesture = null;
        triggerGesture(g);
      }
    }, 250);
  });
}

// ═══════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════
async function boot() {
  await loadConfig();
  initPhotos();
  initGalaxy();
  initCursor();
  initAmbientParticles();
  initIntro();
  initUpload();
  initCameraToggle();
  initKeyboardControls();
  initResize();

  // Attempt hand detection after a short delay
  setTimeout(async () => {
    await initHandDetection();
  }, 1500);
}

document.addEventListener('DOMContentLoaded', boot);
