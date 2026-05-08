update public.workout_programs
set
  duration_weeks = 21,
  days_per_week = 5,
  description = 'Train at a higher level with 21 weeks of custom YoungKingAz advanced strength, size, and conditioning work.'
where id = 'advanced-program'
   or level = 'advanced'
   or lower(title) = 'advanced program';
