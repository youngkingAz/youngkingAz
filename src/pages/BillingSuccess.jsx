import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { useAuth } from '../lib/AuthContext';

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
  border: '1px solid rgba(249, 115, 22, 0.25)',
  borderRadius: '1.25rem',
  padding: '2rem',
  textAlign: 'center',
};

export default function BillingSuccess() {
  const { refreshUserProfile } = useAuth();
  const hasRefreshed = React.useRef(false);

  React.useEffect(() => {
    if (hasRefreshed.current) {
      return;
    }

    hasRefreshed.current = true;

    refreshUserProfile().finally(() => {
      if (typeof window === 'undefined') {
        return;
      }

      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.delete('session_id');
      window.history.replaceState({}, document.title, nextUrl.toString());
    });
  }, [refreshUserProfile]);

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <p style={{ margin: 0, color: '#f97316', fontWeight: 700 }}>Payment received</p>
        <h1 style={{ margin: '0.75rem 0 1rem', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>Subscription Activated</h1>
        <p style={{ margin: '0 auto', maxWidth: '30rem', color: '#d4d4d4', lineHeight: 1.7 }}>
          Your payment went through. If Stripe and Supabase are fully connected, your access should unlock automatically in a moment.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <Button>Open Profile</Button>
          </Link>
          <Link to="/programs" style={{ textDecoration: 'none' }}>
            <Button variant="outline">View Programs</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
