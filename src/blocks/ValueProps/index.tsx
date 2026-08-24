import { Arrow } from '../../components/Arrow'
import { ImageSlot } from '../../components/ImageSlot'
import type { ValuePropsBlock } from '../../payload-types'
import styles from './ValueProps.module.css'

/**
 * Two layouts share one block:
 *
 * - `split` — the editorial split from homepage 1a section 6: tinted ground,
 *   photo beside an arrow-bulleted value list.
 * - `grid` — the same value lines as a compact icon/value grid, no photo.
 */
export const ValueProps = ({
  layout,
  eyebrow,
  heading,
  lead,
  image,
  items,
}: ValuePropsBlock) => {
  const values = (items ?? []).filter((item) => item.title || item.text)
  const isGrid = layout === 'grid'

  const head = (
    <>
      {eyebrow ? <div className={`qw-eyebrow ${styles.eyebrow}`}>{eyebrow}</div> : null}
      {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}
      {lead ? <p className={`qw-lead ${styles.lead}`}>{lead}</p> : null}
    </>
  )

  if (isGrid) {
    return (
      <section className={`${styles.section} ${styles.sectionGrid}`}>
        <div className="qw-shell">
          <div className={styles.gridHead}>{head}</div>
          {values.length > 0 ? (
            <ul className={styles.grid}>
              {values.map((item, index) => (
                <li key={item.id ?? index} className={styles.gridItem}>
                  <Arrow width={22} stroke="var(--qw-green)" />
                  {item.title ? <h3 className={styles.itemTitle}>{item.title}</h3> : null}
                  {item.text ? <p className={styles.itemText}>{item.text}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <section className={`${styles.section} ${styles.sectionSplit}`}>
      <div className={`qw-shell ${styles.split}`}>
        <div className={styles.photo}>
          <ImageSlot slot={image} className={styles.photoImage} />
        </div>
        <div className={styles.copy}>
          {head}
          {values.length > 0 ? (
            <ul className={`qw-arrow-list ${styles.list}`}>
              {values.map((item, index) => (
                <li key={item.id ?? index}>
                  <Arrow width={22} stroke="var(--qw-green)" />
                  <div>
                    {item.title ? <span className={styles.listTitle}>{item.title}</span> : null}
                    {item.text ? <span className={styles.listText}>{item.text}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ValueProps
