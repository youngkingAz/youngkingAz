# YoungKingAz Billing Setup

## 1. Run the billing SQL

Run the migration in:

- `supabase/migrations/20260418_billing_setup.sql`

This adds:

- `profiles.has_premium_access`
- `profiles.premium_plan`
- `profiles.stripe_customer_id`
- `subscriptions` table

## 2. Create Stripe products and prices

Create two recurring monthly prices in Stripe:

- Intermediate Program: `$10/month`
- Advanced Program: `$15/month`

Copy each Stripe `price_...` id.

## 3. Set Supabase function secrets

Set these secrets for your Supabase Edge Functions:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_INTERMEDIATE`
- `STRIPE_PRICE_ADVANCED`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 4. Deploy functions

Deploy:

- `supabase/functions/create-checkout-session`
- `supabase/functions/create-billing-portal-session`
- `supabase/functions/stripe-webhook`

## 5. Connect Stripe webhook

In Stripe, add a webhook endpoint pointing to your deployed Supabase function URL for:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Use the webhook signing secret as `STRIPE_WEBHOOK_SECRET`.

## 6. How access works

- Beginner stays free.
- Intermediate requires `premium_plan = 'intermediate'` or `premium_plan = 'advanced'`.
- Advanced requires `premium_plan = 'advanced'`.
- Admin still has access to everything.

## 8. Customer cancellation

Enable the Stripe customer portal in Stripe Dashboard so customers can manage or cancel their subscription before the next renewal.

The app uses:

- `create-billing-portal-session`

to send signed-in customers into Stripe's billing portal from the Profile page.

## 7. Local app env

Your frontend also needs:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

If you later want Stripe values in the browser too, keep them public and prefix them with `VITE_`.
