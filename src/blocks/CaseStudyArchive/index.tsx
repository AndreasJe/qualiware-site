import Link from 'next/link'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import configPromise from '@payload-config'
import { ImageSlot } from '../../components/ImageSlot'
import type { CaseStudyArchiveBlock, Page } from '../../payload-types'
import styles from './CaseStudyArchive.module.css'

/** One archive card — visually identical to the CaseStudyCards card. */
const ArchiveCard = ({ page }: { page: Page }) => {
  const cs = page.caseStudy

  return (
    <li className={styles.item}>
      <Link href={`/${page.slug}`} className={`qw-card ${styles.card}`}>
        <ImageSlot slot={cs?.image} className={styles.image} />
        <div className={styles.body}>
          {cs?.category ? <div className={styles.category}>{cs.category}</div> : null}
          <h3 className={`qw-h3 ${styles.title}`}>{page.title}</h3>
          {cs?.summary ? <p className={styles.summary}>{cs.summary}</p> : null}
        </div>
      </Link>
    </li>
  )
}

/**
 * Every case study in the current tenant, queried straight from Payload.
 * Server component — no props carry the documents, the block only carries
 * its heading and lead.
 */
export const CaseStudyArchive = async ({
  heading,
  lead,
  tenantSlug,
}: CaseStudyArchiveBlock & { tenantSlug?: string }) => {
  const payload = await getPayload({ config: configPromise })

  const where: Where = { pageType: { equals: 'caseStudy' } }
  if (tenantSlug) {
    where['tenant.slug'] = { equals: tenantSlug }
  }

  const { docs } = await payload.find({
    collection: 'pages',
    where,
    limit: 100,
    overrideAccess: false,
  })

  const pages: Page[] = docs ?? []

  return (
    <section className={styles.section}>
      <div className="qw-shell">
        {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}
        {lead ? <p className={`qw-lead ${styles.lead}`}>{lead}</p> : null}

        {pages.length > 0 ? (
          <ul className={styles.grid}>
            {pages.map((page) => (
              <ArchiveCard key={page.id} page={page} />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

export default CaseStudyArchive
