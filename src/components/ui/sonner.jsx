// @ts-nocheck
"use client";

import * as React from 'react';

const Toaster = ({ style, ...props }) => {
  return (
    <div
      className="toaster group"
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        ...style,
      }}
      {...props}
    />
  );
};

export { Toaster };


