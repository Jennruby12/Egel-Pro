-- Tabla question_reports: reportes de preguntas problemáticas
CREATE TABLE question_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id),
  reported_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','reviewed','fixed','dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_question_reports_status ON question_reports(status, created_at DESC);
