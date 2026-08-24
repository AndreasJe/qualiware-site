import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'
import type { Tenant } from '../payload-types'
import type { SubBarKey } from './nav'

export const TENANT_SLUGS = ['main', 'docs', 'partners', 'support'] as const
export type TenantSlug = (typeof TENANT_SLUGS)[number]

export const isTenantSlug = (value: string): value is TenantSlug =>
  (TENANT_SLUGS as readonly string[]).includes(value)

/** The docs and partners properties each carry a sub-bar; the main site does not. */
export const subBarFor = (slug: TenantSlug): SubBarKey | undefined =>
  slug === 'main' ? undefined : slug

export const domainFor = (slug: TenantSlug): string =>
  slug === 'main' ? 'qualiware.com' : `${slug}.qualiware.com`

/**
 * Resolved once per request. The tenant record is what every content query is
 * scoped by, so a miss here should 404 the whole route rather than leak
 * another property's content.
 */
export const getTenant = cache(async (slug: string): Promise<Tenant | null> => {
  if (!isTenantSlug(slug)) return null

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  return docs[0] ?? null
})
