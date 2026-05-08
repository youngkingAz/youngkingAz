// @ts-nocheck
import { useEffect, useState } from 'react';

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 5000;

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map();

const clearToastTimeout = (toastId) => {
  const timeout = toastTimeouts.get(toastId);
  if (!timeout) {
    return;
  }

  clearTimeout(timeout);
  toastTimeouts.delete(toastId);
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      clearToastTimeout(action.toast.id);
      toastTimeouts.set(
        action.toast.id,
        window.setTimeout(() => {
          dispatch({
            type: actionTypes.REMOVE_TOAST,
            toastId: action.toast.id,
          });
        }, action.toast.duration || TOAST_REMOVE_DELAY),
      );

      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((toastItem) =>
          toastItem.id === action.toast.id ? { ...toastItem, ...action.toast } : toastItem
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      if (toastId === undefined) {
        state.toasts.forEach((toastItem) => {
          clearToastTimeout(toastItem.id);
        });

        return {
          ...state,
          toasts: [],
        };
      }

      clearToastTimeout(toastId);

      return {
        ...state,
        toasts: state.toasts.filter((toastItem) => toastItem.id !== toastId),
      };
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId !== undefined) {
        clearToastTimeout(action.toastId);
      } else {
        state.toasts.forEach((toastItem) => {
          clearToastTimeout(toastItem.id);
        });
      }

      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      return {
        ...state,
        toasts: state.toasts.filter((toastItem) => toastItem.id !== action.toastId),
      };

    default:
      return state;
  }
};

const listeners = [];

let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function toast(props) {
  const id = genId();

  const update = (nextProps) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...nextProps, id },
    });

  const dismiss = () =>
    dispatch({
      type: actionTypes.DISMISS_TOAST,
      toastId: id,
    });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss();
        }
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.push(setState);

    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast };


