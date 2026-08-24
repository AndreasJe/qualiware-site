import Link from 'next/link'
import { Arrow } from '../../components/Arrow'
import type { FeatureGridBlock } from '../../payload-types'
import styles from './FeatureGrid.module.css'

/**
 * White four-up feature grid (homepage 1a section 5). Each card carries the
 * 3px dark-green top rule from `.qw-card--feature`.
 */
export const FeatureGrid = ({ eyebrow, heading, features }: FeatureGridBlock) => {
  const items = (features ?? []).filter((item) => item.title || item.description)

  return (
    <section className={styles.section}>
      <div className="qw-shell">
        {eyebrow || heading ? (
          <div className={styles.head}>
            {eyebrow ? <div className={`qw-eyebrow ${styles.eyebrow}`}>{eyebrow}</div> : null}
            {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}
          </div>
        ) : null}

        {items.length > 0 ? (
          <div className={styles.grid}>
            {items.map((item, index) => (
              <article key={item.id ?? index} className={`qw-card qw-card--feature ${styles.card}`}>
                {item.title ? <h3 className={`qw-h3 ${styles.cardTitle}`}>{item.title}</h3> : null}
                {item.description ? <p className={styles.cardText}>{item.description}</p> : null}
                {item.linkLabel ? (
                  <Link href={item.href || '#'} className={styles.cardLink}>
                    {item.linkLabel}
                    <Arrow width={22} stroke="var(--qw-green)" />
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default FeatureGrid
