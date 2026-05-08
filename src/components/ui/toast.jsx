// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const providerStyle = {
  position: 'fixed',
  top: 0,
  zIndex: 100,
  display: 'flex',
  maxHeight: '100vh',
  width: '100%',
  flexDirection: 'column-reverse',
  padding: '1rem',
};

const viewportStyle = {
  position: 'fixed',
  top: 0,
  zIndex: 100,
  display: 'flex',
  maxHeight: '100vh',
  width: '100%',
  flexDirection: 'column-reverse',
  padding: '1rem',
};

function getToastStyle(variant = 'default') {
  const base = {
    position: 'relative',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    overflow: 'hidden',
    borderRadius: '0.5rem',
    border: '1px solid #2a2a2a',
    padding: '1.5rem 2rem 1.5rem 1.5rem',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
    transition: 'all 0.2s ease',
  };

  if (variant === 'destructive') {
    return {
      ...base,
      background: '#7f1d1d',
      color: '#fef2f2',
      borderColor: '#b91c1c',
    };
  }

  return {
    ...base,
    background: '#0b0b0b',
    color: '#f5f5f5',
  };
}

function toastVariants({ variant = 'default' } = {}) {
  return variant;
}

const ToastProvider = React.forwardRef(
  /**
   * @param {ToastProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{ ...providerStyle, ...style }}
    {...props}
  />
));
ToastProvider.displayName = 'ToastProvider';

const ToastViewport = React.forwardRef(
  /**
   * @param {ToastProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{ ...viewportStyle, ...style }}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

const Toast = React.forwardRef(
  /**
   * @param {ToastProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, variant = 'default', style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      style={{ ...getToastStyle(variant), ...style }}
      {...props}
    />
  );
});
Toast.displayName = 'Toast';

const ToastAction = React.forwardRef(
  /**
   * @param {ToastProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      display: 'inline-flex',
      minHeight: '2rem',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.4rem',
      border: '1px solid #3a3a3a',
      background: 'transparent',
      padding: '0 0.75rem',
      fontSize: '0.85rem',
      fontWeight: 600,
      ...style,
    }}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

const ToastClose = React.forwardRef(
  /**
   * @param {ToastProps & React.ButtonHTMLAttributes<HTMLButtonElement>} props
   * @param {React.ForwardedRef<HTMLButtonElement>} ref
   */
  ({ className, style, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(className)}
    style={{
      position: 'absolute',
      right: '0.5rem',
      top: '0.5rem',
      zIndex: 2,
      borderRadius: '0.35rem',
      border: 'none',
      background: 'transparent',
      color: 'rgba(245,245,245,0.6)',
      padding: '0.25rem',
      cursor: 'pointer',
      ...style,
    }}
    toast-close=""
    {...props}
  >
    {children || 'x'}
  </button>
));
ToastClose.displayName = 'ToastClose';

const ToastTitle = React.forwardRef(
  /**
   * @param {ToastProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{ fontSize: '0.9rem', fontWeight: 700, ...style }}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

const ToastDescription = React.forwardRef(
  /**
   * @param {ToastProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{ fontSize: '0.9rem', opacity: 0.9, ...style }}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
/**
 * @typedef {object} ToastProps
 * @property {string} [className]
 * @property {'default' | 'destructive'} [variant]
 * @property {React.CSSProperties} [style]
 * @property {React.ReactNode} [children]
 */


