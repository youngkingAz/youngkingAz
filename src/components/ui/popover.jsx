// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const PopoverContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const Popover = ({ open: openProp, defaultOpen = false, onOpenChange, children }) => {
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

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const close = () => setOpen(false);
    window.addEventListener('click', close);

    return () => {
      window.removeEventListener('click', close);
    };
  }, [open, setOpen]);

  return <PopoverContext.Provider value={{ open, setOpen }}>{children}</PopoverContext.Provider>;
};

const PopoverTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { open, setOpen } = React.useContext(PopoverContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      onClick={(event) => {
        event.stopPropagation();

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
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverAnchor = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));
PopoverAnchor.displayName = 'PopoverAnchor';

const PopoverContent = React.forwardRef(
  ({ className, align = 'center', sideOffset = 4, style, onClick, ...props }, ref) => {
    const { open } = React.useContext(PopoverContext);

    if (!open) {
      return null;
    }

    const justifyContent =
      align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : 'center';

    return (
      <div
        style={{
          position: 'absolute',
          top: `calc(100% + ${sideOffset}px)`,
          left: 0,
          zIndex: 50,
          display: 'flex',
          width: '100%',
          justifyContent,
          pointerEvents: 'none',
        }}
      >
        <div
          ref={ref}
          className={cn(className)}
          onClick={(event) => {
            event.stopPropagation();
            if (onClick) {
              onClick(event);
            }
          }}
          style={{
            pointerEvents: 'auto',
            width: '18rem',
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
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };


