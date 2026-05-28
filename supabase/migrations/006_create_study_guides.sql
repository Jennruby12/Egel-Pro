-- Tabla study_guides: guias de estudio por subarea (Markdown)
CREATE TABLE study_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL CHECK (section IN ('disciplinar','transversal')),
  area INTEGER NOT NULL,
  subarea INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  ceneval_tips TEXT,
  reading_time_minutes INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_study_guides_area_sub ON study_guides(area, subarea, is_published)
  WHERE is_published = TRUE AND is_deleted = FALSE;
