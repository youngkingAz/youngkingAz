// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

function labelVariants() {
  return 'label';
}

const Label = React.forwardRef(({ className, style, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(className)}
    style={{
      fontSize: '0.9rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#f5f5f5',
      cursor: props.disabled ? 'not-allowed' : 'default',
      opacity: props.disabled ? 0.7 : 1,
      ...style,
    }}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label, labelVariants };


