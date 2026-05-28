-- Tabla flashcards: tarjetas asociadas a guias de estudio
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_guide_id UUID REFERENCES study_guides(id),
  area INTEGER NOT NULL,
  subarea INTEGER NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flashcards_guide ON flashcards(study_guide_id) WHERE is_active = TRUE;
CREATE INDEX idx_flashcards_area_sub ON flashcards(area, subarea) WHERE is_active = TRUE;
