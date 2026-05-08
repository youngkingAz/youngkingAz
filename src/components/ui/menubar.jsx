// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const MenubarContext = React.createContext({
  openMenu: null,
  setOpenMenu: () => {},
  radioValue: undefined,
  setRadioValue: () => {},
});

const panelStyle = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  zIndex: 60,
  minWidth: '12rem',
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

function MenubarMenu(props) {
  return <div {...props} />;
}

function MenubarGroup(props) {
  return <div {...props} />;
}

function MenubarPortal(props) {
  return <>{props.children}</>;
}

function MenubarRadioGroup({ value, onValueChange, children, ...props }) {
  const { setRadioValue } = React.useContext(MenubarContext);

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
}

function MenubarSub(props) {
  return <div data-slot="menubar-sub" {...props} />;
}

const Menubar = React.forwardRef(({ className, style, children, ...props }, ref) => {
  const [openMenu, setOpenMenu] = React.useState(null);
  const [radioValue, setRadioValue] = React.useState(undefined);

  React.useEffect(() => {
    if (!openMenu) {
      return undefined;
    }

    const close = () => setOpenMenu(null);
    window.addEventListener('click', close);

    return () => {
      window.removeEventListener('click', close);
    };
  }, [openMenu]);

  return (
    <MenubarContext.Provider value={{ openMenu, setOpenMenu, radioValue, setRadioValue }}>
      <div
        ref={ref}
        className={cn(className)}
        style={{
          display: 'flex',
          minHeight: '2.25rem',
          alignItems: 'center',
          gap: '0.25rem',
          borderRadius: '0.5rem',
          border: '1px solid #2f2f2f',
          background: '#0b0b0b',
          padding: '0.25rem',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.14)',
          position: 'relative',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  );
});
Menubar.displayName = 'Menubar';

const MenubarTrigger = React.forwardRef(({ className, style, value, onClick, ...props }, ref) => {
  const { openMenu, setOpenMenu } = React.useContext(MenubarContext);
  const menuValue = value || props.children;
  const active = openMenu === menuValue;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '0.35rem',
        padding: '0.35rem 0.75rem',
        fontSize: '0.9rem',
        fontWeight: 600,
        border: 'none',
        background: active ? '#1f1f1f' : 'transparent',
        color: '#f5f5f5',
        cursor: 'pointer',
        ...style,
      }}
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
        if (!event.defaultPrevented) {
          setOpenMenu(active ? null : menuValue);
        }
      }}
      {...props}
    />
  );
});
MenubarTrigger.displayName = 'MenubarTrigger';

const MenubarSubTrigger = React.forwardRef(({ className, inset, children, style, ...props }, ref) => (
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
));
MenubarSubTrigger.displayName = 'MenubarSubTrigger';

const MenubarSubContent = React.forwardRef(({ className, style, ...props }, ref) => (
  <div ref={ref} className={cn(className)} style={{ ...panelStyle, ...style }} {...props} />
));
MenubarSubContent.displayName = 'MenubarSubContent';

const MenubarContent = React.forwardRef(
  ({ className, align = 'start', alignOffset = -4, sideOffset = 8, style, menu, ...props }, ref) => {
    const { openMenu } = React.useContext(MenubarContext);
    const menuValue = menu || props['data-menu'];

    if (openMenu !== menuValue) {
      return null;
    }

    const left =
      align === 'center' ? '50%' : align === 'end' ? 'auto' : `${alignOffset < 0 ? 0 : alignOffset}px`;
    const transform = align === 'center' ? 'translateX(-50%)' : 'none';

    return (
      <MenubarPortal>
        <div
          ref={ref}
          className={cn(className)}
          style={{
            ...panelStyle,
            top: `calc(100% + ${sideOffset}px)`,
            left,
            right: align === 'end' ? 0 : 'auto',
            transform,
            ...style,
          }}
          {...props}
        />
      </MenubarPortal>
    );
  }
);
MenubarContent.displayName = 'MenubarContent';

const MenubarItem = React.forwardRef(({ className, inset, style, onClick, ...props }, ref) => {
  const { setOpenMenu } = React.useContext(MenubarContext);

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
        setOpenMenu(null);
      }}
      {...props}
    />
  );
});
MenubarItem.displayName = 'MenubarItem';

const MenubarCheckboxItem = React.forwardRef(
  ({ className, children, checked, style, onClick, ...props }, ref) => {
    const { setOpenMenu } = React.useContext(MenubarContext);

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
          setOpenMenu(null);
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
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

const MenubarRadioItem = React.forwardRef(
  ({ className, children, value, style, onClick, ...props }, ref) => {
    const { radioValue, setRadioValue, setOpenMenu } = React.useContext(MenubarContext);
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
          setOpenMenu(null);
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
MenubarRadioItem.displayName = 'MenubarRadioItem';

const MenubarLabel = React.forwardRef(({ className, inset, style, ...props }, ref) => (
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
MenubarLabel.displayName = 'MenubarLabel';

const MenubarSeparator = React.forwardRef(({ className, style, ...props }, ref) => (
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
MenubarSeparator.displayName = 'MenubarSeparator';

const MenubarShortcut = ({ className, style, ...props }) => (
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
MenubarShortcut.displayName = 'MenubarShortcut';

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};


