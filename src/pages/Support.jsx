import React from 'react';

/** @type {React.CSSProperties} */
const pageStyle = {
  padding: '2rem 1.5rem 3rem',
  color: '#f5f5f5',
};

/** @type {React.CSSProperties} */
const containerStyle = {
  width: '100%',
  maxWidth: '42rem',
  margin: '0 auto',
};

/** @type {React.CSSProperties} */
const cardStyle = {
  border: '1px solid rgba(249, 115, 22, 0.18)',
  borderRadius: '1.25rem',
  padding: '1.5rem',
  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), #111111 70%)',
};

export default function Support() {
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p style={{ margin: 0, color: '#fdba74', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Support
          </p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>YoungKingAz Workout Support</h1>
          <p style={{ margin: '0.9rem 0 0', lineHeight: 1.7, color: '#d4d4d4' }}>
            Need help with your account, subscription, progress, or a bug in the app? Reach out and we&apos;ll help you.
          </p>

          <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.9rem', lineHeight: 1.7 }}>
            <p style={{ margin: 0 }}>
              Email:{' '}
              <a href="mailto:azanael38.stmarc@gmail.com" style={{ color: '#fdba74' }}>
                azanael38.stmarc@gmail.com
              </a>
            </p>
            <p style={{ margin: 0 }}>
              Instagram:{' '}
              <a
                href="https://www.instagram.com/astmarc38/"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#fdba74' }}
              >
                @astmarc38
              </a>
            </p>
            <p style={{ margin: 0, color: '#a3a3a3' }}>
              Please include the device you used, what you clicked, and what happened so we can fix issues faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
