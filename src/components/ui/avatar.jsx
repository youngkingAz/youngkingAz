// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';

const AvatarContext = React.createContext({
  imageLoaded: false,
  setImageLoaded: () => {},
  imageError: false,
  setImageError: () => {},
});

/**
 * @typedef {object} AvatarProps
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 * @property {React.ReactNode} [children]
 */

const rootStyle = {
  position: 'relative',
  display: 'inline-flex',
  width: '2.5rem',
  height: '2.5rem',
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: '999px',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  aspectRatio: '1 / 1',
};

const fallbackStyle = {
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '999px',
  background: '#262626',
  color: '#f5f5f5',
};

const Avatar = React.forwardRef(
  /**
   * @param {AvatarProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, children, ...props }, ref) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  return (
    <AvatarContext.Provider value={{ imageLoaded, setImageLoaded, imageError, setImageError }}>
      <div ref={ref} className={cn(className)} style={{ ...rootStyle, ...style }} {...props}>
        {children}
      </div>
    </AvatarContext.Provider>
  );
});
Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef(
  /**
   * @param {{ className?: string, style?: React.CSSProperties, onLoad?: React.ReactEventHandler<HTMLImageElement>, onError?: React.ReactEventHandler<HTMLImageElement> } & React.ImgHTMLAttributes<HTMLImageElement>} props
   * @param {React.ForwardedRef<HTMLImageElement>} ref
   */
  ({ className, style, onLoad, onError, ...props }, ref) => {
  const { imageError, setImageError, setImageLoaded } = React.useContext(AvatarContext);

  if (imageError) {
    return null;
  }

  return (
    <img
      ref={ref}
      className={cn(className)}
      style={{ ...imageStyle, ...style }}
      onLoad={(event) => {
        setImageLoaded(true);
        setImageError(false);
        if (onLoad) {
          onLoad(event);
        }
      }}
      onError={(event) => {
        setImageLoaded(false);
        setImageError(true);
        if (onError) {
          onError(event);
        }
      }}
      {...props}
    />
  );
});
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef(
  /**
   * @param {AvatarProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, style, children, ...props }, ref) => {
  const { imageLoaded, imageError } = React.useContext(AvatarContext);

  if (imageLoaded && !imageError) {
    return null;
  }

  return (
    <div ref={ref} className={cn(className)} style={{ ...fallbackStyle, ...style }} {...props}>
      {children}
    </div>
  );
});
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };


