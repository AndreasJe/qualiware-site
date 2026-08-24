import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RenderBlocks } from '../../../blocks/RenderBlocks'
import { PartnersHome } from '../../../components/PartnersHome'
import { DocsHome } from '../../../components/DocsHome'
import { SupportHome } from '../../../components/SupportHome'
import { resolvePath } from '../../../lib/resolve'
import { isTenantSlug } from '../../../lib/tenant'

type Props = { params: Promise<{ tenant: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant } = await params
  if (!isTenantSlug(tenant)) return {}
  const resolved = await resolvePath(tenant, ['home'])
  if (resolved?.kind !== 'page') return {}
  const title = resolved.page.seo?.metaTitle || resolved.page.title
  return {
    title,
    description: resolved.page.seo?.metaDescription ?? undefined,
    alternates: { canonical: '/' },
    openGraph: { title, url: '/', type: 'website' },
  }
}

export default async function TenantHome({ params }: Props) {
  const { tenant } = await params
  if (!isTenantSlug(tenant)) notFound()

  // Support is rendered entirely from components; it needs no Page record.
  if (tenant === 'support') return <SupportHome />

  const resolved = await resolvePath(tenant, ['home'])
  if (resolved?.kind !== 'page') notFound()

  // The partners and docs homepages interleave blocks with property components.
  if (tenant === 'partners') return <PartnersHome page={resolved.page} />
  if (tenant === 'docs') return <DocsHome page={resolved.page} />

  return <RenderBlocks blocks={resolved.page.layout} tenantSlug={tenant} />
}
