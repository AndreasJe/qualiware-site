import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { RenderBlocks } from '../../../../blocks/RenderBlocks'
import { IntegrationsMarketplace } from '../../../../components/IntegrationsMarketplace'
import { resolvePath } from '../../../../lib/resolve'

export const metadata: Metadata = { title: 'Integrations marketplace' }

type Props = { params: Promise<{ tenant: string }> }

export default async function IntegrationsPage({ params }: Props) {
  const { tenant } = await params
  if (tenant !== 'partners') notFound()

  const payload = await getPayload({ config: configPromise })
  const [resolved, { docs: integrations }] = await Promise.all([
    resolvePath('partners', ['integrations']),
    payload.find({
      collection: 'integrations',
      where: { 'tenant.slug': { equals: 'partners' } },
      limit: 0,
      depth: 1,
      sort: 'name',
    }),
  ])

  return (
    <>
      {resolved?.kind === 'page' && (
        <RenderBlocks blocks={resolved.page.layout} tenantSlug="partners" />
      )}
      {/* The marketplace is driven by Integrations, independently of the directory. */}
      <IntegrationsMarketplace integrations={integrations} />
    </>
  )
}
