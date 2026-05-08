// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const Textarea = React.forwardRef(({ className, style, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(className)}
      style={{
        display: 'flex',
        minHeight: '60px',
        width: '100%',
        borderRadius: '0.5rem',
        border: '1px solid #3a3a3a',
        background: 'transparent',
        padding: '0.75rem',
        fontSize: '0.95rem',
        color: '#f5f5f5',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        outline: 'none',
        opacity: props.disabled ? 0.5 : 1,
        cursor: props.disabled ? 'not-allowed' : 'text',
        resize: 'vertical',
        ...style,
      }}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };


