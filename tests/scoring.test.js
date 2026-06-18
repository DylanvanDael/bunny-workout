import { describe, it, expect } from 'vitest';
import { e1rm, entryScore, bestScore } from '../src/logic/scoring.js';

describe('e1rm', () => {
  it('returns weight for single rep', () => expect(e1rm(100, 1)).toBe(100));
  it('calculates correctly for multiple reps', () => expect(e1rm(100, 10)).toBeCloseTo(133.33, 1));
  it('returns 0 for invalid input', () => expect(e1rm(0, 5)).toBe(0));
});

describe('entryScore', () => {
  it('negates time for cardio', () => {
    const ex = { fields: ['distance', 'sets', 'time'] };
    expect(entryScore({ time: 17 }, ex)).toBe(-17);
  });
  it('uses reps for pure bodyweight', () => {
    const ex = { fields: ['weight', 'sets', 'reps'], bodyweight: true };
    expect(entryScore({ weight: 0, reps: 8 }, ex)).toBe(8);
  });
  it('uses e1rm for weight exercise', () => {
    const ex = { fields: ['weight', 'sets', 'reps'], bodyweight: false };
    expect(entryScore({ weight: 100, reps: 1 }, ex)).toBe(100);
  });
});

describe('bestScore', () => {
  it('returns -Infinity for empty history', () => {
    const ex = { fields: ['weight', 'sets', 'reps'], bodyweight: false };
    expect(bestScore([], ex)).toBe(-Infinity);
  });
});
