import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { PartnerProfile } from '../../../../../components/PartnerProfile'

type Props = { params: Promise<{ tenant: string; slug: string }> }

const findPartner = async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'partners',
    where: {
      and: [{ 'tenant.slug': { equals: 'partners' } }, { slug: { equals: slug } }],
    },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant, slug } = await params
  if (tenant !== 'partners') return {}
  const partner = await findPartner(slug)
  return partner ? { title: partner.name, description: partner.blurb ?? undefined } : {}
}

export default async function PartnerProfilePage({ params }: Props) {
  const { tenant, slug } = await params
  if (tenant !== 'partners') notFound()

  const partner = await findPartner(slug)
  if (!partner) notFound()

  // Similar partners: same type, excluding this one.
  const payload = await getPayload({ config: configPromise })
  const { docs: similar } = await payload.find({
    collection: 'partners',
    where: {
      and: [
        { 'tenant.slug': { equals: 'partners' } },
        { partnerType: { equals: partner.partnerType } },
        { id: { not_equals: partner.id } },
      ],
    },
    limit: 3,
    depth: 1,
  })

  return <PartnerProfile partner={partner} similar={similar} />
}
