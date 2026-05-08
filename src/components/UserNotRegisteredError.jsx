import React from 'react';

/** @type {React.CSSProperties} */
const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
};

/** @type {React.CSSProperties} */
const cardStyle = {
  width: '100%',
  maxWidth: '32rem',
  padding: '2rem',
  background: '#ffffff',
  borderRadius: '0.75rem',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.12)',
  border: '1px solid #e2e8f0',
};

/** @type {React.CSSProperties} */
const iconWrapStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '4rem',
  height: '4rem',
  marginBottom: '1.5rem',
  borderRadius: '999px',
  background: '#ffedd5',
};

/** @type {React.CSSProperties} */
const headingStyle = {
  margin: '0 0 1rem',
  fontSize: '1.875rem',
  fontWeight: 700,
  color: '#0f172a',
};

/** @type {React.CSSProperties} */
const bodyStyle = {
  margin: '0 0 2rem',
  color: '#475569',
  lineHeight: 1.7,
};

/** @type {React.CSSProperties} */
const helperBoxStyle = {
  padding: '1rem',
  background: '#f8fafc',
  borderRadius: '0.5rem',
  fontSize: '0.9rem',
  color: '#475569',
};

/** @type {React.CSSProperties} */
const listStyle = {
  margin: '0.5rem 0 0',
  paddingLeft: '1.2rem',
};

/** @type {React.CSSProperties} */
const itemStyle = {
  marginBottom: '0.35rem',
};

const UserNotRegisteredError = () => {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={iconWrapStyle}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{ color: '#ea580c' }}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 style={headingStyle}>Access Restricted</h1>

          <p style={bodyStyle}>
            You are not registered to use this application. Please contact the app administrator to
            request access.
          </p>

          <div style={helperBoxStyle}>
            <p style={{ margin: 0 }}>If you believe this is an error, you can:</p>
            <ul style={listStyle}>
              <li style={itemStyle}>Verify you are logged in with the correct account</li>
              <li style={itemStyle}>Contact the app administrator for access</li>
              <li style={{ marginBottom: 0 }}>Try logging out and back in again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;
