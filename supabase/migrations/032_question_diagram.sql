-- Campo opcional para el diagrama del enunciado de una pregunta, como fuente
-- Mermaid (classDiagram, sequenceDiagram, stateDiagram, flowchart para PERT/
-- actividad). Se renderiza en cliente (MermaidDiagram) y es exportable.
-- Distinto de image_url (legacy, imagen estatica): aqui guardamos el TEXTO.

ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS diagram TEXT NULL;

COMMENT ON COLUMN public.questions.diagram IS
  'Fuente Mermaid del diagrama del enunciado (UML/clases/PERT). Render en cliente.';
