-- Tabla email_logs: registro de emails enviados (auditoria)
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL,
  status TEXT DEFAULT 'sent'
    CHECK (status IN ('sent','failed','bounced')),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_logs_user_type ON email_logs(user_id, type, sent_at DESC);
