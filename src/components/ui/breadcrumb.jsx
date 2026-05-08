// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const Breadcrumb = React.forwardRef((props, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef(({ className, style, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(className)}
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#a3a3a3',
      fontSize: '0.9rem',
      margin: 0,
      padding: 0,
      listStyle: 'none',
      ...style,
    }}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef(({ className, style, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(className)}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      ...style,
    }}
    {...props}
  />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef(({ asChild, className, style, ...props }, ref) => {
  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      ref,
      className: cn(props.children.props.className, className),
      style: {
        color: '#d4d4d4',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        ...props.children.props.style,
        ...style,
      },
      ...props.children.props,
    });
  }

  return (
    <a
      ref={ref}
      className={cn(className)}
      style={{
        color: '#d4d4d4',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        ...style,
      }}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef(({ className, style, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn(className)}
    style={{
      fontWeight: 400,
      color: '#f5f5f5',
      ...style,
    }}
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({ children, className, style, ...props }) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(className)}
    style={{
      color: '#737373',
      display: 'inline-flex',
      alignItems: 'center',
      ...style,
    }}
    {...props}
  >
    {children ?? '>'}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({ className, style, ...props }) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(className)}
    style={{
      display: 'inline-flex',
      width: '2rem',
      height: '2rem',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#a3a3a3',
      ...style,
    }}
    {...props}
  >
    ...
    <span
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      More
    </span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};


