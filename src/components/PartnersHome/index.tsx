import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { RenderBlocks } from '../../blocks/RenderBlocks'
import { ImageSlot } from '../ImageSlot'
import { tenantPath } from '../../lib/links'
import { PartnerTierTable } from '../PartnerTierTable'
import { PartnerPortalTeaser } from '../PartnerPortalTeaser'
import { IntegrationsMarketplace } from '../IntegrationsMarketplace'
import { Arrow } from '../Arrow'
import type { Page } from '../../payload-types'
import styles from './PartnersHome.module.css'

/**
 * The partners homepage interleaves CMS blocks with the partner-platform
 * components. Blocks cover the hero, the programme-value cards and the
 * application form; the tier table, portal teaser and marketplace are
 * components because they are not part of the shared page builder.
 *
 * Tier-table content lives here rather than in the CMS for this phase. If
 * editors need to change it, promote it to a block — the component is already
 * prop-driven.
 */
const TIERS = [
  { name: 'Silver' },
  { name: 'Gold' },
  { name: 'Platinum', highlighted: true },
]

const TIER_ROWS = [
  { benefit: 'Certified consultants required', values: ['2', '5', '10'] },
  { benefit: 'Deal registration', values: ['—', 'Yes', 'Yes'] },
  { benefit: 'Co-marketing budget', values: ['—', 'Shared', 'Dedicated'] },
  { benefit: 'Named partner manager', values: ['—', '—', 'Yes'] },
  { benefit: 'Early access to releases', values: ['—', 'Yes', 'Yes'] },
]

export const PartnersHome = async ({ page }: { page: Page }) => {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: featured }, { docs: integrations }] = await Promise.all([
    payload.find({
      collection: 'partners',
      where: {
        and: [{ 'tenant.slug': { equals: 'partners' } }, { featured: { equals: true } }],
      },
      limit: 2,
      depth: 1,
    }),
    payload.find({
      collection: 'integrations',
      where: { 'tenant.slug': { equals: 'partners' } },
      limit: 4,
      depth: 1,
    }),
  ])

  const layout = page.layout ?? []
  const formIndex = layout.findIndex((block) => block.blockType === 'formBlock')

  // Hero first, then the tier table, then everything up to the application form.
  const heroBlocks = layout.slice(0, 1)
  const middleBlocks = layout.slice(1, formIndex === -1 ? layout.length : formIndex)
  const formBlocks = formIndex === -1 ? [] : layout.slice(formIndex)

  return (
    <>
      <RenderBlocks blocks={heroBlocks} tenantSlug="partners" />

      <PartnerTierTable tiers={TIERS} rows={TIER_ROWS} />

      <RenderBlocks blocks={middleBlocks} tenantSlug="partners" />

      {featured.length > 0 && (
        <section className={`qw-section ${styles.featured}`}>
          <div className="qw-shell">
            <h2 className={`qw-h2 ${styles.featuredHeading}`}>Featured partners</h2>
            <div className={styles.featuredGrid}>
              {featured.map((partner) => (
                <Link
                  key={partner.id}
                  href={tenantPath('partners', `/directory/${partner.slug}`)}
                  className={`qw-card ${styles.featuredCard}`}
                >
                  <div className={styles.featuredTop}>
                    <ImageSlot slot={partner.logo} className={styles.featuredLogo} />
                    {partner.tier && (
                      <span className={styles.tierChip}>{partner.tier}</span>
                    )}
                  </div>
                  <h3 className={`qw-h3 ${styles.featuredName}`}>{partner.name}</h3>
                  {partner.blurb && <p className={styles.featuredBlurb}>{partner.blurb}</p>}
                  <span className={styles.featuredLink}>
                    View profile
                    <Arrow width={22} stroke="var(--qw-green)" strokeWidth={1.6} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PartnerPortalTeaser />

      <IntegrationsMarketplace
        integrations={integrations}
        heading="Integrations marketplace"
        limit={4}
      />

      <RenderBlocks blocks={formBlocks} tenantSlug="partners" />
    </>
  )
}

export default PartnersHome
