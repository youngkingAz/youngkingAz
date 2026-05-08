// @ts-nocheck
import * as React from 'react';

const AspectRatio = React.forwardRef(
  ({ ratio = 1, children, style, ...props }, ref) => {
    const safeRatio = Number(ratio) > 0 ? Number(ratio) : 1;

    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: `${100 / safeRatio}%`,
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };


