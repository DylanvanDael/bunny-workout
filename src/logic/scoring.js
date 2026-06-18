export function e1rm(weight, reps) {
  if (!weight || !reps || weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

export function entryScore(entry, ex) {
  if (ex.fields.includes('time')) {
    return entry.time ? -entry.time : -Infinity;
  }
  if (ex.bodyweight && (!entry.weight || entry.weight === 0)) {
    return entry.reps || 0;
  }
  const rm = e1rm(entry.weight || 0, entry.reps || 0);
  return rm > 0 ? rm : (entry.reps || 0);
}

export function bestScore(history, ex) {
  if (!history?.length) return -Infinity;
  return Math.max(...history.map(e => entryScore(e, ex)));
}
