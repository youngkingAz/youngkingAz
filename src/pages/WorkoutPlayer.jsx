import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import ExerciseCard from '../components/workout/ExerciseCard';
import OnlyAbsAudioPlayer from '../components/workout/OnlyAbsAudioPlayer';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from '../lib/AuthContext';
import { sampleWorkouts } from '../lib/programData';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import {
  buildWorkoutAccessMap,
  completeWorkout,
  fetchWorkoutProgress,
  saveWorkoutCheckpoint,
  sortWorkoutsByProgramOrder,
} from '../lib/workoutProgress';

/**
 * @typedef {object} ExerciseLike
 * @property {string} [name]
 * @property {number} [sets]
 * @property {string | number} [reps]
 * @property {number} [rest_seconds]
 * @property {string} [notes]
 */

/**
 * @typedef {object} WorkoutLike
 * @property {string} [id]
 * @property {string} [program_id]
 * @property {string} [title]
 * @property {number} [day_number]
 * @property {number} [week_number]
 * @property {string} [muscle_group]
 * @property {number} [estimated_minutes]
 * @property {ExerciseLike[]} [exercises]
 */

/** @type {Record<string, React.CSSProperties>} */
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 24px 56px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '24px',
    padding: 0,
  },
  headerCard: {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '24px',
    padding: '28px',
    marginBottom: '24px',
  },
  label: {
    color: '#f97316',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  title: {
    color: '#f8fafc',
    fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
    fontWeight: 800,
    lineHeight: 1,
    margin: '0 0 14px',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px',
    color: '#cbd5e1',
    fontSize: '14px',
  },
  metaBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '999px',
    padding: '8px 12px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '999px',
    background: '#f97316',
    flexShrink: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  navRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '28px',
  },
  navButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minWidth: '160px',
    borderRadius: '999px',
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#f8fafc',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    padding: '12px 18px',
  },
  navButtonDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
  completionCard: {
    marginTop: '24px',
    background: '#111827',
    border: '1px solid rgba(249, 115, 22, 0.24)',
    borderRadius: '24px',
    padding: '24px',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '48px 24px',
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '24px',
    color: '#94a3b8',
  },
};

/**
 * @param {string | undefined} workoutId
 * @returns {Promise<WorkoutLike | null>}
 */
async function fetchWorkout(workoutId) {
  if (!isSupabaseConfigured) {
    return sampleWorkouts.find((item) => item.id === workoutId) || null;
  }

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', workoutId)
    .maybeSingle();

  if (error) {
    console.warn('[YoungKingAz] Could not load workout:', error.message);
    return sampleWorkouts.find((item) => item.id === workoutId) || null;
  }

  return data || sampleWorkouts.find((item) => item.id === workoutId) || null;
}

/**
 * @param {string | undefined} programId
 * @returns {Promise<WorkoutLike[]>}
 */
async function fetchProgramWorkouts(programId) {
  if (!programId) {
    return [];
  }

  const fallbackWorkouts = sortWorkoutsByProgramOrder(
    sampleWorkouts.filter((item) => item.program_id === programId),
  );

  if (!isSupabaseConfigured) {
    return fallbackWorkouts;
  }

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('program_id', programId)
    .order('week_number', { ascending: true })
    .order('day_number', { ascending: true });

  if (error) {
    console.warn('[YoungKingAz] Could not load sibling workouts:', error.message);
    return fallbackWorkouts;
  }

  if (!data || data.length === 0) {
    return fallbackWorkouts;
  }

  if (fallbackWorkouts.length > 0 && data.length < fallbackWorkouts.length) {
    return fallbackWorkouts;
  }

  return sortWorkoutsByProgramOrder(data);
}

export default function WorkoutPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCompleting, setIsCompleting] = React.useState(false);
  const checkpointSavedRef = React.useRef('');

  const { data: workout, isLoading } = useQuery({
    queryKey: ['workout', id],
    queryFn: () => fetchWorkout(id),
    enabled: Boolean(id),
  });

  const { data: siblingWorkouts = [] } = useQuery({
    queryKey: ['program-workouts-nav', workout?.program_id],
    queryFn: () => fetchProgramWorkouts(workout?.program_id),
    enabled: Boolean(workout?.program_id),
  });

  const { data: workoutProgress } = useQuery({
    queryKey: ['workout-progress', user?.id || 'guest', workout?.program_id],
    queryFn: () =>
      fetchWorkoutProgress({
        userId: user?.id || null,
        programId: workout?.program_id,
      }),
    enabled: Boolean(workout?.program_id),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  React.useEffect(() => {
    if (!workout?.id || checkpointSavedRef.current === workout.id) {
      return;
    }

    checkpointSavedRef.current = workout.id;

    saveWorkoutCheckpoint({
      userId: user?.id || null,
      workout,
    })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ['workout-progress', user?.id || 'guest', workout.program_id],
        });
      })
      .catch((error) => {
        console.warn('[YoungKingAz] Could not save workout checkpoint:', error.message);
      });
  }, [queryClient, user?.id, workout]);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.emptyCard, height: '14rem' }} />
      </div>
    );
  }

  if (!workout) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyCard}>
          <p style={{ margin: 0, fontSize: '18px' }}>Workout not found.</p>
        </div>
      </div>
    );
  }

  const exercises = Array.isArray(workout.exercises) ? workout.exercises : [];
  const orderedWorkouts = sortWorkoutsByProgramOrder(siblingWorkouts);
  /** @type {Record<string, { isUnlocked?: boolean, isCompleted?: boolean, progress?: any }>} */
  const workoutAccessMap = /** @type {Record<string, { isUnlocked?: boolean, isCompleted?: boolean, progress?: any }>} */ (
    buildWorkoutAccessMap(orderedWorkouts, workoutProgress)
  );
  const workoutId = workout.id || '';
  const programId = workout.program_id || '';
  const currentWorkoutIndex = orderedWorkouts.findIndex((item) => item.id === workoutId);
  const previousWorkout = currentWorkoutIndex > 0 ? orderedWorkouts[currentWorkoutIndex - 1] : null;
  const nextWorkout =
    currentWorkoutIndex >= 0 && currentWorkoutIndex < orderedWorkouts.length - 1
      ? orderedWorkouts[currentWorkoutIndex + 1]
      : null;
  const currentProgress = workoutAccessMap[workoutId] || {};
  const currentWorkoutLocked = Boolean(currentWorkoutIndex >= 0 && !currentProgress.isUnlocked);
  const currentWorkoutCompleted = Boolean(currentProgress.isCompleted);
  const nextWorkoutId = nextWorkout?.id || '';
  const isNextWorkoutUnlocked = Boolean(nextWorkoutId && workoutAccessMap[nextWorkoutId]?.isUnlocked);
  const shouldShowNextWorkoutButton = Boolean(currentWorkoutCompleted && isNextWorkoutUnlocked);
  const isOnlyAbsWorkout = programId === 'only-abs-program';

  function handleBackToProgram() {
    if (programId) {
      navigate(`/programs/${programId}`);
      return;
    }

    navigate(-1);
  }

  async function handleCompleteWorkout() {
    if (!workout) {
      return;
    }

    setIsCompleting(true);

    try {
      await completeWorkout({
        userId: user?.id || null,
        workout,
      });

      await queryClient.invalidateQueries({
        queryKey: ['workout-progress', user?.id || 'guest', workout.program_id],
      });

      toast({
        title: 'Workout complete',
        description: nextWorkout
          ? `You finished Day ${workout.day_number || ''}. Great work. Day ${nextWorkout.day_number || ''} is unlocked now.`
          : 'You finished this workout. Great work and keep that momentum going.',
      });
    } catch (error) {
      toast({
        title: 'Could not save progress',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCompleting(false);
    }
  }

  return (
    <div style={styles.container}>
      {isOnlyAbsWorkout ? <OnlyAbsAudioPlayer /> : null}

      <button onClick={handleBackToProgram} style={styles.backButton} type="button">
        <span aria-hidden="true">&lt;</span>
        <span>Back to Program</span>
      </button>

      <div style={styles.headerCard}>
        {workout.day_number ? (
          <p style={styles.label}>
            Day {workout.day_number}
            {workout.week_number ? ` · Week ${workout.week_number}` : ''}
          </p>
        ) : null}

        <h1 style={styles.title}>{workout.title || 'Workout'}</h1>

        <div style={styles.metaRow}>
          {workout.muscle_group ? (
            <span style={styles.metaBadge}>
              <span style={styles.dot} />
              <span>{workout.muscle_group}</span>
            </span>
          ) : null}

          {workout.estimated_minutes ? (
            <span style={styles.metaBadge}>
              <span style={styles.dot} />
              <span>{workout.estimated_minutes} min</span>
            </span>
          ) : null}

          <span style={styles.metaBadge}>
            <span style={styles.dot} />
            <span>{exercises.length} exercises</span>
          </span>
        </div>
      </div>

      {currentWorkoutLocked ? (
        <div style={styles.emptyCard}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '18px' }}>This workout is still locked.</p>
          <p style={{ margin: 0 }}>
            Finish the earlier workout days first and this one will unlock automatically.
          </p>
        </div>
      ) : exercises.length > 0 ? (
        <div style={styles.list}>
          {exercises.map(
            /** @param {ExerciseLike} exercise @param {number} index */
            (exercise, index) => (
            <ExerciseCard
              key={`${exercise.name || 'exercise'}-${index}`}
              exercise={exercise}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div style={styles.emptyCard}>
          <p style={{ margin: 0, fontSize: '18px' }}>Exercises will be added soon.</p>
        </div>
      )}

      {!currentWorkoutLocked ? (
        <div style={styles.completionCard}>
          <p
            style={{
              margin: '0 0 0.35rem',
              color: '#f97316',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {currentWorkoutCompleted ? 'Workout Completed' : 'Finish This Day'}
          </p>
          <p style={{ margin: '0 0 1rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {currentWorkoutCompleted
              ? 'Nice work. Your progress is saved and your next workout is ready when you are.'
              : 'Mark this workout complete when you finish. We will save your progress and unlock the next day automatically.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button onClick={handleCompleteWorkout} disabled={isCompleting || currentWorkoutCompleted}>
              {currentWorkoutCompleted
                ? 'Completed'
                : isCompleting
                  ? 'Saving progress...'
                  : 'Finish Workout'}
            </Button>
            {shouldShowNextWorkoutButton ? (
              <Button
                variant="outline"
                onClick={() => nextWorkoutId && navigate(`/workout/${nextWorkoutId}`)}
              >
                Go To Next Day
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div style={styles.navRow}>
        <button
          type="button"
          onClick={() => previousWorkout && navigate(`/workout/${previousWorkout.id}`)}
          disabled={!previousWorkout}
          style={{
            ...styles.navButton,
            ...(!previousWorkout ? styles.navButtonDisabled : {}),
          }}
        >
          <span aria-hidden="true">&lt;</span>
          <span>{previousWorkout ? `Day ${previousWorkout.day_number || ''}`.trim() : 'Previous Day'}</span>
        </button>

        <button
          type="button"
          onClick={handleBackToProgram}
          style={styles.navButton}
        >
          <span>Program Page</span>
        </button>

        <button
          type="button"
          onClick={() =>
            nextWorkoutId && workoutAccessMap[nextWorkoutId]?.isUnlocked && navigate(`/workout/${nextWorkoutId}`)
          }
          disabled={!nextWorkoutId || !workoutAccessMap[nextWorkoutId]?.isUnlocked}
          style={{
            ...styles.navButton,
            ...(!nextWorkoutId || !workoutAccessMap[nextWorkoutId]?.isUnlocked
              ? styles.navButtonDisabled
              : {}),
          }}
        >
          <span>{nextWorkout ? `Day ${nextWorkout.day_number || ''}`.trim() : 'Next Day'}</span>
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>
    </div>
  );
}
