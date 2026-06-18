import { escapeHtml, formatDate, formatEntry, fieldLabel, fieldStep } from '../logic/format.js';
import { getSuggestion } from '../logic/suggestion.js';
import { e1rm, bestScore, entryScore } from '../logic/scoring.js';
import { renderSparkline } from './sparkline.js';
import { formatPlates } from '../logic/plates.js';

function isToday(ts) {
  if (!ts) return false;
  const d = new Date(ts);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

export function renderExerciseCard(ex, index, history, isOpen, isHistoryOpen) {
  const loggedToday = history.length > 0 && isToday(history[0].timestamp);
  const lastEntry = history[0] || null;
  const sparkSvg = renderSparkline(history, ex);

  const doneMark = loggedToday ? '<span class="ex-done-mark">&#10003;</span>' : '';

  const lastVal = lastEntry ? escapeHtml(formatEntry(lastEntry, ex)) : '';
  const lastDate = lastEntry ? escapeHtml(formatDate(lastEntry.timestamp)) : '';

  const rm = (lastEntry && !ex.fields.includes('time') && !ex.bodyweight && lastEntry.weight > 0 && lastEntry.reps > 0)
    ? e1rm(lastEntry.weight, lastEntry.reps).toFixed(1)
    : null;

  // Card body content
  const suggestion = getSuggestion(history, ex);
  let suggestionHtml = '';
  if (suggestion) {
    suggestionHtml = `
      <div class="suggestion-chip" data-action="fill-suggestion"
        data-weight="${suggestion.weight ?? ''}"
        data-sets="${suggestion.sets ?? ''}"
        data-reps="${suggestion.reps ?? ''}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        ${escapeHtml(suggestion.text)}
      </div>`;
  }

  // Build field inputs
  let fieldsHtml = '<div class="field-inputs">';
  let initialPlateHint = '';
  for (const field of ex.fields) {
    const step = fieldStep(field);
    const label = fieldLabel(field);
    let prefill = '';
    if (lastEntry && lastEntry[field] != null) {
      prefill = lastEntry[field];
    }
    if (field === 'weight' && prefill > 20) {
      initialPlateHint = escapeHtml(formatPlates(prefill) || '');
    }
    fieldsHtml += `
      <div class="field-group">
        <span class="field-label">${escapeHtml(label)}</span>
        <div class="field-stepper">
          <button class="stepper-btn" data-action="step-down" data-field="${field}" data-step="${step}" type="button">-</button>
          <input class="field-input" type="number" inputmode="decimal"
            data-field="${field}" step="${step}" min="0"
            value="${prefill !== '' ? prefill : ''}" placeholder="0" />
          <button class="stepper-btn" data-action="step-up" data-field="${field}" data-step="${step}" type="button">+</button>
        </div>
      </div>`;
  }
  fieldsHtml += '</div>';
  fieldsHtml += `<div class="plate-hint" data-plate-hint>${initialPlateHint}</div>`;

  const notesVal = lastEntry?.notes ? escapeHtml(lastEntry.notes) : '';

  // History panel
  let historyHtml = '';
  if (isHistoryOpen && history.length > 0) {
    const prevBest = bestScore(history, ex);
    const entries = history.slice(0, 20);
    historyHtml = '<div class="history-panel"><div class="history-panel-inner">';
    for (const entry of entries) {
      const score = entryScore(entry, ex);
      const isPR = score >= prevBest && prevBest > -Infinity;
      const prTag = isPR ? '<span class="history-pr-tag">pr</span>' : '';
      historyHtml += `
        <div class="history-entry">
          <div class="history-entry-info">
            <span class="history-entry-val">${escapeHtml(formatEntry(entry, ex))} ${prTag}</span>
            <span class="history-entry-date">${escapeHtml(formatDate(entry.timestamp))}${entry.notes ? ' &middot; ' + escapeHtml(entry.notes) : ''}</span>
          </div>
          <button class="history-delete-btn" data-action="delete-entry" data-ts="${entry.timestamp}" type="button" aria-label="verwijder">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>`;
    }
    historyHtml += '</div></div>';
  }

  const numStr = String(index + 1).padStart(2, '0');

  return `
    <div class="exercise-card${loggedToday ? ' logged-today' : ''}" data-id="${escapeHtml(ex.id)}" draggable="false">
      <div class="card-header" data-drag-handle draggable="false">
        <span class="ex-num">${numStr}</span>
        <div class="ex-info">
          <span class="ex-name">${escapeHtml(ex.name)}${doneMark}</span>
          <span class="ex-muscle">${escapeHtml(ex.muscle)}</span>
        </div>
        <div class="ex-right">
          ${sparkSvg ? `<div class="sparkline-wrap">${sparkSvg}</div>` : ''}
          <div class="ex-last">
            <span class="ex-last-val">${lastVal}</span>
            <span class="ex-last-date">${lastDate}</span>
            ${rm ? `<span class="ex-1rm">~${rm}kg 1RM</span>` : ''}
          </div>
          ${lastEntry && !loggedToday ? `<button class="btn-quick-log" data-action="quick-log" type="button" aria-label="herhaal laatste">↺</button>` : ''}
        </div>
      </div>
      <div class="card-body${isOpen ? ' open' : ''}">
        <div class="card-body-inner">
          ${suggestionHtml}
          ${fieldsHtml}
          <textarea class="notes-input" placeholder="notities..." rows="2">${notesVal}</textarea>
          <div class="card-btn-row">
            <button class="btn-primary" data-action="log" type="button">log + rust</button>
            <button class="btn-icon" data-action="toggle-history" type="button" aria-label="geschiedenis">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </button>
            <button class="btn-icon" data-action="edit" type="button" aria-label="bewerken">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
          ${historyHtml}
        </div>
      </div>
    </div>`;
}
