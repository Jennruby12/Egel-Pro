-- Fix infinite recursion en RLS policies de admin.
-- Causa: policies que hacen SELECT FROM profiles dentro de la policy de profiles
-- Solucion: SECURITY DEFINER function que bypassea RLS

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

DROP POLICY IF EXISTS "admin_all_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_manage_orgs" ON organizations;
DROP POLICY IF EXISTS "admin_manage_stimuli" ON stimuli;
DROP POLICY IF EXISTS "admin_manage_questions" ON questions;
DROP POLICY IF EXISTS "admin_manage_guides" ON study_guides;
DROP POLICY IF EXISTS "admin_manage_flashcards" ON flashcards;
DROP POLICY IF EXISTS "admin_manage_reports" ON question_reports;
DROP POLICY IF EXISTS "admin_read_email_logs" ON email_logs;
DROP POLICY IF EXISTS "admin_manage_areas_catalog" ON areas_catalog;

CREATE POLICY "admin_all_profiles" ON profiles FOR ALL USING (public.is_admin());
CREATE POLICY "admin_manage_orgs" ON organizations FOR ALL USING (public.is_admin());
CREATE POLICY "admin_manage_stimuli" ON stimuli FOR ALL USING (public.is_admin());
CREATE POLICY "admin_manage_questions" ON questions FOR ALL USING (public.is_admin());
CREATE POLICY "admin_manage_guides" ON study_guides FOR ALL USING (public.is_admin());
CREATE POLICY "admin_manage_flashcards" ON flashcards FOR ALL USING (public.is_admin());
CREATE POLICY "admin_manage_reports" ON question_reports FOR ALL USING (public.is_admin());
CREATE POLICY "admin_read_email_logs" ON email_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "admin_manage_areas_catalog" ON areas_catalog FOR ALL USING (public.is_admin());
