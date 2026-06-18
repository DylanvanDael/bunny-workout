export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatDate(ts) {
  if (!ts) return '';
  const now = new Date();
  const date = new Date(ts);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffMs = today.getTime() - d.getTime();
  const diffDays = Math.round(diffMs / 86400000);
  if (diffDays === 0) return 'vandaag';
  if (diffDays === 1) return 'gisteren';
  if (diffDays < 14) return `${diffDays}d geleden`;
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

export function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '';
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

export function formatCounterTime(seconds) {
  const s = Math.round(Math.max(0, seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

export function formatEntry(entry, ex) {
  if (!entry) return '';
  if (ex.fields.includes('time')) {
    const dist = entry.distance ? `${entry.distance}m` : '';
    const time = entry.time != null ? formatTime(entry.time) : '';
    const sets = entry.sets ? `${entry.sets}x` : '';
    const parts = [dist, sets, time].filter(Boolean);
    return parts.join(' · ');
  }
  const weight = entry.weight != null && entry.weight > 0 ? `${entry.weight}kg` : null;
  const setsReps = (entry.sets && entry.reps) ? `${entry.sets}×${entry.reps}` : (entry.reps ? `${entry.reps} reps` : null);
  const parts = [weight, setsReps].filter(Boolean);
  if (!parts.length && ex.bodyweight && entry.reps) return `${entry.sets || 1}×${entry.reps}`;
  return parts.join(' · ') || '';
}

export function fieldLabel(field) {
  const labels = {
    weight: 'kg',
    sets: 'sets',
    reps: 'reps',
    distance: 'meter',
    time: 'sec',
  };
  return labels[field] || field;
}

export function fieldStep(field) {
  const steps = {
    weight: 2.5,
    sets: 1,
    reps: 1,
    distance: 50,
    time: 0.5,
  };
  return steps[field] || 1;
}
