// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef(
  ({ className, checked, defaultChecked = false, disabled = false, onCheckedChange, onChange, style, ...props }, ref) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState(Boolean(defaultChecked));
    const currentChecked = isControlled ? Boolean(checked) : internalChecked;

    return (
      <label
        className={cn(className)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1rem',
          height: '1rem',
          borderRadius: '0.2rem',
          border: '1px solid #f97316',
          background: currentChecked ? '#f97316' : 'transparent',
          color: currentChecked ? '#140900' : '#f5f5f5',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          userSelect: 'none',
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
            fontSize: '0.75rem',
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          {currentChecked ? '✓' : ''}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };


