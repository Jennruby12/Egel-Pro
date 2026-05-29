-- RPC public para leaderboard. SECURITY DEFINER para bypassear RLS y exponer SOLO
-- campos publicos (full_name, avatar, level, xp, racha). NO email ni datos privados.

CREATE OR REPLACE FUNCTION public.get_top_players(p_sort_by text DEFAULT 'xp', p_limit int DEFAULT 10)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  avatar_url text,
  level int,
  xp_total int,
  streak_current int,
  streak_max int,
  rank int
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_sort_by = 'streak' THEN
    RETURN QUERY
    SELECT
      p.id AS user_id,
      COALESCE(p.full_name, 'Anonimo') AS full_name,
      p.avatar_url,
      COALESCE(p.level, 1) AS level,
      COALESCE(p.xp_total, 0) AS xp_total,
      COALESCE(p.streak_current, 0) AS streak_current,
      COALESCE(p.streak_max, 0) AS streak_max,
      ROW_NUMBER() OVER (ORDER BY COALESCE(p.streak_current, 0) DESC, COALESCE(p.xp_total, 0) DESC)::int AS rank
    FROM profiles p
    WHERE COALESCE(p.streak_current, 0) > 0 OR COALESCE(p.xp_total, 0) > 0
    ORDER BY rank
    LIMIT p_limit;
  ELSE
    RETURN QUERY
    SELECT
      p.id AS user_id,
      COALESCE(p.full_name, 'Anonimo') AS full_name,
      p.avatar_url,
      COALESCE(p.level, 1) AS level,
      COALESCE(p.xp_total, 0) AS xp_total,
      COALESCE(p.streak_current, 0) AS streak_current,
      COALESCE(p.streak_max, 0) AS streak_max,
      ROW_NUMBER() OVER (ORDER BY COALESCE(p.xp_total, 0) DESC, COALESCE(p.streak_max, 0) DESC)::int AS rank
    FROM profiles p
    WHERE COALESCE(p.xp_total, 0) > 0
    ORDER BY rank
    LIMIT p_limit;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_players(text, int) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_my_rank(p_user_id uuid, p_sort_by text DEFAULT 'xp')
RETURNS TABLE (rank int, total_players int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_sort_by = 'streak' THEN
    RETURN QUERY
    WITH ranked AS (
      SELECT p.id, ROW_NUMBER() OVER (ORDER BY COALESCE(p.streak_current, 0) DESC, COALESCE(p.xp_total, 0) DESC) AS r
      FROM profiles p
      WHERE COALESCE(p.streak_current, 0) > 0 OR COALESCE(p.xp_total, 0) > 0
    )
    SELECT
      COALESCE((SELECT r::int FROM ranked WHERE id = p_user_id), 0),
      (SELECT count(*)::int FROM ranked);
  ELSE
    RETURN QUERY
    WITH ranked AS (
      SELECT p.id, ROW_NUMBER() OVER (ORDER BY COALESCE(p.xp_total, 0) DESC, COALESCE(p.streak_max, 0) DESC) AS r
      FROM profiles p
      WHERE COALESCE(p.xp_total, 0) > 0
    )
    SELECT
      COALESCE((SELECT r::int FROM ranked WHERE id = p_user_id), 0),
      (SELECT count(*)::int FROM ranked);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_rank(uuid, text) TO authenticated;
