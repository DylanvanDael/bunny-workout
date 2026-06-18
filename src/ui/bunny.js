// ─── Scale ───
const PX = 3;

// ─── Palette ───
const _ = null;
const W  = '#ffffff';
const EY = '#ff6b9d';
const NS = '#ffb6c1';
const EI = '#ffddf0';
const G0 = '#1e3d09';
const G1 = '#3d6b1f';
const G2 = '#52921a';
const G3 = '#72c21e';
const FR = '#ff4455';
const FP = '#ff88cc';
const FY = '#ffdd00';
const FW = '#ffffff';
const FS = '#3a6b1a';
const MB = '#7d4e10';
const ML = '#c4955a';
const MD = '#111111';
const MN = '#cc5555';
// Butterfly
const BW1 = '#ffaaee';
const BW2 = '#dd44aa';
const BFB = '#553377';
// Barbell
const WPL = '#334488';
const WPH = '#5566bb';
const WBR = '#ccccdd';

// ─── Pixel art grids (10 × 12) ───

const BSIT = [
  [_,W,_,_,_,_,_,_,W,_],
  [_,W,_,_,_,_,_,_,W,_],
  [_,W,_,_,_,_,_,_,W,_],
  [_,EI,_,_,_,_,_,EI,_,_],
  [_,W,W,W,W,W,W,W,_,_],
  [W,W,W,W,W,W,W,W,W,_],
  [W,EY,W,W,_,W,W,EY,W,_],
  [W,W,W,NS,NS,W,W,W,W,_],
  [W,W,W,W,W,W,W,W,W,W],
  [W,W,W,W,W,W,W,W,W,_],
  [_,W,W,_,_,_,W,W,_,_],
  [_,W,W,_,_,_,W,W,_,_],
];

const BHOP = [
  [W,W,_,_,_,_,_,W,W,_],
  [_,W,_,_,_,_,_,W,_,_],
  [_,W,_,_,_,_,_,W,_,_],
  [_,EI,_,_,_,_,_,EI,_,_],
  [_,W,W,W,W,W,W,W,_,_],
  [W,W,W,W,W,W,W,W,W,_],
  [W,EY,W,W,_,W,W,EY,W,_],
  [W,W,W,NS,NS,W,W,W,W,_],
  [W,W,W,W,W,W,W,W,W,W],
  [W,W,W,W,W,W,W,W,W,_],
  [W,W,_,_,_,_,_,W,W,_],
  [W,W,_,_,_,_,_,W,W,_],
];

const BEAT = [
  [_,W,_,_,_,_,_,_,W,_],
  [_,W,_,_,_,_,_,_,W,_],
  [_,EI,_,_,_,_,_,EI,_,_],
  [_,W,W,W,W,W,W,W,_,_],
  [W,W,W,W,W,W,W,W,W,_],
  [W,EY,W,W,_,W,W,EY,W,_],
  [W,W,W,NS,NS,W,W,W,W,_],
  [W,W,W,W,W,W,W,W,W,W],
  [W,W,W,W,W,W,W,W,W,_],
  [_,W,W,_,_,_,W,W,_,_],
  [_,W,W,_,_,_,W,W,_,_],
  [_,W,W,_,_,_,W,W,_,_],
];

// High-five: paw raised at col 9, rows 2-4
const BHIFI = [
  [_,W,_,_,_,_,_,_,W,_],
  [_,W,_,_,_,_,_,_,W,_],
  [_,W,_,_,_,_,_,_,W,W],
  [_,EI,_,_,_,_,_,EI,W,_],
  [_,W,W,W,W,W,W,W,W,_],
  [W,W,W,W,W,W,W,W,W,_],
  [W,EY,W,W,_,W,W,EY,W,_],
  [W,W,W,NS,NS,W,W,W,W,_],
  [W,W,W,W,W,W,W,W,W,W],
  [W,W,W,W,W,W,W,W,W,_],
  [_,W,W,_,_,_,W,W,_,_],
  [_,W,W,_,_,_,W,W,_,_],
];

// Mole 8 × 7
const BMOLE = [
  [_,MB,MB,MB,MB,MB,_,_],
  [MB,ML,ML,ML,ML,ML,MB,_],
  [MB,ML,MD,ML,MD,ML,MB,_],
  [MB,ML,ML,MN,ML,ML,MB,_],
  [MB,ML,ML,ML,ML,ML,MB,_],
  [MB,MD,MB,MB,MB,MD,MB,_],
  [_,MD,_,_,_,MD,_,_],
];

// Butterfly sprite pixel size (smaller than bunnies)
const BPX = 2;

// Butterfly frame 1 — wings up (6×5)
const BFLY1 = [
  [BW1, _,   _,   _,   _,   BW1],
  [BW1, BW2, _,   _,   BW2, BW1],
  [_,   BW2, BFB, BFB, BW2, _  ],
  [_,   _,   BFB, BFB, _,   _  ],
  [_,   _,   BFB, _,   _,   _  ],
];

// Butterfly frame 2 — wings down (6×5)
const BFLY2 = [
  [_,   _,   BFB, _,   _,   _  ],
  [_,   _,   BFB, BFB, _,   _  ],
  [_,   BW2, BFB, BFB, BW2, _  ],
  [BW1, BW2, _,   _,   BW2, BW1],
  [BW1, _,   _,   _,   _,   BW1],
];

// Barbell (13×4) — weights + chrome bar
const BBELL = [
  [WPL, WPH, _,   _,   _,   _,   _,   _,   _,   _,   _,   WPH, WPL],
  [WPL, WPH, WBR, WBR, WBR, WBR, WBR, WBR, WBR, WBR, WBR, WPH, WPL],
  [WPL, WPH, WBR, WBR, WBR, WBR, WBR, WBR, WBR, WBR, WBR, WPH, WPL],
  [WPL, WPH, _,   _,   _,   _,   _,   _,   _,   _,   _,   WPH, WPL],
];

// ─── Render pixel grid → data URL (px defaults to global PX) ───
function toDataURL(grid, px = PX) {
  const cols = grid[0].length, rows = grid.length;
  const c = document.createElement('canvas');
  c.width = cols * px; c.height = rows * px;
  const ctx = c.getContext('2d');
  grid.forEach((row, y) =>
    row.forEach((color, x) => {
      if (color) { ctx.fillStyle = color; ctx.fillRect(x*px, y*px, px, px); }
    })
  );
  return c.toDataURL();
}

let URLS = null;
function urls() {
  if (!URLS) URLS = {
    sit:  toDataURL(BSIT),
    hop:  toDataURL(BHOP),
    eat:  toDataURL(BEAT),
    hifi: toDataURL(BHIFI),
    mole: toDataURL(BMOLE),
  };
  return URLS;
}

let BF_URLS = null;
function bfURLs() {
  if (!BF_URLS) BF_URLS = {
    f1: toDataURL(BFLY1, BPX),
    f2: toDataURL(BFLY2, BPX),
  };
  return BF_URLS;
}

let BELL_URL = null;
function bellURL() {
  if (!BELL_URL) BELL_URL = toDataURL(BBELL);
  return BELL_URL;
}

// ─── Inject shared CSS once (NES-style dialog box, no border-radius) ───
function ensureStyles() {
  if (document.getElementById('__bunny_ui_styles')) return;
  const s = document.createElement('style');
  s.id = '__bunny_ui_styles';
  s.textContent = `
    .bunny-bubble {
      position: fixed;
      background: #fff0f6;
      color: #8b0033;
      border: 3px solid #c2185b;
      box-shadow: inset 0 0 0 2px #ffaace;
      border-radius: 0;
      padding: 6px 12px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      font-weight: bold;
      letter-spacing: 1px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 9999;
      text-transform: lowercase;
      transform-origin: bottom left;
      transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1), opacity 250ms ease;
    }
  `;
  document.head.appendChild(s);
}

// Canvas-rendered pixelated tail (staircase pointing down-left)
let TAIL_URL = null;
function tailURL() {
  if (TAIL_URL) return TAIL_URL;
  const P = 3; // pixels per grid cell, same as sprite PX
  const c = document.createElement('canvas');
  c.width = 9; c.height = 9;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#c2185b';
  ctx.fillRect(0,     0,   9, P); // row 0: 3 cells wide
  ctx.fillRect(0,     P,   6, P); // row 1: 2 cells wide
  ctx.fillRect(0,   P*2,   3, P); // row 2: 1 cell wide
  // inner highlight row
  ctx.fillStyle = '#ffaace';
  ctx.fillRect(P,     P,   3, P); // highlight middle of row 1
  TAIL_URL = c.toDataURL();
  return TAIL_URL;
}

// ─── Scene constants ───
const SCENE_H  = 76;
const GROUND_H = 18;
const GRASS_Y  = SCENE_H - GROUND_H;
const BW = 10 * PX;
const BH = 12 * PX;
const MIN_GAP      = 8;
const HI_DIST      = 4;
const HIFI_COOLDOWN = 1800; // ms after a high-five where another can't trigger

const active = [];

// ─── Grass + flowers ───
function buildGrassCanvas(holeX) {
  const gc = document.createElement('canvas');
  gc.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;height:100%;display:block';

  function redraw() {
    gc.width  = window.innerWidth;
    gc.height = SCENE_H;
    const ctx = gc.getContext('2d');
    const W   = gc.width;

    ctx.fillStyle = G0;
    ctx.fillRect(0, GRASS_Y, W, GROUND_H);

    for (let x = 0; x < W; x += 3) {
      const h = 7 + Math.floor((Math.sin(x * 7.3 + 1.2) * 0.5 + 0.5) * 8);
      ctx.fillStyle = G1; ctx.fillRect(x, GRASS_Y - h, 3, h);
      ctx.fillStyle = G2; ctx.fillRect(x, GRASS_Y - h, 3, Math.ceil(h * 0.55));
      ctx.fillStyle = G3; ctx.fillRect(x, GRASS_Y - h, 3, 3);
    }

    const fc = [FR, FP, FY];
    for (let i = 0; ; i++) {
      const fx = 20 + i * 68 + Math.round(Math.sin(i * 4.1) * 20);
      if (fx > W - 12) break;
      drawFlower(ctx, fx, GRASS_Y, fc[i % 3]);
    }

    if (holeX) {
      ctx.fillStyle = G0;
      ctx.beginPath();
      ctx.ellipse(holeX, GRASS_Y + 4, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  redraw();
  window.addEventListener('resize', redraw);
  return gc;
}

function drawFlower(ctx, cx, gy, color) {
  const p = 3;
  ctx.fillStyle = FS; ctx.fillRect(cx + p, gy - p*4, p, p*4);
  ctx.fillStyle = color;
  ctx.fillRect(cx + p,   gy - p*7, p, p);
  ctx.fillRect(cx,       gy - p*6, p, p);
  ctx.fillRect(cx + p*2, gy - p*6, p, p);
  ctx.fillRect(cx + p,   gy - p*5, p, p);
  ctx.fillStyle = FW; ctx.fillRect(cx + p, gy - p*6, p, p);
}

// ─── Mole ───
function buildMole(scene, hx) {
  const u = urls();
  const MW = 8 * PX, MH = 7 * PX;

  const clip = document.createElement('div');
  clip.style.cssText = [
    'position:absolute',
    `bottom:${GROUND_H - 2}px`,
    `left:${hx - Math.floor(MW / 2)}px`,
    `width:${MW}px`, `height:${MH + 4}px`,
    'overflow:hidden', 'z-index:4',
  ].join(';');

  const moleEl = document.createElement('div');
  moleEl.style.cssText = [
    'position:absolute', 'bottom:0', 'left:0',
    `width:${MW}px`, `height:${MH}px`,
    `background:url(${u.mole}) 0 0 / 100% 100%`,
    'image-rendering:pixelated',
    'transform:translateY(115%)',
    'transition:transform 0.42s cubic-bezier(0.34,1.45,0.64,1)',
  ].join(';');

  clip.appendChild(moleEl);
  scene.appendChild(clip);

  function pop() {
    moleEl.style.transform = 'translateY(0)';
    setTimeout(() => {
      moleEl.style.transform = 'translateY(115%)';
      setTimeout(pop, 8000 + Math.random() * 12000);
    }, 1800 + Math.random() * 2000);
  }
  setTimeout(pop, 4000 + Math.random() * 9000);
}

// ─── High-five effects (fixed to viewport, not inside scene) ───

function spawnStar(x) {
  const el = document.createElement('div');
  el.textContent = '⭐';
  el.style.cssText = [
    'position:fixed',
    `left:${x - 10}px`,
    `bottom:${GROUND_H + BH + 4}px`,
    'font-size:20px',
    'z-index:9998',
    'animation:starFloat 0.9s ease-out forwards',
    'pointer-events:none',
  ].join(';');
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

function spawnBubble(x, text) {
  const clampedX = Math.min(Math.max(x, 6), window.innerWidth - 150);

  const bubble = document.createElement('div');
  bubble.className = 'bunny-bubble';
  bubble.textContent = text;
  bubble.style.left      = clampedX + 'px';
  bubble.style.bottom    = (GROUND_H + BH + 22) + 'px';
  bubble.style.transform = 'scale(0) rotate(-8deg)';
  bubble.style.opacity   = '1';

  // Pixel-art tail as a canvas image — no anti-aliased triangles
  const tail = document.createElement('div');
  tail.style.cssText = [
    'position:absolute',
    'bottom:-9px', 'left:9px',
    'width:9px', 'height:9px',
    `background:url(${tailURL()}) 0 0 / 100% 100%`,
    'image-rendering:pixelated',
    'image-rendering:crisp-edges',
  ].join(';');
  bubble.appendChild(tail);

  document.body.appendChild(bubble);

  // Double rAF: browser must commit scale(0) before transitioning to scale(1)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bubble.style.transform = 'scale(1) rotate(0deg)';
  }));

  setTimeout(() => {
    bubble.style.opacity   = '0';
    bubble.style.transform = 'scale(0.85) rotate(4deg)';
  }, 2100);
  setTimeout(() => bubble.remove(), 2400);
}

// ─── Bunny ───
function spawnBunny(scene) {
  const u = urls();

  // Balance directions: prefer whichever side has fewer active bunnies
  const rightCount = active.filter(b => b.dir > 0).length;
  const leftCount  = active.filter(b => b.dir < 0).length;
  const dir = rightCount < leftCount ? 1 : leftCount < rightCount ? -1 : (Math.random() > 0.5 ? 1 : -1);

  const b = {
    dir,
    speed:    50 + Math.random() * 40,
    hopMs:    250 + Math.random() * 180,
    pos:         0,
    state:       'hop',
    frame:       0,
    lastT:       null,
    hifiCooldown: 0,   // ms remaining before next high-five allowed
    wrap:        null,
    el:       null,
    hopTimer: null,
    eatTimer: null,
  };

  b.pos = b.dir === 1 ? -BW : window.innerWidth + BW;

  b.wrap = document.createElement('div');
  b.wrap.style.cssText = [
    'position:absolute', `bottom:${GROUND_H}px`, 'z-index:5',
    `left:${b.pos}px`,
  ].join(';');

  b.el = document.createElement('div');
  b.el.style.cssText = [
    `width:${BW}px`, `height:${BH}px`,
    `background:url(${u.sit}) 0 0 / 100% 100%`,
    'image-rendering:pixelated',
    `transform:scaleX(${b.dir > 0 ? 1 : -1})`,
    'transform-origin:center bottom',
    'transition:margin-bottom 80ms ease, transform 260ms cubic-bezier(0.34,1.45,0.64,1), filter 260ms ease',
  ].join(';');

  b.wrap.appendChild(b.el);
  scene.appendChild(b.wrap);
  active.push(b);

  const hopFrames = [u.sit, u.hop];

  b.hopTimer = setInterval(() => {
    if (b.state !== 'hop') return;
    b.frame ^= 1;
    b.el.style.background   = `url(${hopFrames[b.frame]}) 0 0 / 100% 100%`;
    b.el.style.marginBottom = b.frame === 1 ? '10px' : '0';
  }, b.hopMs);

  b.eatTimer = setInterval(() => {
    if (b.state !== 'hop') return;
    if (Math.random() < 0.3) {
      b.state = 'eat';
      b.el.style.background   = `url(${u.eat}) 0 0 / 100% 100%`;
      b.el.style.marginBottom = '0';
      setTimeout(() => {
        if (b.state === 'eat') {
          b.state = 'hop';
          b.el.style.background = `url(${u.sit}) 0 0 / 100% 100%`;
        }
      }, 1600 + Math.random() * 1600);
    }
  }, 3200 + Math.random() * 2000);

  // Staged high-five: squish → spring → hold pose → walk away
  b.doHighFive = () => {
    if (b.state === 'highfive') return;
    b.state = 'highfive';
    b.el.style.marginBottom = '0';

    const D = b.dir; // capture direction at start

    // t=0: anticipation squish (feet stay planted, body compresses)
    b.el.style.transform = `scaleX(${D}) scaleY(0.82)`;
    b.el.style.filter    = 'brightness(1.05)';

    // t=100ms: spring UP and switch to raised-paw frame at peak
    setTimeout(() => {
      b.el.style.transform  = `scaleX(${D}) scaleY(1.25)`;
      b.el.style.filter     = 'brightness(1.4)';
      b.el.style.background = `url(${u.hifi}) 0 0 / 100% 100%`;
    }, 100);

    // t=340ms: settle into relaxed high-five pose (spring curve handles overshoot)
    setTimeout(() => {
      b.el.style.transform = `scaleX(${D}) scaleY(1.1)`;
      b.el.style.filter    = 'brightness(1.15)';
    }, 340);

    // t=1750ms: reverse direction, push clear, reset
    setTimeout(() => {
      if (b.state !== 'highfive') return;
      b.dir = -b.dir;
      b.pos += b.dir * (BW + MIN_GAP + 4);
      b.wrap.style.left     = b.pos + 'px';
      b.hifiCooldown        = HIFI_COOLDOWN;
      b.el.style.transform  = `scaleX(${b.dir}) scaleY(1)`;
      b.el.style.filter     = '';
      b.el.style.background = `url(${u.sit}) 0 0 / 100% 100%`;
      b.state = 'hop';
    }, 1750);
  };

  function tick(ts) {
    if (b.lastT === null) b.lastT = ts;
    const dt = Math.min((ts - b.lastT) / 1000, 0.05);
    b.lastT = ts;

    // Tick down cooldown every frame regardless of state
    if (b.hifiCooldown > 0) b.hifiCooldown -= dt * 1000;

    if (b.state === 'hop') {
      let newPos = b.pos + b.dir * b.speed * dt;

      // Same direction: clamp behind any bunny ahead of us, prevent overlap
      for (const other of active) {
        if (other === b || other.dir !== b.dir) continue;
        if (b.dir > 0) {
          if (other.pos > newPos && newPos + BW + MIN_GAP > other.pos) {
            newPos = other.pos - BW - MIN_GAP;
          }
        } else {
          if (other.pos < newPos && newPos - MIN_GAP < other.pos + BW) {
            newPos = other.pos + BW + MIN_GAP;
          }
        }
      }

      // Opposite direction: high-five on contact (skip if cooldown active)
      let hiTriggered = false;
      for (const other of active) {
        if (other === b || other.dir === b.dir) continue;
        if (b.state === 'highfive' || other.state === 'highfive') continue;
        if (b.hifiCooldown > 0 || other.hifiCooldown > 0) continue;

        const myL = newPos, myR = newPos + BW;
        const oL  = other.pos, oR = other.pos + BW;

        if (myR + HI_DIST >= oL && myL <= oR + HI_DIST) {
          // Snap cleanly to touching point
          b.pos = b.dir > 0 ? oL - BW : oR;
          b.wrap.style.left = b.pos + 'px';

          b.doHighFive();
          other.doHighFive();

          // Shared visual effects — bubble above the left-side bunny
          const midX = (b.pos + other.pos) / 2 + BW / 2;
          const bubX = (b.dir > 0 ? b : other).pos;
          setTimeout(() => spawnBubble(bubX, 'go snippie!'), 260);
          setTimeout(() => spawnStar(midX), 420);

          hiTriggered = true;
          break;
        }
      }

      if (!hiTriggered) {
        b.pos = newPos;
        b.wrap.style.left = b.pos + 'px';
      }
    }

    const done = b.dir > 0
      ? b.pos > window.innerWidth + BW + 20
      : b.pos < -BW - 20;

    if (done) {
      clearInterval(b.hopTimer);
      clearInterval(b.eatTimer);
      b.wrap.remove();
      const idx = active.indexOf(b);
      if (idx >= 0) active.splice(idx, 1);
      setTimeout(() => spawnBunny(scene), 1200 + Math.random() * 4000);
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ─── Butterfly ───
function spawnButterfly() {
  const { f1, f2 } = bfURLs();
  const BFW = BFLY1[0].length * BPX;   // 12px
  const BFH = BFLY1.length    * BPX;   // 10px

  const dir       = Math.random() > 0.5 ? 1 : -1;
  let   x         = dir === 1 ? -BFW - 4 : window.innerWidth + BFW + 4;
  const baseBot   = SCENE_H + 24 + Math.random() * 110;
  const speed     = 28 + Math.random() * 22;
  const amp       = 14 + Math.random() * 18;
  const freq      = 0.9 + Math.random() * 0.7;
  const phase     = Math.random() * Math.PI * 2;

  const el = document.createElement('div');
  el.style.cssText = [
    'position:fixed',
    `left:${x}px`,
    `bottom:${baseBot}px`,
    `width:${BFW}px`,
    `height:${BFH}px`,
    `background:url(${f1}) 0 0 / 100% 100%`,
    'image-rendering:pixelated',
    'image-rendering:crisp-edges',
    `transform:scaleX(${dir})`,
    'transform-origin:center',
    'z-index:52',
    'pointer-events:none',
  ].join(';');
  document.body.appendChild(el);

  const frames = [f1, f2];
  let   frame  = 0;
  let   lastT  = null;

  const wingTimer = setInterval(() => {
    frame ^= 1;
    el.style.background = `url(${frames[frame]}) 0 0 / 100% 100%`;
  }, 130 + Math.random() * 70);

  function tick(ts) {
    if (!lastT) lastT = ts;
    const dt = Math.min((ts - lastT) / 1000, 0.05);
    lastT = ts;

    x += dir * speed * dt;
    const yOff = Math.sin((ts / 1000) * freq * Math.PI * 2 + phase) * amp;
    el.style.left   = x + 'px';
    el.style.bottom = (baseBot + yOff) + 'px';

    if (dir > 0 ? x > window.innerWidth + BFW + 10 : x < -BFW - 10) {
      clearInterval(wingTimer);
      el.remove();
      setTimeout(spawnButterfly, 2500 + Math.random() * 5000);
      return;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ─── Gym bunny (occasional barbell overhead press) ───
function spawnGymBunny(scene) {
  const u     = urls();
  const bellW = BBELL[0].length * PX;   // 39px
  const bellH = BBELL.length    * PX;   // 12px

  const x   = 60 + Math.floor(Math.random() * (window.innerWidth - 120));
  const dir = Math.random() > 0.5 ? 1 : -1;

  const wrap = document.createElement('div');
  wrap.style.cssText = [
    'position:absolute',
    `bottom:${GROUND_H}px`,
    `left:${x}px`,
    'z-index:6',
  ].join(';');

  // Barbell sits centred above the bunny
  const bellLeft = Math.round((BW - bellW) / 2);
  const shoulderY = BH - 2;
  const overheadY = BH + 20;

  const bell = document.createElement('div');
  bell.style.cssText = [
    'position:absolute',
    `width:${bellW}px`,
    `height:${bellH}px`,
    `left:${bellLeft}px`,
    `bottom:${shoulderY}px`,
    `background:url(${bellURL()}) 0 0 / 100% 100%`,
    'image-rendering:pixelated',
    'image-rendering:crisp-edges',
    'transition:bottom 0.52s cubic-bezier(0.4,0,0.2,1)',
  ].join(';');

  const bunny = document.createElement('div');
  bunny.style.cssText = [
    `width:${BW}px`,
    `height:${BH}px`,
    `background:url(${u.sit}) 0 0 / 100% 100%`,
    'image-rendering:pixelated',
    `transform:scaleX(${dir})`,
    'transform-origin:center bottom',
    'transition:transform 260ms cubic-bezier(0.34,1.45,0.64,1)',
  ].join(';');

  wrap.appendChild(bell);
  wrap.appendChild(bunny);
  scene.appendChild(wrap);

  const totalReps = 3 + Math.floor(Math.random() * 4);
  let   repsDone  = 0;
  let   isUp      = false;

  function doRep() {
    isUp = !isUp;
    bell.style.bottom = (isUp ? overheadY : shoulderY) + 'px';

    // Tiny body-lean when pressing up
    bunny.style.transform = isUp
      ? `scaleX(${dir}) scaleY(0.94)`
      : `scaleX(${dir}) scaleY(1)`;

    if (!isUp) {
      repsDone++;
      if (repsDone >= totalReps) {
        setTimeout(() => {
          wrap.remove();
          setTimeout(() => spawnGymBunny(scene), 18000 + Math.random() * 18000);
        }, 1400);
        return;
      }
    }
    setTimeout(doRep, 580 + Math.random() * 180);
  }

  setTimeout(doRep, 900);
}

// ─── Init ───
export function initBunnies() {
  ensureStyles();
  urls();
  bfURLs();
  bellURL();

  const scene = document.createElement('div');
  // No overflow:hidden — the mole has its own clip wrapper
  scene.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0',
    `height:${SCENE_H}px`, 'pointer-events:none', 'z-index:50',
  ].join(';');
  document.body.appendChild(scene);

  const holeX = 90 + Math.floor(Math.random() * (window.innerWidth - 180));
  scene.appendChild(buildGrassCanvas(holeX));
  buildMole(scene, holeX);

  // Walking bunnies
  spawnBunny(scene);
  setTimeout(() => spawnBunny(scene), 3000 + Math.random() * 2000);
  setTimeout(() => spawnBunny(scene), 7500 + Math.random() * 3000);

  // Butterflies
  spawnButterfly();
  setTimeout(spawnButterfly, 2800 + Math.random() * 2000);
  setTimeout(spawnButterfly, 6000 + Math.random() * 3000);

  // Gym bunny (first appearance after a few seconds)
  setTimeout(() => spawnGymBunny(scene), 6000 + Math.random() * 6000);
}
