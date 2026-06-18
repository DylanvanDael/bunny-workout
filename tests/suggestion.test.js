import { describe, it, expect } from 'vitest';
import { getSuggestion } from '../src/logic/suggestion.js';

const weightEx = { fields: ['weight', 'sets', 'reps'], targetReps: 8, increment: 2.5, bodyweight: false };
const bwEx = { fields: ['weight', 'sets', 'reps'], targetReps: 8, increment: 0, bodyweight: true };
const cardioEx = { fields: ['distance', 'sets', 'time'] };

describe('getSuggestion', () => {
  it('returns null for cardio', () => expect(getSuggestion([{ time: 17 }], cardioEx)).toBeNull());
  it('returns null for empty history', () => expect(getSuggestion([], weightEx)).toBeNull());
  it('suggests weight increase when target reached', () => {
    const s = getSuggestion([{ weight: 20, reps: 8, sets: 3 }], weightEx);
    expect(s.weight).toBe(22.5);
    expect(s.reps).toBe(5);
  });
  it('suggests reps increase below target', () => {
    const s = getSuggestion([{ weight: 20, reps: 6, sets: 3 }], weightEx);
    expect(s.reps).toBe(7);
    expect(s.weight).toBe(20);
  });
  it('handles increment=0 with reps increase', () => {
    const s = getSuggestion([{ weight: 0, reps: 8, sets: 3 }], bwEx);
    expect(s.reps).toBe(9);
  });
});
