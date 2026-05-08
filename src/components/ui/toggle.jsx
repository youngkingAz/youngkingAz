// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

function getToggleStyle(variant = 'default', size = 'default', pressed = false) {
  const sizeStyles = {
    default: {
      minHeight: '2.25rem',
      minWidth: '2.25rem',
      padding: '0.5rem',
      fontSize: '0.9rem',
    },
    sm: {
      minHeight: '2rem',
      minWidth: '2rem',
      padding: '0.35rem',
      fontSize: '0.75rem',
    },
    lg: {
      minHeight: '2.5rem',
      minWidth: '2.5rem',
      padding: '0.65rem',
      fontSize: '0.95rem',
    },
  };

  const variantStyles = {
    default: {
      background: pressed ? '#1f1f1f' : 'transparent',
      color: pressed ? '#f5f5f5' : '#d4d4d4',
      border: '1px solid transparent',
    },
    outline: {
      background: pressed ? '#1f1f1f' : 'transparent',
      color: pressed ? '#f5f5f5' : '#d4d4d4',
      border: '1px solid #3a3a3a',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
    },
  };

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '0.5rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    ...sizeStyles[size],
    ...(variantStyles[variant] || variantStyles.default),
  };
}

function toggleVariants({ variant = 'default', size = 'default' } = {}) {
  return `${variant} ${size}`;
}

const Toggle = React.forwardRef(
  ({ className, variant = 'default', size = 'default', pressed: pressedProp, defaultPressed = false, onPressedChange, onClick, style, children, ...props }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
    const pressed = pressedProp !== undefined ? pressedProp : internalPressed;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(toggleVariants({ variant, size }), className)}
        style={{
          ...getToggleStyle(variant, size, pressed),
          ...style,
        }}
        aria-pressed={pressed}
        onClick={(event) => {
          if (onClick) {
            onClick(event);
          }

          if (!event.defaultPrevented) {
            const nextPressed = !pressed;

            if (pressedProp === undefined) {
              setInternalPressed(nextPressed);
            }

            if (onPressedChange) {
              onPressedChange(nextPressed);
            }
          }
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';

export { Toggle, toggleVariants };


