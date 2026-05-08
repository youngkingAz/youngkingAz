// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const HoverCardContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const HoverCard = ({ open: openProp, defaultOpen = false, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;

  const setOpen = React.useCallback(
    (nextOpen) => {
      if (openProp === undefined) {
        setInternalOpen(nextOpen);
      }

      if (onOpenChange) {
        onOpenChange(nextOpen);
      }
    },
    [onOpenChange, openProp]
  );

  return <HoverCardContext.Provider value={{ open, setOpen }}>{children}</HoverCardContext.Provider>;
};

const HoverCardTrigger = React.forwardRef(({ className, onMouseEnter, onMouseLeave, ...props }, ref) => {
  const { setOpen } = React.useContext(HoverCardContext);

  return (
    <div
      ref={ref}
      className={cn(className)}
      onMouseEnter={(event) => {
        setOpen(true);
        if (onMouseEnter) {
          onMouseEnter(event);
        }
      }}
      onMouseLeave={(event) => {
        setOpen(false);
        if (onMouseLeave) {
          onMouseLeave(event);
        }
      }}
      {...props}
    />
  );
});
HoverCardTrigger.displayName = 'HoverCardTrigger';

const HoverCardContent = React.forwardRef(
  ({ className, align = 'center', sideOffset = 4, style, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const { open, setOpen } = React.useContext(HoverCardContext);

    if (!open) {
      return null;
    }

    const alignmentMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
    };

    return (
      <div
        style={{
          position: 'absolute',
          zIndex: 50,
          marginTop: `${sideOffset}px`,
          display: 'flex',
          justifyContent: alignmentMap[align] || 'center',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={ref}
          className={cn(className)}
          onMouseEnter={(event) => {
            setOpen(true);
            if (onMouseEnter) {
              onMouseEnter(event);
            }
          }}
          onMouseLeave={(event) => {
            setOpen(false);
            if (onMouseLeave) {
              onMouseLeave(event);
            }
          }}
          style={{
            pointerEvents: 'auto',
            width: '16rem',
            borderRadius: '0.75rem',
            border: '1px solid #2a2a2a',
            background: '#111111',
            padding: '1rem',
            color: '#f5f5f5',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            outline: 'none',
            ...style,
          }}
          {...props}
        />
      </div>
    );
  }
);
HoverCardContent.displayName = 'HoverCardContent';

export { HoverCard, HoverCardTrigger, HoverCardContent };


