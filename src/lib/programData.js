import advancedProgramImage from '../assets/advanced-program.jpeg';
import onlyAbsProgramImage from '../assets/advanced-program.png';
import beginnerProgramImage from '../assets/beginner-program.jpeg';
import intermediateProgramImage from '../assets/intermediate-program.jpeg';

/**
 * @typedef {object} ProgramLike
 * @property {string} [id]
 * @property {string} [title]
 * @property {'beginner' | 'only_abs' | 'intermediate' | 'advanced' | string} [level]
 * @property {string} [description]
 * @property {number} [duration_weeks]
 * @property {number} [days_per_week]
 * @property {string} [image_url]
 * @property {string} [image_position]
 * @property {boolean} [is_premium]
 * @property {number} [price_monthly]
 * @property {string} [price_label]
 */

/** @type {Record<string, { image_url: string, image_position: string, price_monthly: number, price_label: string }>} */
export const programImageDefaults = {
  beginner: {
    image_url: beginnerProgramImage,
    image_position: 'center',
    price_monthly: 0,
    price_label: 'Free',
  },
  only_abs: {
    image_url: onlyAbsProgramImage,
    image_position: 'center 68%',
    price_monthly: 2.99,
    price_label: '$2.99/month',
  },
  intermediate: {
    image_url: intermediateProgramImage,
    image_position: 'center 28%',
    price_monthly: 10,
    price_label: '$10/month',
  },
  advanced: {
    image_url: advancedProgramImage,
    image_position: 'center',
    price_monthly: 15,
    price_label: '$15/month',
  },
};

export const samplePrograms = [
  {
    id: 'beginner-program',
    title: 'Beginner Program',
    level: 'beginner',
    description: 'Build consistency, learn form, and lock in your foundation with 5 beginner workouts each week.',
    duration_weeks: 5,
    days_per_week: 5,
    image_url: beginnerProgramImage,
    image_position: 'center',
    is_premium: false,
    price_monthly: 0,
    price_label: 'Free',
  },
  {
    id: 'only-abs-program',
    title: 'Only Abs',
    level: 'only_abs',
    description:
      'YoungKingAz Only Abs Workout. Follow all 21 weeks, stay locked in, and build toward abs like YoungKingAz.',
    duration_weeks: 21,
    days_per_week: 5,
    image_url: onlyAbsProgramImage,
    image_position: 'center 68%',
    is_premium: true,
    price_monthly: 2.99,
    price_label: '$2.99/month',
  },
  {
    id: 'intermediate-program',
    title: 'Intermediate Program',
    level: 'intermediate',
    description: 'Push harder for 8 weeks with 5 workout days, then use Friday as a YoungKingAz rest day to eat good and pick it back up Monday.',
    duration_weeks: 8,
    days_per_week: 5,
    image_url: intermediateProgramImage,
    image_position: 'center 28%',
    is_premium: true,
    price_monthly: 10,
    price_label: '$10/month',
  },
  {
    id: 'advanced-program',
    title: 'Advanced Program',
    level: 'advanced',
    description: 'Train at a higher level with 21 weeks of custom YoungKingAz advanced strength, size, and conditioning work.',
    duration_weeks: 21,
    days_per_week: 5,
    image_url: advancedProgramImage,
    image_position: 'center',
    is_premium: true,
    price_monthly: 15,
    price_label: '$15/month',
  },
];

/**
 * @param {ProgramLike[]} [programs]
 * @returns {ProgramLike[]}
 */
export function mergeProgramsWithSamples(programs = []) {
  const mergedPrograms = [...programs];
  const existingKeys = new Set(
    programs.map((program) => `${program?.id || ''}::${program?.level || ''}`),
  );

  for (const sampleProgram of samplePrograms) {
    const sampleKey = `${sampleProgram.id}::${sampleProgram.level}`;
    const hasSameLevel = programs.some((program) => program?.level === sampleProgram.level);

    if (!existingKeys.has(sampleKey) && !hasSameLevel) {
      mergedPrograms.push(sampleProgram);
    }
  }

  return mergedPrograms.map(enrichProgram);
}

const beginnerWeeklyTemplates = [
  {
    title: 'Upper Body Foundation',
    muscle_group: 'Chest, Shoulders & Triceps',
    estimated_minutes: 35,
    exercises: [
      { name: 'Pushups', sets: 4, reps: '10-15', rest_seconds: 45, notes: 'Drop to knees if needed, but keep every rep clean.' },
      { name: 'Incline Pushups', sets: 3, reps: '12', rest_seconds: 45, notes: 'Use a bench, chair, or wall to control the difficulty.' },
      { name: 'Bench Dips', sets: 3, reps: '10-12', rest_seconds: 45, notes: 'Keep shoulders down and elbows tracking back.' },
    ],
  },
  {
    title: 'Lower Body Basics',
    muscle_group: 'Legs & Glutes',
    estimated_minutes: 38,
    exercises: [
      { name: 'Bodyweight Squats', sets: 4, reps: '15', rest_seconds: 60, notes: 'Drive through your heels and keep your chest tall.' },
      { name: 'Reverse Lunges', sets: 3, reps: '10 each', rest_seconds: 45, notes: 'Step back with control and stay balanced.' },
      { name: 'Glute Bridges', sets: 3, reps: '15', rest_seconds: 40, notes: 'Squeeze your glutes hard at the top.' },
    ],
  },
  {
    title: 'Core Control',
    muscle_group: 'Abs & Core',
    estimated_minutes: 28,
    exercises: [
      { name: 'Crunches', sets: 3, reps: '18', rest_seconds: 30, notes: 'Exhale and squeeze at the top.' },
      { name: 'Dead Bugs', sets: 3, reps: '10 each', rest_seconds: 30, notes: 'Keep your lower back pinned down.' },
      { name: 'Plank Hold', sets: 3, reps: '30 seconds', rest_seconds: 30, notes: 'Brace your core and keep your hips level.' },
    ],
  },
  {
    title: 'Full Body Starter',
    muscle_group: 'Full Body',
    estimated_minutes: 42,
    exercises: [
      { name: 'Jumping Jacks', sets: 3, reps: '40 seconds', rest_seconds: 25, notes: 'Stay light on your feet and keep moving.' },
      { name: 'Squat to Reach', sets: 3, reps: '12', rest_seconds: 40, notes: 'Reach up tall after every squat.' },
      { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', rest_seconds: 30, notes: 'Keep hips low and move at a steady pace.' },
    ],
  },
  {
    title: 'Mobility & Conditioning',
    muscle_group: 'Mobility & Cardio',
    estimated_minutes: 32,
    exercises: [
      { name: 'High Knees', sets: 3, reps: '30 seconds', rest_seconds: 30, notes: 'Move fast but stay under control.' },
      { name: 'Arm Circles', sets: 3, reps: '20 each way', rest_seconds: 20, notes: 'Keep shoulders relaxed and controlled.' },
      { name: 'Walkout Planks', sets: 3, reps: '8', rest_seconds: 45, notes: 'Walk hands out slowly and brace your core.' },
    ],
  },
];

const beginnerProgressionNotes = [
  'Focus on learning the movement and finishing every set with good form.',
  'Add 2 reps per set where you can and keep rest times honest.',
  'Move smoother this week and keep your core tight on every exercise.',
  'Push the pace a little more while keeping clean form.',
  'Finish strong. This week is about confidence, consistency, and control.',
];

const beginnerWorkouts = Array.from({ length: 5 }, (_, weekIndex) =>
  beginnerWeeklyTemplates.map((template, dayIndex) => ({
    id: `beginner-wk${weekIndex + 1}-day${dayIndex + 1}`,
    program_id: 'beginner-program',
    title: `${template.title} ${weekIndex + 1}`,
    week_number: weekIndex + 1,
    day_number: dayIndex + 1,
    muscle_group: template.muscle_group,
    estimated_minutes: template.estimated_minutes + weekIndex * 2,
    exercises: template.exercises.map((exercise) => ({
      ...exercise,
      notes: `${exercise.notes} Week ${weekIndex + 1}: ${beginnerProgressionNotes[weekIndex]}`,
    })),
  })),
).flat();

const onlyAbsWeeklyTemplates = [
  {
    title: 'YoungKingAz Core Foundation',
    muscle_group: 'Upper Abs & Core Control',
    estimated_minutes: 24,
    exercises: [
      { name: 'Controlled Crunches', sets: 4, reps: '20', rest_seconds: 30, notes: 'Slow down and squeeze like every rep matters.' },
      { name: 'Dead Bugs', sets: 4, reps: '12 each', rest_seconds: 25, notes: 'Keep your lower back down and move with control.' },
      { name: 'Plank Hold', sets: 3, reps: '45 seconds', rest_seconds: 30, notes: 'Brace hard and keep your body in one straight line.' },
    ],
  },
  {
    title: 'YoungKingAz Lower Abs',
    muscle_group: 'Lower Abs',
    estimated_minutes: 26,
    exercises: [
      { name: 'Reverse Crunches', sets: 4, reps: '16', rest_seconds: 30, notes: 'Curl your hips up using your abs, not momentum.' },
      { name: 'Leg Raises', sets: 4, reps: '12-15', rest_seconds: 35, notes: 'Lower slow and stop before your back arches.' },
      { name: 'Flutter Kicks', sets: 3, reps: '40 seconds', rest_seconds: 25, notes: 'Keep your legs low and core tight.' },
    ],
  },
  {
    title: 'YoungKingAz Oblique Cut',
    muscle_group: 'Obliques',
    estimated_minutes: 25,
    exercises: [
      { name: 'Russian Twists', sets: 4, reps: '30 total', rest_seconds: 30, notes: 'Twist through your torso and keep your chest up.' },
      { name: 'Side Plank Dips', sets: 3, reps: '12 each', rest_seconds: 30, notes: 'Move slow and feel your obliques work.' },
      { name: 'Bicycle Crunches', sets: 4, reps: '30 total', rest_seconds: 30, notes: 'Bring shoulder to opposite knee with clean rotation.' },
    ],
  },
  {
    title: 'YoungKingAz Abs Burnout',
    muscle_group: 'Full Abs Burn',
    estimated_minutes: 28,
    exercises: [
      { name: 'Mountain Climbers', sets: 4, reps: '45 seconds', rest_seconds: 25, notes: 'Drive knees fast while keeping hips low.' },
      { name: 'Toe Touches', sets: 4, reps: '18', rest_seconds: 25, notes: 'Reach up and squeeze your upper abs each rep.' },
      { name: 'Plank Shoulder Taps', sets: 3, reps: '24 total', rest_seconds: 30, notes: 'Fight hip rotation and stay locked in.' },
    ],
  },
  {
    title: 'YoungKingAz Definition Day',
    muscle_group: 'Abs Detail & Endurance',
    estimated_minutes: 30,
    exercises: [
      { name: 'Hollow Body Hold', sets: 4, reps: '30 seconds', rest_seconds: 30, notes: 'Keep your ribs down and abs tight.' },
      { name: 'V-Ups', sets: 4, reps: '12', rest_seconds: 35, notes: 'Reach hands and feet together with control.' },
      { name: 'Plank Saw', sets: 3, reps: '35 seconds', rest_seconds: 30, notes: 'Shift forward and back while staying braced.' },
    ],
  },
];

const onlyAbsProgressionNotes = [
  'Start clean. Learn the squeeze and control every rep.',
  'Add intensity by cutting wasted rest and keeping tension.',
  'Lock in your breathing and keep your core braced.',
  'Every rep should feel sharper and more controlled.',
  'Start chasing the burn without losing form.',
  'Push your plank holds and finish every set strong.',
  'Keep the abs tight from the first movement to the last.',
  'Add range of motion where you can and stay disciplined.',
  'This is where the grind starts showing. Do not rush reps.',
  'Stay consistent. Your abs need the full plan, not one good week.',
  'Tighten up rest times and keep every set honest.',
  'Make each movement cleaner than last week.',
  'Hold tension longer and do not let your lower back take over.',
  'Push through the burn and keep your breathing under control.',
  'Stay locked in. These weeks build the definition.',
  'Move with purpose. No lazy reps.',
  'Add power to the controlled movements and finish with pride.',
  'This is the championship stretch. Stay consistent.',
  'Every rep should look like you mean it.',
  'Finish the plan with discipline and confidence.',
  'Final week. Prove to yourself you stayed YoungKingAz locked in.',
];

const onlyAbsWorkouts = Array.from({ length: 21 }, (_, weekIndex) =>
  onlyAbsWeeklyTemplates.map((template, dayIndex) => ({
    id: `abs-wk${weekIndex + 1}-day${dayIndex + 1}`,
    program_id: 'only-abs-program',
    title: `${template.title} ${weekIndex + 1}`,
    week_number: weekIndex + 1,
    day_number: dayIndex + 1,
    muscle_group: template.muscle_group,
    estimated_minutes: template.estimated_minutes + Math.floor(weekIndex / 4),
    exercises: template.exercises.map((exercise) => ({
      ...exercise,
      notes: `${exercise.notes} Week ${weekIndex + 1}: ${onlyAbsProgressionNotes[weekIndex]}`,
    })),
  })),
).flat();

const intermediateWeeklyTemplates = [
  {
    title: 'YoungKingAz Monday Push',
    muscle_group: 'Chest, Shoulders & Triceps',
    estimated_minutes: 52,
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Control the weight and press with power.' },
      { name: 'Incline Pushups', sets: 4, reps: '15', rest_seconds: 45, notes: 'Keep your body straight and chest working.' },
      { name: 'Shoulder Press', sets: 4, reps: '10', rest_seconds: 60, notes: 'Brace your core and avoid leaning back.' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest_seconds: 45, notes: 'Keep elbows tucked and squeeze the finish.' },
    ],
  },
  {
    title: 'YoungKingAz Tuesday Pull',
    muscle_group: 'Back & Biceps',
    estimated_minutes: 54,
    exercises: [
      { name: 'Pullups or Assisted Pullups', sets: 4, reps: '8-12', rest_seconds: 75, notes: 'Use full range and stay controlled.' },
      { name: 'Dumbbell Rows', sets: 4, reps: '10 each', rest_seconds: 60, notes: 'Pull elbow back and squeeze your back.' },
      { name: 'Lat Pulldowns', sets: 3, reps: '12', rest_seconds: 60, notes: 'Drive elbows down and keep chest tall.' },
      { name: 'Dumbbell Curls', sets: 3, reps: '12', rest_seconds: 45, notes: 'Control the negative every rep.' },
    ],
  },
  {
    title: 'YoungKingAz Wednesday Legs',
    muscle_group: 'Legs & Glutes',
    estimated_minutes: 56,
    exercises: [
      { name: 'Goblet Squats', sets: 4, reps: '12', rest_seconds: 75, notes: 'Sit deep and drive up strong.' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '10', rest_seconds: 75, notes: 'Hinge clean and feel your hamstrings.' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each', rest_seconds: 60, notes: 'Keep steps controlled and balanced.' },
      { name: 'Standing Calf Raises', sets: 4, reps: '20', rest_seconds: 35, notes: 'Pause at the top and control down.' },
    ],
  },
  {
    title: 'YoungKingAz Thursday Core & Conditioning',
    muscle_group: 'Core & Conditioning',
    estimated_minutes: 45,
    exercises: [
      { name: 'Mountain Climbers', sets: 4, reps: '40 seconds', rest_seconds: 25, notes: 'Keep hips low and move with pace.' },
      { name: 'Leg Raises', sets: 4, reps: '12-15', rest_seconds: 35, notes: 'Control the lower and keep your core tight.' },
      { name: 'Russian Twists', sets: 3, reps: '30 total', rest_seconds: 30, notes: 'Rotate clean without swinging.' },
      { name: 'Burpees', sets: 3, reps: '10', rest_seconds: 45, notes: 'Stay explosive and clean.' },
    ],
  },
  {
    title: 'YoungKingAz Friday Rest & Eat Good',
    muscle_group: 'Recovery & Nutrition',
    estimated_minutes: 20,
    exercises: [
      { name: 'Walk & Stretch', sets: 1, reps: '20 minutes', rest_seconds: 0, notes: 'Keep it light. Let your body recover.' },
      { name: 'Hydration Check', sets: 1, reps: 'All day', rest_seconds: 0, notes: 'Drink water and keep your body ready.' },
      { name: 'Eat Good Meal Prep', sets: 1, reps: '1 plan', rest_seconds: 0, notes: 'Get protein, carbs, and clean food ready so you can pick it up again Monday.' },
    ],
  },
];

const intermediateProgressionNotes = [
  'Set the rhythm and learn the weekly order.',
  'Add a little more control and keep rest honest.',
  'Push one extra clean rep when you can.',
  'Move sharper and stay locked in through the full week.',
  'Keep intensity high but do not sacrifice form.',
  'This is where consistency starts showing.',
  'Push the pace and finish every workout strong.',
  'Final week. Prove you can complete the whole YoungKingAz intermediate grind.',
];

const intermediateWorkouts = Array.from({ length: 8 }, (_, weekIndex) =>
  intermediateWeeklyTemplates.map((template, dayIndex) => ({
    id: `intermediate-wk${weekIndex + 1}-day${dayIndex + 1}`,
    program_id: 'intermediate-program',
    title: `${template.title} ${weekIndex + 1}`,
    week_number: weekIndex + 1,
    day_number: dayIndex + 1,
    muscle_group: template.muscle_group,
    estimated_minutes: template.estimated_minutes + Math.floor(weekIndex / 3) * 2,
    exercises: template.exercises.map((exercise) => ({
      ...exercise,
      notes: `${exercise.notes} Week ${weekIndex + 1}: ${intermediateProgressionNotes[weekIndex]}`,
    })),
  })),
).flat();

const advancedWeeklyTemplates = [
  {
    title: 'YoungKingAz Power Push',
    muscle_group: 'Chest, Shoulders & Triceps',
    estimated_minutes: 68,
    exercises: [
      { name: 'Heavy Bench Press', sets: 5, reps: '5', rest_seconds: 120, notes: 'Brace hard, control the descent, and press with power.' },
      { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Pause at the bottom and drive through the top.' },
      { name: 'Weighted Dips', sets: 4, reps: '8-12', rest_seconds: 90, notes: 'Stay upright for triceps or lean forward for chest emphasis.' },
      { name: 'Cable Fly Finisher', sets: 3, reps: '15', rest_seconds: 45, notes: 'Squeeze hard and keep tension through every rep.' },
    ],
  },
  {
    title: 'YoungKingAz Pull Density',
    muscle_group: 'Back & Biceps',
    estimated_minutes: 70,
    exercises: [
      { name: 'Pullups', sets: 5, reps: '8-12', rest_seconds: 90, notes: 'Use clean full reps and avoid swinging.' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Pull elbows back and keep your torso locked.' },
      { name: 'Lat Pulldown', sets: 4, reps: '10-12', rest_seconds: 75, notes: 'Drive elbows down and squeeze your lats.' },
      { name: 'Hammer Curls', sets: 4, reps: '12', rest_seconds: 45, notes: 'Control the negative and keep wrists neutral.' },
    ],
  },
  {
    title: 'YoungKingAz Leg Drive',
    muscle_group: 'Legs & Glutes',
    estimated_minutes: 72,
    exercises: [
      { name: 'Back Squats', sets: 5, reps: '5-8', rest_seconds: 120, notes: 'Stay tight, hit depth, and drive through your heels.' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Hinge slow and stretch the hamstrings.' },
      { name: 'Walking Lunges', sets: 4, reps: '12 each', rest_seconds: 75, notes: 'Keep steps controlled and chest tall.' },
      { name: 'Calf Raises', sets: 5, reps: '18-25', rest_seconds: 40, notes: 'Pause at the top and stretch at the bottom.' },
    ],
  },
  {
    title: 'YoungKingAz Athletic Core',
    muscle_group: 'Core & Conditioning',
    estimated_minutes: 60,
    exercises: [
      { name: 'Hanging Leg Raises', sets: 4, reps: '12-15', rest_seconds: 60, notes: 'Curl your hips up and control the lower.' },
      { name: 'Cable Woodchoppers', sets: 4, reps: '12 each', rest_seconds: 45, notes: 'Rotate through the core, not just the arms.' },
      { name: 'Burpees', sets: 4, reps: '12', rest_seconds: 45, notes: 'Stay explosive without getting sloppy.' },
      { name: 'Battle Rope Slams', sets: 5, reps: '30 seconds', rest_seconds: 35, notes: 'Keep intensity high and core braced.' },
    ],
  },
  {
    title: 'YoungKingAz Full Body Elite',
    muscle_group: 'Full Body Strength',
    estimated_minutes: 75,
    exercises: [
      { name: 'Deadlifts', sets: 5, reps: '4-6', rest_seconds: 150, notes: 'Set your back, push the floor away, and lock out strong.' },
      { name: 'Push Press', sets: 4, reps: '6-8', rest_seconds: 90, notes: 'Use legs for power and finish overhead locked.' },
      { name: 'Dumbbell Row', sets: 4, reps: '10 each', rest_seconds: 75, notes: 'Pull hard and keep your shoulder packed.' },
      { name: 'Farmer Carries', sets: 4, reps: '40 yards', rest_seconds: 60, notes: 'Walk tall, brace your abs, and grip hard.' },
    ],
  },
];

const advancedProgressionNotes = [
  'Set the baseline. Clean heavy reps only.',
  'Add small weight or one clean rep where possible.',
  'Control the tempo and make every set sharper.',
  'Push intensity without breaking form.',
  'Deload slightly if needed, then finish every rep clean.',
  'Start building heavier working sets.',
  'Stay locked in through fatigue and keep technique tight.',
  'Add density by shortening rest where form allows.',
  'Chase strength and size together this week.',
  'Make the last set your best controlled effort.',
  'Reset focus and attack the next phase.',
  'Push volume with discipline, not ego.',
  'Keep core braced on every lift.',
  'Move powerful but stay smooth.',
  'This is where advanced consistency separates you.',
  'Add intensity and finish every accessory with purpose.',
  'Stay explosive on compounds and strict on accessories.',
  'Lock into championship-level focus.',
  'Peak week energy. Execute every set clean.',
  'Prove the work with strong controlled sessions.',
  'Final week. Finish like YoungKingAz and own the grind.',
];

const advancedWorkouts = Array.from({ length: 21 }, (_, weekIndex) =>
  advancedWeeklyTemplates.map((template, dayIndex) => ({
    id: `advanced-wk${weekIndex + 1}-day${dayIndex + 1}`,
    program_id: 'advanced-program',
    title: `${template.title} ${weekIndex + 1}`,
    week_number: weekIndex + 1,
    day_number: dayIndex + 1,
    muscle_group: template.muscle_group,
    estimated_minutes: template.estimated_minutes + Math.floor(weekIndex / 5) * 3,
    exercises: template.exercises.map((exercise) => ({
      ...exercise,
      notes: `${exercise.notes} Week ${weekIndex + 1}: ${advancedProgressionNotes[weekIndex]}`,
    })),
  })),
).flat();

export const sampleWorkouts = [
  ...beginnerWorkouts,
  ...onlyAbsWorkouts,
  ...intermediateWorkouts,
  ...advancedWorkouts,
];

/**
 * @param {ProgramLike | null | undefined} program
 * @returns {ProgramLike}
 */
export function enrichProgram(program) {
  const levelKey = program?.level || '';
  const defaults = programImageDefaults[levelKey] || {};
  const sampleByLevel = samplePrograms.find((sampleProgram) => sampleProgram.level === levelKey);
  const shouldUseSampleCopy = ['advanced', 'only_abs', 'intermediate', 'beginner'].includes(levelKey);

  return {
    ...program,
    description: shouldUseSampleCopy
      ? sampleByLevel?.description || program?.description || ''
      : program?.description || sampleByLevel?.description || '',
    duration_weeks: shouldUseSampleCopy
      ? sampleByLevel?.duration_weeks || program?.duration_weeks || undefined
      : program?.duration_weeks || sampleByLevel?.duration_weeks || undefined,
    days_per_week: shouldUseSampleCopy
      ? sampleByLevel?.days_per_week || program?.days_per_week || undefined
      : program?.days_per_week || sampleByLevel?.days_per_week || undefined,
    image_url: program?.image_url || defaults.image_url || '',
    image_position: program?.image_position || defaults.image_position || 'center',
    price_monthly:
      typeof program?.price_monthly === 'number'
        ? program.price_monthly
        : typeof defaults.price_monthly === 'number'
          ? defaults.price_monthly
          : 0,
    price_label:
      program?.price_label ||
      defaults.price_label ||
      (typeof program?.price_monthly === 'number' && program.price_monthly > 0
        ? `$${program.price_monthly}/month`
        : 'Free'),
  };
}
