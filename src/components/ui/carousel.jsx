// @ts-nocheck
import * as React from 'react';

import { cn } from '../../lib/utils';
import { Button } from './button';

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

const Carousel = React.forwardRef(
  (
    { orientation = 'horizontal', opts, setApi, plugins, className, children, style, ...props },
    ref
  ) => {
    const contentRef = React.useRef(null);
    const [index, setIndex] = React.useState(0);
    const [itemCount, setItemCount] = React.useState(0);

    const canScrollPrev = index > 0;
    const canScrollNext = index < Math.max(itemCount - 1, 0);

    const scrollPrev = React.useCallback(() => {
      setIndex((current) => Math.max(current - 1, 0));
    }, []);

    const scrollNext = React.useCallback(() => {
      setIndex((current) => Math.min(current + 1, Math.max(itemCount - 1, 0)));
    }, [itemCount]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (orientation === 'horizontal' && event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (orientation === 'horizontal' && event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        } else if (orientation === 'vertical' && event.key === 'ArrowUp') {
          event.preventDefault();
          scrollPrev();
        } else if (orientation === 'vertical' && event.key === 'ArrowDown') {
          event.preventDefault();
          scrollNext();
        }
      },
      [orientation, scrollNext, scrollPrev]
    );

    const api = React.useMemo(
      () => ({
        scrollPrev,
        scrollNext,
        canScrollPrev: () => canScrollPrev,
        canScrollNext: () => canScrollNext,
        selectedScrollSnap: () => index,
        scrollTo: (nextIndex) => {
          setIndex(Math.max(0, Math.min(nextIndex, Math.max(itemCount - 1, 0))));
        },
      }),
      [canScrollNext, canScrollPrev, index, itemCount, scrollNext, scrollPrev]
    );

    React.useEffect(() => {
      if (setApi) {
        setApi(api);
      }
    }, [api, setApi]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef: contentRef,
          api,
          opts,
          plugins,
          orientation,
          index,
          setIndex,
          itemCount,
          setItemCount,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn(className)}
          style={{ position: 'relative', ...style }}
          role="region"
          aria-roledescription="carousel"
          tabIndex={0}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef(({ className, children, style, ...props }, ref) => {
  const { carouselRef, orientation, index, setItemCount } = useCarousel();
  const slides = React.Children.toArray(children);

  React.useEffect(() => {
    setItemCount(slides.length);
  }, [setItemCount, slides.length]);

  return (
    <div
      ref={carouselRef}
      style={{
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div
        ref={ref}
        className={cn(className)}
        style={{
          display: 'flex',
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          transform:
            orientation === 'horizontal'
              ? `translateX(-${index * 100}%)`
              : `translateY(-${index * 100}%)`,
          transition: 'transform 0.3s ease',
          width: '100%',
          ...style,
        }}
        {...props}
      >
        {slides}
      </div>
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef(({ className, style, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(className)}
      style={{
        minWidth: orientation === 'horizontal' ? '100%' : 'auto',
        width: orientation === 'horizontal' ? '100%' : '100%',
        flex: '0 0 100%',
        ...style,
      }}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

const srOnlyStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const CarouselPrevious = React.forwardRef(
  ({ className, variant = 'outline', size = 'icon', style, ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(className)}
        style={{
          position: 'absolute',
          width: '2rem',
          height: '2rem',
          borderRadius: '999px',
          ...(orientation === 'horizontal'
            ? { left: '-3rem', top: '50%', transform: 'translateY(-50%)' }
            : { top: '-3rem', left: '50%', transform: 'translateX(-50%) rotate(90deg)' }),
          ...style,
        }}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <span aria-hidden="true">{'<'}</span>
        <span style={srOnlyStyle}>Previous slide</span>
      </Button>
    );
  }
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef(
  ({ className, variant = 'outline', size = 'icon', style, ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(className)}
        style={{
          position: 'absolute',
          width: '2rem',
          height: '2rem',
          borderRadius: '999px',
          ...(orientation === 'horizontal'
            ? { right: '-3rem', top: '50%', transform: 'translateY(-50%)' }
            : { bottom: '-3rem', left: '50%', transform: 'translateX(-50%) rotate(90deg)' }),
          ...style,
        }}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <span aria-hidden="true">{'>'}</span>
        <span style={srOnlyStyle}>Next slide</span>
      </Button>
    );
  }
);
CarouselNext.displayName = 'CarouselNext';

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };


