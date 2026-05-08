import React, { useEffect } from 'react';

import { useAuth } from '../lib/AuthContext';
import UserNotRegisteredError from './UserNotRegisteredError';

const spinnerStyle = {
  width: '2rem',
  height: '2rem',
  border: '4px solid #e2e8f0',
  borderTopColor: '#1e293b',
  borderRadius: '999px',
};

const DefaultFallback = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div style={spinnerStyle} />
  </div>
);

export default function ProtectedRoute({
  fallback = <DefaultFallback />,
  unauthenticatedElement = null,
  children = null,
}) {
  const auth = useAuth() || {};
  const {
    isAuthenticated = false,
    isLoadingAuth = false,
    authChecked = true,
    authError = null,
    checkUserAuth,
  } = auth;

  useEffect(() => {
    if (!authChecked && !isLoadingAuth && typeof checkUserAuth === 'function') {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }

    return unauthenticatedElement;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  return children;
}
