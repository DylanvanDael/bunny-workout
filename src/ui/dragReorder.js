import { vibrate } from './toast.js';

/*
 * Drag-to-reorder for exercise cards.
 *
 * Touch events handle mobile; a separate pointer-event path covers mouse/stylus.
 *
 * We do NOT call e.preventDefault() on touchstart so native scroll works from
 * card headers. Instead:
 *   - CSS (user-select:none, -webkit-touch-callout:none) suppresses text selection.
 *   - selectstart + contextmenu listeners prevent iOS element-selection UI
 *     (the blue handles) without blocking scroll.
 *   - visibilitychange cleans up any stuck drag state when the app backgrounds.
 *   - e.preventDefault() on touchmove is called only once drag is confirmed,
 *     which stops the scroll container during the actual drag gesture.
 */

export function initDragReorder(container, dayIndex, onReorder) {
  let dragState = null;
  let longPressTimer = null;
  let longPressStart = { x: 0, y: 0 };

  // ── DOM helpers ────────────────────────────────────────────────────────────

  function getCards() {
    return Array.from(container.querySelectorAll('.exercise-card'));
  }

  // ── Drag lifecycle ─────────────────────────────────────────────────────────

  function startDrag(card, clientX, clientY) {
    const rect = card.getBoundingClientRect();
    vibrate([30]);

    // Ghost: clone the card header only (lighter, still recognisable)
    const ghost = document.createElement('div');
    ghost.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      z-index: 9999;
      pointer-events: none;
      margin: 0;
      transform: scale(1.04) rotate(0.4deg);
      box-shadow: 0 22px 55px rgba(0,0,0,0.28),
                  inset 0 1px 0 rgba(255,255,255,0.55);
      background: linear-gradient(145deg,rgba(255,255,255,0.38),rgba(255,255,255,0.20));
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(255,255,255,0.50);
      border-radius: 22px;
      overflow: hidden;
      transition: none;
    `;
    ghost.innerHTML = card.querySelector('.card-header').outerHTML;
    document.body.appendChild(ghost);

    // Placeholder: card-shaped dashed outline that marks the drop position
    const ph = document.createElement('div');
    ph.className = 'drag-placeholder';
    ph.style.height = rect.height + 'px';
    card.parentNode.insertBefore(ph, card);

    // Hide original so only the ghost is visible
    card.style.visibility = 'hidden';

    dragState = {
      card,
      ghost,
      placeholder: ph,
      offsetY: clientY - rect.top,
    };
  }

  function moveDrag(clientX, clientY) {
    if (!dragState) return;
    const { ghost, placeholder, card, offsetY } = dragState;

    ghost.style.top = (clientY - offsetY) + 'px';

    // Reposition placeholder so it shows where the card will land
    const cards = getCards().filter(c => c !== card);
    let placed = false;
    for (const c of cards) {
      const r = c.getBoundingClientRect();
      if (clientY < r.top + r.height * 0.5) {
        c.parentNode.insertBefore(placeholder, c);
        placed = true;
        break;
      }
    }
    if (!placed && cards.length > 0) {
      const last = cards[cards.length - 1];
      last.parentNode.insertBefore(placeholder, last.nextSibling);
    }
  }

  function cancelDrag() {
    if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
    if (!dragState) return;
    const { card, ghost, placeholder } = dragState;
    dragState = null;
    ghost.remove();
    card.style.visibility = '';
    // Restore card to its original DOM position (before placeholder)
    if (placeholder.parentNode) {
      placeholder.parentNode.insertBefore(card, placeholder);
      placeholder.remove();
    }
  }

  function endDrag() {
    if (!dragState) return;
    const { card, ghost, placeholder } = dragState;
    dragState = null;

    ghost.remove();
    card.style.visibility = '';
    if (placeholder.parentNode) {
      placeholder.parentNode.insertBefore(card, placeholder);
      placeholder.remove();
    }

    // Block the tap/click that fires right after touchend
    card._justDragged = true;
    setTimeout(() => { card._justDragged = false; }, 400);

    const newOrder = getCards().map(c => c.dataset.id);
    if (onReorder) onReorder(newOrder);
  }

  // ── iOS element-selection prevention ──────────────────────────────────────
  //
  // Prevents the blue selection handles that iOS shows on long-press in
  // standalone/PWA mode, without touching touchstart (which would kill scroll).

  container.addEventListener('selectstart', (e) => {
    if (e.target.closest('.exercise-card')) e.preventDefault();
  });

  container.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.exercise-card')) e.preventDefault();
  });

  // Clean up any stuck drag state when the PWA goes to background
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelDrag();
  });

  // ── Touch events ───────────────────────────────────────────────────────────

  container.addEventListener('touchstart', (e) => {
    const header = e.target.closest('[data-drag-handle]');
    if (!header) return;

    // passive: true — no preventDefault, so native scroll still works.

    const t = e.changedTouches[0];
    longPressStart = { x: t.clientX, y: t.clientY };

    const card = header.closest('.exercise-card');
    if (!card) return;

    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      startDrag(card, t.clientX, t.clientY);
    }, 300);
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (longPressTimer) {
      // Finger moved before long-press fired → was a scroll, cancel timer
      const t = e.changedTouches[0];
      if (Math.abs(t.clientX - longPressStart.x) > 8 ||
          Math.abs(t.clientY - longPressStart.y) > 8) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    }
    if (dragState) {
      e.preventDefault(); // prevent page scroll while dragging
      moveDrag(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  }, { passive: false });

  container.addEventListener('touchend', () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
      // iOS fires the click event naturally (we didn't preventDefault touchstart)
    }
    if (dragState) endDrag();
  });

  container.addEventListener('touchcancel', () => {
    cancelDrag();
  });

  // ── Pointer events (mouse / stylus — not touch) ────────────────────────────

  let mouseLongTimer = null;
  let mouseLongStart = { x: 0, y: 0 };

  container.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    const header = e.target.closest('[data-drag-handle]');
    if (!header) return;
    const card = header.closest('.exercise-card');
    if (!card) return;

    mouseLongStart = { x: e.clientX, y: e.clientY };
    mouseLongTimer = setTimeout(() => {
      mouseLongTimer = null;
      startDrag(card, e.clientX, e.clientY);
    }, 250);
  });

  container.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (mouseLongTimer) {
      if (Math.abs(e.clientX - mouseLongStart.x) > 8 ||
          Math.abs(e.clientY - mouseLongStart.y) > 8) {
        clearTimeout(mouseLongTimer);
        mouseLongTimer = null;
      }
    }
    if (dragState) {
      e.preventDefault();
      moveDrag(e.clientX, e.clientY);
    }
  }, { passive: false });

  container.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (mouseLongTimer) { clearTimeout(mouseLongTimer); mouseLongTimer = null; }
    if (dragState) endDrag();
  });
}
