import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Badge } from '../components/ui/badge';
import { mergeProgramsWithSamples, samplePrograms } from '../lib/programData';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

/**
 * @typedef {object} ProgramLike
 * @property {string} [id]
 * @property {'beginner' | 'only_abs' | 'intermediate' | 'advanced' | string} [level]
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [image_url]
 * @property {string} [image_position]
 * @property {boolean} [is_premium]
 * @property {string} [price_label]
 * @property {number} [duration_weeks]
 * @property {number} [days_per_week]
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
const titleStyle = {
  margin: 0,
  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
  letterSpacing: '-0.04em',
};

/** @type {React.CSSProperties} */
const subtitleStyle = {
  margin: '0.75rem 0 0',
  fontSize: '1.05rem',
  color: '#a3a3a3',
};

/** @type {React.CSSProperties} */
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem',
};

/** @type {React.CSSProperties} */
const cardStyle = {
  background: '#111111',
  border: '1px solid #2a2a2a',
  borderRadius: '1rem',
  overflow: 'hidden',
  color: '#f5f5f5',
  textDecoration: 'none',
  height: '100%',
  display: 'block',
};

/** @type {React.CSSProperties} */
const imageWrapStyle = {
  position: 'relative',
  height: '13rem',
  overflow: 'hidden',
};

/** @type {React.CSSProperties} */
const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

/** @type {React.CSSProperties} */
const overlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(5,5,5,0.05) 0%, rgba(17,17,17,0.92) 100%)',
};

/** @type {React.CSSProperties} */
const premiumStyle = {
  position: 'absolute',
  top: '0.75rem',
  right: '0.75rem',
  background: 'rgba(249, 115, 22, 0.92)',
  color: '#140900',
  borderRadius: '999px',
  padding: '0.35rem 0.55rem',
  fontSize: '0.75rem',
  fontWeight: 700,
};

/** @type {React.CSSProperties} */
const priceStyle = {
  margin: '0 0 1rem',
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#f97316',
};

/** @type {React.CSSProperties} */
const metaRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  fontSize: '0.8rem',
  color: '#a3a3a3',
};

/**
 * @returns {Promise<ProgramLike[]>}
 */
async function fetchPrograms() {
  if (!isSupabaseConfigured) {
    return samplePrograms;
  }

  const { data, error } = await supabase
    .from('workout_programs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[YoungKingAz] Could not load workout programs:', error.message);
    return samplePrograms;
  }

  if (!data || data.length === 0) {
    return samplePrograms;
  }

  return mergeProgramsWithSamples(data);
}

export default function Programs() {
  const { data: programs = samplePrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: fetchPrograms,
  });

  return (
    <div style={pageStyle}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={titleStyle}>PROGRAMS</h1>
        <p style={subtitleStyle}>Choose your level. Follow the plan. See results.</p>
      </div>

      {programs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <p style={{ color: '#a3a3a3', fontSize: '1.05rem' }}>Programs coming soon.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {programs.map(
            /** @param {ProgramLike} program */
            (program) => {
            const config = levelConfig[program.level || 'beginner'] || levelConfig.beginner;

            return (
              <Link key={program.id} to={`/programs/${program.id}`} style={cardStyle}>
                <div style={imageWrapStyle}>
                  <img
                    src={program.image_url || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80'}
                    alt={program.title}
                    style={{
                      ...imageStyle,
                      objectPosition: program.image_position || 'center',
                    }}
                    loading="lazy"
                  />
                  <div style={overlayStyle} />
                  {program.is_premium ? <div style={premiumStyle}>Premium</div> : null}
                  <Badge
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      bottom: '0.75rem',
                      background: config.background,
                      color: config.color,
                    }}
                  >
                    {config.label}
                  </Badge>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <h3
                    style={{
                      margin: '0 0 0.5rem',
                      fontSize: '1.75rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {program.title}
                  </h3>

                  <p style={priceStyle}>{program.price_label || 'Free'}</p>

                  <p
                    style={{
                      margin: '0 0 1rem',
                      fontSize: '0.9rem',
                      color: '#a3a3a3',
                      lineHeight: 1.6,
                    }}
                  >
                    {program.description}
                  </p>

                  <div style={metaRowStyle}>
                    {program.duration_weeks ? <span>{program.duration_weeks} weeks</span> : null}
                    {program.days_per_week ? <span>{program.days_per_week} days/week</span> : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
