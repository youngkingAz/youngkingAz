export const workoutProgramSchema = {
  name: 'WorkoutProgram',
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      description: 'Program name',
    },
    level: {
      type: 'string',
      enum: ['beginner', 'intermediate', 'advanced'],
      description: 'Difficulty level',
    },
    description: {
      type: 'string',
      description: 'Program description',
    },
    duration_weeks: {
      type: 'number',
      description: 'Duration in weeks',
    },
    days_per_week: {
      type: 'number',
      description: 'Training days per week',
    },
    image_url: {
      type: 'string',
      description: 'Cover image URL',
    },
    is_premium: {
      type: 'boolean',
      default: false,
      description: 'Requires paid subscription',
    },
  },
  required: ['title', 'level'],
};

export function createWorkoutProgram(overrides = {}) {
  return {
    title: '',
    level: 'beginner',
    description: '',
    duration_weeks: 0,
    days_per_week: 0,
    image_url: '',
    is_premium: false,
    ...overrides,
  };
}

export default workoutProgramSchema;
