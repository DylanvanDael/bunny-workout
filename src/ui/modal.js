let _currentCallbacks = null;

function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('confirmModal').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('confirmModal').classList.remove('open');
  _currentCallbacks = null;
}

export function showModal({ title, message, hasHistory, onDelete, onDeleteKeepHistory, onCancel }) {
  _currentCallbacks = { onDelete, onDeleteKeepHistory, onCancel };

  const modal = document.getElementById('confirmModal');
  const overlay = document.getElementById('modalOverlay');

  let buttons = '';
  if (hasHistory) {
    buttons = `
      <button class="modal-btn modal-btn-danger" data-action="delete">alles wissen (incl. historie)</button>
      <button class="modal-btn modal-btn-warn" data-action="delete-keep">verwijder, behoud historie</button>
      <button class="modal-btn modal-btn-cancel" data-action="cancel">annuleer</button>
    `;
  } else {
    buttons = `
      <button class="modal-btn modal-btn-danger" data-action="delete">verwijder</button>
      <button class="modal-btn modal-btn-cancel" data-action="cancel">annuleer</button>
    `;
  }

  modal.innerHTML = `
    <div class="modal-title">${escHtml(title)}</div>
    <div class="modal-message">${escHtml(message)}</div>
    <div class="modal-btn-stack">
      ${buttons}
    </div>
  `;

  openModal();

  modal.addEventListener('click', handleModalClick, { once: false });
  overlay.addEventListener('click', handleOverlayClick, { once: false });
}

function handleModalClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const cbs = _currentCallbacks;

  closeModal();
  document.getElementById('confirmModal').removeEventListener('click', handleModalClick);
  document.getElementById('modalOverlay').removeEventListener('click', handleOverlayClick);

  if (action === 'delete' && cbs?.onDelete) cbs.onDelete();
  else if (action === 'delete-keep' && cbs?.onDeleteKeepHistory) cbs.onDeleteKeepHistory();
  else if (action === 'cancel' && cbs?.onCancel) cbs.onCancel();
}

function handleOverlayClick() {
  const cbs = _currentCallbacks;
  closeModal();
  document.getElementById('confirmModal').removeEventListener('click', handleModalClick);
  document.getElementById('modalOverlay').removeEventListener('click', handleOverlayClick);
  if (cbs?.onCancel) cbs.onCancel();
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
