import React from 'react';

/** @type {React.CSSProperties} */
const pageStyle = {
  padding: '2rem 1.5rem 3rem',
  color: '#f5f5f5',
};

/** @type {React.CSSProperties} */
const containerStyle = {
  width: '100%',
  maxWidth: '48rem',
  margin: '0 auto',
};

/** @type {React.CSSProperties} */
const cardStyle = {
  border: '1px solid rgba(249, 115, 22, 0.18)',
  borderRadius: '1.25rem',
  padding: '1.5rem',
  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), #111111 70%)',
};

/** @type {React.CSSProperties} */
const sectionStyle = {
  marginTop: '1.5rem',
  lineHeight: 1.7,
  color: '#d4d4d4',
};

export default function PrivacyPolicy() {
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p style={{ margin: 0, color: '#fdba74', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Privacy Policy
          </p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>YoungKingAz Workout</h1>
          <p style={{ margin: '0.75rem 0 0', color: '#a3a3a3' }}>Last updated: May 12, 2026</p>

          <div style={sectionStyle}>
            <h2 style={{ color: '#f5f5f5' }}>Information we collect</h2>
            <p>
              We may collect account information such as your email address, display name, and profile photo,
              along with workout progress and subscription status needed to run the app.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#f5f5f5' }}>How we use your information</h2>
            <p>
              We use your information to create and manage your account, keep your workout progress saved,
              provide premium access, process subscriptions, and improve the app experience.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#f5f5f5' }}>Payments</h2>
            <p>
              Subscription billing is handled through Stripe. We do not store your full payment card information
              directly inside the app.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#f5f5f5' }}>Data storage</h2>
            <p>
              Account and workout data may be stored using Supabase and related service providers used to operate
              YoungKingAz Workout.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#f5f5f5' }}>Sharing</h2>
            <p>
              We do not sell your personal information. We only share data with service providers needed to run
              the app, such as authentication, storage, and payment tools.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#f5f5f5' }}>Contact</h2>
            <p style={{ marginBottom: 0 }}>
              If you have privacy questions, contact us at{' '}
              <a href="mailto:azanael38.stmarc@gmail.com" style={{ color: '#fdba74' }}>
                azanael38.stmarc@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
