// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const InputOTPContext = React.createContext({
  value: '',
  maxLength: 6,
  setValue: () => {},
});

const InputOTP = React.forwardRef(
  (
    {
      className,
      containerClassName,
      value: valueProp,
      defaultValue = '',
      maxLength = 6,
      onChange,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = valueProp !== undefined ? valueProp : internalValue;

    const setValue = React.useCallback(
      (nextValue) => {
        const trimmed = String(nextValue).slice(0, maxLength);

        if (valueProp === undefined) {
          setInternalValue(trimmed);
        }

        if (onChange) {
          onChange(trimmed);
        }
      },
      [maxLength, onChange, valueProp]
    );

    return (
      <InputOTPContext.Provider value={{ value, maxLength, setValue }}>
        <div
          ref={ref}
          className={cn(containerClassName)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: props.disabled ? 0.5 : 1,
          }}
        >
          <div className={cn(className)} style={style}>
            {children}
          </div>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            style={{
              position: 'absolute',
              opacity: 0,
              pointerEvents: 'none',
              width: 1,
              height: 1,
            }}
            {...props}
          />
        </div>
      </InputOTPContext.Provider>
    );
  }
);
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{
      display: 'flex',
      alignItems: 'center',
      ...style,
    }}
    {...props}
  />
));
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef(({ index, className, style, ...props }, ref) => {
  const { value } = React.useContext(InputOTPContext);
  const char = value[index] || '';
  const isActive = index === Math.min(value.length, Math.max(value.length, 0));
  const hasFakeCaret = !char && isActive;

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        position: 'relative',
        display: 'flex',
        width: '2.25rem',
        height: '2.25rem',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid #3a3a3a',
        borderBottom: '1px solid #3a3a3a',
        borderRight: '1px solid #3a3a3a',
        background: '#111111',
        color: '#f5f5f5',
        fontSize: '0.9rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderLeft: index === 0 ? '1px solid #3a3a3a' : undefined,
        borderTopLeftRadius: index === 0 ? '0.375rem' : undefined,
        borderBottomLeftRadius: index === 0 ? '0.375rem' : undefined,
        borderTopRightRadius: index === 5 ? '0.375rem' : undefined,
        borderBottomRightRadius: index === 5 ? '0.375rem' : undefined,
        outline: isActive ? '1px solid #f97316' : 'none',
        ...style,
      }}
      {...props}
    >
      {char}
      {hasFakeCaret ? (
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '1px',
              height: '1rem',
              background: '#f5f5f5',
              opacity: 0.8,
            }}
          />
        </div>
      ) : null}
    </div>
  );
});
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn(className)}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      ...style,
    }}
    {...props}
  >
    -
  </div>
));
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };


