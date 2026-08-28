# আজকের সম্পর্ক

Mobile-first Bangla AI relationship product-flow MVP built with Next.js App Router, TypeScript, Tailwind CSS, Supabase, Zod, and deterministic local logic.

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYMENT_ADMIN_TOKEN=
```

`SUPABASE_SERVICE_ROLE_KEY` is imported only from `lib/supabase/admin.ts`, which uses `server-only`. Never expose it in client components or public logs.

## Supabase SQL Prerequisite

The database must already contain these tables with compatible columns:

- `quiz_sessions`
- `quiz_answers`
- `reports`
- `generated_messages`
- `payments`

The app does not run migrations or recreate tables. It expects quiz sessions to have a random `session_token`, answers to be upsertable by `quiz_session_id` and `question_key`, reports to be upsertable by `quiz_session_id`, and payments to be upsertable by `quiz_session_id`.

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Testing

```bash
npm run lint
npm run typecheck
npm run test
```

## Routes

- `/`
- `/start`
- `/quiz/interest`
- `/analyzing`
- `/result`
- `/premium`
- `/payment`
- `/report`
- `/message`
- `/message/result`

## API Routes

- `POST /api/quiz/start`
- `POST /api/quiz/answer`
- `POST /api/quiz/complete`
- `GET /api/quiz/[sessionToken]`
- `GET /api/payment/status`
- `POST /api/payment/submit`
- `GET /api/admin/payments`
- `PATCH /api/admin/payments/[paymentId]`
- `POST /api/payment/demo`
- `POST /api/message/generate`

## Manual bKash Payment

The `/payment` page shows personal bKash Send Money instructions for `01953121121`. Users submit their bKash TrxID and sender mobile number. This creates a `pending` payment only; it never unlocks the report.

Admin verification is intentionally minimal and token-protected. Set `PAYMENT_ADMIN_TOKEN` in the server environment, then use:

```bash
curl -H "Authorization: Bearer $PAYMENT_ADMIN_TOKEN" \
  "https://relationship.creatives71.com/api/admin/payments?status=pending"
```

After comparing the TrxID against bKash transaction history, mark it manually:

```bash
curl -X PATCH \
  -H "Authorization: Bearer $PAYMENT_ADMIN_TOKEN" \
  -H "content-type: application/json" \
  -d '{"status":"verified"}' \
  "https://relationship.creatives71.com/api/admin/payments/PAYMENT_ID"
```

Use `{"status":"rejected"}` when the bKash transaction cannot be verified. Only `verified` payments unlock the detailed report. The legacy `/api/payment/demo` Lead route is retained unchanged for the existing Meta Lead implementation.

## Intentionally Excluded From Step 2

- Real AI API integration
- Real payment gateway
- User accounts
- Database migrations
- Predictions about another person's definite feelings or behavior
