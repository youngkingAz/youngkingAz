import React from 'react';
import { useQuery } from '@tanstack/react-query';

import FeaturedPrograms from '../components/home/FeaturedPrograms';
import HeroSection from '../components/home/HeroSection';
import StatsBar from '../components/home/StatsBar';
import { mergeProgramsWithSamples, samplePrograms } from '../lib/programData';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

/** @type {React.CSSProperties} */
const ctaSectionStyle = {
  padding: '4rem 1.5rem',
};

/** @type {React.CSSProperties} */
const ctaCardStyle = {
  border: '1px solid rgba(249, 115, 22, 0.2)',
  borderRadius: '1.5rem',
  padding: '2rem',
  textAlign: 'center',
  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), #111111 55%, #111111 100%)',
  color: '#f5f5f5',
};

const ctaTitleStyle = {
  margin: '0 0 1rem',
  fontSize: 'clamp(2rem, 6vw, 3.75rem)',
  letterSpacing: '-0.03em',
};

const ctaTextStyle = {
  margin: '0 auto',
  maxWidth: '32rem',
  fontSize: '1rem',
  color: '#a3a3a3',
  lineHeight: 1.7,
};

async function fetchPrograms() {
  if (!isSupabaseConfigured) {
    return samplePrograms;
  }

  const { data, error } = await supabase
    .from('workout_programs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.warn('[YoungKingAz] Could not load workout programs:', error.message);
    return samplePrograms;
  }

  if (!data || data.length === 0) {
    return samplePrograms;
  }

  return mergeProgramsWithSamples(data).slice(0, 6);
}

export default function Home() {
  /** @type {import('@tanstack/react-query').UseQueryOptions<any[], Error>} */
  const programsQueryOptions = {
    queryKey: ['home-programs'],
    queryFn: fetchPrograms,
  };

  /** @type {any[]} */
  const fallbackPrograms = samplePrograms;

  const { data: programs = fallbackPrograms, isLoading } = useQuery(programsQueryOptions);

  return (
    <div>
      <HeroSection />
      <StatsBar />
      <FeaturedPrograms programs={programs} isLoading={isLoading} />

      <section style={ctaSectionStyle}>
        <div style={ctaCardStyle}>
          <h2 style={ctaTitleStyle}>READY TO TRANSFORM?</h2>
          <p style={ctaTextStyle}>
            Stop guessing. Start training with a proven system built from real results.
          </p>
        </div>
      </section>
    </div>
  );
}
