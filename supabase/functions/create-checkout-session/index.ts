import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const onlyAbsPriceId = Deno.env.get('STRIPE_PRICE_ONLY_ABS') ?? '';
const intermediatePriceId = Deno.env.get('STRIPE_PRICE_INTERMEDIATE') ?? '';
const advancedPriceId = Deno.env.get('STRIPE_PRICE_ADVANCED') ?? '';

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

const priceMap = {
  only_abs: {
    key: 'only_abs',
    priceId: onlyAbsPriceId,
  },
  intermediate: {
    key: 'intermediate',
    priceId: intermediatePriceId,
  },
  advanced: {
    key: 'advanced',
    priceId: advancedPriceId,
  },
} as const;

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...(init?.headers ?? {}),
    },
  });
}

async function ensureStripeCustomer({
  admin,
  user,
  profile,
}: {
  admin: ReturnType<typeof createClient>;
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> | null };
  profile?: { email?: string | null; full_name?: string | null; stripe_customer_id?: string | null } | null;
}) {
  let stripeCustomerId = profile?.stripe_customer_id ?? '';

  if (stripeCustomerId) {
    try {
      await stripe.customers.retrieve(stripeCustomerId);
      return stripeCustomerId;
    } catch {
      stripeCustomerId = '';
    }
  }

  const customer = await stripe.customers.create({
    email: user.email ?? profile?.email ?? undefined,
    name:
      profile?.full_name ||
      (typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : undefined),
    metadata: {
      user_id: user.id,
    },
  });

  stripeCustomerId = customer.id;

  const { error: profileUpdateError } = await admin
    .from('profiles')
    .update({
      stripe_customer_id: stripeCustomerId,
    })
    .eq('id', user.id);

  if (profileUpdateError) {
    throw new Error(`Could not save Stripe customer: ${profileUpdateError.message}`);
  }

  return stripeCustomerId;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('create-checkout-session:start');

    if (!stripeSecretKey || !supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      console.error('create-checkout-session:missing-secrets');
      return json({ error: 'Server billing secrets are missing.' }, { status: 500 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      console.error('create-checkout-session:missing-auth-header');
      return json({ error: 'Missing auth header.' }, { status: 401 });
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      console.error('create-checkout-session:user-auth-error', userError?.message ?? 'no-user');
      return json({ error: 'User is not authenticated.' }, { status: 401 });
    }

    const { planKey, programId } = await request.json();
    const plan = priceMap[planKey as keyof typeof priceMap];

    if (!plan || !plan.priceId) {
      console.error('create-checkout-session:plan-not-configured', planKey);
      return json({ error: 'This plan is not configured yet.' }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('id, email, full_name, stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('create-checkout-session:profile-query-error', profileError.message);
      return json({ error: `Could not load profile: ${profileError.message}` }, { status: 500 });
    }

    const stripeCustomerId = await ensureStripeCustomer({
      admin,
      user,
      profile,
    });

    const origin = request.headers.get('origin') || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing/canceled`,
      metadata: {
        user_id: user.id,
        plan_key: plan.key,
        program_id: programId || '',
      },
      allow_promotion_codes: true,
    });

    const { error: subscriptionError } = await admin.from('subscriptions').upsert(
      {
        user_id: user.id,
        plan_key: plan.key,
        status: 'checkout_started',
        stripe_customer_id: stripeCustomerId,
        checkout_session_id: session.id,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'checkout_session_id',
      },
    );

    if (subscriptionError) {
      console.error('create-checkout-session:subscription-upsert-error', subscriptionError.message);
      return json({ error: `Could not save checkout session: ${subscriptionError.message}` }, { status: 500 });
    }

    console.log('create-checkout-session:success', session.id);

    return json({ url: session.url });
  } catch (error) {
    console.error(
      'create-checkout-session:unexpected-error',
      error instanceof Error ? error.message : 'Unexpected billing error.',
    );
    return json(
      { error: error instanceof Error ? error.message : 'Unexpected billing error.' },
      { status: 500 },
    );
  }
});
