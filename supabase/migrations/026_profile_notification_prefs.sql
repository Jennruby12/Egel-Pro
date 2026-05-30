-- Preferencias de notificacion por usuario. Por default todas activas.
-- create-notification.ts respeta estas prefs antes de insertar.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_prefs JSONB
  DEFAULT '{"achievement_unlocked": true, "streak_warning": true, "streak_milestone": true, "level_up": true, "weekly_report": true, "exam_reminder": true}'::jsonb;
