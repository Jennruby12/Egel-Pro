-- Opciones con imagen/diagrama (preguntas tipo "elige la imagen/diagrama")
-- Cada opcion A/B/C puede llevar opcionalmente una imagen (URL) y/o un
-- diagrama Mermaid, ademas del texto. NULL = sin media.
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS option_a_image TEXT NULL,
  ADD COLUMN IF NOT EXISTS option_b_image TEXT NULL,
  ADD COLUMN IF NOT EXISTS option_c_image TEXT NULL,
  ADD COLUMN IF NOT EXISTS option_a_diagram TEXT NULL,
  ADD COLUMN IF NOT EXISTS option_b_diagram TEXT NULL,
  ADD COLUMN IF NOT EXISTS option_c_diagram TEXT NULL;
