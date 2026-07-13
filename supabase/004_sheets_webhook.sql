-- Run this AFTER deploying the Google Apps Script (see google-sheets-sync/README.md)
-- and after running 003_subscribers_and_reflections_body.sql (needed first — this
-- adds a trigger to the subscribers table, which must already exist).

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_google_sheets()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform net.http_post(
    url := 'https://script.google.com/macros/s/AKfycbwpJP6_T2sI9Iby1JP-dm9hN-zEWCMIZFDvJ5aQ0AHyDVLTPHL4rvC0AOBpFxMaWLNCTQ/exec',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW)
    )
  );
  return NEW;
end;
$$;

drop trigger if exists leads_to_sheets on leads;
create trigger leads_to_sheets
  after insert on leads
  for each row execute function public.notify_google_sheets();

drop trigger if exists subscribers_to_sheets on subscribers;
create trigger subscribers_to_sheets
  after insert on subscribers
  for each row execute function public.notify_google_sheets();
