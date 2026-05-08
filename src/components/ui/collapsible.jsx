// @ts-nocheck
"use client";

import * as React from 'react';

const CollapsibleContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const Collapsible = ({ open: openProp, defaultOpen = false, onOpenChange, children, ...props }) => {
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
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div {...props}>{children}</div>
    </CollapsibleContext.Provider>
  );
};

const CollapsibleTrigger = React.forwardRef(({ onClick, ...props }, ref) => {
  const { open, setOpen } = React.useContext(CollapsibleContext);

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }

        if (!event.defaultPrevented) {
          setOpen(!open);
        }
      }}
      {...props}
    />
  );
});
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleContent = React.forwardRef(({ children, ...props }, ref) => {
  const { open } = React.useContext(CollapsibleContext);

  if (!open) {
    return null;
  }

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };


