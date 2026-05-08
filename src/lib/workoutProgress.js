import { isSupabaseConfigured, supabase } from './supabaseClient';

const LOCAL_PROGRESS_KEY = 'youngkingaz-workout-progress';

/**
 * @typedef {object} WorkoutProgressEntry
 * @property {string} [workout_id]
 * @property {string | null} [completed_at]
 * @property {string | null} [last_opened_at]
 * @property {string | null} [updated_at]
 */

/**
 * @typedef {object} WorkoutLike
 * @property {string} [id]
 * @property {string} [program_id]
 * @property {string} [title]
 * @property {number} [week_number]
 * @property {number} [day_number]
 */

/**
 * @typedef {Record<string, Record<string, WorkoutProgressEntry[]>>} LocalProgressStore
 */

/**
 * @typedef {object} ProgressState
 * @property {Record<string, WorkoutProgressEntry>} byWorkoutId
 * @property {string[]} completedWorkoutIds
 * @property {WorkoutProgressEntry | null} latestCheckpoint
 */

/**
 * @param {string | null | undefined} userId
 * @returns {string}
 */
function getStorageUserKey(userId) {
  return userId || 'guest';
}

/**
 * @returns {LocalProgressStore}
 */
function readLocalProgressStore() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
    return rawValue ? JSON.parse(rawValue) : {};
  } catch {
    return {};
  }
}

/**
 * @param {LocalProgressStore} store
 */
function writeLocalProgressStore(store) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(store));
}

/**
 * @param {WorkoutProgressEntry[]} [entries]
 * @returns {ProgressState}
 */
export function buildProgressState(entries = []) {
  /** @type {Record<string, WorkoutProgressEntry>} */
  const byWorkoutId = {};
  let latestCheckpoint = null;

  for (const entry of entries) {
    if (!entry?.workout_id) {
      continue;
    }

    byWorkoutId[entry.workout_id] = {
      workout_id: entry.workout_id,
      completed_at: entry.completed_at || null,
      last_opened_at: entry.last_opened_at || null,
      updated_at: entry.updated_at || null,
    };

    if (entry.last_opened_at) {
      const openedAt = new Date(entry.last_opened_at).getTime();
      const latestOpenedAt = latestCheckpoint?.last_opened_at
        ? new Date(latestCheckpoint.last_opened_at).getTime()
        : 0;

      if (!latestCheckpoint || openedAt > latestOpenedAt) {
        latestCheckpoint = entry;
      }
    }
  }

  return {
    byWorkoutId,
    completedWorkoutIds: Object.values(byWorkoutId)
      .filter((entry) => Boolean(entry.completed_at))
      .map((entry) => entry.workout_id)
      .filter(
        /**
         * @param {string | undefined} workoutId
         * @returns {workoutId is string}
         */
        (workoutId) => Boolean(workoutId)
      ),
    latestCheckpoint,
  };
}

/**
 * @param {{ userId: string | null | undefined, programId: string | null | undefined }} params
 * @returns {WorkoutProgressEntry[]}
 */
function getProgramEntriesFromStore({ userId, programId }) {
  const store = readLocalProgressStore();
  const userKey = getStorageUserKey(userId);
  if (!programId) {
    return [];
  }
  return store?.[userKey]?.[programId] || [];
}

/**
 * @param {WorkoutProgressEntry[]} entries
 * @param {WorkoutProgressEntry} nextEntry
 * @returns {WorkoutProgressEntry[]}
 */
function upsertEntry(entries, nextEntry) {
  const nextEntries = [...entries];
  const existingIndex = nextEntries.findIndex((entry) => entry.workout_id === nextEntry.workout_id);

  if (existingIndex >= 0) {
    nextEntries[existingIndex] = {
      ...nextEntries[existingIndex],
      ...nextEntry,
    };
  } else {
    nextEntries.push(nextEntry);
  }

  return nextEntries;
}

/**
 * @param {{ userId: string | null | undefined, programId: string, entries: WorkoutProgressEntry[] }} params
 */
function saveProgramEntriesToStore({ userId, programId, entries }) {
  const store = readLocalProgressStore();
  const userKey = getStorageUserKey(userId);

  store[userKey] = store[userKey] || {};
  store[userKey][programId] = entries;

  writeLocalProgressStore(store);
}

/**
 * @param {{ userId: string | null | undefined, programId: string }} params
 */
function removeProgramEntriesFromStore({ userId, programId }) {
  const store = readLocalProgressStore();
  const userKey = getStorageUserKey(userId);

  if (!store?.[userKey]?.[programId]) {
    return;
  }

  delete store[userKey][programId];
  writeLocalProgressStore(store);
}

/**
 * @param {{ userId: string | null | undefined }} params
 */
function clearUserProgressFromStore({ userId }) {
  const store = readLocalProgressStore();
  const userKey = getStorageUserKey(userId);

  if (!store?.[userKey]) {
    return;
  }

  delete store[userKey];
  writeLocalProgressStore(store);
}

/**
 * @param {WorkoutLike[]} [workouts]
 * @returns {WorkoutLike[]}
 */
export function sortWorkoutsByProgramOrder(workouts = []) {
  return [...workouts].sort((a, b) => {
    const weekA = a.week_number || 0;
    const weekB = b.week_number || 0;
    const dayA = a.day_number || 0;
    const dayB = b.day_number || 0;

    if (weekA !== weekB) {
      return weekA - weekB;
    }

    if (dayA !== dayB) {
      return dayA - dayB;
    }

    return String(a.title || '').localeCompare(String(b.title || ''));
  });
}

/**
 * @param {WorkoutLike[]} [workouts]
 * @param {ProgressState | Record<string, never>} [progressState]
 * @returns {Record<string, { isCompleted: boolean, isUnlocked: boolean, progress: WorkoutProgressEntry | undefined }>}
 */
export function buildWorkoutAccessMap(workouts = [], progressState = {}) {
  const orderedWorkouts = sortWorkoutsByProgramOrder(workouts);
  const progressMap = 'byWorkoutId' in progressState ? progressState.byWorkoutId : {};
  /** @type {Record<string, { isCompleted: boolean, isUnlocked: boolean, progress: WorkoutProgressEntry | undefined }>} */
  const accessMap = {};
  let progressionOpen = true;

  for (const workout of orderedWorkouts) {
    const workoutId = workout.id || '';
    const progress = progressMap[workoutId];
    const isCompleted = Boolean(progress?.completed_at);
    const isUnlocked = progressionOpen || isCompleted;

    accessMap[workoutId] = {
      isCompleted,
      isUnlocked,
      progress,
    };

    if (progressionOpen && !isCompleted) {
      progressionOpen = false;
    }
  }

  return accessMap;
}

/**
 * @param {{ userId: string | null | undefined, programId: string | null | undefined }} params
 * @returns {Promise<ProgressState>}
 */
export async function fetchWorkoutProgress({ userId, programId }) {
  if (!programId) {
    return buildProgressState([]);
  }

  if (!isSupabaseConfigured || !userId) {
    return buildProgressState(getProgramEntriesFromStore({ userId, programId }));
  }

  const { data, error } = await supabase
    .from('workout_progress')
    .select('workout_id, completed_at, last_opened_at, updated_at')
    .eq('user_id', userId)
    .eq('program_id', programId);

  if (error) {
    console.warn('[YoungKingAz] Could not load workout progress:', error.message);
    return buildProgressState(getProgramEntriesFromStore({ userId, programId }));
  }

  return buildProgressState(data || []);
}

/**
 * @param {{ userId: string | null | undefined, workout: WorkoutLike | null | undefined }} params
 */
export async function saveWorkoutCheckpoint({ userId, workout }) {
  if (!workout?.id || !workout?.program_id) {
    return;
  }

  const timestamp = new Date().toISOString();

  if (!isSupabaseConfigured || !userId) {
    const entries = getProgramEntriesFromStore({ userId, programId: workout.program_id });
    const nextEntries = upsertEntry(entries, {
      workout_id: workout.id,
      last_opened_at: timestamp,
      updated_at: timestamp,
    });

    saveProgramEntriesToStore({
      userId,
      programId: workout.program_id,
      entries: nextEntries,
    });
    return;
  }

  const { error } = await supabase
    .from('workout_progress')
    .upsert(
      {
        user_id: userId,
        program_id: workout.program_id,
        workout_id: workout.id,
        last_opened_at: timestamp,
        updated_at: timestamp,
      },
      {
        onConflict: 'user_id,workout_id',
      },
    );

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * @param {{ userId: string | null | undefined, workout: WorkoutLike | null | undefined }} params
 */
export async function completeWorkout({ userId, workout }) {
  if (!workout?.id || !workout?.program_id) {
    throw new Error('No workout selected.');
  }

  const timestamp = new Date().toISOString();

  if (!isSupabaseConfigured || !userId) {
    const entries = getProgramEntriesFromStore({ userId, programId: workout.program_id });
    const nextEntries = upsertEntry(entries, {
      workout_id: workout.id,
      completed_at: timestamp,
      last_opened_at: timestamp,
      updated_at: timestamp,
    });

    saveProgramEntriesToStore({
      userId,
      programId: workout.program_id,
      entries: nextEntries,
    });

    return;
  }

  const { error } = await supabase
    .from('workout_progress')
    .upsert(
      {
        user_id: userId,
        program_id: workout.program_id,
        workout_id: workout.id,
        completed_at: timestamp,
        last_opened_at: timestamp,
        updated_at: timestamp,
      },
      {
        onConflict: 'user_id,workout_id',
      },
    );

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * @param {{ userId: string | null | undefined, programId: string | null | undefined }} params
 */
export async function resetProgramProgress({ userId, programId }) {
  if (!programId) {
    throw new Error('No program selected.');
  }

  if (!isSupabaseConfigured || !userId) {
    removeProgramEntriesFromStore({ userId, programId });
    return;
  }

  const timestamp = new Date().toISOString();

  const { error } = await supabase
    .from('workout_progress')
    .update({
      completed_at: null,
      last_opened_at: null,
      updated_at: timestamp,
    })
    .eq('user_id', userId)
    .eq('program_id', programId);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * @param {{ userId: string | null | undefined }} params
 */
export async function resetAllWorkoutProgress({ userId }) {
  if (!isSupabaseConfigured || !userId) {
    clearUserProgressFromStore({ userId });
    return;
  }

  const timestamp = new Date().toISOString();

  const { error } = await supabase
    .from('workout_progress')
    .update({
      completed_at: null,
      last_opened_at: null,
      updated_at: timestamp,
    })
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
}
