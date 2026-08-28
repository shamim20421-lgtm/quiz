create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  quiz_session_id uuid not null references public.quiz_sessions(id) on delete cascade,
  bkash_trx_id text not null,
  sender_mobile text,
  amount integer not null,
  currency text not null default 'BDT',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  rejected_at timestamptz,
  constraint payments_status_check check (status in ('pending', 'verified', 'rejected')),
  constraint payments_amount_check check (amount in (199, 399)),
  constraint payments_currency_check check (currency = 'BDT')
);

create unique index if not exists payments_bkash_trx_id_unique
  on public.payments (upper(bkash_trx_id));

create unique index if not exists payments_one_active_per_quiz_session
  on public.payments (quiz_session_id)
  where status in ('pending', 'verified');

create index if not exists payments_status_created_at_idx
  on public.payments (status, created_at desc);

alter table public.payments enable row level security;

drop policy if exists "No public payment access" on public.payments;
create policy "No public payment access"
  on public.payments
  for all
  using (false)
  with check (false);
