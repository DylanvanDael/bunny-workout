import { e1rm } from '../logic/scoring.js';

function getValues(history, ex) {
  if (!history || !history.length) return [];
  const last10 = history.slice(0, 10).reverse(); // oldest first for left-to-right plot
  if (ex.fields.includes('time')) {
    return last10.map(e => e.time != null ? e.time : null).filter(v => v != null);
  }
  if (ex.bodyweight && !ex.increment) {
    // pure bodyweight: use reps
    return last10.map(e => e.reps || 0).filter(v => v > 0);
  }
  // weight: use e1rm
  return last10
    .map(e => e1rm(e.weight || 0, e.reps || 0))
    .filter(v => v > 0);
}

export function renderSparkline(history, ex) {
  const values = getValues(history, ex);
  if (values.length < 2) return '';

  const W = 60;
  const H = 24;
  const pad = 2;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // For cardio: lower is better, so invert Y
  const isCardio = ex.fields.includes('time');

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const norm = (v - min) / range; // 0..1, 0=low, 1=high
    const yNorm = isCardio ? norm : (1 - norm); // invert so high value = top
    const y = pad + yNorm * (H - pad * 2);
    return { x, y, v };
  });

  // Build polyline segments with color per direction
  let segs = '';
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    // up = current > previous (for weight: more is better; for cardio: lower time = better)
    const isUp = isCardio ? (cur.v < prev.v) : (cur.v > prev.v);
    const color = isUp ? '#faecb6' : '#f96635';
    segs += `<line x1="${prev.x.toFixed(1)}" y1="${prev.y.toFixed(1)}" x2="${cur.x.toFixed(1)}" y2="${cur.y.toFixed(1)}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
  }

  // Dots
  const dots = points.map(p =>
    `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.5" fill="rgba(255,255,255,0.6)"/>`
  ).join('');

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="overflow:visible">${segs}${dots}</svg>`;
}
