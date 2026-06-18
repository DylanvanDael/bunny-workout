import { escapeHtml } from '../logic/format.js';
import { renderExerciseCard } from './exercise.js';
import { getHistory } from '../storage.js';

function isToday(ts) {
  if (!ts) return false;
  const d = new Date(ts);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

export function renderDay(schema, dayIndex, openExId, historyOpenId) {
  const day = schema[dayIndex];
  if (!day) return '<div class="day-header"><div class="day-header-left"><p>dag niet gevonden</p></div></div>';

  // Count done today
  let doneCount = 0;
  for (const ex of day.exercises) {
    const history = getHistory(ex.id);
    if (history.length > 0 && isToday(history[0].timestamp)) doneCount++;
  }

  const subtitleHtml = day.subtitle
    ? `<div class="day-subtitle">${escapeHtml(day.subtitle)}</div>`
    : '';

  const deleteDayHtml = schema.length > 1
    ? `<button class="btn-danger" data-action="delete-day" style="margin-top:20px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        verwijder dag
      </button>`
    : '';

  let cardsHtml = '';
  day.exercises.forEach((ex, i) => {
    const history = getHistory(ex.id);
    const isOpen = openExId === ex.id;
    const isHistoryOpen = historyOpenId === ex.id;
    cardsHtml += renderExerciseCard(ex, i, history, isOpen, isHistoryOpen);
  });

  return `
    <div class="day-header">
      <div class="day-header-left">
        <div class="day-title">${escapeHtml(day.title)}</div>
        ${subtitleHtml}
        <div class="day-done">${doneCount}/${day.exercises.length} gedaan</div>
      </div>
      <div class="day-header-right">
        <button class="icon-btn" data-action="edit-day" aria-label="dag bewerken">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>
    </div>
    <div class="exercise-list" data-day="${dayIndex}">
      ${cardsHtml}
    </div>
    <button class="btn-add-exercise" data-action="add-exercise">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      oefening toevoegen
    </button>
    ${deleteDayHtml}
  `;
}
