# SignalDrop deployment guide

## Environment variables
Copy `.env.example` to `.env.local` for local dev and configure the same variables in Vercel/Supabase/Stripe/Resend.

Required values:
- `NEXT_PUBLIC_SITE_URL`: Vercel domain with `https`.
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL`
- `STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID`
- `CRON_SECRET`: shared bearer token for the daily cron route.
- `CODEX_API_KEY`, `CODEX_API_URL`, `CODEX_MODEL`: used for summarization.

## Supabase
1. Create a new Supabase project.
2. Run `supabase/schema.sql` in the SQL editor to create tables, RLS, and triggers.
3. Under Authentication → Email Templates, enable magic-link sign-in.
4. Add the site URL to Auth redirect URLs (`/dashboard`).

## Stripe
1. Create a Product called "SignalDrop" with monthly recurring price set to `$99` and copy the price ID into `STRIPE_PRICE_ID`.
2. In Developers → Webhooks, add an endpoint for `https://<your-domain>/api/stripe/webhook` (if you add one) and include `checkout.session.completed`. (A webhook handler is not required for simple access control but can be added for metering.)
3. Use the `/api/billing/checkout` route to redirect users to checkout.

## Resend
1. Verify your sending domain (e.g., `signaldrop.app`).
2. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (from the verified domain).
3. Optionally create a suppression rule for bounced addresses.

## Vercel setup
1. Import the repo into Vercel and select the Next.js framework.
2. Add all environment variables above to Project → Settings → Environment Variables.
3. Add a Vercel cron job in `vercel.json` or via dashboard to call `POST https://<your-domain>/api/cron` daily with header `Authorization: Bearer ${CRON_SECRET}`.
4. Set the root directory to `/` and build command `npm run build`.

## Local development
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the landing page and `http://localhost:3000/dashboard` for auth + URL management.
