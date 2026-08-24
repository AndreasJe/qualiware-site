import Link from 'next/link'
import { Arrow } from '../../components/Arrow'
import type { GartnerCalloutBlock } from '../../payload-types'
import styles from './GartnerCallout.module.css'

/**
 * Analyst-recognition band on navy (homepage 1a section 4). Copy column left,
 * award cards right; everything stacks on mobile.
 */
export const GartnerCallout = ({
  eyebrow,
  heading,
  lead,
  linkLabel,
  linkHref,
  cards,
  peerInsights,
}: GartnerCalloutBlock) => {
  const awards = (cards ?? []).filter((card) => card.title || card.subtitle || card.meta)
  const peer = peerInsights
  const hasPeer = Boolean(peer?.score || peer?.source || peer?.quote)

  return (
    <section className={styles.section}>
      <div className={`qw-shell ${styles.inner}`}>
        <div className={styles.copy}>
          {eyebrow ? <div className={`qw-eyebrow ${styles.eyebrow}`}>{eyebrow}</div> : null}
          {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}
          {lead ? <p className={`qw-lead ${styles.lead}`}>{lead}</p> : null}
          {linkLabel ? (
            <Link href={linkHref || '#'} className={styles.link}>
              {linkLabel}
              <Arrow width={26} />
            </Link>
          ) : null}
        </div>

        {awards.length > 0 || hasPeer ? (
          <div className={styles.cards}>
            {awards.map((card, index) => (
              <div key={card.id ?? index} className={styles.card}>
                {card.title ? <div className={styles.cardTitle}>{card.title}</div> : null}
                {card.subtitle ? <div className={styles.cardSubtitle}>{card.subtitle}</div> : null}
                {card.meta ? <div className={styles.cardMeta}>{card.meta}</div> : null}
              </div>
            ))}

            {hasPeer ? (
              <div className={`${styles.card} ${styles.peerCard}`}>
                <div className={styles.peerScoreGroup}>
                  {peer?.score ? <div className={styles.cardTitle}>{peer.score}</div> : null}
                  {peer?.source ? <div className={styles.cardSubtitle}>{peer.source}</div> : null}
                </div>
                {peer?.quote ? <blockquote className={styles.peerQuote}>{peer.quote}</blockquote> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default GartnerCallout
