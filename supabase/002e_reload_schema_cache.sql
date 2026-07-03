-- Forces PostgREST to reload its internal schema/permissions cache.
-- Sometimes needed after GRANT/POLICY changes made via the SQL Editor.
notify pgrst, 'reload schema';
