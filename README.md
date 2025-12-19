# SignalDrop

SignalDrop emails users when monitored URLs change in meaningful ways. Built with Next.js 14, Supabase Auth/Postgres, Stripe billing, Resend email delivery, and daily Vercel cron crawls.

## File tree
```
.
├── app
│   ├── (marketing)/page.tsx
│   ├── api
│   │   ├── billing/checkout/route.ts
│   │   └── cron/route.ts
│   ├── dashboard/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components
│   ├── AuthPanel.tsx
│   └── UrlManager.tsx
├── emails
│   └── change-alert.ts
├── lib
│   ├── diff.ts
│   ├── email.ts
│   ├── supabase-admin.ts
│   ├── supabase-browser.ts
│   └── types.ts
├── supabase
│   └── schema.sql
├── docs
│   └── DEPLOYMENT.md
├── .env.example
├── next.config.js
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── README.md
```

## Core flows
- **Auth:** passwordless magic links via Supabase Auth. Users sign in on `/dashboard`.
- **URL management:** authenticated users add/remove URLs stored in `monitored_urls` (RLS enforced). Contact email is captured from the authenticated session.
- **Daily crawl:** Vercel cron triggers `POST /api/cron` with `Authorization: Bearer <CRON_SECRET>`. Each URL is fetched, diffed via Codex 5.2, and summarized. Changes insert into `change_events` and trigger a single Resend email.
- **Billing:** `/api/billing/checkout` creates a Stripe Checkout session for the $99/mo plan.

## Email template
See `emails/change-alert.ts` for the HTML email sent on change detection.

## Deployment
Detailed steps and environment variables live in `docs/DEPLOYMENT.md`.
