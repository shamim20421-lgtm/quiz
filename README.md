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
- `POST /api/payment/demo`
- `POST /api/message/generate`

## Demo Payment

The demo payment page collects name, mobile number, and transaction number only. It does not collect card details and does not charge real money. A successful demo payment marks the payment as paid, unlocks the report, and updates the quiz session status.

## Intentionally Excluded From Step 2

- Real AI API integration
- Real payment gateway
- User accounts
- Database migrations
- Predictions about another person's definite feelings or behavior
