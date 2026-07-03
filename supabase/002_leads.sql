-- Run this once in Supabase Dashboard → SQL Editor → New query → Run
-- (Separate from schema.sql so re-running it doesn't duplicate the seed data there.)

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

-- Visitors (anon) can submit the contact form, but cannot read submissions back.
create policy "anyone can submit a lead" on leads
  for insert with check (true);

-- Only the logged-in admin can view, update (mark as read), or delete leads.
create policy "authenticated read leads" on leads
  for select using (auth.role() = 'authenticated');
create policy "authenticated update leads" on leads
  for update using (auth.role() = 'authenticated');
create policy "authenticated delete leads" on leads
  for delete using (auth.role() = 'authenticated');
