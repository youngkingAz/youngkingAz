// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

function getAlertStyle(variant = 'default') {
  const base = {
    width: '100%',
    borderRadius: '0.75rem',
    border: '1px solid #2f2f2f',
    padding: '1rem',
    fontSize: '0.9rem',
    background: '#0b0b0b',
    color: '#f5f5f5',
  };

  if (variant === 'destructive') {
    return {
      ...base,
      borderColor: 'rgba(239, 68, 68, 0.45)',
      background: 'rgba(127, 29, 29, 0.18)',
      color: '#fca5a5',
    };
  }

  return base;
}

const titleStyle = {
  margin: '0 0 0.35rem',
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '0.01em',
};

const descriptionStyle = {
  fontSize: '0.9rem',
  lineHeight: 1.6,
};

const Alert = React.forwardRef(({ className, variant = 'default', style, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(className)}
    style={{ ...getAlertStyle(variant), ...style }}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, style, ...props }, ref) => (
  <h5 ref={ref} className={cn(className)} style={{ ...titleStyle, ...style }} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, style, ...props }, ref) => (
  <div ref={ref} className={cn(className)} style={{ ...descriptionStyle, ...style }} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };


