import React from 'react';
import { Link } from 'react-router-dom';
import heroBackground from '../../assets/hero-background.png';

/** @type {React.CSSProperties} */
const sectionStyle = {
  position: 'relative',
  minHeight: '85vh',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  color: '#f5f5f5',
};

/** @type {React.CSSProperties} */
const backgroundWrapStyle = {
  position: 'absolute',
  inset: 0,
};

/** @type {React.CSSProperties} */
const backgroundImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

/** @type {React.CSSProperties} */
const overlayPrimaryStyle = {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(90deg, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.82) 45%, rgba(5,5,5,0.35) 100%)',
};

/** @type {React.CSSProperties} */
const overlaySecondaryStyle = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.75) 100%)',
};

/** @type {React.CSSProperties} */
const contentWrapStyle = {
  position: 'relative',
  zIndex: 1,
  padding: '2rem 1.5rem',
  maxWidth: '42rem',
};

/** @type {React.CSSProperties} */
const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.45rem 0.9rem',
  background: 'rgba(249, 115, 22, 0.12)',
  border: '1px solid rgba(249, 115, 22, 0.35)',
  borderRadius: '999px',
  marginBottom: '1.5rem',
  color: '#f97316',
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

/** @type {React.CSSProperties} */
const titleStyle = {
  margin: '0 0 1rem',
  fontSize: 'clamp(3.75rem, 11vw, 7.5rem)',
  lineHeight: 0.95,
  letterSpacing: '-0.04em',
};

/** @type {React.CSSProperties} */
const highlightStyle = {
  color: '#f97316',
};

/** @type {React.CSSProperties} */
const copyStyle = {
  margin: '0 0 2rem',
  color: '#d4d4d4',
  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
  lineHeight: 1.7,
  maxWidth: '34rem',
};

/** @type {React.CSSProperties} */
const buttonRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
};

/** @type {React.CSSProperties} */
const primaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  minHeight: '3rem',
  padding: '0 2rem',
  borderRadius: '999px',
  background: '#f97316',
  color: '#120800',
  textDecoration: 'none',
  fontSize: '0.92rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
};

/** @type {React.CSSProperties} */
const secondaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '3rem',
  padding: '0 2rem',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.04)',
  color: '#f5f5f5',
  textDecoration: 'none',
  fontSize: '0.92rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
};

export default function HeroSection() {
  return (
    <section style={sectionStyle}>
      <div style={backgroundWrapStyle}>
        <img
          src={heroBackground}
          alt="YoungKingAz training"
          style={backgroundImageStyle}
        />
        <div style={overlayPrimaryStyle} />
        <div style={overlaySecondaryStyle} />
      </div>

      <div style={contentWrapStyle}>
        <div style={badgeStyle}>
          <span>🔥</span>
          <span>Train Like a King</span>
        </div>

        <h1 style={titleStyle}>
          YOUNG
          <br />
          <span style={highlightStyle}>KING</span>AZ
        </h1>

        <p style={copyStyle}>
          Follow my exact workouts, routines, and lifestyle to build the physique you&apos;ve always wanted.
        </p>

        <div style={buttonRowStyle}>
          {/* ✅ Link — no page reload on mobile */}
          <Link to="/programs" style={primaryButtonStyle}>
            Start Training →
          </Link>
          <Link to="/programs" style={secondaryButtonStyle}>
            View Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
