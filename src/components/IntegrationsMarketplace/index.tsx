import { Arrow } from '../Arrow'
import { ImageSlot } from '../ImageSlot'
import type { Integration } from '../../payload-types'
import styles from './IntegrationsMarketplace.module.css'

const CATEGORY_LABELS: Record<string, string> = {
  itsm: 'ITSM & CMDB',
  identity: 'Identity & access',
  data: 'Data & analytics',
  collaboration: 'Collaboration',
  devops: 'DevOps & delivery',
  grc: 'GRC & risk',
}

/**
 * Integrations marketplace row (artboard 1i).
 *
 * Stands on its own — it is fed from the integrations collection and is
 * independent of the partner directory and its filters. Four cards across on
 * desktop, one to two on mobile.
 *
 * The docs deep link is styled as a cross-property link (muted, matching the
 * mega-menu's "Developer documentation" treatment) because how to authenticate
 * an integration lives in Docs, not here.
 */
export const IntegrationsMarketplace = ({
  integrations,
  heading = 'Integrations marketplace',
  limit,
}: {
  integrations: Integration[]
  heading?: string
  limit?: number
}) => {
  const list = (integrations ?? []).filter((integration) => Boolean(integration?.name))
  const shown = typeof limit === 'number' && limit > 0 ? list.slice(0, limit) : list

  if (shown.length === 0) return null

  return (
    <section className={`qw-section ${styles.section}`}>
      <div className="qw-shell">
        {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}

        <ul className={styles.grid}>
          {shown.map((integration) => {
            // The relationship is either a populated doc or just an id.
            const partner =
              integration.partner && typeof integration.partner === 'object'
                ? integration.partner
                : null
            const category = integration.category
              ? CATEGORY_LABELS[integration.category] || integration.category
              : null

            return (
              <li key={integration.id} className={`qw-card ${styles.card}`}>
                <ImageSlot
                  slot={{
                    media: integration.logo?.media,
                    placeholder: integration.logo?.placeholder || 'LOGO',
                  }}
                  className={styles.logo}
                  alt={integration.name}
                />
                <h3 className={styles.name}>{integration.name}</h3>
                {category ? <p className={`qw-eyebrow ${styles.category}`}>{category}</p> : null}
                {partner ? <p className={styles.byline}>by {partner.name}</p> : null}
                {integration.summary ? <p className={styles.summary}>{integration.summary}</p> : null}
                {integration.docsUrl ? (
                  <a
                    href={integration.docsUrl}
                    className={styles.docsLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>How to connect it — Docs</span>
                    <Arrow width={16} stroke="var(--qw-meta)" />
                  </a>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default IntegrationsMarketplace
