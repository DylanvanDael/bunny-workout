import { escapeHtml } from '../logic/format.js';
import { showModal } from './modal.js';
import { getHistory } from '../storage.js';
import { showToast } from './toast.js';

let _onSave = null;
let _onDelete = null;
let _mode = null; // 'exercise' | 'day'
let _data = null;

function openSheet() {
  document.getElementById('sheetOverlay').classList.add('open');
  document.getElementById('bottomSheet').classList.add('open');
}

function closeSheet() {
  document.getElementById('sheetOverlay').classList.remove('open');
  document.getElementById('bottomSheet').classList.remove('open');
  _onSave = null;
  _onDelete = null;
  _mode = null;
  _data = null;
}

export function showExerciseSheet({ ex, dayIndex, schema, onSave, onDelete }) {
  _onSave = onSave;
  _onDelete = onDelete;
  _mode = 'exercise';
  _data = { ex, dayIndex, schema };

  const isEdit = !!ex;
  const title = isEdit ? 'oefening bewerken' : 'oefening toevoegen';

  // Type detection
  let currentType = 'kracht';
  if (isEdit) {
    if (ex.fields.includes('time')) currentType = 'cardio';
    else if (ex.bodyweight) currentType = 'bodyweight';
  }

  const restOptions = [
    { val: 30, label: '30s' },
    { val: 60, label: '1m' },
    { val: 90, label: '1.5m' },
    { val: 120, label: '2m' },
    { val: 180, label: '3m' },
  ];
  const currentRest = isEdit ? (ex.restSec || 60) : 60;

  const dayPills = schema.map((d, i) =>
    `<button class="pill${i === dayIndex ? ' active' : ''}" data-day-pill="${i}">dag ${i + 1}</button>`
  ).join('');

  let orderHtml = '';
  if (isEdit) {
    const dayExercises = schema[dayIndex]?.exercises || [];
    const exIdx = dayExercises.findIndex(e => e.id === ex.id);
    orderHtml = `
      <div class="sheet-field">
        <span class="sheet-label">volgorde</span>
        <div class="sheet-order-btns">
          <button class="sheet-order-btn" data-action="move-up" ${exIdx === 0 ? 'disabled' : ''}>omhoog</button>
          <button class="sheet-order-btn" data-action="move-down" ${exIdx === dayExercises.length - 1 ? 'disabled' : ''}>omlaag</button>
        </div>
      </div>`;
  }

  const deleteHtml = isEdit
    ? `<button class="sheet-delete-btn" data-action="delete">verwijder oefening</button>`
    : '';

  const sheet = document.getElementById('bottomSheet');
  sheet.innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-title">${title}</div>
    <div class="sheet-content">
      <div class="sheet-field">
        <span class="sheet-label">naam</span>
        <input class="sheet-input" type="text" id="sheetName" placeholder="oefening naam" value="${isEdit ? escapeHtml(ex.name) : ''}" />
      </div>
      <div class="sheet-field">
        <span class="sheet-label">spiergroep</span>
        <input class="sheet-input" type="text" id="sheetMuscle" placeholder="spiergroep" value="${isEdit ? escapeHtml(ex.muscle) : ''}" />
      </div>
      <div class="sheet-field">
        <span class="sheet-label">type</span>
        <div class="pill-group" id="typePills">
          <button class="pill${currentType === 'kracht' ? ' active' : ''}" data-type="kracht">kracht</button>
          <button class="pill${currentType === 'bodyweight' ? ' active' : ''}" data-type="bodyweight">bodyweight</button>
          <button class="pill${currentType === 'cardio' ? ' active' : ''}" data-type="cardio">cardio</button>
        </div>
      </div>
      <div id="strengthFields" style="${currentType === 'cardio' ? 'display:none' : ''}">
        <div class="sheet-field">
          <span class="sheet-label">target reps</span>
          <div class="sheet-num-row">
            <input class="sheet-num-input" type="number" id="sheetTargetReps" value="${isEdit && ex.targetReps != null ? ex.targetReps : 10}" min="1" inputmode="numeric" />
          </div>
        </div>
        <div class="sheet-field">
          <span class="sheet-label">increment (kg)</span>
          <div class="sheet-num-row">
            <input class="sheet-num-input" type="number" id="sheetIncrement" value="${isEdit && ex.increment != null ? ex.increment : 2.5}" min="0" step="0.5" inputmode="decimal" />
          </div>
        </div>
      </div>
      <div class="sheet-field">
        <span class="sheet-label">rusttijd</span>
        <div class="pill-group" id="restPills">
          ${restOptions.map(o =>
            `<button class="pill${o.val === currentRest ? ' active' : ''}" data-rest="${o.val}">${o.label}</button>`
          ).join('')}
        </div>
      </div>
      <div class="sheet-field">
        <span class="sheet-label">dag</span>
        <div class="pill-group" id="dayPills">
          ${dayPills}
        </div>
      </div>
      ${orderHtml}
      ${deleteHtml}
    </div>
    <div class="sheet-btn-row">
      <button class="sheet-btn-save" data-action="save">opslaan</button>
      <button class="sheet-btn-cancel" data-action="cancel">annuleer</button>
    </div>
  `;

  openSheet();
  _initSheetEvents(sheet);
}

export function showDaySheet({ day, dayIndex, schema, onSave, onDelete }) {
  _onSave = onSave;
  _onDelete = onDelete;
  _mode = 'day';
  _data = { day, dayIndex, schema };

  const sheet = document.getElementById('bottomSheet');

  const orderBtns = `
    <div class="sheet-field">
      <span class="sheet-label">volgorde</span>
      <div class="sheet-order-btns">
        <button class="sheet-order-btn" data-action="move-up" ${dayIndex === 0 ? 'disabled' : ''}>omhoog</button>
        <button class="sheet-order-btn" data-action="move-down" ${dayIndex === schema.length - 1 ? 'disabled' : ''}>omlaag</button>
      </div>
    </div>`;

  const deleteHtml = schema.length > 1
    ? `<button class="sheet-delete-btn" data-action="delete">verwijder dag</button>`
    : '';

  sheet.innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-title">dag bewerken</div>
    <div class="sheet-content">
      <div class="sheet-field">
        <span class="sheet-label">naam</span>
        <input class="sheet-input" type="text" id="sheetDayName" value="${escapeHtml(day.title)}" placeholder="dag naam" />
      </div>
      <div class="sheet-field">
        <span class="sheet-label">ondertitel</span>
        <input class="sheet-input" type="text" id="sheetDaySubtitle" value="${escapeHtml(day.subtitle || '')}" placeholder="optioneel" />
      </div>
      ${orderBtns}
      ${deleteHtml}
    </div>
    <div class="sheet-btn-row">
      <button class="sheet-btn-save" data-action="save">opslaan</button>
      <button class="sheet-btn-cancel" data-action="cancel">annuleer</button>
    </div>
  `;

  openSheet();
  _initSheetEvents(sheet);
}

let _persistentListenersAttached = false;

function _initSheetEvents(sheet) {
  // Type pills
  const typePills = sheet.querySelector('#typePills');
  if (typePills) {
    typePills.addEventListener('click', (e) => {
      const pill = e.target.closest('[data-type]');
      if (!pill) return;
      typePills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const type = pill.dataset.type;
      const strengthFields = sheet.querySelector('#strengthFields');
      if (strengthFields) {
        strengthFields.style.display = type === 'cardio' ? 'none' : '';
      }
    });
  }

  // Rest pills
  const restPills = sheet.querySelector('#restPills');
  if (restPills) {
    restPills.addEventListener('click', (e) => {
      const pill = e.target.closest('[data-rest]');
      if (!pill) return;
      restPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  }

  // Day pills
  const dayPillsEl = sheet.querySelector('#dayPills');
  if (dayPillsEl) {
    dayPillsEl.addEventListener('click', (e) => {
      const pill = e.target.closest('[data-day-pill]');
      if (!pill) return;
      dayPillsEl.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  }

  // Persistent listeners live on elements that survive innerHTML resets
  // (the sheet + overlay), so attach them only once to avoid stacking
  // duplicate handlers each time a sheet opens.
  if (_persistentListenersAttached) return;
  _persistentListenersAttached = true;

  // Close on overlay click
  document.getElementById('sheetOverlay').addEventListener('click', () => {
    closeSheet();
  });

  // Action buttons (delegated; reads current _mode/_data from module state)
  sheet.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'cancel') {
      closeSheet();
    } else if (action === 'save') {
      _handleSave(sheet);
    } else if (action === 'delete') {
      _handleDelete(sheet);
    } else if (action === 'move-up') {
      _handleMove(sheet, -1);
    } else if (action === 'move-down') {
      _handleMove(sheet, 1);
    }
  });
}

function _handleSave(sheet) {
  // Capture the callback before closeSheet() nulls it out.
  const onSave = _onSave;
  if (_mode === 'exercise') {
    const { ex, dayIndex, schema } = _data;
    const name = sheet.querySelector('#sheetName')?.value?.trim() || '';
    const muscle = sheet.querySelector('#sheetMuscle')?.value?.trim() || '';
    if (!name) {
      showToast('vul een naam in', 'error');
      return;
    }

    const activeType = sheet.querySelector('[data-type].active')?.dataset.type || 'kracht';
    const activeRest = parseInt(sheet.querySelector('[data-rest].active')?.dataset.rest || '60', 10);
    const targetDayIdx = parseInt(sheet.querySelector('[data-day-pill].active')?.dataset.dayPill ?? dayIndex, 10);
    const targetReps = parseFloat(sheet.querySelector('#sheetTargetReps')?.value || '10') || 10;
    const increment = parseFloat(sheet.querySelector('#sheetIncrement')?.value || '0') || 0;

    let fields, bodyweight;
    if (activeType === 'cardio') {
      fields = ['distance', 'sets', 'time'];
      bodyweight = false;
    } else if (activeType === 'bodyweight') {
      fields = ['weight', 'sets', 'reps'];
      bodyweight = true;
    } else {
      fields = ['weight', 'sets', 'reps'];
      bodyweight = false;
    }

    const updatedEx = {
      id: ex?.id || window._app.newExerciseId(targetDayIdx),
      name,
      muscle,
      fields,
      bodyweight,
      targetReps,
      increment,
      restSec: activeRest,
    };

    closeSheet();
    if (onSave) onSave(updatedEx, targetDayIdx, ex ? dayIndex : targetDayIdx);
  } else if (_mode === 'day') {
    const { dayIndex } = _data;
    const name = sheet.querySelector('#sheetDayName')?.value?.trim() || '';
    const subtitle = sheet.querySelector('#sheetDaySubtitle')?.value?.trim() || '';
    if (!name) {
      showToast('vul een naam in', 'error');
      return;
    }
    closeSheet();
    if (onSave) onSave({ title: name, subtitle }, dayIndex);
  }
}

function _handleDelete(sheet) {
  // Capture the callback before closeSheet() nulls it out.
  const onDelete = _onDelete;
  if (_mode === 'exercise') {
    const { ex, dayIndex } = _data;
    const history = getHistory(ex.id);
    closeSheet();
    showModal({
      title: 'oefening verwijderen',
      message: `"${ex.name}" verwijderen?`,
      hasHistory: history.length > 0,
      onDelete: () => { if (onDelete) onDelete(ex.id, dayIndex, true); },
      onDeleteKeepHistory: () => { if (onDelete) onDelete(ex.id, dayIndex, false); },
      onCancel: () => {},
    });
  } else if (_mode === 'day') {
    const { day, dayIndex } = _data;
    closeSheet();
    showModal({
      title: 'dag verwijderen',
      message: `dag "${day.title}" verwijderen?`,
      hasHistory: false,
      onDelete: () => { if (onDelete) onDelete(dayIndex); },
      onCancel: () => {},
    });
  }
}

function _handleMove(sheet, direction) {
  if (_mode === 'exercise') {
    const { ex, dayIndex, schema } = _data;
    const exercises = [...schema[dayIndex].exercises];
    const idx = exercises.findIndex(e => e.id === ex.id);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= exercises.length) return;
    [exercises[idx], exercises[newIdx]] = [exercises[newIdx], exercises[idx]];
    const newSchema = schema.map((d, i) =>
      i === dayIndex ? { ...d, exercises } : d
    );
    window._app.saveSchema(newSchema);
    closeSheet();
    window._app.render();
    showToast('volgorde aangepast');
  } else if (_mode === 'day') {
    const { dayIndex, schema } = _data;
    const newIdx = dayIndex + direction;
    if (newIdx < 0 || newIdx >= schema.length) return;
    const newSchema = [...schema];
    [newSchema[dayIndex], newSchema[newIdx]] = [newSchema[newIdx], newSchema[dayIndex]];
    window._app.saveSchema(newSchema);
    closeSheet();
    window._app.activeTab = newIdx;
    window._app.render();
    showToast('volgorde aangepast');
  }
}
