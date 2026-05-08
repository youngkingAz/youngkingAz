// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const ToggleGroupContext = React.createContext({
  size: 'default',
  variant: 'default',
  type: 'single',
  value: undefined,
  toggleValue: () => {},
});

/**
 * @typedef {object} ToggleGroupProps
 * @property {string} [className]
 * @property {'default' | 'outline'} [variant]
 * @property {'default' | 'sm' | 'lg'} [size]
 * @property {'single' | 'multiple'} [type]
 * @property {string | string[] | undefined} [value]
 * @property {string | string[] | undefined} [defaultValue]
 * @property {(value: string | string[]) => void} [onValueChange]
 * @property {React.ReactNode} [children]
 * @property {React.CSSProperties} [style]
 */

function getToggleStyle({ variant = 'default', size = 'default', pressed = false }) {
  const sizeStyles = {
    default: {
      minHeight: '2.25rem',
      padding: '0.5rem 0.75rem',
      fontSize: '0.9rem',
    },
    sm: {
      minHeight: '2rem',
      padding: '0.35rem 0.6rem',
      fontSize: '0.75rem',
    },
    lg: {
      minHeight: '2.75rem',
      padding: '0.65rem 1rem',
      fontSize: '0.95rem',
    },
  };

  const variantStyles = {
    default: {
      background: pressed ? '#1f1f1f' : 'transparent',
      color: '#f5f5f5',
      border: '1px solid transparent',
    },
    outline: {
      background: pressed ? '#1f1f1f' : 'transparent',
      color: '#f5f5f5',
      border: '1px solid #3a3a3a',
    },
  };

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...(sizeStyles[size] || sizeStyles.default),
    ...(variantStyles[variant] || variantStyles.default),
  };
}

const ToggleGroup = React.forwardRef(
  /**
   * @param {ToggleGroupProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, variant = 'default', size = 'default', type = 'single', value: valueProp, defaultValue, onValueChange, children, style, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = valueProp !== undefined ? valueProp : internalValue;

    const toggleValue = React.useCallback(
      /** @param {string} itemValue */
      (itemValue) => {
        let nextValue;

        if (type === 'multiple') {
          const current = Array.isArray(value) ? value : [];
          nextValue = current.includes(itemValue)
            ? current.filter((/** @param {string} entry */ entry) => entry !== itemValue)
            : [...current, itemValue];
        } else {
          nextValue = value === itemValue ? '' : itemValue;
        }

        if (valueProp === undefined) {
          setInternalValue(nextValue);
        }

        if (onValueChange) {
          onValueChange(nextValue);
        }
      },
      [onValueChange, type, value, valueProp]
    );

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          ...style,
        }}
        {...props}
      >
        <ToggleGroupContext.Provider value={{ variant, size, type, value, toggleValue }}>
          {children}
        </ToggleGroupContext.Provider>
      </div>
    );
  }
);
ToggleGroup.displayName = 'ToggleGroup';

const ToggleGroupItem = React.forwardRef(
  /**
   * @param {{ className?: string, children?: React.ReactNode, variant?: 'default' | 'outline', size?: 'default' | 'sm' | 'lg', value?: string, style?: React.CSSProperties, onClick?: React.MouseEventHandler<HTMLButtonElement> } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
   * @param {React.ForwardedRef<HTMLButtonElement>} ref
   */
  ({ className, children, variant, size, value, style, onClick, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    const pressed =
      context.type === 'multiple'
        ? Array.isArray(context.value) && context.value.includes(value)
        : context.value === value;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(className)}
        style={{
          ...getToggleStyle({
            variant: context.variant || variant,
            size: context.size || size,
            pressed,
          }),
          ...style,
        }}
        onClick={(event) => {
          if (onClick) {
            onClick(event);
          }
          if (!event.defaultPrevented) {
            context.toggleValue(value);
          }
        }}
        aria-pressed={pressed}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroup, ToggleGroupItem };


