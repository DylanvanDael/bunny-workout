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

// ─── Render pixel grid → data URL ───
function toDataURL(grid) {
  const cols = grid[0].length, rows = grid.length;
  const c = document.createElement('canvas');
  c.width = cols * PX; c.height = rows * PX;
  const ctx = c.getContext('2d');
  grid.forEach((row, y) =>
    row.forEach((color, x) => {
      if (color) { ctx.fillStyle = color; ctx.fillRect(x*PX, y*PX, PX, PX); }
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

// ─── Inject shared CSS once (bubble tail uses ::before/::after) ───
function ensureStyles() {
  if (document.getElementById('__bunny_ui_styles')) return;
  const s = document.createElement('style');
  s.id = '__bunny_ui_styles';
  s.textContent = `
    .bunny-bubble {
      position: fixed;
      background: #fff0f6;
      color: #c2185b;
      border: 2px solid #f48fb1;
      border-radius: 10px;
      padding: 5px 10px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
      pointer-events: none;
      z-index: 9999;
      text-transform: lowercase;
      transform-origin: bottom left;
      transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1), opacity 250ms ease;
    }
    .bunny-bubble::after {
      content: '';
      position: absolute;
      bottom: -9px;
      left: 14px;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 9px solid #f48fb1;
    }
    .bunny-bubble::before {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 16px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid #fff0f6;
      z-index: 1;
    }
  `;
  document.head.appendChild(s);
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
  const clampedX = Math.min(Math.max(x, 6), window.innerWidth - 130);

  const bubble = document.createElement('div');
  bubble.className = 'bunny-bubble';
  bubble.textContent = text;
  bubble.style.left   = clampedX + 'px';
  bubble.style.bottom = (GROUND_H + BH + 18) + 'px';
  bubble.style.transform = 'scale(0) rotate(-6deg)';
  bubble.style.opacity   = '1';

  document.body.appendChild(bubble);

  // Double rAF guarantees the browser paints scale(0) before we transition to scale(1)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bubble.style.transform = 'scale(1) rotate(0deg)';
  }));

  setTimeout(() => {
    bubble.style.opacity   = '0';
    bubble.style.transform = 'scale(0.88) rotate(3deg)';
  }, 2000);
  setTimeout(() => bubble.remove(), 2300);
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

  // Staged high-five animation for this bunny
  b.doHighFive = () => {
    if (b.state === 'highfive') return;
    b.state = 'highfive';
    b.el.style.marginBottom = '0';

    // t=0: scale-up bounce
    b.el.style.transform = `scaleX(${b.dir > 0 ? 1.15 : -1.15}) scaleY(1.15)`;
    b.el.style.filter    = 'brightness(1.25)';

    // t=180ms: raise paw
    setTimeout(() => {
      b.el.style.background = `url(${u.hifi}) 0 0 / 100% 100%`;
      b.el.style.transform  = `scaleX(${b.dir > 0 ? 1 : -1}) scale(1.18)`;
    }, 180);

    // t=1700ms: reverse, push apart so they don't immediately re-collide, set cooldown
    setTimeout(() => {
      if (b.state !== 'highfive') return;
      b.dir = -b.dir;
      // Move away from the meeting point before resuming so collision zone is clear
      b.pos += b.dir * (BW + MIN_GAP + 4);
      b.wrap.style.left  = b.pos + 'px';
      b.hifiCooldown     = HIFI_COOLDOWN;
      b.el.style.transform  = `scaleX(${b.dir > 0 ? 1 : -1}) scale(1)`;
      b.el.style.filter     = '';
      b.el.style.background = `url(${u.sit}) 0 0 / 100% 100%`;
      b.state = 'hop';
    }, 1700);
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

// ─── Init ───
export function initBunnies() {
  ensureStyles();
  urls();

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

  spawnBunny(scene);
  setTimeout(() => spawnBunny(scene), 3000 + Math.random() * 2000);
  setTimeout(() => spawnBunny(scene), 7500 + Math.random() * 3000);
}
