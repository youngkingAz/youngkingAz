/**
 * @param {any[]} inputs
 * @returns {string[]}
 */
function flattenInputs(inputs) {
  return inputs.flatMap((input) => {
    if (!input) {
      return [];
    }

    if (Array.isArray(input)) {
      return flattenInputs(input);
    }

    if (typeof input === 'object') {
      return Object.entries(input)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key);
    }

    return [String(input)];
  });
}

/**
 * @param {...any[]} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return flattenInputs(inputs).join(' ');
}

export const isIframe =
  typeof window !== 'undefined' ? (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })() : false;
