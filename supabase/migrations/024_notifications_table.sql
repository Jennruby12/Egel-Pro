-- Notificaciones in-app (logros desbloqueados, racha en riesgo, level up, etc.).
-- Insert via service_role o helper server-side (createNotification). El cliente
-- solo puede SELECT/UPDATE/DELETE las suyas via RLS.

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'achievement_unlocked', 'streak_warning', 'streak_milestone',
    'level_up', 'weekly_report', 'exam_reminder', 'system'
  )),
  title TEXT NOT NULL,
  body TEXT,
  read_at TIMESTAMPTZ,
  action_link TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications(user_id, created_at DESC)
  WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_user_all
  ON public.notifications(user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_notifications_select" ON public.notifications;
CREATE POLICY "own_notifications_select" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_notifications_update" ON public.notifications;
CREATE POLICY "own_notifications_update" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_notifications_delete" ON public.notifications;
CREATE POLICY "own_notifications_delete" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);
