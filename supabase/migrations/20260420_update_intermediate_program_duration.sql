update public.workout_programs
set
  duration_weeks = 8,
  days_per_week = 5,
  description = 'Push harder for 8 weeks with 5 workout days, then use Friday as a YoungKingAz rest day to eat good and pick it back up Monday.'
where id = 'intermediate-program'
   or level = 'intermediate'
   or lower(title) = 'intermediate program';
