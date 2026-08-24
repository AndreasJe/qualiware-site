import Link from 'next/link'
import { ImageSlot } from '../../components/ImageSlot'
import type { CaseStudyCardsBlock, Page } from '../../payload-types'
import styles from './CaseStudyCards.module.css'

/**
 * Case-study card row (homepage 1a section 8). Three cards on desktop; mobile
 * shows two, per the handoff note "shows 2 case-study cards".
 *
 * `caseStudies` is a hasMany relationship to pages filtered to
 * `pageType: 'caseStudy'`. Values arrive as `number | Page`, so unpopulated
 * ids are skipped rather than rendered.
 */
export const CaseStudyCards = ({ heading, caseStudies }: CaseStudyCardsBlock) => {
  const pages: Page[] = (caseStudies ?? []).filter(
    (entry): entry is Page => typeof entry === 'object' && entry !== null,
  )

  if (pages.length === 0) return null

  return (
    <section className={styles.section}>
      <div className="qw-shell">
        {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}

        <ul className={styles.grid}>
          {pages.map((page, index) => {
            const cs = page.caseStudy
            return (
              <li
                key={page.id ?? index}
                className={index > 1 ? `${styles.item} ${styles.itemExtra}` : styles.item}
              >
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
          })}
        </ul>
      </div>
    </section>
  )
}

export default CaseStudyCards
