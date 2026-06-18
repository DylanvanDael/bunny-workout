import { escapeHtml, formatDate } from '../logic/format.js';
import { e1rm, bestScore, entryScore } from '../logic/scoring.js';
import { getHistory } from '../storage.js';
import { getAllExercises } from '../schema.js';

function isToday(ts) {
  const d = new Date(ts);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function sameDay(ts, date) {
  const d = new Date(ts);
  return d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate();
}

function renderWeekGrid(schema) {
  const today = new Date();
  // Show last 7 days: today and 6 days back
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  // Get all exercise ids
  const allEx = getAllExercises(schema);
  // Check each day
  const dayLabels = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];

  let html = '<div class="week-grid">';
  for (const d of days) {
    let trained = false;
    for (const ex of allEx) {
      const history = getHistory(ex.id);
      if (history.some(e => sameDay(e.timestamp, d))) {
        trained = true;
        break;
      }
    }
    const todayClass = isToday(d.getTime()) ? ' today' : '';
    const trainedClass = trained ? ' trained' : '';
    const dayNum = d.getDate();
    html += `
      <div class="week-day-cell">
        <span class="week-day-label">${dayLabels[d.getDay()]}</span>
        <div class="week-day-dot${trainedClass}${todayClass}">${dayNum}</div>
      </div>`;
  }
  html += '</div>';
  return html;
}

function renderStatCards(history, ex) {
  if (!history.length) return '';

  let cards = '';

  if (ex.fields.includes('time')) {
    // Cardio
    const times = history.map(e => e.time).filter(t => t != null && t > 0);
    const bestTime = times.length ? Math.min(...times) : null;
    const lastTime = history[0]?.time ?? null;
    const sessCount = history.length;

    cards = `
      <div class="stat-card">
        <span class="stat-card-val">${bestTime != null ? bestTime + 's' : '-'}</span>
        <span class="stat-card-label">beste tijd</span>
      </div>
      <div class="stat-card">
        <span class="stat-card-val">${lastTime != null ? lastTime + 's' : '-'}</span>
        <span class="stat-card-label">laatste tijd</span>
      </div>
      <div class="stat-card">
        <span class="stat-card-val">${sessCount}</span>
        <span class="stat-card-label">sessies</span>
      </div>`;
  } else if (ex.bodyweight && (!history[0]?.weight || history[0]?.weight === 0)) {
    // Pure bodyweight
    const bestReps = Math.max(...history.map(e => e.reps || 0));
    const lastReps = history[0]?.reps ?? 0;
    const lastVol = (history[0]?.sets || 0) * (history[0]?.reps || 0);

    cards = `
      <div class="stat-card">
        <span class="stat-card-val">${bestReps}</span>
        <span class="stat-card-label">meeste reps</span>
      </div>
      <div class="stat-card">
        <span class="stat-card-val">${lastReps}</span>
        <span class="stat-card-label">laatste reps</span>
      </div>
      <div class="stat-card">
        <span class="stat-card-val">${lastVol}</span>
        <span class="stat-card-label">laatste volume</span>
      </div>`;
  } else {
    // Weight exercise
    const best1rm = Math.max(...history.map(e => e1rm(e.weight || 0, e.reps || 0)).filter(v => v > 0));
    const maxWeight = Math.max(...history.map(e => e.weight || 0).filter(v => v > 0));
    const last = history[0];
    const lastVol = last ? (last.sets || 0) * (last.reps || 0) * (last.weight || 0) : 0;

    cards = `
      <div class="stat-card">
        <span class="stat-card-val">${best1rm > 0 ? best1rm.toFixed(1) + 'kg' : '-'}</span>
        <span class="stat-card-label">geschat 1rm</span>
      </div>
      <div class="stat-card">
        <span class="stat-card-val">${maxWeight > 0 ? maxWeight + 'kg' : '-'}</span>
        <span class="stat-card-label">max gewicht</span>
      </div>
      <div class="stat-card">
        <span class="stat-card-val">${lastVol > 0 ? lastVol + 'kg' : '-'}</span>
        <span class="stat-card-label">laatste volume</span>
      </div>`;
  }

  return `<div class="stat-cards">${cards}</div>`;
}

function renderLineChart(history, ex) {
  if (history.length < 2) {
    return `<div class="stats-chart-wrap"><div class="chart-no-data">minimaal 2 sessies nodig voor grafiek</div></div>`;
  }

  // Get data points (oldest first)
  const points = history.slice(0, 20).reverse();
  let values;
  let label;

  if (ex.fields.includes('time')) {
    values = points.map(e => e.time ?? 0);
    label = 'tijd (sec)';
  } else if (ex.bodyweight && (!history[0]?.weight || history[0]?.weight === 0)) {
    values = points.map(e => e.reps || 0);
    label = 'reps';
  } else {
    values = points.map(e => e1rm(e.weight || 0, e.reps || 0));
    label = 'geschat 1rm (kg)';
  }

  const dates = points.map(e => formatDate(e.timestamp));

  const W = 320;
  const H = 120;
  const padL = 40;
  const padR = 12;
  const padT = 16;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal || 1;

  const toX = (i) => padL + (i / (values.length - 1)) * plotW;
  const toY = (v) => padT + (1 - (v - minVal) / valRange) * plotH;

  // For cardio, lower = better; invert y
  const toYCardio = (v) => padT + ((v - minVal) / valRange) * plotH;
  const yFn = ex.fields.includes('time') ? toYCardio : toY;

  const ptCoords = values.map((v, i) => ({ x: toX(i), y: yFn(v), v, date: dates[i] }));

  // Area path
  const linePoints = ptCoords.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `M${ptCoords[0].x.toFixed(1)},${(padT + plotH).toFixed(1)} ` +
    ptCoords.map(p => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
    ` L${ptCoords[ptCoords.length - 1].x.toFixed(1)},${(padT + plotH).toFixed(1)} Z`;

  // Y axis labels
  const yLabels = [
    { v: minVal, y: yFn(minVal) },
    { v: maxVal, y: yFn(maxVal) },
  ];

  const yLabelHtml = yLabels.map(l =>
    `<text x="${(padL - 4).toFixed(0)}" y="${l.y.toFixed(1)}" font-size="9" fill="rgba(255,255,255,0.5)" text-anchor="end" dominant-baseline="middle">${l.v.toFixed(0)}</text>`
  ).join('');

  // X axis labels (first and last)
  const xLabels = [
    `<text x="${ptCoords[0].x.toFixed(1)}" y="${(padT + plotH + 14).toFixed(1)}" font-size="9" fill="rgba(255,255,255,0.5)" text-anchor="start">${dates[0]}</text>`,
    `<text x="${ptCoords[ptCoords.length - 1].x.toFixed(1)}" y="${(padT + plotH + 14).toFixed(1)}" font-size="9" fill="rgba(255,255,255,0.5)" text-anchor="end">${dates[dates.length - 1]}</text>`,
  ].join('');

  const dots = ptCoords.map(p =>
    `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="rgba(255,255,255,0.8)"/>`
  ).join('');

  const svg = `<svg class="stats-chart-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,0.25)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0.02)"/>
      </linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#chartGrad)"/>
    <polyline points="${linePoints}" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
    ${yLabelHtml}
    ${xLabels}
  </svg>`;

  return `<div class="stats-chart-wrap">
    <div class="stats-chart-title">${escapeHtml(label)}</div>
    ${svg}
  </div>`;
}

function renderLastWorkoutVolume(schema) {
  const allEx = getAllExercises(schema).filter(ex => !ex.fields.includes('time'));

  // Find the most recent training day
  let lastKey = null;
  for (const ex of allEx) {
    for (const entry of getHistory(ex.id)) {
      const d = new Date(entry.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (!lastKey || key > lastKey) lastKey = key;
    }
  }
  if (!lastKey) return '';

  const [y, m, d] = lastKey.split('-').map(Number);
  const lastDate = new Date(y, m, d);

  let totalKg = 0;
  for (const ex of allEx) {
    for (const entry of getHistory(ex.id)) {
      const ed = new Date(entry.timestamp);
      if (ed.getFullYear() === lastDate.getFullYear() &&
          ed.getMonth() === lastDate.getMonth() &&
          ed.getDate() === lastDate.getDate()) {
        if (entry.sets && entry.reps && entry.weight) {
          totalKg += entry.sets * entry.reps * entry.weight;
        }
      }
    }
  }

  if (!totalKg) return '';

  const formatted = totalKg.toLocaleString('nl-NL') + ' kg';
  const dateLabel = escapeHtml(formatDate(lastDate.getTime()));

  return `<div class="stat-cards" style="margin-bottom:24px">
    <div class="stat-card" style="grid-column:1/-1">
      <span class="stat-card-val" style="font-size:28px">${formatted}</span>
      <span class="stat-card-label">totaal bewogen · ${dateLabel}</span>
    </div>
  </div>`;
}

export function renderStats(schema) {
  const allEx = getAllExercises(schema);
  const exWithHistory = allEx.filter(ex => getHistory(ex.id).length > 0);

  const weekGridHtml = renderWeekGrid(schema);

  const selectOptions = exWithHistory.length
    ? `<option value="">kies een oefening...</option>` +
      exWithHistory.map(ex =>
        `<option value="${escapeHtml(ex.id)}">${escapeHtml(ex.name)}</option>`
      ).join('')
    : `<option value="">geen data beschikbaar</option>`;

  const volumeChartHtml = renderLastWorkoutVolume(schema);

  return `
    <div class="stats-section">
      <div class="stats-section-title">deze week</div>
      ${weekGridHtml}
      ${volumeChartHtml}
      <div class="stats-section-title">statistieken</div>
      <div class="stats-select-wrap">
        <select class="stats-select" id="statsExSelect">
          ${selectOptions}
        </select>
      </div>
      <div id="statsDetail"></div>
    </div>
  `;
}

export function initStatsEvents(container, schema) {
  const sel = container.querySelector('#statsExSelect');
  if (!sel) return;

  const allEx = getAllExercises(schema);

  sel.addEventListener('change', () => {
    const exId = sel.value;
    const detail = container.querySelector('#statsDetail');
    if (!detail) return;

    if (!exId) {
      detail.innerHTML = '';
      return;
    }

    const ex = allEx.find(e => e.id === exId);
    if (!ex) return;

    const history = getHistory(exId);
    if (!history.length) {
      detail.innerHTML = '<div class="chart-no-data">nog geen data</div>';
      return;
    }

    detail.innerHTML = renderStatCards(history, ex) + renderLineChart(history, ex);
  });
}
