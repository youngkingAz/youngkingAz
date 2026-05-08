// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const Separator = React.forwardRef(
  ({ className, orientation = 'horizontal', decorative = true, style, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={orientation}
      className={cn(className)}
      style={{
        flexShrink: 0,
        background: '#2a2a2a',
        ...(orientation === 'horizontal'
          ? { width: '100%', height: '1px' }
          : { width: '1px', height: '100%' }),
        ...style,
      }}
      {...props}
    />
  )
);
Separator.displayName = 'Separator';

export { Separator };


