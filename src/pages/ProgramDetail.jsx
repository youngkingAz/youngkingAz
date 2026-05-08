import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import OnlyAbsAudioPlayer from '../components/workout/OnlyAbsAudioPlayer';
import { useAuth } from '../lib/AuthContext';
import { canAccessProgram, getProgramPlan, startCheckoutForProgram } from '../lib/billing';
import { enrichProgram, samplePrograms, sampleWorkouts } from '../lib/programData';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import {
  buildProgressState,
  buildWorkoutAccessMap,
  fetchWorkoutProgress,
  resetProgramProgress,
  sortWorkoutsByProgramOrder,
} from '../lib/workoutProgress';

/**
 * @typedef {object} ProgramLike
 * @property {string} [id]
 * @property {string} [title]
 * @property {'beginner' | 'only_abs' | 'intermediate' | 'advanced' | string} [level]
 * @property {string} [description]
 * @property {string} [image_url]
 * @property {string} [image_position]
 * @property {boolean} [is_premium]
 * @property {string} [price_label]
 * @property {number} [duration_weeks]
 * @property {number} [days_per_week]
 */

/**
 * @typedef {object} WorkoutLike
 * @property {string} [id]
 * @property {string} [program_id]
 * @property {string} [title]
 * @property {number} [week_number]
 * @property {number} [day_number]
 * @property {string} [muscle_group]
 * @property {number} [estimated_minutes]
 * @property {any[]} [exercises]
 */

/** @type {Record<string, { background: string, color: string, label: string }>} */
const levelConfig = {
  beginner: { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', label: 'Beginner' },
  only_abs: { background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', label: 'Only Abs' },
  intermediate: { background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', label: 'Intermediate' },
  advanced: { background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', label: 'Advanced' },
};

/** @type {React.CSSProperties} */
const pageStyle = {
  padding: '2rem 1.5rem 3rem',
  color: '#f5f5f5',
};

/** @type {React.CSSProperties} */
const backLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#a3a3a3',
  textDecoration: 'none',
  fontSize: '0.9rem',
  marginBottom: '1.5rem',
};

/** @type {React.CSSProperties} */
const headerWrapStyle = {
  position: 'relative',
  borderRadius: '1.5rem',
  overflow: 'hidden',
  marginBottom: '2.5rem',
  background: '#111111',
  border: '1px solid #2a2a2a',
};

/** @type {React.CSSProperties} */
const headerImageStyle = {
  width: '100%',
  height: '20rem',
  objectFit: 'cover',
  display: 'block',
};

/** @type {React.CSSProperties} */
const headerOverlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(5,5,5,0.15) 0%, rgba(5,5,5,0.82) 75%, rgba(5,5,5,0.96) 100%)',
};

/** @type {React.CSSProperties} */
const headerContentStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  padding: '1.5rem 1.5rem 2rem',
};

/** @type {React.CSSProperties} */
const metaRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.25rem',
  marginTop: '1rem',
  fontSize: '0.9rem',
  color: '#d4d4d4',
};

/** @type {React.CSSProperties} */
const workoutCardStyle = {
  background: '#111111',
  border: '1px solid #2a2a2a',
  borderRadius: '0.9rem',
  padding: '1.25rem',
  color: '#f5f5f5',
  textDecoration: 'none',
  display: 'block',
};

/** @type {React.CSSProperties} */
const workoutCardLockedStyle = {
  ...workoutCardStyle,
  opacity: 0.55,
  cursor: 'not-allowed',
};

/** @type {React.CSSProperties} */
const lockedCardStyle = {
  textAlign: 'center',
  padding: '3rem 1.5rem',
  background: '#111111',
  border: '1px solid rgba(249, 115, 22, 0.25)',
  borderRadius: '1rem',
};

/** @type {React.CSSProperties} */
const priceLineStyle = {
  margin: '0.85rem 0 0',
  color: '#f97316',
  fontSize: '1rem',
  fontWeight: 700,
};

/** @type {React.CSSProperties} */
const progressBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '999px',
  padding: '0.35rem 0.7rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

/**
 * @param {unknown} error
 * @returns {string}
 */
function getErrorMessage(error) {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

/**
 * @param {ProgramLike | null | undefined} program
 * @returns {WorkoutLike[]}
 */
function getSampleWorkoutsForProgram(program) {
  if (!program) {
    return [];
  }

  const exactMatch = sampleWorkouts.filter((item) => item.program_id === program.id);
  if (exactMatch.length > 0) {
    return exactMatch;
  }

  const levelMatch = samplePrograms.find((item) => item.level === program.level);
  if (!levelMatch) {
    return [];
  }

  return sampleWorkouts.filter((item) => item.program_id === levelMatch.id);
}

/**
 * @param {string | undefined} programId
 * @returns {Promise<ProgramLike | null>}
 */
async function fetchProgram(programId) {
  if (!isSupabaseConfigured) {
    return samplePrograms.find((item) => item.id === programId) || null;
  }

  const { data, error } = await supabase
    .from('workout_programs')
    .select('*')
    .eq('id', programId)
    .maybeSingle();

  if (error) {
    console.warn('[YoungKingAz] Could not load program:', error.message);
    return samplePrograms.find((item) => item.id === programId) || null;
  }

  return data ? enrichProgram(data) : samplePrograms.find((item) => item.id === programId) || null;
}

/**
 * @param {ProgramLike | null | undefined} program
 * @returns {Promise<WorkoutLike[]>}
 */
async function fetchWorkouts(program) {
  if (!program) {
    return [];
  }

  const fallbackWorkouts = sortWorkoutsByProgramOrder(getSampleWorkoutsForProgram(program));

  if (!isSupabaseConfigured) {
    return fallbackWorkouts;
  }

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('program_id', program.id)
    .order('week_number', { ascending: true })
    .order('day_number', { ascending: true });

  if (error) {
    console.warn('[YoungKingAz] Could not load workouts:', error.message);
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

export default function ProgramDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [billingMessage, setBillingMessage] = React.useState('');
  const [isBillingLoading, setIsBillingLoading] = React.useState(false);
  const [isResettingProgress, setIsResettingProgress] = React.useState(false);

  const { data: program, isLoading: programLoading } = useQuery({
    queryKey: ['program', id],
    queryFn: () => fetchProgram(id),
    enabled: Boolean(id),
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['program-workouts', program?.id, program?.level],
    queryFn: () => fetchWorkouts(program),
    enabled: Boolean(program),
  });

  const { data: workoutProgress } = useQuery({
    queryKey: ['workout-progress', user?.id || 'guest', program?.id],
    queryFn: () =>
      fetchWorkoutProgress({
        userId: user?.id || null,
        programId: program?.id,
      }),
    enabled: Boolean(program?.id),
  });

  if (programLoading) {
    return (
      <div style={pageStyle}>
        <div
          style={{
            height: '20rem',
            borderRadius: '1.5rem',
            background: '#111111',
            border: '1px solid #2a2a2a',
          }}
        />
      </div>
    );
  }

  if (!program) {
    return (
      <div style={{ ...pageStyle, textAlign: 'center' }}>
        <p style={{ color: '#a3a3a3', fontSize: '1.05rem' }}>Program not found.</p>
        <Link to="/programs" style={{ textDecoration: 'none' }}>
          <Button variant="outline" style={{ marginTop: '1rem' }}>
            Back to Programs
          </Button>
        </Link>
      </div>
    );
  }

  const levelKey = program.level || 'beginner';
  const config = levelConfig[levelKey] || levelConfig.beginner;
  const billingPlan = getProgramPlan(program);
  const isOnlyAbsProgram = program.level === 'only_abs';
  const isLocked = Boolean(program.is_premium && !canAccessProgram(user, program));
  const orderedWorkouts = sortWorkoutsByProgramOrder(workouts);
  /** @type {Record<string, { isUnlocked?: boolean, isCompleted?: boolean }>} */
  // @ts-ignore
  const workoutAccessMap = buildWorkoutAccessMap(orderedWorkouts, workoutProgress);

  const weekGroups = workouts.reduce(
    /**
     * @param {Record<number, WorkoutLike[]>} acc
     * @param {WorkoutLike} workout
     */
    (acc, workout) => {
    const week = workout.week_number || 1;
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(workout);
    return acc;
    },
    /** @type {Record<number, WorkoutLike[]>} */ ({})
  );

  async function handleCheckout() {
    if (!program) {
      return;
    }

    setBillingMessage('');
    setIsBillingLoading(true);

    try {
      await startCheckoutForProgram(program);
    } catch (error) {
      setBillingMessage(getErrorMessage(error) || 'Could not start checkout.');
      setIsBillingLoading(false);
    }
  }

  async function handleResetProgramProgress() {
    if (!program?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to reset your ${program.title} progress? This will send you back to Day 1.`,
    );

    if (!confirmed) {
      return;
    }

    setIsResettingProgress(true);

    try {
      await resetProgramProgress({
        userId: user?.id || null,
        programId: program.id,
      });

      queryClient.setQueriesData(
        { queryKey: ['workout-progress', user?.id || 'guest', program.id] },
        () => buildProgressState([]),
      );

      queryClient.removeQueries({
        queryKey: ['workout-progress', user?.id || 'guest', program.id],
        exact: true,
      });

      await queryClient.invalidateQueries({
        queryKey: ['workout-progress', user?.id || 'guest', program.id],
      });

      await queryClient.refetchQueries({
        queryKey: ['workout-progress', user?.id || 'guest', program.id],
        exact: true,
      });

      toast({
        title: 'Progress reset',
        description: `${program.title} is back to Day 1. Lock in and start the grind again.`,
      });
    } catch (error) {
      toast({
        title: 'Could not reset progress',
        description: getErrorMessage(error) || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResettingProgress(false);
    }
  }

  return (
    <div style={pageStyle}>
      {isOnlyAbsProgram ? <OnlyAbsAudioPlayer /> : null}

      <Link to="/programs" style={backLinkStyle}>
        &lt; All Programs
      </Link>

      <div style={headerWrapStyle}>
        <div style={{ height: '20rem' }}>
          <img
            src={program.image_url || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80'}
            alt={program.title}
            style={{
              ...headerImageStyle,
              objectPosition: program.image_position || 'center',
            }}
          />
          <div style={headerOverlayStyle} />
        </div>

        <div style={headerContentStyle}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <Badge style={{ background: config.background, color: config.color }}>{config.label}</Badge>
            {program.is_premium ? (
              <Badge style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                Premium
              </Badge>
            ) : null}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              letterSpacing: '-0.04em',
            }}
          >
            {program.title}
          </h1>

          <p
            style={{
              margin: '0.5rem 0 0',
              maxWidth: '34rem',
              color: '#d4d4d4',
              lineHeight: 1.7,
            }}
          >
            {program.description}
          </p>

          <p style={priceLineStyle}>{program.price_label || 'Free'}</p>

          <div style={metaRowStyle}>
            {program.duration_weeks ? <span>{program.duration_weeks} weeks</span> : null}
            {program.days_per_week ? <span>{program.days_per_week} days/week</span> : null}
            <span>{isLocked ? 'Premium locked' : `${workouts.length} workouts`}</span>
          </div>
        </div>
      </div>

      {isLocked ? (
        <div style={lockedCardStyle}>
          <p style={{ margin: '0 0 0.75rem', color: '#f97316', fontWeight: 700 }}>Premium Program Locked</p>
          <p style={{ margin: '0 auto', maxWidth: '34rem', color: '#d4d4d4', lineHeight: 1.7 }}>
            This plan is {program.price_label || 'premium'} and should only open for members who have premium access. Your account does not have that access yet.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            {!isAuthenticated ? (
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <Button>Sign In</Button>
              </Link>
            ) : (
              <Button onClick={handleCheckout} disabled={isBillingLoading}>
                {isBillingLoading
                  ? 'Opening checkout...'
                  : `Subscribe for ${billingPlan?.priceLabel || program.price_label || 'premium access'}`}
              </Button>
            )}
            <Link to="/programs" style={{ textDecoration: 'none' }}>
              <Button variant="outline">Back to Programs</Button>
            </Link>
          </div>
          {billingMessage ? (
            <p style={{ margin: '1rem 0 0', color: '#fca5a5' }}>{billingMessage}</p>
          ) : null}
        </div>
      ) : workouts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            background: '#111111',
            border: '1px solid #2a2a2a',
            borderRadius: '1rem',
          }}
        >
          <p style={{ margin: 0, color: '#a3a3a3' }}>Workouts are not linked to this program yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <Button
              variant="outline"
              onClick={handleResetProgramProgress}
              disabled={isResettingProgress}
              style={{
                borderColor: 'rgba(185, 28, 28, 0.35)',
                color: '#fca5a5',
                background: 'transparent',
              }}
            >
              {isResettingProgress ? 'Resetting progress...' : 'Reset This Program'}
            </Button>
          </div>

          {Object.entries(weekGroups)
            .sort(
              /** @param {[string, WorkoutLike[]]} a @param {[string, WorkoutLike[]]} b */
              (a, b) => Number(a[0]) - Number(b[0]),
            )
            .map(([week, weekWorkouts]) => (
              <div key={week}>
                <h3
                  style={{
                    margin: '0 0 1rem',
                    fontSize: '1.5rem',
                    letterSpacing: '0.08em',
                    color: '#a3a3a3',
                  }}
                >
                  WEEK {week}
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {weekWorkouts
                    .sort(
                      /** @param {WorkoutLike} a @param {WorkoutLike} b */
                      (a, b) => (a.day_number || 0) - (b.day_number || 0),
                    )
                    .map(
                      /** @param {WorkoutLike} workout @param {number} index */
                      (workout, index) => {
                      const workoutKey = workout.id || `${week}-${index}`;
                      /** @type {{ isUnlocked?: boolean, isCompleted?: boolean }} */
                      const progress = workoutAccessMap[workoutKey] || {};
                      const isWorkoutLocked = !progress.isUnlocked;
                      const isWorkoutCompleted = Boolean(progress.isCompleted);

                      const content = (
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                          <div>
                            <p
                              style={{
                                margin: '0 0 0.35rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                color: '#f97316',
                                textTransform: 'uppercase',
                              }}
                            >
                              Day {workout.day_number || index + 1}
                            </p>
                            <h4 style={{ margin: 0, fontSize: '1rem' }}>{workout.title}</h4>
                            {workout.muscle_group ? (
                              <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: '#a3a3a3' }}>
                                {workout.muscle_group}
                              </p>
                            ) : null}
                          </div>

                          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#a3a3a3' }}>
                            <div
                              style={{
                                ...progressBadgeStyle,
                                marginBottom: '0.55rem',
                                background: isWorkoutCompleted
                                  ? 'rgba(34, 197, 94, 0.15)'
                                  : isWorkoutLocked
                                    ? 'rgba(148, 163, 184, 0.14)'
                                    : 'rgba(249, 115, 22, 0.14)',
                                color: isWorkoutCompleted
                                  ? '#4ade80'
                                  : isWorkoutLocked
                                    ? '#cbd5e1'
                                    : '#f97316',
                              }}
                            >
                              {isWorkoutCompleted ? 'Completed' : isWorkoutLocked ? 'Locked' : 'Ready'}
                            </div>
                            {workout.estimated_minutes ? <p style={{ margin: 0 }}>{workout.estimated_minutes} min</p> : null}
                            {workout.exercises ? (
                              <p style={{ margin: workout.estimated_minutes ? '0.35rem 0 0' : 0 }}>
                                {workout.exercises.length} exercises
                              </p>
                            ) : null}
                          </div>
                        </div>
                      );

                      if (isWorkoutLocked) {
                        return (
                          <div key={workoutKey} style={workoutCardLockedStyle}>
                            {content}
                          </div>
                        );
                      }

                      return (
                        <Link key={workoutKey} to={`/workout/${workout.id}`} style={workoutCardStyle}>
                          {content}
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
