const isBrowser = typeof window !== 'undefined';
const STORAGE_PREFIX = 'youngkingaz_workout';

/**
 * @typedef {object} AppParamOptions
 * @property {string | null | undefined} [defaultValue]
 * @property {boolean} [removeFromUrl]
 */

/**
 * @param {string} value
 * @returns {string}
 */
const toSnakeCase = (value) => {
  return String(value).replace(/([A-Z])/g, '_$1').toLowerCase();
};

/**
 * @param {string} paramName
 * @returns {string}
 */
const getStorageKey = (paramName) => {
  return `${STORAGE_PREFIX}_${toSnakeCase(paramName)}`;
};

/**
 * @param {string} storageKey
 * @returns {string | null}
 */
const getStoredValue = (storageKey) => {
  if (!isBrowser) {
    return null;
  }

  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
};

/**
 * @param {string} storageKey
 * @param {string | null | undefined} value
 */
const setStoredValue = (storageKey, value) => {
  if (!isBrowser || value === undefined || value === null || value === '') {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, String(value));
  } catch {
    // Ignore storage failures so app params still work without localStorage.
  }
};

/**
 * @param {string} storageKey
 */
const removeStoredValue = (storageKey) => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage failures.
  }
};

/**
 * @param {string} paramName
 * @param {AppParamOptions} [options]
 * @returns {string | null}
 */
const getAppParamValue = (
  paramName,
  { defaultValue = undefined, removeFromUrl = false } = {}
) => {
  if (!isBrowser) {
    return defaultValue ?? null;
  }

  const storageKey = getStorageKey(paramName);
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl && searchParam !== null) {
    urlParams.delete(paramName);
    const nextUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}${window.location.hash}`;
    window.history.replaceState({}, document.title, nextUrl);
  }

  if (searchParam !== null && searchParam !== '') {
    setStoredValue(storageKey, searchParam);
    return searchParam;
  }

  const storedValue = getStoredValue(storageKey);
  if (storedValue !== null && storedValue !== '') {
    return storedValue;
  }

  if (defaultValue !== undefined && defaultValue !== null && defaultValue !== '') {
    setStoredValue(storageKey, defaultValue);
    return defaultValue;
  }

  return null;
};

const clearStoredToken = () => {
  removeStoredValue(getStorageKey('accessToken'));
  removeStoredValue('token');
};

/**
 * @returns {{
 *   appId: string | null,
 *   token: string | null,
 *   fromUrl: string | null,
 *   functionsVersion: string | null,
 *   appBaseUrl: string | null,
 * }}
 */
const getAppParams = () => {
  if (getAppParamValue('clear_access_token') === 'true') {
    clearStoredToken();
  }

  return {
    appId: getAppParamValue('app_id', {
      defaultValue: import.meta.env.VITE_APP_ID,
    }),
    token: getAppParamValue('access_token', {
      removeFromUrl: true,
    }),
    fromUrl: getAppParamValue('from_url', {
      defaultValue: isBrowser ? window.location.href : null,
    }),
    functionsVersion: getAppParamValue('functions_version', {
      defaultValue: import.meta.env.VITE_FUNCTIONS_VERSION,
    }),
    appBaseUrl: getAppParamValue('app_base_url', {
      defaultValue: import.meta.env.VITE_APP_BASE_URL,
    }),
  };
};

export const appParams = {
  ...getAppParams(),
};

export { getAppParamValue, getAppParams };
export default appParams;
