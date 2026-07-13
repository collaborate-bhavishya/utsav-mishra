# Google Sheets sync for leads + newsletter subscribers

Every new contact-form lead and newsletter signup will automatically be appended
as a row in a Google Sheet, in addition to living in Supabase.

## 1. Create the sheet

Create a new Google Sheet (any name, e.g. "Utsav Mishra — Leads & Subscribers").
You don't need to add any tabs or headers manually — the script creates
"Leads" and "Subscribers" tabs (with header rows) automatically the first time
each one is used.

## 2. Add the script

In the sheet: **Extensions → Apps Script**. Delete any starter code in the
editor, then paste the entire contents of `Code.gs` (in this same folder).
Save (Ctrl/Cmd+S).

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" → choose **Web app**
3. Settings:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** → authorize the permissions it asks for (it's your own
   script acting on your own sheet)
5. Copy the **Web app URL** it gives you (looks like
   `https://script.google.com/macros/s/AKfycb.../exec`)

## 4. Wire up Supabase

1. Run `supabase/003_subscribers_and_reflections_body.sql` first if you
   haven't already (creates the `subscribers` table).
2. Open `supabase/004_sheets_webhook.sql`, replace both occurrences of
   `PASTE_YOUR_APPS_SCRIPT_URL_HERE` with the Web App URL from step 3.
3. Run the edited file in the Supabase SQL Editor.

## 5. Test it

Submit the contact form or newsletter signup on the live site, then check the
Google Sheet — a new row should appear within a few seconds in the "Leads" or
"Subscribers" tab.

If nothing shows up, the most common cause is the deployment access setting —
double check step 3 has **"Who has access: Anyone"**, not "Only myself".
