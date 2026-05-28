-- Tabla stimuli: textos para preguntas multirreactivas (comprension lectora)
CREATE TABLE stimuli (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  body TEXT NOT NULL,
  text_type TEXT NOT NULL
    CHECK (text_type IN (
      'resena_academica','articulo_investigacion',
      'cuento','ensayo_literario',
      'convocatoria','nota_informativa'
    )),
  subarea_context TEXT NOT NULL
    CHECK (subarea_context IN ('estudio','literario','participacion_social')),
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stimuli_active ON stimuli(is_active) WHERE is_active = TRUE;
