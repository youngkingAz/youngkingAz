// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';
import { buttonVariants } from './button';

const Pagination = ({ className, style, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn(className)}
    style={{
      margin: '0 auto',
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      ...style,
    }}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef(({ className, style, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(className)}
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '0.25rem',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      ...style,
    }}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn(className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

const getPaginationLinkStyle = ({ isActive, size }) => {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  };

  const sizeStyles = {
    default: {
      minHeight: '2.25rem',
      padding: '0.5rem 1rem',
      fontSize: '0.9rem',
    },
    icon: {
      width: '2.25rem',
      height: '2.25rem',
      padding: 0,
      fontSize: '0.9rem',
    },
  };

  const variantStyle = isActive
    ? {
        background: 'transparent',
        color: '#f5f5f5',
        border: '1px solid #3a3a3a',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
      }
    : {
        background: 'transparent',
        color: '#f5f5f5',
        border: '1px solid transparent',
      };

  return {
    ...base,
    ...(sizeStyles[size] || sizeStyles.icon),
    ...variantStyle,
  };
};

const PaginationLink = ({ className, isActive, size = 'icon', style, ...props }) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }), className)}
    style={{
      ...getPaginationLinkStyle({ isActive, size }),
      ...style,
    }}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(className)}
    style={{ paddingLeft: '0.625rem' }}
    {...props}
  >
    <span aria-hidden="true">{'<'}</span>
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(className)}
    style={{ paddingRight: '0.625rem' }}
    {...props}
  >
    <span>Next</span>
    <span aria-hidden="true">{'>'}</span>
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const srOnlyStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const PaginationEllipsis = ({ className, style, ...props }) => (
  <span
    aria-hidden
    className={cn(className)}
    style={{
      display: 'flex',
      width: '2.25rem',
      height: '2.25rem',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      ...style,
    }}
    {...props}
  >
    ...
    <span style={srOnlyStyle}>More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};


