-- Diagnostic only — run this and share the output if the insert still fails
-- after 002c. Shows RLS status, policies, and grants on the leads table.

select relrowsecurity as rls_enabled, relforcerowsecurity as rls_forced
from pg_class where relname = 'leads';

select policyname, cmd, roles, qual, with_check
from pg_policies where tablename = 'leads';

select grantee, privilege_type
from information_schema.role_table_grants
where table_name = 'leads';
