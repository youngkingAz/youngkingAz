// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const TabsContext = React.createContext({
  value: undefined,
  setValue: () => {},
});

const Tabs = ({ value: valueProp, defaultValue, onValueChange, children, ...props }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const setValue = React.useCallback(
    (nextValue) => {
      if (valueProp === undefined) {
        setInternalValue(nextValue);
      }
      if (onValueChange) {
        onValueChange(nextValue);
      }
    },
    [onValueChange, valueProp]
  );

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      display: 'inline-flex',
      minHeight: '2.25rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.75rem',
      background: '#1f1f1f',
      padding: '0.25rem',
      color: '#a3a3a3',
      ...style,
    }}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(({ className, value, style, onClick, ...props }, ref) => {
  const { value: currentValue, setValue } = React.useContext(TabsContext);
  const active = currentValue === value;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        borderRadius: '0.5rem',
        border: 'none',
        padding: '0.35rem 0.75rem',
        fontSize: '0.9rem',
        fontWeight: 600,
        background: active ? '#0b0b0b' : 'transparent',
        color: active ? '#f5f5f5' : '#a3a3a3',
        boxShadow: active ? '0 6px 18px rgba(0, 0, 0, 0.18)' : 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...style,
      }}
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
        if (!event.defaultPrevented) {
          setValue(value);
        }
      }}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef(({ className, value, style, ...props }, ref) => {
  const { value: currentValue } = React.useContext(TabsContext);

  if (currentValue !== value) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        marginTop: '0.5rem',
        ...style,
      }}
      {...props}
    />
  );
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };


