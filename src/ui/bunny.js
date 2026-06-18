// ─── Pixel scale ───
const PX = 3;

// ─── Palette ───
const _ = null;
const W  = '#ffffff';
const EY = '#ff6b9d';   // eye pink
const NS = '#ffb6c1';   // nose
const EI = '#ffddf0';   // ear inner
const G0 = '#1e3d09';   // ground dark
const G1 = '#3d6b1f';   // grass base
const G2 = '#52921a';   // grass mid
const G3 = '#72c21e';   // grass tip bright
const FR = '#ff4455';   // flower red
const FP = '#ff88cc';   // flower pink
const FY = '#ffdd00';   // flower yellow
const FW = '#ffffff';   // flower center
const FS = '#3a6b1a';   // flower stem
const MB = '#7d4e10';   // mole brown
const ML = '#c4955a';   // mole light
const MD = '#111111';   // mole dark (eyes/claws)
const MN = '#cc5555';   // mole nose

// ─── Pixel art grids ───

// 10 × 12  bunny sitting upright
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

// 10 × 12  bunny mid-hop, ears swept back
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

// 10 × 12  bunny eating (head lowered)
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

// 8 × 7  mole
const BMOLE = [
  [_,MB,MB,MB,MB,MB,_,_],
  [MB,ML,ML,ML,ML,ML,MB,_],
  [MB,ML,MD,ML,MD,ML,MB,_],
  [MB,ML,ML,MN,ML,ML,MB,_],
  [MB,ML,ML,ML,ML,ML,MB,_],
  [MB,MD,MB,MB,MB,MD,MB,_],
  [_,MD,_,_,_,MD,_,_],
];

// ─── Render a pixel grid to a data URL ───
function toDataURL(grid) {
  const cols = grid[0].length;
  const rows = grid.length;
  const c = document.createElement('canvas');
  c.width  = cols * PX;
  c.height = rows * PX;
  const ctx = c.getContext('2d');
  grid.forEach((row, y) =>
    row.forEach((color, x) => {
      if (color) { ctx.fillStyle = color; ctx.fillRect(x*PX, y*PX, PX, PX); }
    })
  );
  return c.toDataURL();
}

// ─── Pre-rendered URLs (lazy) ───
let URLS = null;
function urls() {
  if (!URLS) URLS = {
    sit:  toDataURL(BSIT),
    hop:  toDataURL(BHOP),
    eat:  toDataURL(BEAT),
    mole: toDataURL(BMOLE),
  };
  return URLS;
}

// ─── Scene constants ───
const SCENE_H  = 76;
const GROUND_H = 18;
const GRASS_Y  = SCENE_H - GROUND_H;
const BW = 10 * PX;
const BH = 12 * PX;

// ─── Grass canvas ───
function buildGrassCanvas(holeX) {
  const gc = document.createElement('canvas');
  gc.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;height:100%;display:block';

  function redraw() {
    gc.width  = window.innerWidth;
    gc.height = SCENE_H;
    const ctx = gc.getContext('2d');
    const W   = gc.width;

    // Ground
    ctx.fillStyle = G0;
    ctx.fillRect(0, GRASS_Y, W, GROUND_H);

    // Grass blades (3 px wide columns, deterministic heights)
    for (let x = 0; x < W; x += 3) {
      const s = Math.sin(x * 7.3 + 1.2);
      const h = 7 + Math.floor((s * 0.5 + 0.5) * 8);
      ctx.fillStyle = G1; ctx.fillRect(x, GRASS_Y - h, 3, h);
      ctx.fillStyle = G2; ctx.fillRect(x, GRASS_Y - h, 3, Math.ceil(h * 0.55));
      ctx.fillStyle = G3; ctx.fillRect(x, GRASS_Y - h, 3, 3);
    }

    // Flowers
    const fc = [FR, FP, FY];
    for (let i = 0; ; i++) {
      const fx = 20 + i * 68 + Math.round(Math.sin(i * 4.1) * 20);
      if (fx > W - 12) break;
      drawFlower(ctx, fx, GRASS_Y, fc[i % 3]);
    }

    // Mole hole — dark oval at ground surface
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
  // stem
  ctx.fillStyle = FS;
  ctx.fillRect(cx + p, gy - p * 4, p, p * 4);
  // petals
  ctx.fillStyle = color;
  ctx.fillRect(cx + p,     gy - p * 7, p, p); // top
  ctx.fillRect(cx,         gy - p * 6, p, p); // left
  ctx.fillRect(cx + p * 2, gy - p * 6, p, p); // right
  ctx.fillRect(cx + p,     gy - p * 5, p, p); // bottom
  // center
  ctx.fillStyle = FW;
  ctx.fillRect(cx + p, gy - p * 6, p, p);
}

// ─── Mole ───
function buildMole(scene, hx) {
  const u = urls();
  const MW = 8 * PX;
  const MH = 7 * PX;

  // Clip container: only shows area above ground
  const clip = document.createElement('div');
  clip.style.cssText = [
    'position:absolute',
    `bottom:${GROUND_H - 2}px`,
    `left:${hx - Math.floor(MW / 2)}px`,
    `width:${MW}px`,
    `height:${MH + 4}px`,
    'overflow:hidden',
    'z-index:4',
  ].join(';');

  const moleEl = document.createElement('div');
  moleEl.style.cssText = [
    'position:absolute',
    'bottom:0', 'left:0',
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
    const peekTime = 1800 + Math.random() * 2000;
    setTimeout(() => {
      moleEl.style.transform = 'translateY(115%)';
      setTimeout(pop, 8000 + Math.random() * 12000);
    }, peekTime);
  }
  setTimeout(pop, 4000 + Math.random() * 9000);
}

// ─── Bunny ───
function spawnBunny(scene) {
  const u       = urls();
  const goRight = Math.random() > 0.5;
  const speed   = 50 + Math.random() * 40; // px/s
  const hopMs   = 250 + Math.random() * 180;

  const wrap = document.createElement('div');
  wrap.style.cssText = [
    'position:absolute',
    `bottom:${GROUND_H}px`,
    'z-index:5',
    `left:${goRight ? -BW : window.innerWidth + BW}px`,
  ].join(';');

  const el = document.createElement('div');
  el.style.cssText = [
    `width:${BW}px`, `height:${BH}px`,
    `background:url(${u.sit}) 0 0 / 100% 100%`,
    'image-rendering:pixelated',
    `transform:scaleX(${goRight ? 1 : -1})`,
    'transform-origin:center',
    'transition:margin-bottom 80ms ease',
  ].join(';');

  wrap.appendChild(el);
  scene.appendChild(wrap);

  let pos     = goRight ? -BW : window.innerWidth + BW;
  let frame   = 0;
  let eating  = false;
  let lastT   = null;

  const hopFrames = [u.sit, u.hop];

  // Alternate sit/hop frames
  const hopTimer = setInterval(() => {
    if (eating) return;
    frame ^= 1;
    el.style.background = `url(${hopFrames[frame]}) 0 0 / 100% 100%`;
    el.style.marginBottom = frame === 1 ? '10px' : '0';
  }, hopMs);

  // Occasionally eat (stop and dip head)
  const eatTimer = setInterval(() => {
    if (Math.random() < 0.3) {
      eating = true;
      el.style.background    = `url(${u.eat}) 0 0 / 100% 100%`;
      el.style.marginBottom  = '0';
      setTimeout(() => {
        eating = false;
        el.style.background = `url(${u.sit}) 0 0 / 100% 100%`;
      }, 1600 + Math.random() * 1600);
    }
  }, 3200 + Math.random() * 2000);

  function tick(ts) {
    if (!lastT) lastT = ts;
    const dt = (ts - lastT) / 1000;
    lastT = ts;

    if (!eating) {
      pos += goRight ? speed * dt : -(speed * dt);
      wrap.style.left = pos + 'px';
    }

    const done = goRight ? pos > window.innerWidth + BW + 10 : pos < -BW - 10;
    if (done) {
      clearInterval(hopTimer);
      clearInterval(eatTimer);
      wrap.remove();
      setTimeout(() => spawnBunny(scene), 1200 + Math.random() * 4000);
      return;
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ─── Init ───
export function initBunnies() {
  urls(); // warm up canvas rendering

  const scene = document.createElement('div');
  scene.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0',
    `height:${SCENE_H}px`, 'pointer-events:none', 'z-index:50', 'overflow:hidden',
  ].join(';');
  document.body.appendChild(scene);

  // Pick mole position, then draw grass with hole
  const holeX = 90 + Math.floor(Math.random() * (window.innerWidth - 180));
  scene.appendChild(buildGrassCanvas(holeX));
  buildMole(scene, holeX);

  spawnBunny(scene);
  setTimeout(() => spawnBunny(scene), 3000 + Math.random() * 2000);
  setTimeout(() => spawnBunny(scene), 7500 + Math.random() * 3000);
}
