import Link from 'next/link'
import { RenderBlocks } from '../../blocks/RenderBlocks'
import { Arrow } from '../Arrow'
import { propertyHref } from '../../lib/links'
import { Authorship, Sources } from './Authorship'
import { RegulationFacts } from './RegulationFacts'
import type { Page } from '../../payload-types'
import type { TenantSlug } from '../../lib/tenant'
import styles from './PageShell.module.css'

/**
 * Renders a page in its archetype.
 *
 * Every archetype shares the same block-built body, but each wraps it in
 * different furniture so the page type is recognisable at a glance:
 *
 *   platformCapability — numbered "how it works" rail, hands off to Docs
 *   solutionDiscipline — "what it's for" framing, links *down* into Platform
 *   solutionIndustry   — same skeleton, industry proof
 *   solutionRegulation — instrument/deadline facts and a requirements table first
 *   resourceHub        — listing furniture
 *   company            — editorial, no product CTA
 *   legal              — plain document, no marketing blocks
 *
 * The archetype label in the eyebrow strip is what makes the type legible; the
 * E-E-A-T byline and the sources list are rendered for every archetype that
 * carries them.
 */

const ARCHETYPE_LABELS: Partial<Record<NonNullable<Page['pageType']>, string>> = {
  platformCapability: 'Platform · How it works',
  solutionDiscipline: 'Solution · By discipline',
  solutionIndustry: 'Solution · By industry',
  solutionRegulation: 'Solution · By regulation',
  resourceHub: 'Resources',
  company: 'Company',
  legal: 'Legal',
}

const isObject = (value: unknown): value is Page =>
  typeof value === 'object' && value !== null

export const PageShell = ({ page, tenantSlug }: { page: Page; tenantSlug: TenantSlug }) => {
  const type = page.pageType ?? 'standard'
  const archetypeLabel = ARCHETYPE_LABELS[type]

  const capabilities = (page.relatedCapabilities ?? []).filter(isObject)

  // The legal archetype is deliberately austere: a document, not a landing page.
  if (type === 'legal') {
    return (
      <article className={styles.legal} data-archetype="legal">
        <div className={`qw-section ${styles.legalInner}`}>
          <div className={styles.legalShell}>
            <div className={`qw-eyebrow ${styles.legalEyebrow}`}>Legal</div>
            <h1 className={`qw-h1 ${styles.legalTitle}`}>{page.title}</h1>
            <Authorship authorship={page.authorship} />
            <RenderBlocks blocks={page.layout} tenantSlug={tenantSlug} />
            <Sources sources={page.sources} />
          </div>
        </div>
      </article>
    )
  }

  return (
    <article data-archetype={type}>
      {archetypeLabel && (
        <div className={styles.archetypeStrip} data-archetype={type}>
          <div className={`qw-shell ${styles.archetypeStripInner}`}>
            <span className={styles.archetypeLabel}>{archetypeLabel}</span>
            {type === 'platformCapability' && (
              <span className={styles.archetypeAside}>
                Endpoints and authentication live in{' '}
                <a href={propertyHref('docs')} className={styles.archetypeLink}>
                  Docs
                </a>
              </span>
            )}
            {(type === 'solutionDiscipline' ||
              type === 'solutionIndustry' ||
              type === 'solutionRegulation') && (
              <span className={styles.archetypeAside}>
                What it&rsquo;s for. How it works lives under{' '}
                <Link href="/platform" className={styles.archetypeLink}>
                  Platform
                </Link>
              </span>
            )}
          </div>
        </div>
      )}

      <RegulationFacts regulation={page.regulation} />

      <RenderBlocks blocks={page.layout} tenantSlug={tenantSlug} />

      {/* Solutions pages link down into the Platform pages that deliver them. */}
      {capabilities.length > 0 && (
        <section className={`qw-section ${styles.capabilities}`}>
          <div className="qw-shell">
            <h2 className={`qw-h2 ${styles.capabilitiesHeading}`}>
              The platform capabilities behind this
            </h2>
            <p className={styles.capabilitiesLead}>
              This page explains what the discipline is for. These pages explain the machinery
              that delivers it.
            </p>
            <ul className={styles.capabilityGrid}>
              {capabilities.map((capability) => (
                <li key={capability.id}>
                  <Link
                    href={`/${capability.slug}`}
                    className={`qw-card ${styles.capabilityCard}`}
                  >
                    <span className={styles.capabilityTitle}>{capability.title}</span>
                    <Arrow width={24} stroke="var(--qw-green)" strokeWidth={1.6} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(page.authorship?.author ||
        page.authorship?.lastReviewed ||
        page.authorship?.experienceNote) && (
        <section className={`qw-section ${styles.bylineSection}`}>
          <div className="qw-shell">
            <Authorship authorship={page.authorship} />
          </div>
        </section>
      )}

      <Sources sources={page.sources} />
    </article>
  )
}

export default PageShell
