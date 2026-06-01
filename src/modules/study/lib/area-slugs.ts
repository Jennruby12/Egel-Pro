/**
 * Mapeo slug <-> seccion+area para rutas /study/[areaSlug]/[guideSlug].
 * No usamos los IDs numericos en la URL; usamos slugs amigables.
 */

export type AreaKey = {
  section: 'disciplinar' | 'transversal'
  area_num: number
  slug: string
  name: string
}

export const AREA_KEYS: AreaKey[] = [
  { section: 'disciplinar', area_num: 1, slug: 'analisis-de-sistemas', name: 'Analisis de Sistemas de Software' },
  { section: 'disciplinar', area_num: 2, slug: 'diseno-de-sistemas', name: 'Diseno de Sistemas de Software' },
  { section: 'disciplinar', area_num: 3, slug: 'desarrollo-de-sistemas', name: 'Desarrollo de Sistemas de Software' },
  { section: 'disciplinar', area_num: 4, slug: 'gestion-de-proyectos', name: 'Gestion de Proyectos de Software' },
  { section: 'transversal', area_num: 1, slug: 'comprension-lectora', name: 'Comprension Lectora' },
  { section: 'transversal', area_num: 2, slug: 'redaccion-indirecta', name: 'Redaccion Indirecta' },
]

export function findArea(slug: string): AreaKey | undefined {
  return AREA_KEYS.find((a) => a.slug === slug)
}
