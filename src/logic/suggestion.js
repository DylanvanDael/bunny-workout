export function getSuggestion(history, ex) {
  if (ex.fields.includes('time')) return null;
  if (!history?.length) return null;
  const last = history[0];
  const reps = last.reps ?? 0;
  const weight = last.weight ?? 0;
  const sets = last.sets ?? 3;
  if (reps === 0) return null;
  if (reps >= ex.targetReps) {
    if (ex.increment > 0) {
      const newWeight = Math.round((weight + ex.increment) * 2) / 2;
      const newReps = Math.max(5, ex.targetReps - 3);
      return { text: `${newWeight}kg proberen, terug naar minder reps`, weight: newWeight, sets, reps: newReps };
    }
    return { text: `target gehaald, probeer ${reps + 1} reps of verzwaar`, weight, sets, reps: reps + 1 };
  }
  return { text: `zelfde gewicht, ga voor ${reps + 1} reps`, weight, sets, reps: reps + 1 };
}
