// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const Progress = React.forwardRef(({ className, value = 0, style, ...props }, ref) => {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        position: 'relative',
        height: '0.5rem',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '999px',
        background: 'rgba(249, 115, 22, 0.2)',
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          height: '100%',
          width: `${safeValue}%`,
          background: '#f97316',
          transition: 'width 0.2s ease',
        }}
      />
    </div>
  );
});
Progress.displayName = 'Progress';

export { Progress };


