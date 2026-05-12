import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { appParams } from './app-params';
import { isSupabaseConfigured, supabase } from './supabaseClient';

/**
 * @param {string | null | undefined} baseUrl
 * @returns {string | null}
 */
function normalizeBaseUrl(baseUrl) {
  if (!baseUrl) {
    return null;
  }

  return String(baseUrl).trim().replace(/\/+$/, '');
}

/**
 * @returns {string}
 */
function getEmailRedirectUrl() {
  const configuredBaseUrl = normalizeBaseUrl(appParams.appBaseUrl);

  if (configuredBaseUrl) {
    return `${configuredBaseUrl}/profile`;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/profile`;
  }

  return 'http://localhost:5173/profile';
}

/**
 * @typedef {Object} AuthUserLike
 * @property {string} id
 * @property {string | null | undefined} [email]
 * @property {{ full_name?: string, name?: string } | undefined} [user_metadata]
 */

/**
 * @typedef {Object} UserProfile
 * @property {string | null | undefined} [full_name]
 * @property {'user' | 'premium' | 'admin' | string | null | undefined} [role]
 * @property {boolean | null | undefined} [has_premium_access]
 * @property {string | null | undefined} [premium_plan]
 * @property {string | null | undefined} [avatar_url]
 * @property {string | null | undefined} [active_subscription_status]
 * @property {string | null | undefined} [active_subscription_updated_at]
 * @property {string | null | undefined} [active_subscription_period_end]
 */

/**
 * @typedef {Object} NormalizedUser
 * @property {string} id
 * @property {string} email
 * @property {string} full_name
 * @property {'user' | 'premium' | 'admin' | string} role
 * @property {UserProfile | null} profile
 */

/**
 * @typedef {Object} AuthErrorState
 * @property {string} type
 * @property {string} message
 */

/**
 * @typedef {Object} PublicSettingsState
 * @property {string} id
 * @property {{
 *   appBaseUrl: string | null,
 *   functionsVersion: string | null,
 *   supabaseConfigured: boolean,
 * }} public_settings
 */

/**
 * @typedef {Object} AuthProviderProps
 * @property {React.ReactNode} children
 */

/**
 * @typedef {Object} SignInPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} SignUpPayload
 * @property {string} email
 * @property {string} password
 * @property {string} fullName
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {NormalizedUser | null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoadingAuth
 * @property {boolean} isLoadingPublicSettings
 * @property {boolean} authChecked
 * @property {AuthErrorState | null} authError
 * @property {PublicSettingsState | null} appPublicSettings
 * @property {boolean} isSupabaseConfigured
 * @property {() => Promise<void>} logout
 * @property {() => void} navigateToLogin
 * @property {() => Promise<{ isAuthenticated: boolean, user: AuthUserLike | null }>} checkAppState
 * @property {() => Promise<{ isAuthenticated: boolean, user: AuthUserLike | null }>} checkUserAuth
 * @property {() => Promise<{ isAuthenticated: boolean, user: AuthUserLike | null }>} refreshUserProfile
 * @property {(payload: SignInPayload) => Promise<any>} signIn
 * @property {(payload: SignUpPayload) => Promise<any>} signUp
 */

const AuthContext =
  /** @type {React.Context<AuthContextValue | null>} */ (
    createContext(/** @type {AuthContextValue | null} */ (null))
  );

/**
 * @param {AuthUserLike | null} user
 * @returns {Promise<UserProfile | null>}
 */
async function ensureProfileExists(user) {
  if (!user?.id || !isSupabaseConfigured) {
    return null;
  }

  const payload = {
    id: user.id,
    email: user.email || null,
    full_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      null,
  };

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, {
      onConflict: 'id',
    });

  if (error) {
    console.warn('[YoungKingAz] Could not ensure profile row exists:', error.message);
    return null;
  }

  const { data, error: reloadError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (reloadError) {
    console.warn('[YoungKingAz] Could not reload ensured profile:', reloadError.message);
    return null;
  }

  return data;
}

/**
 * @param {AuthUserLike | null} user
 * @returns {Promise<UserProfile | null>}
 */
async function loadProfile(user) {
  if (!user?.id || !isSupabaseConfigured) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.warn('[YoungKingAz] Could not load profile:', error.message);
  }

  let profileData = data;

  if (!profileData) {
    profileData = await ensureProfileExists(user);
  }

  const { data: activeSubscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('plan_key, status, current_period_end, updated_at')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subscriptionError) {
    console.warn('[YoungKingAz] Could not load subscription:', subscriptionError.message);
  }

  if (!profileData && !activeSubscription) {
    return null;
  }

  if (!activeSubscription) {
    return profileData;
  }

  return {
    ...(profileData || {}),
    has_premium_access: true,
    premium_plan: activeSubscription.plan_key || profileData?.premium_plan || null,
    role: profileData?.role === 'admin' ? 'admin' : 'premium',
    active_subscription_status: activeSubscription.status,
    active_subscription_updated_at: activeSubscription.updated_at,
    active_subscription_period_end: activeSubscription.current_period_end,
  };
}

/**
 * @param {AuthUserLike | null} authUser
 * @param {UserProfile | null} [profile=null]
 * @returns {NormalizedUser | null}
 */
function normalizeUser(authUser, profile = null) {
  if (!authUser) {
    return null;
  }

  return {
    id: authUser.id,
    email: authUser.email || '',
    full_name:
      profile?.full_name ||
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      '',
    role: profile?.role || 'user',
    profile,
  };
}

/**
 * @param {AuthProviderProps} props
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(/** @type {NormalizedUser | null} */ (null));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(/** @type {AuthErrorState | null} */ (null));
  const [appPublicSettings, setAppPublicSettings] = useState(/** @type {PublicSettingsState | null} */ (null));

  /**
   * @param {{ user?: AuthUserLike | null } | null} session
   */
  const applySession = useCallback(
    /** @param {{ user?: AuthUserLike | null } | null} session */
    async (session) => {
    const authUser = session?.user || null;

    if (!authUser) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    const profile = await loadProfile(authUser);
    setUser(normalizeUser(authUser, profile));
    setIsAuthenticated(true);
    },
    [],
  );

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    setAuthError(null);

    if (!isSupabaseConfigured) {
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
      setIsLoadingAuth(false);
      return { isAuthenticated: false, user: null };
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      setAuthError({
        type: 'auth_error',
        message: error.message,
      });
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
      setIsLoadingAuth(false);
      return { isAuthenticated: false, user: null };
    }

    await applySession(data.session);
    setAuthChecked(true);
    setIsLoadingAuth(false);

    return {
      isAuthenticated: Boolean(data.session?.user),
      user: data.session?.user || null,
    };
  }, [applySession]);

  const refreshUserProfile = useCallback(async () => {
    if (!isSupabaseConfigured) {
      return { isAuthenticated: false, user: null };
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      setAuthError({
        type: 'auth_error',
        message: error.message,
      });
      return { isAuthenticated: false, user: null };
    }

    await applySession(data.session);

    return {
      isAuthenticated: Boolean(data.session?.user),
      user: data.session?.user || null,
    };
  }, [applySession]);

  const checkAppState = useCallback(async () => {
    setIsLoadingPublicSettings(true);
    setAuthError(null);

    const nextPublicSettings = {
      id: appParams.appId || 'youngkingaz-workout',
      public_settings: {
        appBaseUrl: appParams.appBaseUrl || null,
        functionsVersion: appParams.functionsVersion || null,
        supabaseConfigured: isSupabaseConfigured,
      },
    };

    setAppPublicSettings(nextPublicSettings);
    setIsLoadingPublicSettings(false);

    return checkUserAuth();
  }, [checkUserAuth]);

  useEffect(() => {
    checkAppState();
  }, [checkAppState]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, /** @type {{ user?: AuthUserLike | null } | null} */ session) => {
      Promise.resolve(applySession(session))
        .then(() => {
          setAuthChecked(true);
          setIsLoadingAuth(false);
        })
        .catch((error) => {
          setAuthError({
            type: 'auth_error',
            message: error.message || 'Authentication state update failed.',
          });
          setIsLoadingAuth(false);
        });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [applySession]);

  /**
   * @param {SignInPayload} payload
   */
  const signIn = useCallback(
    /** @param {SignInPayload} payload */
    async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured yet.') };
    }

    setAuthError(null);

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (result.error) {
      setAuthError({
        type: 'auth_error',
        message: result.error.message,
      });
    }

    return result;
    },
    [],
  );

  /**
   * @param {SignUpPayload} payload
   */
  const signUp = useCallback(
    /** @param {SignUpPayload} payload */
    async ({ email, password, fullName }) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured yet.') };
    }

    setAuthError(null);

    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getEmailRedirectUrl(),
        data: {
          full_name: fullName || '',
        },
      },
    });

    if (result.error) {
      setAuthError({
        type: 'auth_error',
        message: result.error.message,
      });
    }

    return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setAuthError({
          type: 'auth_error',
          message: error.message,
        });
      }
    }

    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(true);
  }, []);

  const navigateToLogin = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.location.assign('/profile');
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authChecked,
      authError,
      appPublicSettings,
      isSupabaseConfigured,
      logout,
      navigateToLogin,
      checkAppState,
      checkUserAuth,
      refreshUserProfile,
      signIn,
      signUp,
    }),
    [
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authChecked,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState,
      checkUserAuth,
      refreshUserProfile,
      signIn,
      signUp,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
