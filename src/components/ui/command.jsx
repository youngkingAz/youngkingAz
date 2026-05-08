// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const CommandContext = React.createContext(null);

function useCommandContext() {
  const context = React.useContext(CommandContext);

  if (!context) {
    throw new Error('Command components must be used within a <Command />');
  }

  return context;
}

const shellStyle = {
  display: 'flex',
  width: '100%',
  height: '100%',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: '0.75rem',
  background: '#111111',
  color: '#f5f5f5',
  border: '1px solid #2a2a2a',
};

const dialogOverlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  background: 'rgba(0, 0, 0, 0.7)',
};

const dialogContentStyle = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  zIndex: 51,
  width: 'min(92vw, 34rem)',
  transform: 'translate(-50%, -50%)',
  overflow: 'hidden',
  borderRadius: '1rem',
  border: '1px solid #2a2a2a',
  background: '#0b0b0b',
  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
};

const Command = React.forwardRef(({ className, children, style, ...props }, ref) => {
  const [query, setQuery] = React.useState('');

  return (
    <CommandContext.Provider value={{ query, setQuery }}>
      <div ref={ref} className={cn(className)} style={{ ...shellStyle, ...style }} {...props}>
        {children}
      </div>
    </CommandContext.Provider>
  );
});
Command.displayName = 'Command';

const CommandDialog = ({ children, open = true, onOpenChange, ...props }) => {
  if (!open) {
    return null;
  }

  return (
    <>
      <div
        style={dialogOverlayStyle}
        onClick={() => {
          if (onOpenChange) {
            onOpenChange(false);
          }
        }}
      />
      <div style={dialogContentStyle} {...props}>
        <Command>{children}</Command>
      </div>
    </>
  );
};

const CommandInput = React.forwardRef(({ className, style, onChange, ...props }, ref) => {
  const { query, setQuery } = useCommandContext();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #262626',
        padding: '0 0.75rem',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          marginRight: '0.5rem',
          fontSize: '0.9rem',
          opacity: 0.6,
        }}
      >
        Search
      </span>
      <input
        ref={ref}
        className={cn(className)}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (onChange) {
            onChange(event);
          }
        }}
        style={{
          display: 'flex',
          height: '2.75rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          color: '#f5f5f5',
          fontSize: '0.9rem',
          outline: 'none',
          ...style,
        }}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      maxHeight: '300px',
      overflowY: 'auto',
      overflowX: 'hidden',
      ...style,
    }}
    {...props}
  />
));
CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      padding: '1.5rem',
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#a3a3a3',
      ...style,
    }}
    {...props}
  />
));
CommandEmpty.displayName = 'CommandEmpty';

const CommandGroup = React.forwardRef(({ className, style, heading, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      overflow: 'hidden',
      padding: '0.5rem',
      color: '#f5f5f5',
      ...style,
    }}
    {...props}
  >
    {heading ? (
      <div
        style={{
          padding: '0.35rem 0.5rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#9ca3af',
        }}
      >
        {heading}
      </div>
    ) : null}
    {children}
  </div>
));
CommandGroup.displayName = 'CommandGroup';

const CommandSeparator = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      height: '1px',
      margin: '0 0.25rem',
      background: '#262626',
      ...style,
    }}
    {...props}
  />
));
CommandSeparator.displayName = 'CommandSeparator';

const CommandItem = React.forwardRef(({ className, style, children, onSelect, onClick, ...props }, ref) => {
  const { query } = useCommandContext();
  const text = React.Children.toArray(children).join(' ').toLowerCase();
  const matches = !query || text.includes(query.toLowerCase());

  if (!matches) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
        if (onSelect) {
          onSelect(text);
        }
      }}
      style={{
        position: 'relative',
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        gap: '0.5rem',
        borderRadius: '0.35rem',
        padding: '0.5rem',
        fontSize: '0.9rem',
        outline: 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
CommandItem.displayName = 'CommandItem';

const CommandShortcut = ({ className, style, ...props }) => (
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
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};


