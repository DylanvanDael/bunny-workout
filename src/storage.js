// In-memory fallback when localStorage is unavailable
const memStore = new Map();

function isLocalStorageAvailable() {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

const hasLS = isLocalStorageAvailable();

export function sGet(key) {
  if (hasLS) {
    try {
      return localStorage.getItem(key);
    } catch {
      return memStore.get(key) ?? null;
    }
  }
  return memStore.get(key) ?? null;
}

export function sSet(key, value) {
  if (hasLS) {
    try {
      localStorage.setItem(key, value);
    } catch {
      memStore.set(key, value);
    }
  } else {
    memStore.set(key, value);
  }
  fetch('/api/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  }).catch(() => {});
}

export async function loadFromDB() {
  try {
    const res = await fetch('/api/store');
    if (!res.ok) return;
    const data = await res.json();
    for (const [key, value] of Object.entries(data)) {
      if (hasLS) {
        try { localStorage.setItem(key, value); } catch { memStore.set(key, value); }
      } else {
        memStore.set(key, value);
      }
    }
  } catch {
    // DB unavailable — continue with localStorage
  }
}

export const KEYS = {
  SCHEMA: 'wt:schema_v2',
  SEEDED: 'wt_seeded_v1',
  history: (id) => `wt:${id}`,
};

export function getHistory(exerciseId) {
  const raw = sGet(KEYS.history(exerciseId));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveHistory(exerciseId, history) {
  const capped = history.slice(0, 200);
  sSet(KEYS.history(exerciseId), JSON.stringify(capped));
}
