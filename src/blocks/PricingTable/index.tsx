import Link from 'next/link'
import { Arrow } from '../../components/Arrow'
import type { PricingTableBlock } from '../../payload-types'
import styles from './PricingTable.module.css'

const DEFAULT_CTA = 'CONTACT SALES'

/**
 * Named pricing tiers (artboard 1m) — no prices anywhere. One column on
 * mobile, three from 900px. The emphasized tier carries a 2px green border and
 * a neon tab straddling the top edge of the card; its CTA is solid green while
 * the others are outlined. Static markup, so this stays a server component.
 */
export const PricingTable = ({ heading, lead, note, tiers }: PricingTableBlock) => {
  const tierList = (tiers ?? []).filter((tier) => Boolean(tier?.name))

  return (
    <section className={`qw-section ${styles.section}`}>
      <div className="qw-shell">
        {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}
        {lead ? <p className={`qw-lead ${styles.lead}`}>{lead}</p> : null}

        {tierList.length > 0 ? (
          <div className={styles.grid}>
            {tierList.map((tier, index) => {
              const features = (tier.features ?? []).filter((feature) => Boolean(feature?.text))
              const emphasized = tier.emphasized === true

              return (
                <div
                  key={tier.id ?? index}
                  className={emphasized ? `${styles.card} ${styles.cardEmphasized}` : styles.card}
                >
                  {emphasized && tier.tabLabel ? (
                    <span className={`qw-eyebrow ${styles.tab}`}>{tier.tabLabel}</span>
                  ) : null}

                  <h3 className={`qw-h3 ${styles.tierName}`}>{tier.name}</h3>

                  {tier.description ? (
                    <p className={styles.description}>{tier.description}</p>
                  ) : null}

                  {features.length > 0 ? (
                    <>
                      <div className={styles.divider} />
                      <ul className={`qw-arrow-list ${styles.features}`}>
                        {features.map((feature, featureIndex) => (
                          <li key={feature.id ?? featureIndex}>
                            <Arrow width={20} stroke="var(--qw-green)" />
                            <span className={styles.featureText}>{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}

                  <Link
                    href={tier.ctaHref || '#'}
                    className={
                      emphasized
                        ? `qw-btn qw-btn--solid qw-btn--full ${styles.cta}`
                        : `qw-btn qw-btn--outline-green qw-btn--full ${styles.cta}`
                    }
                  >
                    {tier.ctaLabel || DEFAULT_CTA}
                    <Arrow
                      width={26}
                      stroke={emphasized ? 'var(--qw-neon)' : 'var(--qw-green)'}
                    />
                  </Link>
                </div>
              )
            })}
          </div>
        ) : null}

        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
    </section>
  )
}

export default PricingTable
