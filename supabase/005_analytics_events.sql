-- Run this in Supabase Dashboard → SQL Editor → New query → Run

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,          -- 'page_view' | 'scroll_depth' | 'cta_click'
  label text,                        -- scroll_depth: '25'|'50'|'75'|'100'; cta_click: button name
  page text not null default '/',
  session_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc);
create index if not exists analytics_events_type_idx on analytics_events (event_type);

alter table analytics_events enable row level security;

-- Any visitor's browser can log events, but only the logged-in admin can read them.
create policy "anyone can log events" on analytics_events
  for insert to anon, authenticated with check (true);

create policy "authenticated read events" on analytics_events
  for select to authenticated using (true);

create policy "authenticated delete events" on analytics_events
  for delete to authenticated using (true);
