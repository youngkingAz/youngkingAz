// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const DialogContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  background: 'rgba(0, 0, 0, 0.8)',
};

const contentStyle = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  zIndex: 51,
  display: 'grid',
  width: 'min(92vw, 32rem)',
  transform: 'translate(-50%, -50%)',
  gap: '1rem',
  border: '1px solid #2f2f2f',
  background: '#0b0b0b',
  color: '#f5f5f5',
  padding: '1.5rem',
  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
  borderRadius: '0.75rem',
};

const closeButtonStyle = {
  position: 'absolute',
  right: '1rem',
  top: '1rem',
  borderRadius: '0.35rem',
  border: '1px solid #2f2f2f',
  background: 'transparent',
  color: '#a3a3a3',
  width: '2rem',
  height: '2rem',
  cursor: 'pointer',
};

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

const Dialog = ({ open: openProp, defaultOpen = false, onOpenChange, children }) => {
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

  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
};

const DialogTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(DialogContext);

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
DialogTrigger.displayName = 'DialogTrigger';

const DialogPortal = ({ children }) => <>{children}</>;

const DialogClose = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(DialogContext);

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
DialogClose.displayName = 'DialogClose';

const DialogOverlay = React.forwardRef(({ className, style, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DialogContext);

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
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef(({ className, children, style, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DialogContext);

  if (!open) {
    return null;
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={ref}
        className={cn(className)}
        style={{ ...contentStyle, ...style }}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {children}
        <button type="button" style={closeButtonStyle} onClick={() => setOpen(false)}>
          x
          <span style={srOnlyStyle}>Close</span>
        </button>
      </div>
    </DialogPortal>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, style, ...props }) => (
  <div
    className={cn(className)}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      textAlign: 'left',
      ...style,
    }}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, style, ...props }) => (
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
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef(({ className, style, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(className)}
    style={{
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '0.01em',
      margin: 0,
      ...style,
    }}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef(({ className, style, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(className)}
    style={{
      fontSize: '0.9rem',
      color: '#a3a3a3',
      margin: 0,
      ...style,
    }}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};


