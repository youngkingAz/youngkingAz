// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const NavigationMenuContext = React.createContext({
  openItem: null,
  setOpenItem: () => {},
});

function navigationMenuTriggerStyle() {
  return 'navigation-menu-trigger';
}

const panelStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: 20,
  marginTop: '0.5rem',
  minWidth: '14rem',
  borderRadius: '0.75rem',
  border: '1px solid #2a2a2a',
  background: '#111111',
  color: '#f5f5f5',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
};

const NavigationMenu = React.forwardRef(({ className, children, style, ...props }, ref) => {
  const [openItem, setOpenItem] = React.useState(null);

  return (
    <NavigationMenuContext.Provider value={{ openItem, setOpenItem }}>
      <nav
        ref={ref}
        className={cn(className)}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          maxWidth: 'max-content',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        {...props}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
});
NavigationMenu.displayName = 'NavigationMenu';

const NavigationMenuList = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      display: 'flex',
      flex: 1,
      listStyle: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      ...style,
    }}
    {...props}
  />
));
NavigationMenuList.displayName = 'NavigationMenuList';

const NavigationMenuItem = React.forwardRef(({ className, style, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      position: 'relative',
      ...style,
    }}
    data-value={value}
    {...props}
  />
));
NavigationMenuItem.displayName = 'NavigationMenuItem';

const NavigationMenuTrigger = React.forwardRef(
  ({ className, children, style, itemValue, onClick, ...props }, ref) => {
    const { openItem, setOpenItem } = React.useContext(NavigationMenuContext);
    const value = itemValue || props['data-value'] || children;
    const isOpen = openItem === value;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(className)}
        style={{
          display: 'inline-flex',
          minHeight: '2.25rem',
          width: 'max-content',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.5rem',
          border: 'none',
          background: isOpen ? '#1f1f1f' : '#0b0b0b',
          padding: '0.5rem 1rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#f5f5f5',
          cursor: 'pointer',
          ...style,
        }}
        onClick={(event) => {
          if (onClick) {
            onClick(event);
          }
          if (!event.defaultPrevented) {
            setOpenItem(isOpen ? null : value);
          }
        }}
        {...props}
      >
        {children}
        <span
          aria-hidden="true"
          style={{
            marginLeft: '0.35rem',
            fontSize: '0.7rem',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          v
        </span>
      </button>
    );
  }
);
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

const NavigationMenuContent = React.forwardRef(
  ({ className, style, itemValue, ...props }, ref) => {
    const { openItem } = React.useContext(NavigationMenuContext);
    const value = itemValue || props['data-value'];

    if (value !== undefined && openItem !== value) {
      return null;
    }

    return <div ref={ref} className={cn(className)} style={{ ...panelStyle, ...style }} {...props} />;
  }
);
NavigationMenuContent.displayName = 'NavigationMenuContent';

const NavigationMenuLink = React.forwardRef(({ className, style, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(className)}
    style={{
      color: '#f5f5f5',
      textDecoration: 'none',
      ...style,
    }}
    {...props}
  />
));
NavigationMenuLink.displayName = 'NavigationMenuLink';

const NavigationMenuViewport = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    className={cn(className)}
    style={{
      position: 'absolute',
      left: 0,
      top: '100%',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      pointerEvents: 'none',
      ...style,
    }}
    ref={ref}
    {...props}
  />
));
NavigationMenuViewport.displayName = 'NavigationMenuViewport';

const NavigationMenuIndicator = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      position: 'absolute',
      top: '100%',
      zIndex: 1,
      display: 'flex',
      height: '0.375rem',
      alignItems: 'flex-end',
      justifyContent: 'center',
      overflow: 'hidden',
      ...style,
    }}
    {...props}
  >
    <div
      style={{
        position: 'relative',
        top: '60%',
        width: '0.5rem',
        height: '0.5rem',
        transform: 'rotate(45deg)',
        borderTopLeftRadius: '2px',
        background: '#2a2a2a',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
      }}
    />
  </div>
));
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};


