// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

function useLocalIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

const basePanelStyle = {
  background: '#0b0b0b',
  color: '#f5f5f5',
  borderColor: '#2a2a2a',
};

const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useLocalIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === 'function' ? value(open) : value;

        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        if (typeof document !== 'undefined') {
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        }
      },
      [open, setOpenProp]
    );

    const toggleSidebar = React.useCallback(() => {
      if (isMobile) {
        setOpenMobile((current) => !current);
      } else {
        setOpen((current) => !current);
      }
    }, [isMobile, setOpen]);

    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(className)}
          style={{
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            display: 'flex',
            minHeight: '100vh',
            width: '100%',
            background: '#050505',
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    const collapsed = state === 'collapsed';

    if (collapsible === 'none') {
      return (
        <div
          ref={ref}
          className={cn(className)}
          style={{
            ...basePanelStyle,
            width: 'var(--sidebar-width)',
            display: 'flex',
            flexDirection: 'column',
            borderRight: side === 'left' ? '1px solid #2a2a2a' : undefined,
            borderLeft: side === 'right' ? '1px solid #2a2a2a' : undefined,
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      if (!openMobile) {
        return null;
      }

      return (
        <>
          <div
            onClick={() => setOpenMobile(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 49,
              background: 'rgba(0, 0, 0, 0.75)',
            }}
          />
          <div
            ref={ref}
            data-sidebar="sidebar"
            data-mobile="true"
            className={cn(className)}
            style={{
              ...basePanelStyle,
              position: 'fixed',
              top: 0,
              bottom: 0,
              [side]: 0,
              zIndex: 50,
              width: SIDEBAR_WIDTH_MOBILE,
              display: 'flex',
              flexDirection: 'column',
              borderRight: side === 'left' ? '1px solid #2a2a2a' : undefined,
              borderLeft: side === 'right' ? '1px solid #2a2a2a' : undefined,
              ...style,
            }}
            {...props}
          >
            {children}
          </div>
        </>
      );
    }

    return (
      <div
        ref={ref}
        data-state={state}
        data-collapsible={collapsed ? collapsible : ''}
        data-variant={variant}
        data-side={side}
        className={cn(className)}
        style={{
          ...basePanelStyle,
          position: 'relative',
          width:
            collapsed && collapsible !== 'none'
              ? collapsible === 'icon'
                ? 'var(--sidebar-width-icon)'
                : 0
              : 'var(--sidebar-width)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
          overflow: 'hidden',
          borderRight: side === 'left' ? '1px solid #2a2a2a' : undefined,
          borderLeft: side === 'right' ? '1px solid #2a2a2a' : undefined,
          ...(variant === 'floating' || variant === 'inset'
            ? {
                margin: '0.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #2a2a2a',
              }
            : {}),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = 'Sidebar';

const SidebarTrigger = React.forwardRef(({ className, onClick, asChild = false, style, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  const triggerProps = {
    ref,
    className: cn(className),
    onClick: (event) => {
      if (onClick) {
        onClick(event);
      }
      toggleSidebar();
    },
    style: {
      display: 'inline-flex',
      width: '1.75rem',
      height: '1.75rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.4rem',
      border: '1px solid #2a2a2a',
      background: 'transparent',
      color: '#f5f5f5',
      cursor: 'pointer',
      ...style,
    },
    ...props,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, triggerProps);
  }

  return (
    <button type="button" {...triggerProps}>
      |||
      <span
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Toggle Sidebar
      </span>
    </button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarRail = React.forwardRef(({ className, style, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle Sidebar"
      onClick={toggleSidebar}
      className={cn(className)}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: '-0.5rem',
        width: '0.75rem',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        ...style,
      }}
      {...props}
    />
  );
});
SidebarRail.displayName = 'SidebarRail';

const SidebarInset = React.forwardRef(({ className, style, ...props }, ref) => (
  <main
    ref={ref}
    className={cn(className)}
    style={{
      position: 'relative',
      display: 'flex',
      minHeight: '100vh',
      flex: 1,
      flexDirection: 'column',
      background: '#050505',
      color: '#f5f5f5',
      ...style,
    }}
    {...props}
  />
));
SidebarInset.displayName = 'SidebarInset';

const SidebarInput = React.forwardRef(({ className, style, ...props }, ref) => (
  <input
    ref={ref}
    data-sidebar="input"
    className={cn(className)}
    style={{
      width: '100%',
      minHeight: '2rem',
      borderRadius: '0.5rem',
      border: '1px solid #3a3a3a',
      background: '#111111',
      padding: '0.4rem 0.75rem',
      color: '#f5f5f5',
      ...style,
    }}
    {...props}
  />
));
SidebarInput.displayName = 'SidebarInput';

const simpleDiv = (displayName, defaultStyle) => {
  const Component = React.forwardRef(({ className, style, ...props }, ref) => (
    <div ref={ref} className={cn(className)} style={{ ...defaultStyle, ...style }} {...props} />
  ));
  Component.displayName = displayName;
  return Component;
};

const SidebarHeader = simpleDiv('SidebarHeader', { display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem' });
const SidebarFooter = simpleDiv('SidebarFooter', { display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem' });
const SidebarSeparator = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{ height: '1px', margin: '0 0.5rem', background: '#2a2a2a', ...style }}
    {...props}
  />
));
SidebarSeparator.displayName = 'SidebarSeparator';
const SidebarContent = simpleDiv('SidebarContent', { display: 'flex', minHeight: 0, flex: 1, flexDirection: 'column', gap: '0.5rem', overflow: 'auto' });
const SidebarGroup = simpleDiv('SidebarGroup', { position: 'relative', display: 'flex', width: '100%', minWidth: 0, flexDirection: 'column', padding: '0.5rem' });

const SidebarGroupLabel = React.forwardRef(({ className, asChild = false, style, ...props }, ref) => {
  const sharedStyle = {
    display: 'flex',
    minHeight: '2rem',
    alignItems: 'center',
    borderRadius: '0.4rem',
    padding: '0 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'rgba(245,245,245,0.7)',
    ...style,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      ref,
      className: cn(props.children.props.className, className),
      style: { ...sharedStyle, ...props.children.props.style },
      ...props,
    });
  }

  return <div ref={ref} className={cn(className)} style={sharedStyle} {...props} />;
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupAction = React.forwardRef(({ className, asChild = false, style, ...props }, ref) => {
  const sharedStyle = {
    position: 'absolute',
    right: '0.75rem',
    top: '0.75rem',
    display: 'flex',
    width: '1.25rem',
    height: '1.25rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.4rem',
    border: '1px solid #2a2a2a',
    background: 'transparent',
    color: '#f5f5f5',
    cursor: 'pointer',
    ...style,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      ref,
      className: cn(props.children.props.className, className),
      style: { ...sharedStyle, ...props.children.props.style },
      ...props,
    });
  }

  return <button ref={ref} type="button" className={cn(className)} style={sharedStyle} {...props} />;
});
SidebarGroupAction.displayName = 'SidebarGroupAction';

const SidebarGroupContent = simpleDiv('SidebarGroupContent', { width: '100%', fontSize: '0.9rem' });
const SidebarMenu = React.forwardRef(({ className, style, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(className)}
    style={{ display: 'flex', width: '100%', minWidth: 0, flexDirection: 'column', gap: '0.25rem', listStyle: 'none', margin: 0, padding: 0, ...style }}
    {...props}
  />
));
SidebarMenu.displayName = 'SidebarMenu';
const SidebarMenuItem = simpleDiv('SidebarMenuItem', { position: 'relative' });

function sidebarMenuButtonVariants({ variant = 'default', size = 'default' } = {}) {
  return `${variant} ${size}`;
}

const SidebarMenuButton = React.forwardRef(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const sharedStyle = {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      gap: '0.5rem',
      overflow: 'hidden',
      borderRadius: '0.5rem',
      padding: size === 'lg' ? '0.75rem' : size === 'sm' ? '0.35rem 0.5rem' : '0.5rem',
      textAlign: 'left',
      fontSize: size === 'sm' ? '0.75rem' : '0.9rem',
      border: variant === 'outline' ? '1px solid #2a2a2a' : '1px solid transparent',
      background: isActive ? '#1f1f1f' : 'transparent',
      color: '#f5f5f5',
      cursor: 'pointer',
      ...style,
    };

    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(props.children, {
        ref,
        className: cn(props.children.props.className, className),
        style: { ...sharedStyle, ...props.children.props.style },
        title: typeof tooltip === 'string' ? tooltip : props.children.props.title,
        ...props,
      });
    }

    return <button ref={ref} type="button" className={cn(sidebarMenuButtonVariants({ variant, size }), className)} style={sharedStyle} title={typeof tooltip === 'string' ? tooltip : undefined} {...props} />;
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuAction = React.forwardRef(({ className, asChild = false, style, ...props }, ref) => {
  const sharedStyle = {
    position: 'absolute',
    right: '0.25rem',
    top: '0.35rem',
    display: 'flex',
    width: '1.25rem',
    height: '1.25rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.35rem',
    border: '1px solid #2a2a2a',
    background: 'transparent',
    color: '#f5f5f5',
    cursor: 'pointer',
    ...style,
  };

    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(props.children, {
        ref,
        className: cn(props.children.props.className, className),
        style: { ...sharedStyle, ...props.children.props.style },
        ...props,
      });
    }

    return <button ref={ref} type="button" className={cn(className)} style={sharedStyle} {...props} />;
});
SidebarMenuAction.displayName = 'SidebarMenuAction';

const SidebarMenuBadge = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      pointerEvents: 'none',
      position: 'absolute',
      right: '0.25rem',
      top: '0.35rem',
      display: 'flex',
      minWidth: '1.25rem',
      height: '1.25rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.35rem',
      padding: '0 0.25rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      color: '#f5f5f5',
      ...style,
    }}
    {...props}
  />
));
SidebarMenuBadge.displayName = 'SidebarMenuBadge';

const SidebarMenuSkeleton = React.forwardRef(({ className, showIcon = false, style, ...props }, ref) => {
  const width = React.useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{ display: 'flex', minHeight: '2rem', alignItems: 'center', gap: '0.5rem', borderRadius: '0.5rem', padding: '0 0.5rem', ...style }}
      {...props}
    >
      {showIcon ? <div style={{ width: '1rem', height: '1rem', borderRadius: '0.25rem', background: '#2a2a2a' }} /> : null}
      <div style={{ height: '1rem', width, borderRadius: '0.25rem', background: '#2a2a2a' }} />
    </div>
  );
});
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton';

const SidebarMenuSub = React.forwardRef(({ className, style, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(className)}
    style={{
      margin: '0 0 0 0.875rem',
      display: 'flex',
      minWidth: 0,
      flexDirection: 'column',
      gap: '0.25rem',
      borderLeft: '1px solid #2a2a2a',
      padding: '0.25rem 0 0.25rem 0.75rem',
      listStyle: 'none',
      ...style,
    }}
    {...props}
  />
));
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef((props, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarMenuSubButton = React.forwardRef(
  ({ asChild = false, size = 'md', isActive, className, style, ...props }, ref) => {
    const sharedStyle = {
      display: 'flex',
      minHeight: '1.75rem',
      minWidth: 0,
      alignItems: 'center',
      gap: '0.5rem',
      overflow: 'hidden',
      borderRadius: '0.4rem',
      padding: '0 0.5rem',
      fontSize: size === 'sm' ? '0.75rem' : '0.9rem',
      color: '#f5f5f5',
      background: isActive ? '#1f1f1f' : 'transparent',
      textDecoration: 'none',
      ...style,
    };

    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(props.children, {
        ref,
        className: cn(props.children.props.className, className),
        style: { ...sharedStyle, ...props.children.props.style },
        ...props,
      });
    }

    return <a ref={ref} className={cn(className)} style={sharedStyle} {...props} />;
  }
);
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};


