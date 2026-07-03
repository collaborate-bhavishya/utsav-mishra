-- Run this if the leads insert still fails with a row-level security error
-- after 002b. This adds the base table GRANTs that RLS policies depend on.

grant usage on schema public to anon, authenticated;
grant insert on table leads to anon, authenticated;
grant select, update, delete on table leads to authenticated;

-- Re-confirm RLS is on and policies are in place.
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
