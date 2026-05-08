// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const SheetContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  background: 'rgba(0, 0, 0, 0.8)',
};

function getSheetPositionStyle(side = 'right') {
  const base = {
    position: 'fixed',
    zIndex: 51,
    display: 'grid',
    gap: '1rem',
    background: '#0b0b0b',
    color: '#f5f5f5',
    padding: '1.5rem',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
    transition: 'all 0.3s ease',
  };

  const variants = {
    top: {
      ...base,
      insetInline: 0,
      top: 0,
      borderBottom: '1px solid #2f2f2f',
    },
    bottom: {
      ...base,
      insetInline: 0,
      bottom: 0,
      borderTop: '1px solid #2f2f2f',
    },
    left: {
      ...base,
      insetBlock: 0,
      left: 0,
      width: '75%',
      maxWidth: '24rem',
      borderRight: '1px solid #2f2f2f',
    },
    right: {
      ...base,
      insetBlock: 0,
      right: 0,
      width: '75%',
      maxWidth: '24rem',
      borderLeft: '1px solid #2f2f2f',
    },
  };

  return variants[side] || variants.right;
}

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

const Sheet = ({ open: openProp, defaultOpen = false, onOpenChange, children }) => {
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

  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>;
};

const SheetTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(SheetContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
        if (!event.defaultPrevented) {
          setOpen(true);
        }
      }}
      {...props}
    />
  );
});
SheetTrigger.displayName = 'SheetTrigger';

const SheetClose = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(SheetContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
        if (!event.defaultPrevented) {
          setOpen(false);
        }
      }}
      {...props}
    />
  );
});
SheetClose.displayName = 'SheetClose';

const SheetPortal = ({ children }) => <>{children}</>;

const SheetOverlay = React.forwardRef(({ className, style, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SheetContext);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{ ...overlayStyle, ...style }}
      onClick={() => setOpen(false)}
      {...props}
    />
  );
});
SheetOverlay.displayName = 'SheetOverlay';

const SheetContent = React.forwardRef(({ side = 'right', className, children, style, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SheetContext);

  if (!open) {
    return null;
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <div
        ref={ref}
        className={cn(className)}
        style={{ ...getSheetPositionStyle(side), ...style }}
        {...props}
      >
        <button
          type="button"
          style={{
            position: 'absolute',
            right: '1rem',
            top: '1rem',
            width: '2rem',
            height: '2rem',
            borderRadius: '0.35rem',
            border: '1px solid #2f2f2f',
            background: '#1f1f1f',
            color: '#a3a3a3',
            cursor: 'pointer',
          }}
          onClick={() => setOpen(false)}
        >
          x
          <span style={srOnlyStyle}>Close</span>
        </button>
        {children}
      </div>
    </SheetPortal>
  );
});
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, style, ...props }) => (
  <div
    className={cn(className)}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      textAlign: 'left',
      ...style,
    }}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, style, ...props }) => (
  <div
    className={cn(className)}
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: '0.5rem',
      flexWrap: 'wrap',
      ...style,
    }}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef(({ className, style, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(className)}
    style={{
      margin: 0,
      fontSize: '1.125rem',
      fontWeight: 700,
      color: '#f5f5f5',
      ...style,
    }}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef(({ className, style, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(className)}
    style={{
      margin: 0,
      fontSize: '0.9rem',
      color: '#a3a3a3',
      ...style,
    }}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};


