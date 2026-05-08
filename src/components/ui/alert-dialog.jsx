// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const AlertDialogContext = React.createContext({
  open: false,
  setOpen: () => {},
});

function buttonStyle(variant = 'default') {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '2.5rem',
    padding: '0 1rem',
    borderRadius: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid transparent',
  };

  if (variant === 'outline') {
    return {
      ...base,
      background: 'transparent',
      color: '#f5f5f5',
      borderColor: '#2f2f2f',
    };
  }

  return {
    ...base,
    background: '#f97316',
    color: '#140900',
  };
}

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
  width: 'min(92vw, 32rem)',
  transform: 'translate(-50%, -50%)',
  border: '1px solid #2f2f2f',
  background: '#0b0b0b',
  color: '#f5f5f5',
  padding: '1.5rem',
  borderRadius: '1rem',
  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
};

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  textAlign: 'left',
};

const footerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '1rem',
};

const titleStyle = {
  margin: 0,
  fontSize: '1.125rem',
  fontWeight: 700,
};

const descriptionStyle = {
  margin: 0,
  fontSize: '0.95rem',
  color: '#a3a3a3',
  lineHeight: 1.6,
};

/**
 * @param {{ open?: boolean, defaultOpen?: boolean, onOpenChange?: (nextOpen: boolean) => void, children?: React.ReactNode }} props
 */
const AlertDialog = ({ open: openProp, defaultOpen = false, onOpenChange, children }) => {
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

  return <AlertDialogContext.Provider value={{ open, setOpen }}>{children}</AlertDialogContext.Provider>;
};

const AlertDialogTrigger = React.forwardRef(
  /**
   * @param {{ className?: string, onClick?: React.MouseEventHandler<HTMLButtonElement> } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
   * @param {React.ForwardedRef<HTMLButtonElement>} ref
   */
  ({ className, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext);

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
AlertDialogTrigger.displayName = 'AlertDialogTrigger';

/** @param {{ children?: React.ReactNode }} props */
const AlertDialogPortal = ({ children }) => <>{children}</>;

const AlertDialogOverlay = React.forwardRef(
  /**
   * @param {{ className?: string } & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, ...props }, ref) => {
  const { open } = React.useContext(AlertDialogContext);

  if (!open) {
    return null;
  }

  return <div ref={ref} className={cn(className)} style={overlayStyle} {...props} />;
});
AlertDialogOverlay.displayName = 'AlertDialogOverlay';

const AlertDialogContent = React.forwardRef(
  /**
   * @param {{ className?: string, children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, children, ...props }, ref) => {
  const { open } = React.useContext(AlertDialogContext);

  if (!open) {
    return null;
  }

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <div ref={ref} className={cn(className)} style={contentStyle} role="alertdialog" aria-modal="true" {...props}>
        {children}
      </div>
    </AlertDialogPortal>
  );
});
AlertDialogContent.displayName = 'AlertDialogContent';

/** @param {{ className?: string } & React.HTMLAttributes<HTMLDivElement>} props */
const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn(className)} style={headerStyle} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

/** @param {{ className?: string } & React.HTMLAttributes<HTMLDivElement>} props */
const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn(className)} style={footerStyle} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef(
  /**
   * @param {{ className?: string } & React.HTMLAttributes<HTMLHeadingElement>} props
   * @param {React.ForwardedRef<HTMLHeadingElement>} ref
   */
  ({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn(className)} style={titleStyle} {...props} />
));
AlertDialogTitle.displayName = 'AlertDialogTitle';

const AlertDialogDescription = React.forwardRef(
  /**
   * @param {{ className?: string } & React.HTMLAttributes<HTMLParagraphElement>} props
   * @param {React.ForwardedRef<HTMLParagraphElement>} ref
   */
  ({ className, ...props }, ref) => (
  <p ref={ref} className={cn(className)} style={descriptionStyle} {...props} />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

const AlertDialogAction = React.forwardRef(
  /**
   * @param {{ className?: string, onClick?: React.MouseEventHandler<HTMLButtonElement> } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
   * @param {React.ForwardedRef<HTMLButtonElement>} ref
   */
  ({ className, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      style={buttonStyle('default')}
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
AlertDialogAction.displayName = 'AlertDialogAction';

const AlertDialogCancel = React.forwardRef(
  /**
   * @param {{ className?: string, onClick?: React.MouseEventHandler<HTMLButtonElement> } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
   * @param {React.ForwardedRef<HTMLButtonElement>} ref
   */
  ({ className, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      style={buttonStyle('outline')}
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
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};


