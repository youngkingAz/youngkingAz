// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const SelectContext = React.createContext({
  value: '',
  setValue: () => {},
  open: false,
  setOpen: () => {},
});

const triggerBaseStyle = {
  display: 'flex',
  minHeight: '2.25rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
  whiteSpace: 'nowrap',
  borderRadius: '0.5rem',
  border: '1px solid #3a3a3a',
  background: 'transparent',
  padding: '0.5rem 0.75rem',
  fontSize: '0.9rem',
  color: '#f5f5f5',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  cursor: 'pointer',
};

const Select = ({ value: valueProp, defaultValue = '', onValueChange, children }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const setValue = React.useCallback(
    (nextValue) => {
      if (valueProp === undefined) {
        setInternalValue(nextValue);
      }
      if (onValueChange) {
        onValueChange(nextValue);
      }
      setOpen(false);
    },
    [onValueChange, valueProp]
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
  }, [open]);

  return (
    <SelectContext.Provider value={{ value, setValue, open, setOpen }}>
      <div style={{ position: 'relative' }}>{children}</div>
    </SelectContext.Provider>
  );
};

const SelectGroup = ({ children, ...props }) => <div {...props}>{children}</div>;

const SelectValue = ({ placeholder, children }) => {
  const { value } = React.useContext(SelectContext);
  return <span>{children || value || placeholder || ''}</span>;
};

const SelectTrigger = React.forwardRef(({ className, children, style, onClick, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      style={{ ...triggerBaseStyle, ...style }}
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
    >
      {children}
      <span aria-hidden="true" style={{ fontSize: '0.8rem', opacity: 0.5 }}>
        v
      </span>
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectScrollUpButton = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '0.25rem',
      color: '#a3a3a3',
      ...style,
    }}
    {...props}
  >
    ^
  </div>
));
SelectScrollUpButton.displayName = 'SelectScrollUpButton';

const SelectScrollDownButton = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '0.25rem',
      color: '#a3a3a3',
      ...style,
    }}
    {...props}
  >
    v
  </div>
));
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

const SelectContent = React.forwardRef(
  ({ className, children, position = 'popper', style, ...props }, ref) => {
    const { open } = React.useContext(SelectContext);

    if (!open) {
      return null;
    }

    return (
      <div
        style={{
          position: 'absolute',
          top: position === 'popper' ? 'calc(100% + 4px)' : '100%',
          left: 0,
          zIndex: 50,
          width: '100%',
        }}
      >
        <div
          ref={ref}
          className={cn(className)}
          style={{
            position: 'relative',
            maxHeight: '24rem',
            minWidth: '8rem',
            overflow: 'hidden',
            borderRadius: '0.5rem',
            border: '1px solid #2a2a2a',
            background: '#111111',
            color: '#f5f5f5',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            ...style,
          }}
          onClick={(event) => event.stopPropagation()}
          {...props}
        >
          <SelectScrollUpButton />
          <div style={{ padding: '0.25rem' }}>{children}</div>
          <SelectScrollDownButton />
        </div>
      </div>
    );
  }
);
SelectContent.displayName = 'SelectContent';

const SelectLabel = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      padding: '0.5rem 0.75rem',
      fontSize: '0.9rem',
      fontWeight: 700,
      ...style,
    }}
    {...props}
  />
));
SelectLabel.displayName = 'SelectLabel';

const SelectItem = React.forwardRef(({ className, children, value, style, onClick, ...props }, ref) => {
  const { value: selectedValue, setValue } = React.useContext(SelectContext);
  const selected = selectedValue === value;

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        cursor: 'pointer',
        alignItems: 'center',
        borderRadius: '0.35rem',
        padding: '0.5rem 2rem 0.5rem 0.75rem',
        fontSize: '0.9rem',
        color: '#f5f5f5',
        ...style,
      }}
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
        setValue(value);
      }}
      {...props}
    >
      <span
        style={{
          position: 'absolute',
          right: '0.5rem',
          display: 'flex',
          width: '1rem',
          justifyContent: 'center',
        }}
      >
        {selected ? '✓' : ''}
      </span>
      <span>{children}</span>
    </div>
  );
});
SelectItem.displayName = 'SelectItem';

const SelectSeparator = React.forwardRef(({ className, style, ...props }, ref) => (
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
SelectSeparator.displayName = 'SelectSeparator';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};


