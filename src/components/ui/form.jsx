// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const FormContext = React.createContext({
  values: {},
  errors: {},
  setValue: () => {},
});

const FormFieldContext = React.createContext({});
const FormItemContext = React.createContext({});

const Form = ({ children, values = {}, errors = {}, onValuesChange, ...props }) => {
  const [internalValues, setInternalValues] = React.useState(values);
  const currentValues = values && Object.keys(values).length ? values : internalValues;

  const setValue = React.useCallback(
    (name, value) => {
      setInternalValues((previous) => {
        const next = { ...previous, [name]: value };

        if (onValuesChange) {
          onValuesChange(next);
        }

        return next;
      });
    },
    [onValuesChange]
  );

  return (
    <FormContext.Provider value={{ values: currentValues, errors, setValue }}>
      <form {...props}>{children}</form>
    </FormContext.Provider>
  );
};

const FormField = ({ name, render, defaultValue = '', ...props }) => {
  const { values, setValue } = React.useContext(FormContext);
  const value = values?.[name] ?? defaultValue;

  const field = {
    name,
    value,
    onChange: (eventOrValue) => {
      const nextValue =
        eventOrValue && typeof eventOrValue === 'object' && 'target' in eventOrValue
          ? eventOrValue.target.type === 'checkbox'
            ? eventOrValue.target.checked
            : eventOrValue.target.value
          : eventOrValue;

      setValue(name, nextValue);
    },
  };

  return (
    <FormFieldContext.Provider value={{ name }}>
      {typeof render === 'function' ? render({ field, ...props }) : null}
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { errors = {} } = React.useContext(FormContext);

  if (!fieldContext || !fieldContext.name) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;
  const error = errors[fieldContext.name];

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    error,
  };
};

const FormItem = React.forwardRef(({ className, style, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn(className)}
        style={{
          display: 'grid',
          gap: '0.5rem',
          ...style,
        }}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef(({ className, style, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <label
      ref={ref}
      className={cn(className)}
      htmlFor={formItemId}
      style={{
        color: error ? '#fca5a5' : '#f5f5f5',
        fontSize: '0.9rem',
        fontWeight: 600,
        ...style,
      }}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef(({ children, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      id: formItemId,
      'aria-describedby': !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      'aria-invalid': !!error,
      ...props,
      ...children.props,
    });
  }

  return (
    <div
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    >
      {children}
    </div>
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef(({ className, style, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn(className)}
      style={{
        fontSize: '0.8rem',
        color: '#a3a3a3',
        ...style,
      }}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef(({ className, children, style, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message || error) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(className)}
      style={{
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#fca5a5',
        ...style,
      }}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};


