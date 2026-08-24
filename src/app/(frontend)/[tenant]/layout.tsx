import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { propertyHref } from '../../../lib/links'
import { SiteHeader } from '../../../components/SiteHeader'
import { SiteFooter } from '../../../components/SiteFooter'
import { getTenant, isTenantSlug, subBarFor } from '../../../lib/tenant'
import { getSession } from '../../../lib/session'

/**
 * Each property is its own site for search: docs.qualiware.com must not emit
 * canonical or Open Graph URLs pointing at qualiware.com. `metadataBase` makes
 * every relative URL in page metadata resolve against the right origin.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>
}): Promise<Metadata> {
  const { tenant } = await params
  if (!isTenantSlug(tenant)) return {}

  const origin = propertyHref(tenant)
  if (!origin.startsWith('http')) return {}

  return { metadataBase: new URL(origin) }
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params

  if (!isTenantSlug(tenant)) notFound()
  // A missing tenant record must 404 rather than fall through to unscoped content.
  if (!(await getTenant(tenant))) notFound()

  const session = await getSession()

  return (
    <>
      <SiteHeader subBar={subBarFor(tenant)} tenant={tenant} session={session} />
      <main>{children}</main>
      <SiteFooter tenant={tenant} />
    </>
  )
}
