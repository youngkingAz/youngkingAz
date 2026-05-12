import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from './lib/query-client';
import { Toaster } from './components/ui/toaster';
import { AuthProvider, useAuth } from './lib/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import WorkoutPlayer from './pages/WorkoutPlayer';
import Profile from './pages/Profile';
import BillingSuccess from './pages/BillingSuccess';
import BillingCanceled from './pages/BillingCanceled';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Support from './pages/Support';
import PageNotFound from './lib/PageNotFound';

/** @typedef {{ children?: React.ReactNode }} ErrorBoundaryProps */

// ─── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  /**
   * @param {ErrorBoundaryProps} props
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050505',
            color: '#f5f5f5',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</p>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: '#a3a3a3', marginBottom: '1.5rem' }}>
            Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#f97316',
              color: '#120800',
              border: 'none',
              borderRadius: '999px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Loading screen ───────────────────────────────────────────────────────────
function AppLoading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
      }}
    >
      <style>{`
        @keyframes yk-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '999px',
          border: '4px solid #1e293b',
          borderTopColor: '#f97316',
          animation: 'yk-spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

// ─── Main authenticated shell ─────────────────────────────────────────────────
function AuthenticatedApp() {
  const { isLoadingAuth, isLoadingPublicSettings } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return <AppLoading />;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/"                   element={<Home />} />
        <Route path="/programs"           element={<Programs />} />
        <Route path="/programs/:id"       element={<ProgramDetail />} />
        <Route path="/workout/:id"        element={<WorkoutPlayer />} />
        <Route path="/profile"            element={<Profile />} />
        <Route path="/billing/success"    element={<BillingSuccess />} />
        <Route path="/billing/canceled"   element={<BillingCanceled />} />
        <Route path="/privacy"            element={<PrivacyPolicy />} />
        <Route path="/support"            element={<Support />} />
      </Route>
      <Route path="/404" element={<PageNotFound />} />
      <Route path="*"    element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <BrowserRouter>
            <AuthenticatedApp />
            <Toaster />
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
