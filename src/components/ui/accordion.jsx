// @ts-nocheck
import React from 'react';

import { cn } from '../../lib/utils';

/**
 * @typedef {object} AccordionProps
 * @property {React.ReactNode} [children]
 * @property {'single' | 'multiple'} [type]
 * @property {string | string[] | undefined} [value]
 * @property {string | string[] | undefined} [defaultValue]
 * @property {boolean} [collapsible]
 * @property {(value: string | string[] | undefined) => void} [onValueChange]
 */

const AccordionContext = React.createContext({
  value: undefined,
  type: 'single',
  collapsible: false,
  toggleItem: () => {},
});

const AccordionItemContext = React.createContext({
  value: undefined,
  isOpen: false,
});

const baseStyles = {
  item: {
    borderBottom: '1px solid #262626',
  },
  trigger: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    padding: '1rem 0',
    border: 'none',
    background: 'transparent',
    color: 'inherit',
    fontSize: '0.95rem',
    fontWeight: 600,
    textAlign: 'left',
    cursor: 'pointer',
  },
  icon: {
    fontSize: '0.9rem',
    color: '#a3a3a3',
    transition: 'transform 0.2s ease',
  },
  content: {
    overflow: 'hidden',
    fontSize: '0.9rem',
  },
  contentInner: {
    paddingBottom: '1rem',
    color: '#b3b3b3',
    lineHeight: 1.6,
  },
};

const Accordion = React.forwardRef(
  /**
   * @param {AccordionProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ children, type = 'single', value, defaultValue, collapsible = false, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : type === 'multiple' ? [] : undefined
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const toggleItem = React.useCallback(
      /** @param {string} itemValue */
      (itemValue) => {
        setInternalValue((previousValue) => {
          let nextValue;

          if (type === 'multiple') {
            const current = Array.isArray(value !== undefined ? value : previousValue)
              ? value !== undefined
                ? value
                : previousValue
              : [];

            nextValue = current.includes(itemValue)
              ? current.filter((/** @param {string} entry */ entry) => entry !== itemValue)
              : [...current, itemValue];
          } else {
            const current = value !== undefined ? value : previousValue;

            if (current === itemValue) {
              nextValue = collapsible ? undefined : itemValue;
            } else {
              nextValue = itemValue;
            }
          }

          if (value === undefined) {
            return nextValue;
          }

          return previousValue;
        });

        const currentValue = value !== undefined ? value : internalValue;
        let nextValue;

        if (type === 'multiple') {
          const current = Array.isArray(currentValue) ? currentValue : [];
          nextValue = current.includes(itemValue)
            ? current.filter((/** @param {string} entry */ entry) => entry !== itemValue)
            : [...current, itemValue];
        } else if (currentValue === itemValue) {
          nextValue = collapsible ? undefined : itemValue;
        } else {
          nextValue = itemValue;
        }

        if (onValueChange) {
          onValueChange(nextValue);
        }
      },
      [collapsible, internalValue, onValueChange, type, value]
    );

    return (
      <AccordionContext.Provider
        value={{
          value: value !== undefined ? value : internalValue,
          type,
          collapsible,
          toggleItem,
        }}
      >
        <div ref={ref} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef(
  /**
   * @param {{ className?: string, value?: string, children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, value, children, ...props }, ref) => {
  const accordion = React.useContext(AccordionContext);
  const isOpen =
    accordion.type === 'multiple'
      ? Array.isArray(accordion.value) && accordion.value.includes(value)
      : accordion.value === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div ref={ref} className={cn(className)} style={baseStyles.item} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef(
  /**
   * @param {{ className?: string, children?: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
   * @param {React.ForwardedRef<HTMLButtonElement>} ref
   */
  ({ className, children, ...props }, ref) => {
  const accordion = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);

  return (
    <div className="flex">
      <button
        ref={ref}
        type="button"
        className={cn(className)}
        style={baseStyles.trigger}
        onClick={() => accordion.toggleItem(item.value)}
        aria-expanded={item.isOpen}
        {...props}
      >
        <span>{children}</span>
        <span
          aria-hidden="true"
          style={{
            ...baseStyles.icon,
            transform: item.isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          v
        </span>
      </button>
    </div>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef(
  /**
   * @param {{ className?: string, children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  ({ className, children, ...props }, ref) => {
  const item = React.useContext(AccordionItemContext);

  if (!item.isOpen) {
    return null;
  }

  return (
    <div ref={ref} className={cn(className)} style={baseStyles.content} {...props}>
      <div style={baseStyles.contentInner}>{children}</div>
    </div>
  );
});
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };


