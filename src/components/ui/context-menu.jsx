// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const ContextMenuContext = React.createContext({
  open: false,
  setOpen: () => {},
  position: { x: 0, y: 0 },
  setPosition: () => {},
  radioValue: undefined,
  setRadioValue: () => {},
});

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

const contentStyle = {
  position: 'fixed',
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

const ContextMenu = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [radioValue, setRadioValue] = React.useState(undefined);

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const close = () => setOpen(false);
    window.addEventListener('click', close);
    window.addEventListener('contextmenu', close);

    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('contextmenu', close);
    };
  }, [open]);

  return (
    <ContextMenuContext.Provider
      value={{ open, setOpen, position, setPosition, radioValue, setRadioValue }}
    >
      <div>{children}</div>
    </ContextMenuContext.Provider>
  );
};

const ContextMenuTrigger = React.forwardRef(({ className, onContextMenu, style, ...props }, ref) => {
  const { setOpen, setPosition } = React.useContext(ContextMenuContext);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={style}
      onContextMenu={(event) => {
        event.preventDefault();
        setPosition({ x: event.clientX, y: event.clientY });
        setOpen(true);

        if (onContextMenu) {
          onContextMenu(event);
        }
      }}
      {...props}
    />
  );
});
ContextMenuTrigger.displayName = 'ContextMenuTrigger';

const ContextMenuGroup = ({ children, ...props }) => <div {...props}>{children}</div>;

const ContextMenuPortal = ({ children }) => <>{children}</>;

const ContextMenuSub = ({ children }) => <>{children}</>;

const ContextMenuRadioGroup = ({ value, onValueChange, children, ...props }) => {
  const { setRadioValue } = React.useContext(ContextMenuContext);

  React.useEffect(() => {
    if (value !== undefined) {
      setRadioValue(value);
    }
  }, [setRadioValue, value]);

  return (
    <div
      {...props}
      data-value={value}
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

const ContextMenuSubTrigger = React.forwardRef(
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
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

const ContextMenuSubContent = React.forwardRef(({ className, style, ...props }, ref) => (
  <div ref={ref} className={cn(className)} style={{ ...contentStyle, ...style }} {...props} />
));
ContextMenuSubContent.displayName = 'ContextMenuSubContent';

const ContextMenuContent = React.forwardRef(({ className, style, ...props }, ref) => {
  const { open, position } = React.useContext(ContextMenuContext);

  if (!open) {
    return null;
  }

  return (
    <ContextMenuPortal>
      <div
        ref={ref}
        className={cn(className)}
        style={{
          ...contentStyle,
          left: position.x,
          top: position.y,
          ...style,
        }}
        {...props}
      />
    </ContextMenuPortal>
  );
});
ContextMenuContent.displayName = 'ContextMenuContent';

const ContextMenuItem = React.forwardRef(({ className, inset, style, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(ContextMenuContext);

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
ContextMenuItem.displayName = 'ContextMenuItem';

const ContextMenuCheckboxItem = React.forwardRef(
  ({ className, children, checked, style, onClick, ...props }, ref) => {
    const { setOpen } = React.useContext(ContextMenuContext);

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
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

const ContextMenuRadioItem = React.forwardRef(
  ({ className, children, value, style, onClick, ...props }, ref) => {
    const { radioValue, setRadioValue, setOpen } = React.useContext(ContextMenuContext);
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
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

const ContextMenuLabel = React.forwardRef(({ className, inset, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      padding: '0.5rem 0.75rem',
      paddingLeft: inset ? '2rem' : '0.75rem',
      fontSize: '0.9rem',
      fontWeight: 700,
      color: '#f5f5f5',
      ...style,
    }}
    {...props}
  />
));
ContextMenuLabel.displayName = 'ContextMenuLabel';

const ContextMenuSeparator = React.forwardRef(({ className, style, ...props }, ref) => (
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
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

const ContextMenuShortcut = ({ className, style, ...props }) => (
  <span
    className={cn(className)}
    style={{
      marginLeft: 'auto',
      fontSize: '0.75rem',
      letterSpacing: '0.12em',
      color: '#9ca3af',
      ...style,
    }}
    {...props}
  />
);
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};


