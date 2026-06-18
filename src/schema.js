import { sGet, sSet, KEYS } from './storage.js';

export const DEFAULT_SCHEMA = [
  {
    title: 'Upper Body',
    subtitle: 'Push / Pull',
    exercises: [
      { id: 'd1_ohp',     name: 'Overhead Press',          muscle: 'Upper Chest / Shoulders', fields: ['weight','sets','reps'], bodyweight: false, targetReps: 8,  increment: 2.5, restSec: 120 },
      { id: 'd1_pullup',  name: 'Pull-ups',                muscle: 'Lats',                    fields: ['weight','sets','reps'], bodyweight: true,  targetReps: 8,  increment: 2.5, restSec: 120 },
      { id: 'd1_dips',    name: 'Dips',                    muscle: 'Chest / Triceps',         fields: ['weight','sets','reps'], bodyweight: true,  targetReps: 10, increment: 2.5, restSec: 120 },
      { id: 'd1_facepull',name: 'Face Pulls',              muscle: 'Mid Back',                fields: ['weight','sets','reps'], bodyweight: false, targetReps: 15, increment: 2.5, restSec: 60 },
      { id: 'd1_lat',     name: 'Lateral Raises',          muscle: 'Shoulders',               fields: ['weight','sets','reps'], bodyweight: false, targetReps: 16, increment: 1,   restSec: 60 },
      { id: 'd1_crunch',  name: 'Cable Crunch',            muscle: 'Abs',                     fields: ['weight','sets','reps'], bodyweight: false, targetReps: 12, increment: 5,   restSec: 60 },
    ],
  },
  {
    title: 'Lower Body',
    subtitle: 'Glutes / Hamstrings',
    exercises: [
      { id: 'd2_bulg',    name: 'Bulgarian Split Squat',   muscle: 'Glutes',                  fields: ['weight','sets','reps'], bodyweight: false, targetReps: 10, increment: 2,   restSec: 90 },
      { id: 'd2_nordic',  name: 'Nordic H-Curl',           muscle: 'Hamstrings (met band)',   fields: ['weight','sets','reps'], bodyweight: true,  targetReps: 12, increment: 0,   restSec: 90 },
      { id: 'd2_rdl',     name: 'DB Romanian Deadlift',    muscle: 'Hamstrings',              fields: ['weight','sets','reps'], bodyweight: false, targetReps: 10, increment: 2,   restSec: 120 },
      { id: 'd2_kb',      name: 'KB Swings',               muscle: 'Posterior Chain',         fields: ['weight','sets','reps'], bodyweight: false, targetReps: 30, increment: 4,   restSec: 30 },
      { id: 'd2_hang',    name: 'Hanging Leg Raises',      muscle: 'Lower Abs',               fields: ['weight','sets','reps'], bodyweight: true,  targetReps: 10, increment: 0,   restSec: 60 },
      { id: 'd2_crunch',  name: 'Cable Crunch',            muscle: 'Abs',                     fields: ['weight','sets','reps'], bodyweight: false, targetReps: 12, increment: 5,   restSec: 60 },
    ],
  },
  {
    title: 'Upper Body',
    subtitle: 'Push / Pull',
    exercises: [
      { id: 'd3_ohp',     name: 'Overhead Press',          muscle: 'Shoulders',               fields: ['weight','sets','reps'], bodyweight: false, targetReps: 8,  increment: 2.5, restSec: 120 },
      { id: 'd3_tbar',    name: 'T-Bar Row',               muscle: 'Back',                    fields: ['weight','sets','reps'], bodyweight: false, targetReps: 12, increment: 2,   restSec: 90 },
      { id: 'd3_incline', name: 'Incline Press',           muscle: 'Upper Chest',             fields: ['weight','sets','reps'], bodyweight: false, targetReps: 8,  increment: 2.5, restSec: 120 },
      { id: 'd3_facepull',name: 'Face Pulls',              muscle: 'Shoulder Health',         fields: ['weight','sets','reps'], bodyweight: false, targetReps: 15, increment: 2.5, restSec: 60 },
      { id: 'd3_lat',     name: 'Lateral Raises',          muscle: 'Shoulder Cap',            fields: ['weight','sets','reps'], bodyweight: false, targetReps: 16, increment: 1,   restSec: 60 },
      { id: 'd3_crunch',  name: 'Cable Crunch',            muscle: 'Abs',                     fields: ['weight','sets','reps'], bodyweight: false, targetReps: 12, increment: 5,   restSec: 60 },
    ],
  },
  {
    title: 'Sprints',
    subtitle: 'Cardio / Conditie',
    exercises: [
      { id: 'd4_sprint',  name: 'Sprint Training',         muscle: '100m intervals',          fields: ['distance','sets','time'], restSec: 120 },
    ],
  },
];

let _schema = null;

export function loadSchema() {
  const raw = sGet(KEYS.SCHEMA);
  if (raw) {
    try {
      _schema = JSON.parse(raw);
      return;
    } catch {
      // fall through
    }
  }
  _schema = JSON.parse(JSON.stringify(DEFAULT_SCHEMA));
}

export function getSchema() {
  if (!_schema) loadSchema();
  return _schema;
}

export function saveSchema(newSchema) {
  _schema = newSchema;
  sSet(KEYS.SCHEMA, JSON.stringify(newSchema));
}

export function findExercise(schema, exerciseId) {
  for (const day of schema) {
    for (const ex of day.exercises) {
      if (ex.id === exerciseId) return ex;
    }
  }
  return null;
}

export function getAllExercises(schema) {
  return schema.flatMap(day => day.exercises);
}

let _idCounter = Date.now();

export function newExerciseId(dayIndex) {
  _idCounter++;
  return `d${dayIndex + 1}_c${_idCounter}`;
}
