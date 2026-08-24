import Link from 'next/link'
import { RenderBlocks } from '../../blocks/RenderBlocks'
import { DocsNav } from '../DocsNav'
import { Arrow } from '../Arrow'
import { getDocsTree } from '../../lib/docsTree'
import { tenantPath, tenantBase } from '../../lib/links'
import type { Page } from '../../payload-types'
import styles from './DocsHome.module.css'

/**
 * Docs landing page: the hero comes from the page's blocks, then a split with
 * the collapsible category tree beside the orientation cards.
 *
 * The three side cards are static for this phase. Promote them to blocks if
 * editors need to change them without a deploy.
 */
export const DocsHome = async ({ page }: { page: Page }) => {
  const tree = await getDocsTree('docs')

  return (
    <>
      <RenderBlocks blocks={page.layout} tenantSlug="docs" />

      <section className={`qw-section ${styles.section}`}>
        <div className={`qw-shell ${styles.split}`}>
          <div className={styles.treeColumn}>
            <h2 className={`qw-h2 ${styles.treeHeading}`}>Browse the documentation</h2>
            <p className={styles.treeLead}>
              Every article is open — no login required. {tree.length} top-level sections.
            </p>
            <DocsNav nodes={tree} variant="home" basePath={tenantBase('docs')} />
          </div>

          <aside className={styles.railColumn}>
            <div className={styles.iceCard}>
              <div className={`qw-eyebrow ${styles.cardEyebrow}`}>What&rsquo;s new</div>
              <h3 className={`qw-h3 ${styles.cardTitle}`}>New in 10.10</h3>
              <p className={styles.cardText}>
                Release highlights, upgrade notes and every breaking change, with the full
                changelog.
              </p>
              <Link href={tenantPath('docs', '/release-notes')} className={styles.cardLink}>
                Read the release notes
                <Arrow width={24} stroke="var(--qw-green)" strokeWidth={1.6} />
              </Link>
            </div>

            <div className={styles.card}>
              <div className={`qw-eyebrow ${styles.cardEyebrowGreen}`}>Getting started</div>
              <h3 className={`qw-h3 ${styles.cardTitle}`}>Your first two weeks</h3>
              <ol className={styles.numbered}>
                <li>Get access and sign in to the repository</li>
                <li>Model your first process</li>
                <li>Publish to the web portal</li>
                <li>Invite reviewers and set up governance</li>
              </ol>
              <Link href={tenantPath('docs', '/getting-started')} className={styles.cardLink}>
                Start here
                <Arrow width={24} stroke="var(--qw-green)" strokeWidth={1.6} />
              </Link>
            </div>

            <div className={styles.card}>
              <div className={`qw-eyebrow ${styles.cardEyebrowGreen}`}>Contribute</div>
              <h3 className={`qw-h3 ${styles.cardTitle}`}>This wiki is open</h3>
              <p className={styles.cardText}>
                Spotted something wrong or missing? Suggest an edit on any article and it reaches
                the documentation team directly.
              </p>
              <a href="mailto:docs@qualiware.com" className={styles.cardLink}>
                Suggest an edit
                <Arrow width={24} stroke="var(--qw-green)" strokeWidth={1.6} />
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export default DocsHome
