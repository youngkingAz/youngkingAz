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

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

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
  stripeCustomerId,
}: {
  admin: ReturnType<typeof createClient>;
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> | null };
  stripeCustomerId?: string | null;
}) {
  let nextCustomerId = stripeCustomerId ?? '';

  if (nextCustomerId) {
    try {
      await stripe.customers.retrieve(nextCustomerId);
      return nextCustomerId;
    } catch {
      nextCustomerId = '';
    }
  }

  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name:
      typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : undefined,
    metadata: {
      user_id: user.id,
    },
  });

  nextCustomerId = customer.id;

  const { error: profileUpdateError } = await admin
    .from('profiles')
    .update({
      stripe_customer_id: nextCustomerId,
    })
    .eq('id', user.id);

  if (profileUpdateError) {
    throw new Error(`Could not save Stripe customer: ${profileUpdateError.message}`);
  }

  return nextCustomerId;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!stripeSecretKey || !supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return json({ error: 'Server billing secrets are missing.' }, { status: 500 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
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
      return json({ error: 'User is not authenticated.' }, { status: 401 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      return json({ error: `Could not load profile: ${profileError.message}` }, { status: 500 });
    }

    let stripeCustomerId = profile?.stripe_customer_id ?? '';

    if (!stripeCustomerId) {
      const { data: subscriptionMatch, error: subscriptionError } = await admin
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .not('stripe_customer_id', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subscriptionError) {
        return json({ error: `Could not load subscription: ${subscriptionError.message}` }, { status: 500 });
      }

      stripeCustomerId = subscriptionMatch?.stripe_customer_id ?? '';
    }

    stripeCustomerId = await ensureStripeCustomer({
      admin,
      user,
      stripeCustomerId,
    });

    const origin = request.headers.get('origin') || 'http://localhost:5173';

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${origin}/profile`,
    });

    return json({ url: session.url });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unexpected billing portal error.' },
      { status: 500 },
    );
  }
});
