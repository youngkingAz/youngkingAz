import React from 'react';

import { useAuth } from './AuthContext';

export default function PageNotFound() {
  const auth = useAuth();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const pageName = pathname.replace(/^\/+/, '') || 'home';
  const isAdmin = auth?.isAuthenticated && auth?.user?.role === 'admin';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: '#f8fafc',
      }}
    >
      <div style={{ width: '100%', maxWidth: '32rem' }}>
        <div
          style={{
            textAlign: 'center',
            display: 'grid',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '4.5rem',
                fontWeight: 300,
                color: '#cbd5e1',
              }}
            >
              404
            </h1>
            <div
              style={{
                width: '4rem',
                height: '2px',
                background: '#e2e8f0',
                margin: '0 auto',
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 500,
                color: '#1e293b',
              }}
            >
              Page Not Found
            </h2>
            <p
              style={{
                margin: 0,
                color: '#475569',
                lineHeight: 1.7,
              }}
            >
              The page <span style={{ fontWeight: 600, color: '#334155' }}>&quot;{pageName}&quot;</span>{' '}
              could not be found in this application.
            </p>
          </div>

          {isAdmin ? (
            <div
              style={{
                marginTop: '0.5rem',
                padding: '1rem',
                background: '#f1f5f9',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: '1.25rem',
                    height: '1.25rem',
                    borderRadius: '999px',
                    background: '#ffedd5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '0.125rem',
                  }}
                >
                  <div
                    style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      borderRadius: '999px',
                      background: '#fb923c',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gap: '0.25rem' }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#334155',
                    }}
                  >
                    Admin Note
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: '#475569',
                      lineHeight: 1.6,
                    }}
                  >
                    This could mean that the AI hasn&apos;t implemented this page yet. Ask it to
                    implement it in the chat.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.65rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#334155',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              <span style={{ marginRight: '0.5rem' }} aria-hidden="true">
                {'<'}
              </span>
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
