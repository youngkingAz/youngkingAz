import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const shellStyle = {
  minHeight: '100vh',
  background: '#050505',
  color: '#f5f5f5',
};

const mainStyle = {
  minHeight: '100vh',
  paddingTop: '4rem',
  paddingLeft: 0,
};

export default function AppLayout() {
  // ✅ use react-router hook — no more window.location
  const { pathname } = useLocation();

  return (
    <div style={shellStyle}>
      <style>
        {`
          @media (min-width: 1024px) {
            .desktop-sidebar {
              display: flex !important;
            }
            .app-layout-main {
              margin-left: 240px;
              padding-top: 0 !important;
            }
          }
        `}
      </style>
      <Sidebar currentPath={pathname} />
      <main className="app-layout-main" style={mainStyle}>
        {/* Outlet renders the matched child route */}
        <Outlet />
      </main>
    </div>
  );
}
