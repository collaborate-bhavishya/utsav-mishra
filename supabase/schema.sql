-- Run this once in Supabase Dashboard → SQL Editor → New query → Run

create extension if not exists "pgcrypto";

-- ── TESTIMONIALS ─────────────────────────────────────────────
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  name text not null,
  role text not null,
  avatar_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── REFLECTIONS ──────────────────────────────────────────────
create table if not exists reflections (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  publication text not null,
  title text not null,
  description text not null,
  link text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── PARTNER LOGOS ────────────────────────────────────────────
create table if not exists partner_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
-- Public (anon) visitors can read. Only logged-in admins can write.
alter table testimonials enable row level security;
alter table reflections enable row level security;
alter table partner_logos enable row level security;

create policy "public read testimonials" on testimonials for select using (true);
create policy "public read reflections" on reflections for select using (true);
create policy "public read partner_logos" on partner_logos for select using (true);

create policy "authenticated write testimonials" on testimonials
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write reflections" on reflections
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write partner_logos" on partner_logos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── STORAGE (for uploaded avatar/logo/reflection images) ─────
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

create policy "public read site-assets" on storage.objects
  for select using (bucket_id = 'site-assets');
create policy "authenticated upload site-assets" on storage.objects
  for insert with check (bucket_id = 'site-assets' and auth.role() = 'authenticated');
create policy "authenticated update site-assets" on storage.objects
  for update using (bucket_id = 'site-assets' and auth.role() = 'authenticated');
create policy "authenticated delete site-assets" on storage.objects
  for delete using (bucket_id = 'site-assets' and auth.role() = 'authenticated');

-- ── SEED DATA (matches what's currently hardcoded on the site) ─
insert into testimonials (text, name, role, avatar_url, display_order) values
  ('Composed. Thoughtful. An extremely good listener. Action-oriented. He helped me unlock my blind spots and become significantly more self-aware as a leader.', 'Sudarshan Ravi Jha', 'Co-founder, z21 Ventures & LetsTransport', '/s.jpeg', 0),
  ('His frameworks on resilience and energy management offered practical, actionable insights. Our team continues to reference and apply them long after the session.', 'Ritesh Agarwal', 'VP, Educational Initiatives (Ei)', '/4.jpg', 1),
  ('He carries his skills lightly — humble, patient, always willing to listen. He challenges you to think differently without ever making you feel pushed.', 'Neelacantan', 'L&D Leader, Tekion', '/hero2.jpg', 2);

insert into reflections (category, publication, title, description, display_order) values
  ('Leadership', 'People Matters', 'Gen Z Isn''t the Problem — You Are', 'What the loudest critiques of a generation reveal about the people making them.', 0),
  ('Career', 'ETHRWorld', 'Three Ways People Find Work They Truly Love', 'Most people are only taught one path. There are two others — and they''re more reliable.', 1),
  ('Personal Growth', 'Blog', 'Forget Self-Love — Self-Awareness Is the Real Superpower', 'Self-love is comforting. Self-awareness and accountability are what actually move you forward.', 2);

insert into partner_logos (name, image_url, display_order) values
  ('Indian Air Force', '/Partner%20logos/Indian%20Air%20Force.png', 0),
  ('Western Digital', '/Partner%20logos/Western%20Digital.png', 1),
  ('NetApp', '/Partner%20logos/netapp.jpg', 2),
  ('ITC Infotech', '/Partner%20logos/ITC%20Infotech.png', 3),
  ('Swiggy', '/Partner%20logos/Swiggy.png', 4),
  ('Amul', '/Partner%20logos/Amul.png', 5),
  ('Indira IVF', '/Partner%20logos/Indira%20IVF.png', 6),
  ('Bajaj Consumer Care', '/Partner%20logos/Bajaj%20consumer%20care.jpg', 7),
  ('The Modern Data Company', '/Partner%20logos/themoderndatacompany.jpg', 8),
  ('LetsTransport', '/Partner%20logos/letstransport.png', 9),
  ('60 Decibels', '/Partner%20logos/60%20decibels.png', 10),
  ('z21 Ventures', '/Partner%20logos/z21%20ventures.png', 11),
  ('Svatantra Microfinance', '/Partner%20logos/Svatantra%20Microfinance.png', 12),
  ('United Way Bengaluru', '/Partner%20logos/United%20Way%20Bengaluru.png', 13),
  ('Educational Initiatives (Ei)', '/Partner%20logos/Ei.png', 14),
  ('India Partner Network', '/Partner%20logos/India%20Partner%20Network.png', 15);
