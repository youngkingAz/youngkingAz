// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

/**
 * @typedef {object} BadgeProps
 * @property {string} [className]
 * @property {'default' | 'secondary' | 'destructive' | 'outline'} [variant]
 * @property {React.CSSProperties} [style]
 * @property {React.ReactNode} [children]
 */

function getBadgeStyle(variant = 'default') {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '0.5rem',
    border: '1px solid transparent',
    padding: '0.2rem 0.65rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    transition: 'all 0.2s ease',
  };

  const variants = {
    default: {
      ...base,
      background: '#f97316',
      color: '#140900',
    },
    secondary: {
      ...base,
      background: '#1f1f1f',
      color: '#f5f5f5',
    },
    destructive: {
      ...base,
      background: '#b91c1c',
      color: '#fef2f2',
    },
    outline: {
      ...base,
      background: 'transparent',
      color: '#f5f5f5',
      borderColor: '#3a3a3a',
    },
  };

  return variants[variant] || variants.default;
}

function badgeVariants({ variant } = {}) {
  return variant || 'default';
}

/**
 * @param {BadgeProps & React.HTMLAttributes<HTMLDivElement>} props
 */
function Badge({ className, variant = 'default', style, ...props }) {
  return <div className={cn(className)} style={{ ...getBadgeStyle(variant), ...style }} {...props} />;
}

export { Badge, badgeVariants };


