// 8-bit pixel sparkle shapes (1=filled, 0=transparent)
const SHAPES = {
  cross:   [[0,1,0],[1,1,1],[0,1,0]],
  star:    [[1,0,1,0,1],[0,1,1,1,0],[1,1,1,1,1],[0,1,1,1,0],[1,0,1,0,1]],
  diamond: [[0,0,1,0,0],[0,1,1,1,0],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]],
  dot:     [[1,1],[1,1]],
  tiny:    [[1]],
};

function makeSparkleURL(type, color) {
  const grid = SHAPES[type] || SHAPES.cross;
  const rows = grid.length, cols = grid[0].length;
  const c = document.createElement('canvas');
  c.width = cols; c.height = rows;
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++)
      if (grid[y][x]) ctx.fillRect(x, y, 1, 1);
  return c.toDataURL();
}

function injectSplashStyles() {
  const s = document.createElement('style');
  s.id = 'splash-styles';
  s.textContent = `
    @keyframes splashFloat {
      0%   { transform: translateY(0) scale(1);   opacity: 0.55; }
      50%  { transform: translateY(-14px) scale(1.25); opacity: 1; }
      100% { transform: translateY(0) scale(1);   opacity: 0.55; }
    }
    @keyframes splashBlink {
      0%, 48%  { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    @keyframes splashGlitch {
      0%, 91%, 100% { transform: translateX(0); filter: none; }
      92%  { transform: translateX(-3px); filter: hue-rotate(30deg); }
      93%  { transform: translateX(3px);  filter: hue-rotate(-30deg); }
      94%  { transform: translateX(-2px); filter: none; }
      95%  { transform: translateX(0); }
    }
    @keyframes splashFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes splashScanScroll {
      from { background-position: 0 0; }
      to   { background-position: 0 4px; }
    }
  `;
  document.head.appendChild(s);
  return s;
}

export function showSplash() {
  return new Promise(resolve => {
    const styleEl = injectSplashStyles();

    // ── Root overlay ──
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 999999;
      background: #0d0020;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      font-family: 'Press Start 2P', 'Courier New', monospace;
      color: #ff88cc;
      overflow: hidden;
      cursor: pointer;
      text-transform: none;
    `;

    // ── CRT scanlines ──
    const scanlines = document.createElement('div');
    scanlines.style.cssText = `
      position: absolute; inset: 0; pointer-events: none; z-index: 2;
      background: repeating-linear-gradient(
        0deg,
        transparent, transparent 2px,
        rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 4px
      );
    `;
    overlay.appendChild(scanlines);

    // ── Pixel sprinkles ──
    const COLORS = ['#ffee55','#ff88cc','#aa55ff','#55ffcc','#ff5577','#ffffff','#ff9944'];
    const TYPES  = ['star','cross','diamond','dot','tiny','cross','star'];
    const SCALES = [2,3,4,5,3,4,2];
    for (let i = 0; i < 42; i++) {
      const color = COLORS[i % COLORS.length];
      const type  = TYPES [i % TYPES.length];
      const scale = SCALES[i % SCALES.length];
      const grid  = SHAPES[type];
      const url   = makeSparkleURL(type, color);
      const pw    = grid[0].length * scale;
      const ph    = grid.length    * scale;
      const el    = document.createElement('div');
      const delay = (Math.random() * 3.5).toFixed(2);
      const dur   = (1.4 + Math.random() * 2.2).toFixed(2);
      el.style.cssText = `
        position: absolute;
        left: ${(Math.random() * 93).toFixed(1)}%;
        top:  ${(Math.random() * 87).toFixed(1)}%;
        width: ${pw}px; height: ${ph}px;
        background: url(${url}) 0 0 / 100% 100%;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        animation: splashFloat ${dur}s ${delay}s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
      `;
      overlay.appendChild(el);
    }

    // ── Content ──
    const content = document.createElement('div');
    content.style.cssText = `
      position: relative; z-index: 5;
      text-align: center;
      padding: 0 20px;
      max-width: 400px;
      width: 100%;
    `;
    overlay.appendChild(content);

    // ── NES double-border title box ──
    const titleBox = document.createElement('div');
    titleBox.style.cssText = `
      border: 3px solid #ffee55;
      box-shadow: 0 0 0 5px #0d0020, 0 0 0 8px #ffee55, 5px 5px 0 8px rgba(0,0,0,0.6);
      padding: 18px 14px 16px;
      margin-bottom: 22px;
      animation: splashGlitch 9s 3s infinite;
    `;

    const line1 = mkLine('10px', '#ffee55', 'text-shadow:2px 2px 0 #5a3300;letter-spacing:1.5px;margin-bottom:10px;');
    const line2 = mkLine('12px', '#ff44aa', 'text-shadow:2px 2px 0 #7a0055;letter-spacing:2px;margin-bottom:6px;');
    const line3 = mkLine('10px', '#bb88ff', 'text-shadow:2px 2px 0 #3d0066;letter-spacing:1.5px;');
    titleBox.append(line1, line2, line3);
    content.appendChild(titleBox);

    // ── Pixel divider ──
    const divider = document.createElement('div');
    divider.textContent = '══════════════';
    divider.style.cssText = `
      font-size: 8px; color: #ff44aa; letter-spacing: 2px;
      margin-bottom: 18px; opacity: 0.7;
      font-family: 'Courier New', monospace;
    `;
    content.appendChild(divider);

    // ── Subtitle lines ──
    const sub1 = mkLine('7px', '#ffffff', 'letter-spacing:1px;margin-bottom:8px;line-height:1.8;');
    const sub2 = mkLine('8px', '#ff88cc', 'letter-spacing:1px;margin-bottom:28px;line-height:1.8;text-shadow:2px 2px 0 rgba(0,0,0,0.6);');
    content.append(sub1, sub2);

    // ── Blink prompt ──
    const prompt = document.createElement('div');
    prompt.textContent = '[ tap to proceed ]';
    prompt.style.cssText = `
      font-size: 6px; color: #55ffcc; letter-spacing: 2px;
      animation: splashBlink 1s step-end infinite;
    `;
    content.appendChild(prompt);

    document.body.appendChild(overlay);

    // ── Typewriter helper ──
    function typeText(el, text, startDelay, charMs = 55) {
      return new Promise(r => {
        setTimeout(() => {
          let i = 0;
          const iv = setInterval(() => {
            el.textContent = text.slice(0, ++i);
            if (i >= text.length) { clearInterval(iv); r(); }
          }, charMs);
        }, startDelay);
      });
    }

    // ── Sequence ──
    (async () => {
      await typeText(line1, 'THE SNIPPIE BUNNY', 350, 52);
      await typeText(line2, 'TRACKER 3000',      150, 68);
      await typeText(line3, '~ LOADING ~',        180, 48);
      await new Promise(r => setTimeout(r, 350));
      line3.textContent = '';
      await typeText(line3, 'EST. SNIPPIEVILLE',  80, 46);
      await typeText(sub1,  'FOR CERTIFIED',      300, 52);
      await typeText(sub2,  'PREMIUM BOOTY.',     200, 62);
    })();

    // ── Dismiss ──
    const dismiss = () => {
      overlay.style.transition = 'opacity 0.45s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        styleEl.remove();
        resolve();
      }, 450);
    };

    overlay.addEventListener('click', dismiss);
  });
}

function mkLine(size, color, extra = '') {
  const el = document.createElement('div');
  el.style.cssText = `font-size:${size};color:${color};min-height:1em;line-height:1.7;${extra}`;
  return el;
}
