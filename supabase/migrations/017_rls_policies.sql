-- Row Level Security: politicas para todas las tablas
-- Activar RLS en todas las tablas sensibles

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stimuli ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ORGANIZATIONS: usuarios ven su propia organizacion
-- =====================================================
CREATE POLICY "users_read_own_org" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND organization_id = organizations.id
    )
  );

CREATE POLICY "admin_manage_orgs" ON organizations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- PROFILES: cada usuario ve solo el suyo; admin ve todos
-- =====================================================
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "admin_all_profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- =====================================================
-- STIMULI: lectura publica, escritura admin
-- =====================================================
CREATE POLICY "anyone_read_active_stimuli" ON stimuli
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "admin_manage_stimuli" ON stimuli
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- QUESTIONS: lectura publica de activas, admin escribe
-- =====================================================
CREATE POLICY "anyone_read_active_questions" ON questions
  FOR SELECT USING (is_active = TRUE AND is_deleted = FALSE);

CREATE POLICY "admin_manage_questions" ON questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- STUDY_GUIDES: lectura publica de publicadas
-- =====================================================
CREATE POLICY "anyone_read_published_guides" ON study_guides
  FOR SELECT USING (is_published = TRUE AND is_deleted = FALSE);

CREATE POLICY "admin_manage_guides" ON study_guides
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- FLASHCARDS: lectura publica de activas
-- =====================================================
CREATE POLICY "anyone_read_active_flashcards" ON flashcards
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "admin_manage_flashcards" ON flashcards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- QUIZ_SESSIONS: solo el dueno
-- =====================================================
CREATE POLICY "users_own_sessions" ON quiz_sessions
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- QUIZ_ANSWERS: solo el dueno (via session)
-- =====================================================
CREATE POLICY "users_own_answers" ON quiz_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quiz_sessions
      WHERE id = quiz_answers.session_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- USER_PROGRESS: dueno + managers de su org
-- =====================================================
CREATE POLICY "users_own_progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "org_managers_read_member_progress" ON user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles manager
      JOIN profiles member ON member.organization_id = manager.organization_id
      WHERE manager.id = auth.uid()
        AND manager.org_role IN ('manager','owner')
        AND member.id = user_progress.user_id
    )
  );

-- =====================================================
-- STREAKS: solo el dueno
-- =====================================================
CREATE POLICY "users_own_streaks" ON streaks
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- ACHIEVEMENTS: solo el dueno
-- =====================================================
CREATE POLICY "users_own_achievements" ON achievements
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- USER_FLASHCARD_PROGRESS: solo el dueno
-- =====================================================
CREATE POLICY "users_own_flashcard_progress" ON user_flashcard_progress
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- USER_NOTES: solo el dueno
-- =====================================================
CREATE POLICY "users_own_notes" ON user_notes
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- QUESTION_REPORTS: usuario crea y ve los suyos; admin todo
-- =====================================================
CREATE POLICY "users_create_reports" ON question_reports
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "users_read_own_reports" ON question_reports
  FOR SELECT USING (auth.uid() = reported_by);

CREATE POLICY "admin_manage_reports" ON question_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- EMAIL_LOGS: solo admin
-- =====================================================
CREATE POLICY "admin_read_email_logs" ON email_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
