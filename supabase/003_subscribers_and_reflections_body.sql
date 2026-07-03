-- Run in Supabase Dashboard → SQL Editor → New query → Run

-- ── SUBSCRIBERS (email list) ─────────────────────────────────
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table subscribers enable row level security;

-- Anyone can subscribe (insert their own email).
create policy "anyone can subscribe" on subscribers
  for insert with check (true);

-- Only authenticated admin can read/delete subscribers.
create policy "authenticated read subscribers" on subscribers
  for select using (auth.role() = 'authenticated');
create policy "authenticated delete subscribers" on subscribers
  for delete using (auth.role() = 'authenticated');

-- ── REFLECTIONS: add body column ─────────────────────────────
alter table reflections add column if not exists body text;
