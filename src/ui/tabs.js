let _onTabChange = null;
let _schema = null;
let _activeTab = 0;

export function renderTabs(schema, activeTab, onTabChange) {
  _schema = schema;
  _activeTab = activeTab;
  _onTabChange = onTabChange;

  const bar = document.getElementById('tabBar');
  if (!bar) return;

  // Keep the indicator element
  const indicator = document.getElementById('tabIndicator');

  // Build tab buttons
  let html = '';
  schema.forEach((day, i) => {
    const isActive = i === activeTab;
    html += `<button class="tab-btn${isActive ? ' active' : ''}" data-tab="${i}">
      <span class="tab-num">dag ${i + 1}</span>
      <span class="tab-title">${escHtml(day.title)}</span>
    </button>`;
  });

  // Stats tab
  const statsActive = activeTab === schema.length;
  html += `<button class="tab-btn${statsActive ? ' active' : ''}" data-tab="${schema.length}">
    <span class="tab-num">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    </span>
    <span class="tab-title">stats</span>
  </button>`;

  // Add day tab
  if (schema.length < 10) {
    html += `<button class="tab-btn tab-btn-add" data-tab="add" title="dag toevoegen">
      <span class="tab-num">+</span>
    </button>`;
  }

  // Remove all children except indicator
  while (bar.firstChild) bar.removeChild(bar.firstChild);
  bar.appendChild(indicator);
  bar.insertAdjacentHTML('beforeend', html);

  // Event listeners
  bar.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab === 'add') {
        addNewDay();
        return;
      }
      const idx = parseInt(tab, 10);
      if (_onTabChange) _onTabChange(idx);
    });
  });

  // Update indicator position
  requestAnimationFrame(() => updateTabIndicator(activeTab));
}

export function updateTabIndicator(tabIndex) {
  const bar = document.getElementById('tabBar');
  const indicator = document.getElementById('tabIndicator');
  if (!bar || !indicator) return;

  const btns = bar.querySelectorAll('.tab-btn:not(.tab-btn-add)');
  const target = btns[tabIndex];
  if (!target) return;

  const barRect = bar.getBoundingClientRect();
  const btnRect = target.getBoundingClientRect();

  const left = btnRect.left - barRect.left + bar.scrollLeft;
  indicator.style.transform = `translateX(${left}px)`;
  indicator.style.width = `${btnRect.width}px`;

  // Scroll active tab into view
  target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

function addNewDay() {
  const { getSchema, saveSchema, newExerciseId } = window._app || {};
  if (!getSchema || !saveSchema) return;

  const schema = getSchema();
  if (schema.length >= 10) return;

  const newDay = {
    title: `dag ${schema.length + 1}`,
    subtitle: '',
    exercises: [],
  };
  const newSchema = [...schema, newDay];
  saveSchema(newSchema);

  if (_onTabChange) _onTabChange(newSchema.length - 1);
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
