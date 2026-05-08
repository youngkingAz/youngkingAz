import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

const admin = createClient(supabaseUrl, supabaseServiceRoleKey);

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
}

async function findExistingSubscription({
  stripeSubscriptionId,
  stripeCustomerId,
}: {
  stripeSubscriptionId?: string | null;
  stripeCustomerId?: string | null;
}) {
  if (stripeSubscriptionId) {
    const { data: directMatch } = await admin
      .from('subscriptions')
      .select('id, user_id, plan_key, checkout_session_id')
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .maybeSingle();

    if (directMatch) {
      return directMatch;
    }
  }

  if (stripeCustomerId) {
    const { data: customerMatch } = await admin
      .from('subscriptions')
      .select('id, user_id, plan_key, checkout_session_id')
      .eq('stripe_customer_id', stripeCustomerId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (customerMatch) {
      return customerMatch;
    }
  }

  return null;
}

async function activatePlan({
  userId,
  planKey,
  stripeCustomerId,
  stripeSubscriptionId,
  checkoutSessionId,
  status,
  currentPeriodEnd,
  cancelAtPeriodEnd = false,
}: {
  userId: string;
  planKey: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  checkoutSessionId?: string | null;
  status: string;
  currentPeriodEnd?: number | null;
  cancelAtPeriodEnd?: boolean;
}) {
  const premiumActive = ['active', 'trialing'].includes(status);
  const { data: existingProfile, error: existingProfileError } = await admin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (existingProfileError) {
    console.error('stripe-webhook:profile-load-error', existingProfileError.message);
    throw new Error(`Could not load profile before update: ${existingProfileError.message}`);
  }

  const nextRole = existingProfile?.role === 'admin' ? 'admin' : premiumActive ? 'premium' : 'user';

  console.log('stripe-webhook:activate-plan:start', JSON.stringify({
    userId,
    planKey,
    checkoutSessionId,
    stripeSubscriptionId,
    status,
  }));
  const subscriptionPayload = {
    user_id: userId,
    plan_key: planKey,
    status,
    stripe_customer_id: stripeCustomerId ?? null,
    stripe_subscription_id: stripeSubscriptionId ?? null,
    checkout_session_id: checkoutSessionId ?? null,
    current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
    cancel_at_period_end: cancelAtPeriodEnd,
    updated_at: new Date().toISOString(),
  };

  const { error: profileUpdateError } = await admin
    .from('profiles')
    .update({
      role: nextRole,
      has_premium_access: premiumActive,
      premium_plan: premiumActive ? planKey : null,
      stripe_customer_id: stripeCustomerId ?? null,
      premium_updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (profileUpdateError) {
    console.error('stripe-webhook:profile-update-error', profileUpdateError.message);
    throw new Error(`Could not update profile: ${profileUpdateError.message}`);
  }

  if (checkoutSessionId) {
    const { data: checkoutMatch } = await admin
      .from('subscriptions')
      .select('id')
      .eq('checkout_session_id', checkoutSessionId)
      .maybeSingle();

    if (checkoutMatch?.id) {
      console.log('stripe-webhook:update-by-checkout-session', checkoutMatch.id);
      const { error: checkoutUpdateError } = await admin
        .from('subscriptions')
        .update(subscriptionPayload)
        .eq('id', checkoutMatch.id);

      if (checkoutUpdateError) {
        console.error('stripe-webhook:checkout-update-error', checkoutUpdateError.message);
        throw new Error(`Could not update subscription by checkout session: ${checkoutUpdateError.message}`);
      }
      return;
    }
  }

  if (stripeSubscriptionId) {
    const { data: subscriptionMatch } = await admin
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .maybeSingle();

    if (subscriptionMatch?.id) {
      console.log('stripe-webhook:update-by-subscription-id', subscriptionMatch.id);
      const { error: subscriptionUpdateError } = await admin
        .from('subscriptions')
        .update(subscriptionPayload)
        .eq('id', subscriptionMatch.id);

      if (subscriptionUpdateError) {
        console.error('stripe-webhook:subscription-update-error', subscriptionUpdateError.message);
        throw new Error(`Could not update subscription by Stripe subscription id: ${subscriptionUpdateError.message}`);
      }
      return;
    }
  }

  console.log('stripe-webhook:insert-subscription');
  const { error: insertError } = await admin
    .from('subscriptions')
    .insert(subscriptionPayload);

  if (insertError) {
    console.error('stripe-webhook:insert-error', insertError.message);
    throw new Error(`Could not insert subscription: ${insertError.message}`);
  }
}

Deno.serve(async (request) => {
  try {
    if (!stripeSecretKey || !stripeWebhookSecret || !supabaseUrl || !supabaseServiceRoleKey) {
      return json({ error: 'Webhook secrets are missing.' }, { status: 500 });
    }

    const signature = request.headers.get('Stripe-Signature');
    if (!signature) {
      return json({ error: 'Missing Stripe signature.' }, { status: 400 });
    }

    const body = await request.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('stripe-webhook:event', event.type);
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const planKey = session.metadata?.plan_key;

        if (userId && planKey) {
          let currentPeriodEnd: number | null = null;
          let status = 'active';

          if (typeof session.subscription === 'string') {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            currentPeriodEnd = subscription.current_period_end;
            status = subscription.status;
          }

          await activatePlan({
            userId,
            planKey,
            stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
            stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : null,
            checkoutSessionId: session.id,
            currentPeriodEnd,
            status,
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        console.log('stripe-webhook:event', event.type);
        const subscription = event.data.object as Stripe.Subscription;

        const existing = await findExistingSubscription({
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : null,
        });

        if (existing?.user_id && existing?.plan_key) {
          await activatePlan({
            userId: existing.user_id,
            planKey: existing.plan_key,
            stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : null,
            stripeSubscriptionId: subscription.id,
            checkoutSessionId: existing.checkout_session_id ?? null,
            currentPeriodEnd: subscription.current_period_end,
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          });
        }
        break;
      }
      case 'invoice.paid':
      case 'invoice.payment_failed': {
        console.log('stripe-webhook:event', event.type);
        const invoice = event.data.object as Stripe.Invoice;
        const stripeSubscriptionId =
          typeof invoice.subscription === 'string' ? invoice.subscription : null;
        const stripeCustomerId =
          typeof invoice.customer === 'string' ? invoice.customer : null;

        const existing = await findExistingSubscription({
          stripeSubscriptionId,
          stripeCustomerId,
        });

        if (existing?.user_id && existing?.plan_key && stripeSubscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

          await activatePlan({
            userId: existing.user_id,
            planKey: existing.plan_key,
            stripeCustomerId,
            stripeSubscriptionId,
            checkoutSessionId: existing.checkout_session_id ?? null,
            currentPeriodEnd: subscription.current_period_end,
            status: event.type === 'invoice.payment_failed' ? 'past_due' : subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          });
        }
        break;
      }
      default:
        break;
    }

    return json({ received: true });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Webhook error.' },
      { status: 400 },
    );
  }
});
