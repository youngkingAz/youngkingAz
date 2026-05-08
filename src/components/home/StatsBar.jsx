import React from 'react';

const stats = [
  { icon: 'Users', value: '10K+', label: 'Athletes' },
  { icon: 'Lift', value: '50+', label: 'Workouts' },
  { icon: 'Win', value: '4', label: 'Programs' },
  { icon: 'Power', value: '100%', label: 'Results' },
];

/** @type {React.CSSProperties} */
const sectionStyle = {
  padding: '3rem 1.5rem',
};

/** @type {React.CSSProperties} */
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '1rem',
};

/** @type {React.CSSProperties} */
const cardStyle = {
  background: '#111111',
  border: '1px solid #2a2a2a',
  borderRadius: '1rem',
  padding: '1.5rem',
  textAlign: 'center',
  color: '#f5f5f5',
};

/** @type {React.CSSProperties} */
const iconStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '3.25rem',
  minHeight: '3.25rem',
  marginBottom: '0.85rem',
  borderRadius: '999px',
  background: 'rgba(249, 115, 22, 0.14)',
  border: '1px solid rgba(249, 115, 22, 0.3)',
  color: '#f97316',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

/** @type {React.CSSProperties} */
const valueStyle = {
  margin: 0,
  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
};

/** @type {React.CSSProperties} */
const labelStyle = {
  margin: '0.35rem 0 0',
  color: '#9ca3af',
  fontSize: '0.75rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
};

export default function StatsBar() {
  return (
    <section style={sectionStyle}>
      <div style={gridStyle}>
        {stats.map((stat) => (
          <article key={stat.label} style={cardStyle}>
            <div style={iconStyle}>{stat.icon}</div>
            <p style={valueStyle}>{stat.value}</p>
            <p style={labelStyle}>{stat.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
