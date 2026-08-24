import { NextResponse, type NextRequest } from 'next/server'

/**
 * Tenant routing. Both addressing schemes work at once:
 *
 *   Host      docs.localhost:3000/modelling   ->  docs      (the default)
 *             docs.qualiware.com/modelling    ->  docs
 *   Path      /docs/modelling                 ->  docs
 *             /                               ->  main
 *
 * Host-based is canonical, because it matches production and lets every link
 * inside a property stay root-relative. `docs.localhost` and
 * `partners.localhost` resolve without any hosts-file entry in current browsers,
 * so development matches production exactly.
 *
 * The path form is kept as a fallback for environments without wildcard DNS.
 * Set NEXT_PUBLIC_TENANT_MODE=path there so `src/lib/links.ts` emits prefixed
 * links to match; otherwise links inside docs and partners resolve against the
 * main site.
 */
const HOST_TENANTS: Record<string, string> = {
  'qualiware.com': 'main',
  'www.qualiware.com': 'main',
  'docs.qualiware.com': 'docs',
  'partners.qualiware.com': 'partners',
  'support.qualiware.com': 'support',
}

const TENANTS = ['main', 'docs', 'partners', 'support']

/** Paths owned by the app rather than by any tenant. Whole segments only. */
const RESERVED = ['/admin', '/api', '/_next', '/media', '/favicon.ico']

const tenantFromHost = (host: string): string | undefined => {
  const clean = host.split(':')[0].toLowerCase()
  if (HOST_TENANTS[clean]) return HOST_TENANTS[clean]

  const sub = clean.split('.')[0]
  if (sub === 'docs' || sub === 'partners' || sub === 'support') return sub
  return undefined
}

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  /*
   * Payload's admin, API and static assets are shared across all properties.
   *
   * Match on a segment boundary, not a bare prefix: the docs property has real
   * categories at `/administration` and `/api-reference`, and `startsWith('/admin')`
   * swallows both — they skip the tenant rewrite and 404.
   */
  if (RESERVED.some((seg) => pathname === seg || pathname.startsWith(`${seg}/`))) {
    return NextResponse.next()
  }

  const firstSegment = pathname.split('/')[1]

  // `/docs/...` and `/partners/...` already name their tenant, so they map
  // straight onto the [tenant] route segment.
  if (TENANTS.includes(firstSegment)) return NextResponse.next()

  const tenant =
    tenantFromHost(request.headers.get('host') ?? '') ??
    (TENANTS.includes(searchParams.get('tenant') ?? '') ? searchParams.get('tenant')! : 'main')

  const url = request.nextUrl.clone()
  url.pathname = `/${tenant}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
