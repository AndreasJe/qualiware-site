import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { isTenantSlug, type TenantSlug } from '../../../../lib/tenant'
import { propertyHref, tenantPath } from '../../../../lib/links'

export const dynamic = 'force-dynamic'

type Entry = { path: string; lastmod?: string | null; priority: string }

/**
 * One sitemap per property. Each sub-platform is a separate site for search, so
 * docs.qualiware.com must list only documentation URLs, at its own origin.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenant: string }> },
) {
  const { tenant } = await params
  if (!isTenantSlug(tenant)) return new Response('Not found', { status: 404 })

  const entries = await collect(tenant)
  const origin = propertyHref(tenant).replace(/\/$/, '')

  // In path mode `propertyHref` returns a path, so fall back to a relative URL
  // rather than emitting a malformed absolute one.
  const absolute = (path: string) =>
    origin.startsWith('http') ? `${origin}${path === '/' ? '' : path}` : path

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) =>
      `  <url>\n    <loc>${escapeXml(absolute(entry.path))}</loc>${
        entry.lastmod ? `\n    <lastmod>${entry.lastmod.slice(0, 10)}</lastmod>` : ''
      }\n    <priority>${entry.priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] as string,
  )

async function collect(tenant: TenantSlug): Promise<Entry[]> {
  const payload = await getPayload({ config: configPromise })
  const where = { 'tenant.slug': { equals: tenant } }

  // Always advertise the property root. Support is rendered from components
  // rather than Page records, so it would otherwise have an empty sitemap.
  const entries: Entry[] = [{ path: tenantPath(tenant, '/'), priority: '1.0' }]

  const { docs: pages } = await payload.find({
    collection: 'pages',
    where,
    limit: 0,
    depth: 0,
  })

  for (const page of pages) {
    const path = page.slug === 'home' ? '/' : `/${page.slug}`
    entries.push({
      path: tenantPath(tenant, path),
      lastmod: page.updatedAt,
      priority: page.slug === 'home' ? '1.0' : '0.7',
    })
  }

  if (tenant === 'docs') {
    // Gated articles are excluded: overrideAccess:false applies the same rule
    // the public site does, so nothing behind the flag is advertised.
    const { docs: articles } = await payload.find({
      collection: 'docs',
      where,
      limit: 0,
      depth: 0,
      overrideAccess: false,
    })

    for (const article of articles) {
      const url = article.breadcrumbs?.[article.breadcrumbs.length - 1]?.url
      if (!url) continue
      entries.push({ path: tenantPath(tenant, url), lastmod: article.updatedAt, priority: '0.6' })
    }

    const { docs: categories } = await payload.find({
      collection: 'categories',
      where,
      limit: 0,
      depth: 0,
    })

    for (const category of categories) {
      const url = category.breadcrumbs?.[category.breadcrumbs.length - 1]?.url
      if (!url) continue
      entries.push({ path: tenantPath(tenant, url), lastmod: category.updatedAt, priority: '0.5' })
    }
  }

  if (tenant === 'partners') {
    const { docs: partners } = await payload.find({
      collection: 'partners',
      where,
      limit: 0,
      depth: 0,
    })

    for (const partner of partners) {
      entries.push({
        path: tenantPath(tenant, `/directory/${partner.slug}`),
        lastmod: partner.updatedAt,
        priority: '0.6',
      })
    }
  }

  // Stable order, and never advertise the same URL twice.
  const seen = new Set<string>()
  return entries
    .filter((entry) => (seen.has(entry.path) ? false : seen.add(entry.path)))
    .sort((a, b) => a.path.localeCompare(b.path))
}
