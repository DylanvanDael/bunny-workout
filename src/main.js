import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sheet.css';
import './styles/stats.css';
import './styles/timer.css';
import './styles/bunny.css';

import { sGet, sSet, KEYS, getHistory, saveHistory, loadFromDB } from './storage.js';
import { loadSchema, getSchema, saveSchema, getAllExercises, newExerciseId } from './schema.js';
import { seedIfNeeded } from './seed.js';
import { renderTabs, updateTabIndicator } from './ui/tabs.js';
import { renderDay } from './ui/day.js';
import { renderStats, initStatsEvents } from './ui/stats.js';
import { showToast, vibrate } from './ui/toast.js';
import { startTimer } from './ui/timer.js';
import { showExerciseSheet, showDaySheet } from './ui/sheet.js';
import { showModal } from './ui/modal.js';
import { initDragReorder } from './ui/dragReorder.js';
import { fieldStep } from './logic/format.js';
import { bestScore, entryScore } from './logic/scoring.js';
import { formatPlates } from './logic/plates.js';
import { initBunnies } from './ui/bunny.js';
import { showSplash } from './ui/splash.js';

// ===== APP STATE =====
let activeTab = 0;
let openExId = null;
let historyOpenId = null;

// ===== EXPOSE GLOBALS FOR CROSS-MODULE USE =====
window._app = {
  getSchema,
  saveSchema,
  newExerciseId,
  render,
  activeTab: 0,
};

// ===== HELPERS =====
function isToday(ts) {
  if (!ts) return false;
  const d = new Date(ts);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function calcStreak(schema) {
  const allEx = getAllExercises(schema);
  const uniqueDays = new Set();
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    for (const ex of allEx) {
      const history = getHistory(ex.id);
      for (const entry of history) {
        const ed = new Date(entry.timestamp);
        const ek = `${ed.getFullYear()}-${ed.getMonth()}-${ed.getDate()}`;
        if (ek === key) {
          uniqueDays.add(key);
          break;
        }
      }
    }
  }
  return uniqueDays.size;
}

// ===== RENDER =====
function render() {
  const schema = getSchema();
  window._app.activeTab = activeTab;

  // Update streak badge
  const streakEl = document.getElementById('streakCount');
  if (streakEl) streakEl.textContent = calcStreak(schema);

  // Render tabs
  renderTabs(schema, activeTab, (i) => {
    activeTab = i;
    openExId = null;
    historyOpenId = null;
    render();
  });

  // Render main content
  const main = document.getElementById('mainContent');
  if (!main) return;

  if (activeTab === schema.length) {
    // Stats tab
    main.innerHTML = renderStats(schema);
    initStatsEvents(main, schema);
  } else if (activeTab < schema.length) {
    main.innerHTML = renderDay(schema, activeTab, openExId, historyOpenId);
    initDayEvents(main, schema, activeTab);
  }
}

// ===== DAY EVENTS =====
function initDayEvents(container, schema, dayIndex) {
  // Gear button -> edit day
  container.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="edit-day"]')) {
      const day = schema[dayIndex];
      showDaySheet({
        day,
        dayIndex,
        schema,
        onSave: (changes, idx) => {
          const newSchema = schema.map((d, i) =>
            i === idx ? { ...d, ...changes } : d
          );
          saveSchema(newSchema);
          render();
          showToast('dag bijgewerkt');
        },
        onDelete: (idx) => {
          const newSchema = schema.filter((_, i) => i !== idx);
          saveSchema(newSchema);
          activeTab = Math.min(activeTab, newSchema.length - 1);
          openExId = null;
          historyOpenId = null;
          render();
          showToast('dag verwijderd');
        },
      });
      return;
    }

    if (e.target.closest('[data-action="add-exercise"]')) {
      showExerciseSheet({
        ex: null,
        dayIndex,
        schema,
        onSave: (newEx, targetDayIdx) => {
          const newSchema = schema.map((d, i) => {
            if (i === targetDayIdx) {
              return { ...d, exercises: [...d.exercises, newEx] };
            }
            return d;
          });
          saveSchema(newSchema);
          render();
          showToast('oefening toegevoegd');
        },
        onDelete: () => {},
      });
      return;
    }

    if (e.target.closest('[data-action="delete-day"]')) {
      showModal({
        title: 'dag verwijderen',
        message: `dag "${schema[dayIndex].title}" verwijderen?`,
        hasHistory: false,
        onDelete: () => {
          const newSchema = schema.filter((_, i) => i !== dayIndex);
          saveSchema(newSchema);
          activeTab = Math.min(activeTab, newSchema.length - 1);
          openExId = null;
          historyOpenId = null;
          render();
          showToast('dag verwijderd');
        },
        onCancel: () => {},
      });
      return;
    }
  });

  // Exercise list events
  const exerciseList = container.querySelector('.exercise-list');
  if (!exerciseList) return;

  exerciseList.addEventListener('click', (e) => {
    handleExerciseClick(e, schema, dayIndex);
  });

  // Live plate calculator update on weight input
  exerciseList.addEventListener('input', (e) => {
    const input = e.target.closest('.field-input[data-field="weight"]');
    if (!input) return;
    const card = input.closest('.exercise-card');
    if (!card) return;
    const hint = card.querySelector('[data-plate-hint]');
    if (!hint) return;
    const val = parseFloat(input.value);
    hint.textContent = (!isNaN(val) && val > 20) ? (formatPlates(val) || '') : '';
  });

  // Drag to reorder
  initDragReorder(exerciseList, dayIndex, (newOrder) => {
    const currentEx = schema[dayIndex].exercises;
    const reordered = newOrder.map(id => currentEx.find(ex => ex.id === id)).filter(Boolean);
    if (JSON.stringify(reordered.map(e => e.id)) === JSON.stringify(currentEx.map(e => e.id))) return;
    const newSchema = schema.map((d, i) =>
      i === dayIndex ? { ...d, exercises: reordered } : d
    );
    saveSchema(newSchema);
    render();
    showToast('volgorde aangepast');
  });
}

// ===== EXERCISE CLICK HANDLER =====
function handleExerciseClick(e, schema, dayIndex) {
  const card = e.target.closest('.exercise-card');
  if (!card) return;
  const exId = card.dataset.id;
  const ex = schema[dayIndex]?.exercises.find(ex => ex.id === exId);
  if (!ex) return;

  // Steppers
  const stepBtn = e.target.closest('[data-action="step-up"], [data-action="step-down"]');
  if (stepBtn) {
    e.stopPropagation();
    const field = stepBtn.dataset.field;
    const step = parseFloat(stepBtn.dataset.step) || 1;
    const input = card.querySelector(`.field-input[data-field="${field}"]`);
    if (!input) return;
    let val = parseFloat(input.value) || 0;
    if (stepBtn.dataset.action === 'step-up') val += step;
    else val = Math.max(0, val - step);
    val = Math.round(val * 100) / 100;
    input.value = val;
    if (field === 'weight') {
      const hint = card.querySelector('[data-plate-hint]');
      if (hint) hint.textContent = val > 20 ? (formatPlates(val) || '') : '';
    }
    return;
  }

  // Quick-log (repeat last entry from header button)
  if (e.target.closest('[data-action="quick-log"]')) {
    e.stopPropagation();
    handleQuickLog(ex);
    return;
  }

  // Log button
  if (e.target.closest('[data-action="log"]')) {
    e.stopPropagation();
    handleLog(card, ex, dayIndex);
    return;
  }

  // Toggle history
  if (e.target.closest('[data-action="toggle-history"]')) {
    e.stopPropagation();
    historyOpenId = historyOpenId === exId ? null : exId;
    render();
    return;
  }

  // Edit exercise
  if (e.target.closest('[data-action="edit"]')) {
    e.stopPropagation();
    showExerciseSheet({
      ex,
      dayIndex,
      schema,
      onSave: (updatedEx, targetDayIdx, sourceDayIdx) => {
        let newSchema = schema.map(d => ({ ...d, exercises: [...d.exercises] }));
        // Remove from source day
        newSchema[sourceDayIdx].exercises = newSchema[sourceDayIdx].exercises.filter(e => e.id !== updatedEx.id);
        // Add/update in target day
        if (targetDayIdx === sourceDayIdx) {
          // Same day - insert back at original position
          const origIdx = schema[sourceDayIdx].exercises.findIndex(e => e.id === updatedEx.id);
          newSchema[targetDayIdx].exercises.splice(origIdx >= 0 ? origIdx : newSchema[targetDayIdx].exercises.length, 0, updatedEx);
        } else {
          newSchema[targetDayIdx].exercises.push(updatedEx);
        }
        saveSchema(newSchema);
        if (targetDayIdx !== dayIndex) activeTab = targetDayIdx;
        openExId = null;
        render();
        showToast('oefening bijgewerkt');
      },
      onDelete: (id, dIdx, clearHistory) => {
        if (clearHistory) {
          saveHistory(id, []);
        }
        const newSchema = schema.map((d, i) =>
          i === dIdx ? { ...d, exercises: d.exercises.filter(ex => ex.id !== id) } : d
        );
        saveSchema(newSchema);
        openExId = null;
        historyOpenId = null;
        render();
        showToast('oefening verwijderd');
      },
    });
    return;
  }

  // Delete history entry
  const delEntry = e.target.closest('[data-action="delete-entry"]');
  if (delEntry) {
    e.stopPropagation();
    const ts = parseInt(delEntry.dataset.ts, 10);
    const history = getHistory(exId);
    const newHistory = history.filter(e => e.timestamp !== ts);
    saveHistory(exId, newHistory);
    render();
    return;
  }

  // Suggestion chip fill
  if (e.target.closest('[data-action="fill-suggestion"]')) {
    e.stopPropagation();
    const chip = e.target.closest('[data-action="fill-suggestion"]');
    const weight = chip.dataset.weight;
    const sets = chip.dataset.sets;
    const reps = chip.dataset.reps;
    if (weight !== '') {
      const inp = card.querySelector('.field-input[data-field="weight"]');
      if (inp) inp.value = weight;
    }
    if (sets !== '') {
      const inp = card.querySelector('.field-input[data-field="sets"]');
      if (inp) inp.value = sets;
    }
    if (reps !== '') {
      const inp = card.querySelector('.field-input[data-field="reps"]');
      if (inp) inp.value = reps;
    }
    return;
  }

  // Card header toggle open/close
  if (e.target.closest('.card-header')) {
    if (card._justDragged) return;
    openExId = openExId === exId ? null : exId;
    if (openExId !== exId) historyOpenId = null;
    render();
    return;
  }
}

// ===== LOG ENTRY =====
function handleLog(card, ex, dayIndex) {
  const entry = { timestamp: Date.now() };
  let hasValue = false;

  for (const field of ex.fields) {
    const input = card.querySelector(`.field-input[data-field="${field}"]`);
    if (!input) continue;
    const val = input.value.trim();
    if (val !== '' && !isNaN(parseFloat(val))) {
      entry[field] = parseFloat(val);
      hasValue = true;
    } else {
      entry[field] = null;
    }
  }

  // Notes
  const notesEl = card.querySelector('.notes-input');
  entry.notes = notesEl ? notesEl.value.trim() : '';

  if (!hasValue) {
    showToast('vul minimaal een waarde in', 'error');
    return;
  }

  // PR check BEFORE saving
  const history = getHistory(ex.id);
  const prevBest = bestScore(history, ex);
  const newScore = entryScore(entry, ex);
  const isPR = history.length >= 1 && newScore > prevBest && prevBest > -Infinity;

  // Save
  history.unshift(entry);
  saveHistory(ex.id, history);

  // Toast + haptics
  if (isPR) {
    showToast('nieuw pr! 🥕', 'pr');
    vibrate([100, 50, 100]);
  } else {
    showToast('hop! opgeslagen 🐰', 'success');
    vibrate([30]);
  }

  // Start rest timer
  startTimer(ex.restSec || 60, ex.name);

  // Re-render
  render();
}

// ===== QUICK LOG =====
function handleQuickLog(ex) {
  const history = getHistory(ex.id);
  if (!history.length) return;
  const entry = { ...history[0], timestamp: Date.now() };

  const prevBest = bestScore(history, ex);
  const newScore = entryScore(entry, ex);
  const isPR = history.length >= 1 && newScore > prevBest && prevBest > -Infinity;

  history.unshift(entry);
  saveHistory(ex.id, history);

  if (isPR) {
    showToast('nieuw pr! 🥕', 'pr');
    vibrate([100, 50, 100]);
  } else {
    showToast('hop! herhaal 🐰', 'success');
    vibrate([30]);
  }

  startTimer(ex.restSec || 60, ex.name);
  render();
}

// ===== EXPORT / IMPORT =====
function setupExportImport() {
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const schema = getSchema();
      const data = { __schema: schema };
      const allEx = getAllExercises(schema);
      for (const ex of allEx) {
        data[ex.id] = getHistory(ex.id);
      }
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      a.href = url;
      a.download = `bunny-${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('geexporteerd');
    });
  }

  const importInput = document.getElementById('importInput');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (!data.__schema || !Array.isArray(data.__schema)) {
            showToast('ongeldig bestand', 'error');
            return;
          }
          saveSchema(data.__schema);
          // Restore history
          const allEx = getAllExercises(data.__schema);
          for (const ex of allEx) {
            if (Array.isArray(data[ex.id])) {
              saveHistory(ex.id, data[ex.id]);
            }
          }
          activeTab = 0;
          openExId = null;
          historyOpenId = null;
          render();
          showToast('geimporteerd');
        } catch {
          showToast('import mislukt', 'error');
        }
        importInput.value = '';
      };
      reader.readAsText(file);
    });
  }
}

// ===== INIT =====
async function init() {
  await loadFromDB();
  loadSchema();
  seedIfNeeded();
  setupExportImport();
  initBunnies();
  await showSplash();
  render();

  window.addEventListener('focus', async () => {
    await loadFromDB();
    loadSchema();
    render();
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

init();
