
-- Grant execute on has_role to authenticated and anon so RLS/PostgREST can call it
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user_role() TO authenticated, anon, service_role;

-- Ensure trigger exists on auth.users so new signups get a role automatically
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Backfill: if any existing auth users don't have a role yet, assign them
-- (first one becomes admin if none exists, otherwise user)
DO $$
DECLARE
  u RECORD;
BEGIN
  FOR u IN SELECT id FROM auth.users WHERE id NOT IN (SELECT user_id FROM public.user_roles) LOOP
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (u.id, 'admin');
    ELSE
      INSERT INTO public.user_roles (user_id, role) VALUES (u.id, 'user');
    END IF;
  END LOOP;
END $$;
