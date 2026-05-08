// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const ScrollArea = React.forwardRef(({ className, children, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}
    {...props}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        borderRadius: 'inherit',
      }}
    >
      {children}
    </div>
  </div>
));
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef(({ className, orientation = 'vertical', style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      display: 'flex',
      touchAction: 'none',
      userSelect: 'none',
      transition: 'colors 0.2s ease',
      ...(orientation === 'vertical'
        ? {
            width: '0.625rem',
            height: '100%',
            padding: '1px',
            borderLeft: '1px solid transparent',
          }
        : {
            height: '0.625rem',
            width: '100%',
            padding: '1px',
            borderTop: '1px solid transparent',
            flexDirection: 'column',
          }),
      ...style,
    }}
    {...props}
  >
    <div
      style={{
        position: 'relative',
        flex: 1,
        borderRadius: '999px',
        background: '#2a2a2a',
      }}
    />
  </div>
));
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };


