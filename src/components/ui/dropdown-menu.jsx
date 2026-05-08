// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const DropdownMenuContext = React.createContext({
  open: false,
  setOpen: () => {},
  radioValue: undefined,
  setRadioValue: () => {},
});

const menuStyle = {
  position: 'absolute',
  zIndex: 60,
  minWidth: '8rem',
  overflow: 'hidden',
  borderRadius: '0.75rem',
  border: '1px solid #2a2a2a',
  background: '#111111',
  padding: '0.25rem',
  color: '#f5f5f5',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
};

const itemBaseStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  borderRadius: '0.35rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.9rem',
  color: '#f5f5f5',
  cursor: 'pointer',
};

const DropdownMenu = ({ open: openProp, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState(undefined);
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

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, radioValue, setRadioValue }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DropdownMenuContext);

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
          setOpen(!open);
        }
      }}
      {...props}
    />
  );
});
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuGroup = ({ children, ...props }) => <div {...props}>{children}</div>;

const DropdownMenuPortal = ({ children }) => <>{children}</>;

const DropdownMenuSub = ({ children }) => <>{children}</>;

const DropdownMenuRadioGroup = ({ value, onValueChange, children, ...props }) => {
  const { setRadioValue } = React.useContext(DropdownMenuContext);

  React.useEffect(() => {
    if (value !== undefined) {
      setRadioValue(value);
    }
  }, [setRadioValue, value]);

  return (
    <div
      {...props}
      onChange={(event) => {
        if (onValueChange) {
          onValueChange(event.target.value);
        }
      }}
    >
      {children}
    </div>
  );
};

const DropdownMenuSubTrigger = React.forwardRef(
  ({ className, inset, children, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        ...itemBaseStyle,
        paddingLeft: inset ? '2rem' : itemBaseStyle.padding,
        ...style,
      }}
      {...props}
    >
      {children}
      <span style={{ marginLeft: 'auto', color: '#a3a3a3' }}>{'>'}</span>
    </div>
  )
);
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

const DropdownMenuSubContent = React.forwardRef(({ className, style, ...props }, ref) => (
  <div ref={ref} className={cn(className)} style={{ ...menuStyle, ...style }} {...props} />
));
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 4, style, ...props }, ref) => {
    const { open } = React.useContext(DropdownMenuContext);

    if (!open) {
      return null;
    }

    return (
      <DropdownMenuPortal>
        <div
          ref={ref}
          className={cn(className)}
          style={{
            ...menuStyle,
            top: `calc(100% + ${sideOffset}px)`,
            left: 0,
            ...style,
          }}
          {...props}
        />
      </DropdownMenuPortal>
    );
  }
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef(({ className, inset, style, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        ...itemBaseStyle,
        paddingLeft: inset ? '2rem' : itemBaseStyle.padding,
        ...style,
      }}
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
        setOpen(false);
      }}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuCheckboxItem = React.forwardRef(
  ({ className, children, checked, style, onClick, ...props }, ref) => {
    const { setOpen } = React.useContext(DropdownMenuContext);

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          ...itemBaseStyle,
          paddingLeft: '2rem',
          ...style,
        }}
        onClick={(event) => {
          if (onClick) {
            onClick(event);
          }
          setOpen(false);
        }}
        {...props}
      >
        <span
          style={{
            position: 'absolute',
            left: '0.5rem',
            display: 'flex',
            width: '1rem',
            justifyContent: 'center',
          }}
        >
          {checked ? '✓' : ''}
        </span>
        {children}
      </div>
    );
  }
);
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

const DropdownMenuRadioItem = React.forwardRef(
  ({ className, children, value, style, onClick, ...props }, ref) => {
    const { radioValue, setRadioValue, setOpen } = React.useContext(DropdownMenuContext);
    const selected = radioValue === value;

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          ...itemBaseStyle,
          paddingLeft: '2rem',
          ...style,
        }}
        onClick={(event) => {
          setRadioValue(value);
          if (onClick) {
            onClick(event);
          }
          setOpen(false);
        }}
        {...props}
      >
        <span
          style={{
            position: 'absolute',
            left: '0.5rem',
            display: 'flex',
            width: '1rem',
            justifyContent: 'center',
          }}
        >
          {selected ? '●' : '○'}
        </span>
        {children}
      </div>
    );
  }
);
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

const DropdownMenuLabel = React.forwardRef(({ className, inset, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      padding: '0.5rem 0.75rem',
      paddingLeft: inset ? '2rem' : '0.75rem',
      fontSize: '0.9rem',
      fontWeight: 700,
      ...style,
    }}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

const DropdownMenuSeparator = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      height: '1px',
      margin: '0.25rem',
      background: '#262626',
      ...style,
    }}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

const DropdownMenuShortcut = ({ className, style, ...props }) => (
  <span
    className={cn(className)}
    style={{
      marginLeft: 'auto',
      fontSize: '0.75rem',
      letterSpacing: '0.12em',
      opacity: 0.6,
      ...style,
    }}
    {...props}
  />
);
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};


