// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const Table = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      overflow: 'auto',
    }}
  >
    <table
      ref={ref}
      className={cn(className)}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
        color: '#f5f5f5',
        ...style,
      }}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef(({ className, style, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(className)}
    style={{
      borderTop: '1px solid #2a2a2a',
      background: 'rgba(255,255,255,0.03)',
      fontWeight: 600,
      ...style,
    }}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef(({ className, style, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(className)}
    style={{
      borderBottom: '1px solid #2a2a2a',
      transition: 'background 0.2s ease',
      ...style,
    }}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ className, style, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(className)}
    style={{
      height: '2.5rem',
      padding: '0.5rem',
      textAlign: 'left',
      verticalAlign: 'middle',
      fontWeight: 600,
      color: '#a3a3a3',
      ...style,
    }}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, style, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(className)}
    style={{
      padding: '0.5rem',
      verticalAlign: 'middle',
      ...style,
    }}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef(({ className, style, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(className)}
    style={{
      marginTop: '1rem',
      fontSize: '0.9rem',
      color: '#a3a3a3',
      ...style,
    }}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};


