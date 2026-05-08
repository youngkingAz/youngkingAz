// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const Slider = React.forwardRef(
  ({ className, value, defaultValue, min = 0, max = 100, step = 1, onValueChange, style, ...props }, ref) => {
    const normalizedDefault = Array.isArray(defaultValue) ? defaultValue[0] : defaultValue;
    const normalizedValue = Array.isArray(value) ? value[0] : value;

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={normalizedValue}
        defaultValue={normalizedDefault}
        className={cn(className)}
        onChange={(event) => {
          if (onValueChange) {
            onValueChange([Number(event.target.value)]);
          }
        }}
        style={{
          width: '100%',
          accentColor: '#f97316',
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          ...style,
        }}
        {...props}
      />
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };


