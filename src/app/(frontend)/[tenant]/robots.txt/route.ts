import { isTenantSlug } from '../../../../lib/tenant'
import { propertyHref, tenantPath } from '../../../../lib/links'

export const dynamic = 'force-dynamic'

/**
 * One robots.txt per property, each pointing at its own sitemap. Every property
 * is a separate site for search, so they must not advertise each other's.
 *
 * Set NEXT_PUBLIC_ALLOW_INDEXING=false on review deployments — a staging copy of
 * the marketing site competing with the real one in search results is the
 * expensive kind of mistake.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenant: string }> },
) {
  const { tenant } = await params
  if (!isTenantSlug(tenant)) return new Response('Not found', { status: 404 })

  const indexable = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== 'false'

  const origin = propertyHref(tenant).replace(/\/$/, '')
  const sitemap = origin.startsWith('http')
    ? `${origin}${tenantPath(tenant, '/sitemap.xml')}`
    : tenantPath(tenant, '/sitemap.xml')

  const body = indexable
    ? [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /api/',
        'Disallow: /search',
        '',
        `Sitemap: ${sitemap}`,
        '',
      ].join('\n')
    : ['User-agent: *', 'Disallow: /', ''].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
