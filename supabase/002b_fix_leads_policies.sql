-- Run this if the contact form is failing with a row-level security error
-- on the leads table. Safe to run multiple times.

alter table leads enable row level security;

drop policy if exists "anyone can submit a lead" on leads;
drop policy if exists "authenticated read leads" on leads;
drop policy if exists "authenticated update leads" on leads;
drop policy if exists "authenticated delete leads" on leads;

create policy "anyone can submit a lead" on leads
  for insert to anon, authenticated with check (true);

create policy "authenticated read leads" on leads
  for select to authenticated using (true);
create policy "authenticated update leads" on leads
  for update to authenticated using (true);
create policy "authenticated delete leads" on leads
  for delete to authenticated using (true);
