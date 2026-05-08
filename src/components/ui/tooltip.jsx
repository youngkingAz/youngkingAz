// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const TooltipContext = React.createContext({
  open: false,
  setOpen: () => {},
});

/** @param {{ children?: React.ReactNode }} props */
const TooltipProvider = ({ children }) => <>{children}</>;

/**
 * @param {{ open?: boolean, defaultOpen?: boolean, onOpenChange?: (nextOpen: boolean) => void, children?: React.ReactNode }} props
 */
const Tooltip = ({ open: openProp, defaultOpen = false, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;

  const setOpen = React.useCallback(
    /** @param {boolean} nextOpen */
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

  return <TooltipContext.Provider value={{ open, setOpen }}>{children}</TooltipContext.Provider>;
};

const TooltipTrigger = React.forwardRef(
  /**
   * @param {{ className?: string, onMouseEnter?: React.MouseEventHandler<HTMLDivElement>, onMouseLeave?: React.MouseEventHandler<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, onMouseEnter, onMouseLeave, ...props }, ref) => {
  const { setOpen } = React.useContext(TooltipContext);

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
TooltipTrigger.displayName = 'TooltipTrigger';

const TooltipContent = React.forwardRef(
  /**
   * @param {{ className?: string, sideOffset?: number, style?: React.CSSProperties, onMouseEnter?: React.MouseEventHandler<HTMLDivElement>, onMouseLeave?: React.MouseEventHandler<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, sideOffset = 4, style, onMouseEnter, onMouseLeave, ...props }, ref) => {
  const { open, setOpen } = React.useContext(TooltipContext);

  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: `calc(100% + ${sideOffset}px)`,
        left: '50%',
        zIndex: 50,
        transform: 'translateX(-50%)',
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
          overflow: 'hidden',
          borderRadius: '0.5rem',
          background: '#f97316',
          padding: '0.375rem 0.75rem',
          fontSize: '0.75rem',
          color: '#140900',
          boxShadow: '0 10px 24px rgba(0, 0, 0, 0.2)',
          ...style,
        }}
        {...props}
      />
    </div>
  );
});
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };


