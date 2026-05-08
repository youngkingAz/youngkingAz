import { isSupabaseConfigured, supabase } from './supabaseClient';

/**
 * @typedef {object} BillingPlan
 * @property {string} key
 * @property {string} name
 * @property {string} priceLabel
 * @property {number} amountMonthly
 * @property {string[]} allowedProgramLevels
 * @property {string} priceEnvKey
 */

/**
 * @typedef {object} BillingProgram
 * @property {string} [id]
 * @property {string} [level]
 * @property {boolean} [is_premium]
 */

/**
 * @typedef {object} BillingUserProfile
 * @property {string | null | undefined} [premium_plan]
 * @property {boolean | null | undefined} [has_premium_access]
 */

/**
 * @typedef {object} BillingUser
 * @property {string} [role]
 * @property {BillingUserProfile | null | undefined} [profile]
 */

/**
 * @typedef {object} BillingFunctionPayload
 * @property {string} [error]
 * @property {string} [url]
 */

/** @type {Record<string, BillingPlan>} */
export const billingPlans = {
  only_abs: {
    key: 'only_abs',
    name: 'Only Abs',
    priceLabel: '$2.99/month',
    amountMonthly: 2.99,
    allowedProgramLevels: ['only_abs'],
    priceEnvKey: 'VITE_STRIPE_PRICE_ONLY_ABS',
  },
  intermediate: {
    key: 'intermediate',
    name: 'Intermediate Program',
    priceLabel: '$10/month',
    amountMonthly: 10,
    allowedProgramLevels: ['intermediate'],
    priceEnvKey: 'VITE_STRIPE_PRICE_INTERMEDIATE',
  },
  advanced: {
    key: 'advanced',
    name: 'Advanced Program',
    priceLabel: '$15/month',
    amountMonthly: 15,
    allowedProgramLevels: ['intermediate', 'advanced'],
    priceEnvKey: 'VITE_STRIPE_PRICE_ADVANCED',
  },
};

/**
 * @param {BillingProgram | null | undefined} program
 * @returns {BillingPlan | null}
 */
export function getProgramPlan(program) {
  if (!program?.is_premium) {
    return null;
  }

  if (program.level === 'only_abs') {
    return billingPlans.only_abs;
  }

  if (program.level === 'advanced') {
    return billingPlans.advanced;
  }

  if (program.level === 'intermediate') {
    return billingPlans.intermediate;
  }

  return null;
}

/**
 * @param {BillingUser | null | undefined} user
 * @param {BillingProgram | null | undefined} program
 */
export function canAccessProgram(user, program) {
  if (!program?.is_premium) {
    return true;
  }

  if (!user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  const plan = user.profile?.premium_plan || null;
  const hasGenericPremium = user.role === 'premium' || user.profile?.has_premium_access === true;

  if (hasGenericPremium && !plan) {
    return true;
  }

  if (!plan) {
    return false;
  }

  const activePlan = billingPlans[plan];
  if (!activePlan) {
    return false;
  }

  return Boolean(program?.level && activePlan.allowedProgramLevels.includes(program.level));
}

/**
 * @param {BillingProgram | null | undefined} program
 */
export async function startCheckoutForProgram(program) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured yet.');
  }

  const plan = getProgramPlan(program);
  if (!plan) {
    throw new Error('This program does not need a paid subscription.');
  }

  const programId = program?.id || '';

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;
  if (!accessToken) {
    throw new Error('Please sign in before starting checkout.');
  }

  const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    },
    body: JSON.stringify({
      planKey: plan.key,
      programId,
    }),
  });

  const rawBody = await response.text();
  /** @type {BillingFunctionPayload} */
  let payload = {};

  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const message =
      payload?.error ||
      rawBody ||
      `Could not start checkout. Server returned ${response.status}.`;
    throw new Error(message);
  }

  if (!payload?.url) {
    throw new Error('Checkout URL was not returned.');
  }

  if (typeof window !== 'undefined') {
    window.location.assign(payload.url);
  }

  return payload;
}

export async function openBillingPortal() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured yet.');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;
  if (!accessToken) {
    throw new Error('Please sign in before managing your subscription.');
  }

  const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-billing-portal-session`;
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    },
    body: JSON.stringify({}),
  });

  const rawBody = await response.text();
  /** @type {BillingFunctionPayload} */
  let payload = {};

  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const message =
      payload?.error ||
      rawBody ||
      `Could not open billing portal. Server returned ${response.status}.`;
    throw new Error(message);
  }

  if (!payload?.url) {
    throw new Error('Billing portal URL was not returned.');
  }

  if (typeof window !== 'undefined') {
    window.location.assign(payload.url);
  }

  return payload;
}
