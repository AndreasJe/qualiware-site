import type { TenantSlug } from './tenant'

/**
 * Link generation across the three properties.
 *
 * Default (`subdomain` mode) — each property has its own host, which is how
 * production works and what `docs.localhost:3000` gives you in development:
 *
 *   main      http://localhost:3000            /pricing
 *   docs      http://docs.localhost:3000       /modelling
 *   partners  http://partners.localhost:3000   /directory
 *
 * Because the host selects the tenant, links *within* a property stay plain
 * root-relative paths and need no help from this module. Only cross-property
 * links need `propertyHref`.
 *
 * Point it at production with one variable:
 *
 *   NEXT_PUBLIC_ROOT_DOMAIN=qualiware.com
 *
 * `path` mode — set NEXT_PUBLIC_TENANT_MODE=path for a review deployment with
 * no wildcard DNS. Properties are then served at `/docs` and `/partners` from a
 * single host, and `tenantPath` adds the prefix that within-property links need.
 */
const MODE = process.env.NEXT_PUBLIC_TENANT_MODE === 'path' ? 'path' : 'subdomain'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim() || 'localhost:3000'

const IS_LOCAL =
  /(^|\.)localhost(:\d+)?$/.test(ROOT_DOMAIN) || ROOT_DOMAIN.startsWith('127.0.0.1')

const PROTOCOL = IS_LOCAL ? 'http' : 'https'

/**
 * A link *within* one property. In path mode the tenant prefix is part of the
 * URL; in subdomain mode the host already selects the tenant, so the path is
 * used unchanged.
 */
export const tenantPath = (tenant: TenantSlug, path = '/'): string => {
  const clean = path === '' ? '/' : path.startsWith('/') ? path : `/${path}`

  if (MODE === 'subdomain' || tenant === 'main') return clean
  return clean === '/' ? `/${tenant}` : `/${tenant}${clean}`
}

/**
 * The prefix to concatenate in front of an already-absolute path — `''` in
 * subdomain mode, `/docs` in path mode.
 *
 * Distinct from `tenantPath(tenant)` on purpose. That returns `'/'` for a
 * property root, and `'/' + '/administration'` is `'//administration'` — a
 * protocol-relative URL the browser resolves against the host `administration`.
 * Anything doing string concatenation must use this instead.
 */
export const tenantBase = (tenant: TenantSlug): string =>
  MODE === 'subdomain' || tenant === 'main' ? '' : `/${tenant}`

/** A link into another property. Same thing, plus an origin in subdomain mode. */
export const propertyHref = (tenant: TenantSlug, path = '/'): string => {
  if (MODE === 'path') return tenantPath(tenant, path)

  const origin =
    tenant === 'main'
      ? `${PROTOCOL}://${ROOT_DOMAIN}`
      : `${PROTOCOL}://${tenant}.${ROOT_DOMAIN}`
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `${origin}${clean}`
}

/**
 * A link to the **main marketing site** from wherever we currently are.
 *
 * The header and footer are shared across all three properties, but their
 * PLATFORM / SOLUTIONS / PRICING links and the wordmark all belong to the main
 * site. Left root-relative they would resolve against the current host, so on
 * docs.qualiware.com the logo would lead back to the docs home rather than to
 * qualiware.com. Each sub-platform is a separate site for SEO, so those links
 * have to cross the host boundary explicitly.
 */
export const mainHref = (current: TenantSlug, path = '/'): string =>
  current === 'main' ? (path.startsWith('/') ? path : `/${path}`) : propertyHref('main', path)

/** The label shown at the right of a property sub-bar. */
export const propertyHost = (tenant: TenantSlug): string => {
  if (MODE === 'path') return tenantPath(tenant)
  return tenant === 'main' ? ROOT_DOMAIN : `${tenant}.${ROOT_DOMAIN}`
}

export const hostOf = (url: string): string =>
  url.replace(/^https?:\/\//, '').replace(/\/$/, '')

/**
 * Support runs on the existing Zoho Desk help centre — a separate service, not
 * a tenant of this application, so this stays a real absolute URL.
 */
export const SUPPORT_URL =
  process.env.NEXT_PUBLIC_SUPPORT_URL?.trim() || 'https://support.qualiware.com'

export { MODE as TENANT_MODE, ROOT_DOMAIN }
