import { describe, it, expect } from 'vitest';
import { DEFAULT_SCHEMA, newExerciseId } from '../src/schema.js';

describe('DEFAULT_SCHEMA', () => {
  it('has 4 days', () => expect(DEFAULT_SCHEMA).toHaveLength(4));
  it('has correct exercise ids', () => {
    const ids = DEFAULT_SCHEMA.flatMap(d => d.exercises.map(e => e.id));
    expect(ids).toContain('d1_ohp');
    expect(ids).toContain('d4_sprint');
  });
  it('sprint is cardio', () => {
    const sprint = DEFAULT_SCHEMA[3].exercises[0];
    expect(sprint.fields).toContain('time');
  });
});

describe('newExerciseId', () => {
  it('generates unique ids', () => {
    const a = newExerciseId(0);
    const b = newExerciseId(0);
    expect(a).not.toBe(b);
  });
  it('includes day prefix', () => {
    expect(newExerciseId(0)).toMatch(/^d1_c/);
  });
});
