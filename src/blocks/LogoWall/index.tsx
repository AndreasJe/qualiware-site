import { ImageSlot } from '../../components/ImageSlot'
import type { LogoWallBlock } from '../../payload-types'
import styles from './LogoWall.module.css'

export const LogoWall = ({ label, logos }: LogoWallBlock) => {
  const items = logos ?? []

  if (items.length === 0 && !label) return null

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        {label ? <p className={`qw-eyebrow ${styles.label}`}>{label}</p> : null}

        {items.length > 0 ? (
          <ul className={styles.grid}>
            {items.map((item, index) => (
              <li className={styles.frame} key={item.id ?? `${item.name}-${index}`}>
                <ImageSlot
                  slot={item.logo ?? null}
                  className={styles.slot}
                  alt={item.name ?? ''}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

export default LogoWall
