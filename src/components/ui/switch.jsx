// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const Switch = React.forwardRef(
  ({ className, checked, defaultChecked = false, disabled = false, onCheckedChange, onChange, style, ...props }, ref) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState(Boolean(defaultChecked));
    const currentChecked = isControlled ? Boolean(checked) : internalChecked;

    return (
      <label
        className={cn(className)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: '2.25rem',
          height: '1.25rem',
          alignItems: 'center',
          borderRadius: '999px',
          background: currentChecked ? '#f97316' : '#2a2a2a',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'background 0.2s ease',
          ...style,
        }}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={currentChecked}
          disabled={disabled}
          onChange={(event) => {
            const nextChecked = event.target.checked;

            if (!isControlled) {
              setInternalChecked(nextChecked);
            }

            if (onCheckedChange) {
              onCheckedChange(nextChecked);
            }

            if (onChange) {
              onChange(event);
            }
          }}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
          }}
          {...props}
        />
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            width: '1rem',
            height: '1rem',
            borderRadius: '999px',
            background: '#f5f5f5',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.18)',
            transform: currentChecked ? 'translateX(1rem)' : 'translateX(0.125rem)',
            transition: 'transform 0.2s ease',
          }}
        />
      </label>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };


