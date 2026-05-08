import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @typedef {object} FeaturedProgram
 * @property {string} [id]
 * @property {string} [title]
 * @property {string} [level]
 * @property {string} [description]
 * @property {number} [duration_weeks]
 * @property {number} [days_per_week]
 * @property {string} [image_url]
 * @property {string} [image_position]
 * @property {boolean} [is_premium]
 * @property {string} [price_label]
 */

/** @type {Record<string, { color: string, background: string, label: string }>} */
const levelConfig = {
  beginner: { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', label: 'Beginner' },
  only_abs: { color: '#ec4899', background: 'rgba(236, 72, 153, 0.15)', label: 'Only Abs' },
  intermediate: { color: '#f97316', background: 'rgba(249, 115, 22, 0.15)', label: 'Intermediate' },
  advanced: { color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)', label: 'Advanced' },
};

/** @type {React.CSSProperties} */
const sectionStyle = { padding: '3rem 1.5rem' };
/** @type {React.CSSProperties} */
const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  marginBottom: '2rem',
  flexWrap: 'wrap',
};
/** @type {React.CSSProperties} */
const titleStyle = { margin: 0, fontSize: '2.25rem', letterSpacing: '0.04em' };
/** @type {React.CSSProperties} */
const linkStyle = { color: '#f97316', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none' };
/** @type {React.CSSProperties} */
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' };
/** @type {React.CSSProperties} */
const cardStyle = { background: '#111111', border: '1px solid #2a2a2a', borderRadius: '1rem', overflow: 'hidden', color: '#f5f5f5' };
/** @type {React.CSSProperties} */
const imageWrapStyle = { position: 'relative', height: '12rem', overflow: 'hidden', background: '#1a1a1a' };
/** @type {React.CSSProperties} */
const imageStyle = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
/** @type {React.CSSProperties} */
const premiumStyle = {
  position: 'absolute',
  top: '0.75rem',
  right: '0.75rem',
  background: 'rgba(249, 115, 22, 0.92)',
  color: '#140900',
  borderRadius: '999px',
  padding: '0.35rem 0.6rem',
  fontSize: '0.75rem',
  fontWeight: 700,
};
/** @type {React.CSSProperties} */
const contentStyle = { padding: '1.25rem' };
/** @type {React.CSSProperties} */
const cardTitleStyle = { margin: '0 0 0.35rem', fontSize: '1.5rem' };
/** @type {React.CSSProperties} */
const descStyle = { margin: 0, color: '#b3b3b3', lineHeight: 1.5 };
/** @type {React.CSSProperties} */
const priceStyle = { margin: '0.9rem 0 0', color: '#f97316', fontSize: '0.95rem', fontWeight: 700 };
/** @type {React.CSSProperties} */
const metaStyle = { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '0.8rem', color: '#9ca3af' };

/**
 * @param {{ index: number }} props
 */
function LoadingCard({ index }) {
  return <div key={index} style={{ ...cardStyle, height: '340px', background: '#151515' }} />;
}

/**
 * @param {{ level?: string }} props
 */
function LevelBadge({ level }) {
  const levelKey = level || 'beginner';
  const config = levelConfig[levelKey] || levelConfig.beginner;
  return (
    <span
      style={{
        position: 'absolute',
        left: '0.75rem',
        bottom: '0.75rem',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.35rem 0.65rem',
        borderRadius: '999px',
        border: '1px solid transparent',
        background: config.background,
        color: config.color,
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.03em',
      }}
    >
      {config.label}
    </span>
  );
}

/**
 * @param {{ programs?: FeaturedProgram[], isLoading?: boolean }} props
 */
export default function FeaturedPrograms({ programs = [], isLoading = false }) {
  if (isLoading) {
    return (
      <section style={sectionStyle}>
        <div style={gridStyle}>
          {[1, 2, 3].map((item) => <LoadingCard key={item} index={item} />)}
        </div>
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>PROGRAMS</h2>
        <Link to="/programs" style={linkStyle}>View All →</Link>
      </div>

      <div style={gridStyle}>
        {programs.map(
          /** @param {FeaturedProgram} program @param {number} index */
          (program, index) => {
          const key = program.id || `${program.title || 'program'}-${index}`;
          return (
            <Link
              key={key}
              to={`/programs/${program.id || index}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article style={cardStyle}>
                <div style={imageWrapStyle}>
                  <img
                    src={program.image_url || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80'}
                    alt={program.title || 'Workout program'}
                    style={{ ...imageStyle, objectPosition: program.image_position || 'center' }}
                    loading="lazy"
                  />
                  {program.is_premium ? <div style={premiumStyle}>Premium</div> : null}
                  <LevelBadge level={program.level} />
                </div>
                <div style={contentStyle}>
                  <h3 style={cardTitleStyle}>{program.title || 'Untitled Program'}</h3>
                  <p style={descStyle}>{program.description || 'Coming soon.'}</p>
                  <p style={priceStyle}>{program.price_label || 'Free'}</p>
                  <div style={metaStyle}>
                    {program.duration_weeks ? <span>{program.duration_weeks} weeks</span> : null}
                    {program.days_per_week ? <span>{program.days_per_week} days/week</span> : null}
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
