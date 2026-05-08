// @ts-nocheck
import React from 'react';
import { cn } from '../../lib/utils';

function Skeleton({ className, style, ...props }) {
  return (
    <div
      className={cn(className)}
      style={{
        borderRadius: '0.375rem',
        background: 'rgba(249, 115, 22, 0.1)',
        opacity: 0.75,
        ...style,
      }}
      {...props}
    />
  );
}

export { Skeleton };


