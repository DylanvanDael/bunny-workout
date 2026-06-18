import { beep, vibrate } from './toast.js';

let _interval = null;
let _remaining = 0;
let _total = 0;

export function clearTimer() {
  if (_interval) {
    clearInterval(_interval);
    _interval = null;
  }
  const el = document.getElementById('restTimer');
  if (el) el.style.display = 'none';
}

export function startTimer(seconds, exerciseName) {
  clearTimer();

  _remaining = seconds;
  _total = seconds;

  const el = document.getElementById('restTimer');
  if (!el) return;

  el.style.display = 'block';
  el.style.animation = 'none';
  // Force reflow
  void el.offsetWidth;
  el.style.animation = '';

  function updateUI() {
    const display = el.querySelector('.timer-display');
    const progress = el.querySelector('.timer-progress');
    const label = el.querySelector('.timer-ex-name');

    if (label) label.textContent = exerciseName;
    if (display) {
      display.classList.remove('done');
      const m = Math.floor(_remaining / 60);
      const s = _remaining % 60;
      display.textContent = `${m}:${String(s).padStart(2, '0')}`;
    }
    if (progress) {
      const pct = _total > 0 ? (_remaining / _total) * 100 : 0;
      progress.style.width = `${pct}%`;
    }
  }

  el.innerHTML = `
    <div class="timer-header">
      <span class="timer-label">rust &middot; <span class="timer-ex-name">${escHtml(exerciseName)}</span></span>
      <span class="timer-display">0:00</span>
    </div>
    <div class="timer-bar"><div class="timer-progress" style="width:100%"></div></div>
    <div class="timer-controls">
      <button class="timer-btn" data-action="minus15">-15</button>
      <button class="timer-btn timer-skip" data-action="skip">skip</button>
      <button class="timer-btn" data-action="plus15">+15</button>
    </div>
  `;

  updateUI();

  el.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'minus15') {
      _remaining = Math.max(0, _remaining - 15);
      updateUI();
    } else if (action === 'plus15') {
      _remaining = Math.min(_total + 60, _remaining + 15);
      _total = Math.max(_total, _remaining);
      updateUI();
    } else if (action === 'skip') {
      clearTimer();
    }
  }, { once: false });

  _interval = setInterval(() => {
    _remaining--;
    if (_remaining <= 0) {
      _remaining = 0;
      clearInterval(_interval);
      _interval = null;

      const display = el.querySelector('.timer-display');
      if (display) {
        display.textContent = 'go!';
        display.classList.add('done');
      }
      const progress = el.querySelector('.timer-progress');
      if (progress) progress.style.width = '0%';

      beep();
      vibrate([200, 100, 200]);

      setTimeout(clearTimer, 2500);
    } else {
      updateUI();
    }
  }, 1000);
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
