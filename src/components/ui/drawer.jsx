// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const DrawerContext = React.createContext({
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
  insetInline: 0,
  bottom: 0,
  zIndex: 51,
  marginTop: '6rem',
  display: 'flex',
  flexDirection: 'column',
  height: 'auto',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
  border: '1px solid #2f2f2f',
  background: '#0b0b0b',
  color: '#f5f5f5',
  boxShadow: '0 -18px 50px rgba(0, 0, 0, 0.35)',
};

const handleStyle = {
  width: '100px',
  height: '0.5rem',
  margin: '1rem auto 0',
  borderRadius: '999px',
  background: '#2f2f2f',
};

const Drawer = ({ open: openProp, defaultOpen = false, onOpenChange, shouldScaleBackground = true, children }) => {
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

  return (
    <DrawerContext.Provider value={{ open, setOpen, shouldScaleBackground }}>
      {children}
    </DrawerContext.Provider>
  );
};
Drawer.displayName = 'Drawer';

const DrawerTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(DrawerContext);

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
DrawerTrigger.displayName = 'DrawerTrigger';

const DrawerPortal = ({ children }) => <>{children}</>;

const DrawerClose = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(DrawerContext);

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
DrawerClose.displayName = 'DrawerClose';

const DrawerOverlay = React.forwardRef(({ className, style, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DrawerContext);

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
DrawerOverlay.displayName = 'DrawerOverlay';

const DrawerContent = React.forwardRef(({ className, children, style, ...props }, ref) => {
  const { open } = React.useContext(DrawerContext);

  if (!open) {
    return null;
  }

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <div ref={ref} className={cn(className)} style={{ ...contentStyle, ...style }} {...props}>
        <div style={handleStyle} />
        {children}
      </div>
    </DrawerPortal>
  );
});
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({ className, style, ...props }) => (
  <div
    className={cn(className)}
    style={{
      display: 'grid',
      gap: '0.375rem',
      padding: '1rem',
      textAlign: 'left',
      ...style,
    }}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({ className, style, ...props }) => (
  <div
    className={cn(className)}
    style={{
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: '1rem',
      ...style,
    }}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef(({ className, style, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(className)}
    style={{
      margin: 0,
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '0.01em',
      ...style,
    }}
    {...props}
  />
));
DrawerTitle.displayName = 'DrawerTitle';

const DrawerDescription = React.forwardRef(({ className, style, ...props }, ref) => (
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
DrawerDescription.displayName = 'DrawerDescription';

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};


