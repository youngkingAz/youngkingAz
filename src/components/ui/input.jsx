// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type = 'text', style, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(className)}
      ref={ref}
      style={{
        display: 'flex',
        width: '100%',
        minHeight: '2.25rem',
        borderRadius: '0.5rem',
        border: '1px solid #3a3a3a',
        background: 'transparent',
        padding: '0.5rem 0.75rem',
        fontSize: '0.95rem',
        color: '#f5f5f5',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        outline: 'none',
        opacity: props.disabled ? 0.5 : 1,
        cursor: props.disabled ? 'not-allowed' : 'text',
        ...style,
      }}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };


