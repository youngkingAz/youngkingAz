export const workoutExerciseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      description: 'Exercise name',
    },
    sets: {
      type: 'number',
      description: 'Number of sets',
    },
    reps: {
      type: 'string',
      description: 'Rep range or target reps',
    },
    rest_seconds: {
      type: 'number',
      description: 'Rest time in seconds',
    },
    video_url: {
      type: 'string',
      description: 'Exercise video URL',
    },
    notes: {
      type: 'string',
      description: 'Extra coaching notes',
    },
  },
  required: ['name'],
};

export const workoutSchema = {
  name: 'Workout',
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      description: 'Workout name',
    },
    program_id: {
      type: 'string',
      description: 'Associated program ID',
    },
    day_number: {
      type: 'number',
      description: 'Day number in the program',
    },
    week_number: {
      type: 'number',
      description: 'Week number in the program',
    },
    muscle_group: {
      type: 'string',
      description: 'Target muscle group (e.g. Chest & Triceps)',
    },
    estimated_minutes: {
      type: 'number',
      description: 'Estimated duration in minutes',
    },
    exercises: {
      type: 'array',
      description: 'List of exercises',
      items: workoutExerciseSchema,
    },
  },
  required: ['title', 'program_id'],
};

export function createWorkout(overrides = {}) {
  return {
    title: '',
    program_id: '',
    day_number: 1,
    week_number: 1,
    muscle_group: '',
    estimated_minutes: 0,
    exercises: [],
    ...overrides,
  };
}

export default workoutSchema;
