import { KEYS, saveHistory, getHistory } from './storage.js';
import { sGet, sSet } from './storage.js';

const SEED_ENTRIES = {
  d1_ohp:    { weight: 16, sets: 2, reps: 5, notes: '+20kg stang' },
  d1_pullup: { weight: 0,  sets: 3, reps: 4, notes: 'bodyweight' },
  d1_dips:   { weight: 0,  sets: 3, reps: 5, notes: 'bodyweight' },
  d1_lat:    { weight: 5,  sets: 3, reps: 16, notes: '' },
  d1_crunch: { weight: 30, sets: 3, reps: 8, notes: '' },
  d2_bulg:   { weight: 8,  sets: 3, reps: 8, notes: 'volgende keer meer' },
  d2_nordic: { weight: 0,  sets: 3, reps: 10, notes: 'met band' },
  d2_rdl:    { weight: 16, sets: 3, reps: 6, notes: 'volgende keer meer' },
  d2_kb:     { weight: 16, sets: 3, reps: 25, notes: '' },
  d2_hang:   { weight: 0,  sets: 3, reps: 5, notes: 'knie tot strek progressie' },
  d2_crunch: { weight: 30, sets: 3, reps: 8, notes: '' },
  d3_ohp:    { weight: 16, sets: 2, reps: 5, notes: '+20kg stang' },
  d3_tbar:   { weight: 16, sets: 3, reps: 10, notes: '2x 16kg DB' },
  d3_incline:{ weight: 20, sets: 3, reps: 5, notes: '+ stang' },
  d3_lat:    { weight: 5,  sets: 3, reps: 16, notes: '' },
  d3_crunch: { weight: 30, sets: 3, reps: 8, notes: '' },
  d4_sprint: { distance: 100, sets: 1, time: 17, notes: '' },
};

export function seedIfNeeded() {
  if (sGet(KEYS.SEEDED) === '1') return;
  const baseTs = Date.now() - 3 * 86400000;
  let offset = 0;
  for (const [id, data] of Object.entries(SEED_ENTRIES)) {
    const entry = { timestamp: baseTs + offset, ...data };
    const history = getHistory(id);
    history.unshift(entry);
    saveHistory(id, history);
    offset += 1;
  }
  sSet(KEYS.SEEDED, '1');
}
