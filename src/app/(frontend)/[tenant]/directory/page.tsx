import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { RenderBlocks } from '../../../../blocks/RenderBlocks'
import { PartnerDirectoryGrid } from '../../../../components/PartnerDirectoryGrid'
import { resolvePath } from '../../../../lib/resolve'

export const metadata: Metadata = { title: 'Partner directory' }

type Props = {
  params: Promise<{ tenant: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

export default async function DirectoryPage({ params, searchParams }: Props) {
  const { tenant } = await params
  // Only the partners property exposes a directory.
  if (tenant !== 'partners') notFound()

  const query = await searchParams

  const payload = await getPayload({ config: configPromise })
  const [resolved, { docs: partners }] = await Promise.all([
    resolvePath('partners', ['directory']),
    payload.find({
      collection: 'partners',
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
      {/*
        Filter state is read here on the server and handed down, so the grid
        never calls useSearchParams() and never needs a Suspense boundary.
      */}
      <PartnerDirectoryGrid
        partners={partners}
        initialFilters={{
          type: first(query.type),
          region: first(query.region),
          industry: first(query.industry),
          q: first(query.q),
        }}
      />
    </>
  )
}
