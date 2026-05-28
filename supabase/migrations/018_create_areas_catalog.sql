-- Tabla areas_catalog: referencia inmutable de areas/subareas del EGEL
-- Se popula via supabase/seed.sql
CREATE TABLE areas_catalog (
  area INTEGER NOT NULL,
  area_name TEXT NOT NULL,
  subarea INTEGER NOT NULL,
  subarea_name TEXT NOT NULL,
  section TEXT NOT NULL CHECK (section IN ('disciplinar','transversal')),
  expected_questions INTEGER NOT NULL,
  PRIMARY KEY (area, subarea, section)
);

-- RLS: lectura publica (es referencia oficial, no contiene datos personales)
ALTER TABLE areas_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_read_areas_catalog" ON areas_catalog
  FOR SELECT USING (TRUE);

CREATE POLICY "admin_manage_areas_catalog" ON areas_catalog
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
