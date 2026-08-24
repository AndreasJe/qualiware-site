import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Arrow } from '../Arrow'
import { ImageSlot } from '../ImageSlot'
import { tenantPath } from '../../lib/links'
import type { Integration, Partner } from '../../payload-types'
import styles from './PartnerProfile.module.css'

const TYPE_LABELS: Record<string, string> = {
  technology: 'Technology / integration partner',
  solution: 'Solution / consulting partner',
}

const REGION_LABELS: Record<string, string> = {
  nordics: 'Nordics',
  europe: 'Europe',
  'north-america': 'North America',
  mea: 'Middle East & Africa',
  apac: 'Asia-Pacific',
  global: 'Global',
}

const INDUSTRY_LABELS: Record<string, string> = {
  'public-sector': 'Public Sector',
  finance: 'Finance',
  defence: 'Defence',
  energy: 'Energy & Utilities',
  manufacturing: 'Manufacturing',
  'life-sciences': 'Life sciences',
  'cross-industry': 'Cross-industry',
}

const label = (map: Record<string, string>, value?: string | null) =>
  value ? (map[value] ?? value) : null

export const PartnerProfile = ({
  partner,
  similar,
}: {
  partner: Partner
  similar: Partner[]
}) => {
  const industries = (partner.industries ?? [])
    .map((value) => label(INDUSTRY_LABELS, value))
    .filter(Boolean) as string[]

  const extensions = (partner.integrations ?? []).filter(
    (entry): entry is Integration => typeof entry === 'object' && entry !== null,
  )

  const glance: { term: string; value: string }[] = [
    { term: 'Partner type', value: label(TYPE_LABELS, partner.partnerType) ?? '—' },
    { term: 'Regions', value: label(REGION_LABELS, partner.region) ?? '—' },
    { term: 'Industries', value: industries.length ? industries.join(', ') : '—' },
  ]
  if (partner.atAGlance?.certifiedConsultants != null) {
    glance.push({
      term: 'Certified consultants',
      value: String(partner.atAGlance.certifiedConsultants),
    })
  }
  if (partner.atAGlance?.partnerSince) {
    glance.push({ term: 'Partner since', value: partner.atAGlance.partnerSince })
  }
  if (partner.atAGlance?.languages) {
    glance.push({ term: 'Languages', value: partner.atAGlance.languages })
  }

  return (
    <>
      <div className={`qw-section ${styles.wrap}`}>
        <div className="qw-shell">
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href={tenantPath('partners')}>Partners</Link>
            <span className={styles.crumbSeparator} aria-hidden="true">
              /
            </span>
            <Link href={tenantPath('partners', '/directory')}>Directory</Link>
            <span className={styles.crumbSeparator} aria-hidden="true">
              /
            </span>
            <span className={styles.crumbCurrent}>{partner.name}</span>
          </nav>

          <div className={styles.split}>
            <div className={styles.main}>
              <div className={styles.identity}>
                <ImageSlot slot={partner.logo} className={styles.logo} />
                {partner.tier && (
                  <span className={styles.tierChip}>{partner.tier} partner</span>
                )}
              </div>

              <h1 className={styles.title}>{partner.name}</h1>
              {partner.blurb && <p className={`qw-lead ${styles.standfirst}`}>{partner.blurb}</p>}

              {partner.description && (
                <section className={styles.section}>
                  <h2 className={`qw-h2 ${styles.sectionHeading}`}>
                    What they do with QualiWare
                  </h2>
                  <div className={styles.prose}>
                    <RichText data={partner.description as never} />
                  </div>
                </section>
              )}

              {Boolean(partner.services?.length) && (
                <section className={styles.section}>
                  <h2 className={`qw-h2 ${styles.sectionHeading}`}>Services</h2>
                  <div className={styles.serviceGrid}>
                    {partner.services?.map((service, i) => (
                      <div key={service.id ?? i} className={`qw-card ${styles.serviceCard}`}>
                        <h3 className={`qw-h3 ${styles.serviceName}`}>{service.name}</h3>
                        {service.scope && <p className={styles.serviceScope}>{service.scope}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {partner.quote?.text && (
                <blockquote className={styles.quote}>
                  <p className={styles.quoteText}>{partner.quote.text}</p>
                  {partner.quote.attribution && (
                    <footer className={styles.quoteAttribution}>
                      {partner.quote.attribution}
                    </footer>
                  )}
                </blockquote>
              )}
            </div>

            <aside className={styles.rail}>
              <div className={styles.glance}>
                <div className={`qw-eyebrow ${styles.glanceTitle}`}>At a glance</div>
                <dl className={styles.glanceList}>
                  {glance.map((row) => (
                    <div key={row.term} className={styles.glanceRow}>
                      <dt className={styles.glanceTerm}>{row.term}</dt>
                      <dd className={styles.glanceValue}>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {partner.contactEmail && (
                <a
                  href={`mailto:${partner.contactEmail}`}
                  className={`qw-btn qw-btn--solid qw-btn--full ${styles.contact}`}
                >
                  Contact this partner
                  <Arrow width={26} strokeWidth={1.6} />
                </a>
              )}

              {partner.website && (
                <a href={partner.website} className={styles.websiteLink} rel="noopener noreferrer">
                  Visit their website
                  <Arrow width={22} stroke="var(--qw-green)" strokeWidth={1.6} />
                </a>
              )}

              {extensions.length > 0 && (
                <div className={styles.extensions}>
                  <div className={`qw-eyebrow ${styles.glanceTitle}`}>
                    Extensions they publish
                  </div>
                  <ul className={styles.extensionList}>
                    {extensions.map((extension) => (
                      <li key={extension.id}>
                        <Link href={tenantPath('partners', '/integrations')} className={styles.extensionLink}>
                          <Arrow width={18} stroke="var(--qw-green)" strokeWidth={1.6} />
                          {extension.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link href={tenantPath('partners', '/directory')} className={styles.backLink}>
                Back to the directory
              </Link>
            </aside>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className={`qw-section ${styles.similar}`}>
          <div className="qw-shell">
            <h2 className={`qw-h2 ${styles.similarHeading}`}>Similar partners</h2>
            <div className={styles.similarGrid}>
              {similar.map((other) => (
                <Link
                  key={other.id}
                  href={tenantPath('partners', `/directory/${other.slug}`)}
                  className={`qw-card ${styles.similarCard}`}
                >
                  <ImageSlot slot={other.logo} className={styles.similarLogo} />
                  <h3 className={`qw-h3 ${styles.similarName}`}>{other.name}</h3>
                  {other.blurb && <p className={styles.similarBlurb}>{other.blurb}</p>}
                  <span className={styles.similarLink}>
                    View profile
                    <Arrow width={22} stroke="var(--qw-green)" strokeWidth={1.6} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default PartnerProfile
