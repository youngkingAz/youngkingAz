// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

/**
 * @typedef {object} ButtonProps
 * @property {string} [className]
 * @property {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'} [variant]
 * @property {'default' | 'sm' | 'lg' | 'icon'} [size]
 * @property {boolean} [asChild]
 * @property {React.CSSProperties} [style]
 * @property {React.ReactNode} [children]
 */

function getVariantStyle(variant = 'default') {
  const variants = {
    default: {
      background: '#f97316',
      color: '#140900',
      border: '1px solid transparent',
      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
    },
    destructive: {
      background: '#b91c1c',
      color: '#fef2f2',
      border: '1px solid transparent',
      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.14)',
    },
    outline: {
      background: 'transparent',
      color: '#f5f5f5',
      border: '1px solid #3a3a3a',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
    },
    secondary: {
      background: '#1f1f1f',
      color: '#f5f5f5',
      border: '1px solid transparent',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
    },
    ghost: {
      background: 'transparent',
      color: '#f5f5f5',
      border: '1px solid transparent',
      boxShadow: 'none',
    },
    link: {
      background: 'transparent',
      color: '#f97316',
      border: '1px solid transparent',
      boxShadow: 'none',
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
      paddingLeft: 0,
      paddingRight: 0,
    },
  };

  return variants[variant] || variants.default;
}

function getSizeStyle(size = 'default') {
  const sizes = {
    default: {
      minHeight: '2.25rem',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.9rem',
    },
    sm: {
      minHeight: '2rem',
      padding: '0.4rem 0.75rem',
      borderRadius: '0.45rem',
      fontSize: '0.75rem',
    },
    lg: {
      minHeight: '2.5rem',
      padding: '0.65rem 2rem',
      borderRadius: '0.55rem',
      fontSize: '0.95rem',
    },
    icon: {
      width: '2.25rem',
      height: '2.25rem',
      padding: 0,
      borderRadius: '0.5rem',
      fontSize: '0.9rem',
    },
  };

  return sizes[size] || sizes.default;
}

function buttonVariants({ variant = 'default', size = 'default' } = {}) {
  return `${variant} ${size}`;
}

const Button = React.forwardRef(
  /**
   * @param {ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} props
   * @param {React.ForwardedRef<HTMLButtonElement>} ref
   */
  ({ className, variant = 'default', size = 'default', asChild = false, style, children, ...props }, ref) => {
    const combinedStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      fontWeight: 600,
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      ...getSizeStyle(size),
      ...getVariantStyle(variant),
      ...style,
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        className: cn(children.props.className, className),
        style: {
          ...combinedStyle,
          ...children.props.style,
        },
        ...props,
      });
    }

    return (
      <button ref={ref} className={cn(className)} style={combinedStyle} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };


