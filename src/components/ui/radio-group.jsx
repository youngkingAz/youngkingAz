// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const RadioGroupContext = React.createContext({
  value: undefined,
  setValue: () => {},
  disabled: false,
  name: undefined,
});

const RadioGroup = React.forwardRef(
  (
    { className, value: valueProp, defaultValue, onValueChange, disabled = false, name, style, children, ...props },
    ref
  ) => {
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
      <RadioGroupContext.Provider value={{ value, setValue, disabled, name }}>
        <div
          ref={ref}
          className={cn(className)}
          style={{
            display: 'grid',
            gap: '0.5rem',
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef(
  ({ className, value, disabled: itemDisabled = false, style, onChange, ...props }, ref) => {
    const { value: groupValue, setValue, disabled: groupDisabled, name } = React.useContext(RadioGroupContext);
    const disabled = groupDisabled || itemDisabled;
    const checked = groupValue === value;

    return (
      <label
        className={cn(className)}
        style={{
          display: 'inline-flex',
          width: '1rem',
          height: '1rem',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '999px',
          border: '1px solid #f97316',
          color: '#f97316',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          ...style,
        }}
      >
        <input
          ref={ref}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            setValue(value);
            if (onChange) {
              onChange(event);
            }
          }}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
          }}
          {...props}
        />
        <span
          aria-hidden="true"
          style={{
            width: '0.55rem',
            height: '0.55rem',
            borderRadius: '999px',
            background: checked ? '#f97316' : 'transparent',
            transition: 'background 0.2s ease',
          }}
        />
      </label>
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };


