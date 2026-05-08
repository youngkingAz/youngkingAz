import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/ui/button';

/** @type {React.CSSProperties} */
const pageStyle = {
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1.5rem',
  color: '#f5f5f5',
};

/** @type {React.CSSProperties} */
const cardStyle = {
  width: '100%',
  maxWidth: '40rem',
  background: '#111111',
  border: '1px solid #2a2a2a',
  borderRadius: '1.25rem',
  padding: '2rem',
  textAlign: 'center',
};

export default function BillingCanceled() {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <p style={{ margin: 0, color: '#a3a3a3', fontWeight: 700 }}>Checkout canceled</p>
        <h1 style={{ margin: '0.75rem 0 1rem', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>No Charge Was Made</h1>
        <p style={{ margin: '0 auto', maxWidth: '30rem', color: '#d4d4d4', lineHeight: 1.7 }}>
          You can come back anytime and restart checkout when you are ready.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Link to="/programs" style={{ textDecoration: 'none' }}>
            <Button>Back to Programs</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
