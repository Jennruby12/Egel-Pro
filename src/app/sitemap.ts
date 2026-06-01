import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import { AREA_KEYS } from '@/modules/study/lib/area-slugs'

// Sitemap dinamico — Next.js App Router convention.
// Incluye rutas publicas + las 6 areas y N guias publicadas para SEO.
// El dashboard interno no se indexa, pero las rutas de estudio son linkeables
// y conviene que aparezcan en search engines (login redirect funciona).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://egelpro.app'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/register`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/forgot-password`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/study`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ]

  const areaRoutes: MetadataRoute.Sitemap = AREA_KEYS.map((a) => ({
    url: `${baseUrl}/study/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Las guias se intentan resolver via admin client. Si no hay creds (build local
  // sin .env.local poblado), degradamos a solo rutas estaticas.
  let guideRoutes: MetadataRoute.Sitemap = []
  try {
    const supabase = createAdminClient()
    const { data: guides } = await supabase
      .from('guides')
      .select('slug, section, area_num, updated_at')
      .eq('published', true)

    if (guides) {
      guideRoutes = guides
        .map((g) => {
          const area = AREA_KEYS.find(
            (a) => a.section === g.section && a.area_num === g.area_num,
          )
          if (!area) return null
          return {
            url: `${baseUrl}/study/${area.slug}/${g.slug}`,
            lastModified: g.updated_at ? new Date(g.updated_at) : now,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          }
        })
        .filter((r): r is NonNullable<typeof r> => r !== null)
    }
  } catch {
    // fallback silencioso: el sitemap sigue valido sin las guias
  }

  return [...staticRoutes, ...areaRoutes, ...guideRoutes]
}
