// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

/**
 * @typedef {object} CardProps
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 * @property {React.ReactNode} [children]
 */

const cardStyle = {
  borderRadius: '0.75rem',
  border: '1px solid #2f2f2f',
  background: '#111111',
  color: '#f5f5f5',
  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.18)',
};

const Card = React.forwardRef(
  /**
   * @param {CardProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
    <div ref={ref} className={cn(className)} style={{ ...cardStyle, ...style }} {...props} />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef(
  /**
   * @param {CardProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      padding: '1.5rem',
      ...style,
    }}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(
  /**
   * @param {CardProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: '0.01em',
      ...style,
    }}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(
  /**
   * @param {CardProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      fontSize: '0.9rem',
      color: '#a3a3a3',
      ...style,
    }}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(
  /**
   * @param {CardProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      padding: '0 1.5rem 1.5rem',
      ...style,
    }}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(
  /**
   * @param {CardProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem 1.5rem',
      ...style,
    }}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };


