// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const ResizableContext = React.createContext({
  direction: 'horizontal',
});

const ResizablePanelGroup = ({ className, direction = 'horizontal', style, ...props }) => (
  <ResizableContext.Provider value={{ direction }}>
    <div
      data-panel-group-direction={direction}
      className={cn(className)}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        ...style,
      }}
      {...props}
    />
  </ResizableContext.Provider>
);

const ResizablePanel = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      flex: 1,
      minWidth: 0,
      minHeight: 0,
      ...style,
    }}
    {...props}
  />
));
ResizablePanel.displayName = 'ResizablePanel';

const ResizableHandle = ({ withHandle, className, style, ...props }) => {
  const { direction } = React.useContext(ResizableContext);

  return (
    <div
      data-panel-group-direction={direction}
      className={cn(className)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#2a2a2a',
        ...(direction === 'vertical'
          ? { width: '100%', height: '1px' }
          : { width: '1px', height: '100%' }),
        ...style,
      }}
      {...props}
    >
      {withHandle ? (
        <div
          style={{
            zIndex: 10,
            display: 'flex',
            width: direction === 'vertical' ? '1rem' : '0.75rem',
            height: direction === 'vertical' ? '0.75rem' : '1rem',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0.25rem',
            border: '1px solid #3a3a3a',
            background: '#1f1f1f',
            color: '#9ca3af',
            fontSize: '0.65rem',
          }}
        >
          {direction === 'vertical' ? '===' : '|||'}
        </div>
      ) : null}
    </div>
  );
};

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };


