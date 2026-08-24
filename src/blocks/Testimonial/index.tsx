import { ImageSlot } from '../../components/ImageSlot'
import type { TestimonialBlock } from '../../payload-types'
import styles from './Testimonial.module.css'

/** The quote glyph, inline above the quote at its natural size, per artboard 1a. */
const QuoteGlyph = () => (
  <svg
    className={styles.watermark}
    width="46"
    height="34"
    viewBox="0 0 46 34"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M0 34V18C0 8 6 2 18 0v8c-6 1-9 4-9 10h9v16H0zm26 0V18C26 8 32 2 44 0v8c-6 1-9 4-9 10h9v16H26z"
      fill="var(--qw-green)"
      opacity="0.35"
    />
  </svg>
)

/** Play control laid over the video still. Decorative — the still is a slot. */
const PlayOverlay = () => (
  <span className={styles.play} aria-hidden="true">
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path d="M0 0l18 10L0 20z" fill="var(--qw-white)" />
    </svg>
  </span>
)

/**
 * Ice-blue watermarked quote panel (homepage 1a section 7). The watermark is
 * clipped inside the panel and sits behind the top of the quote at low
 * contrast, so it never collides with the text.
 */
export const Testimonial = ({
  quote,
  name,
  role,
  org,
  portrait,
  videoStill,
}: TestimonialBlock) => {
  const attribution = [role, org].filter(Boolean).join(', ')
  const hasAttribution = Boolean(name || attribution)

  return (
    <section className={styles.section}>
      <div className={`qw-shell ${styles.inner}`}>
        <figure className={styles.panel}>
          <QuoteGlyph />
          <blockquote className={styles.quote}>{quote}</blockquote>

          {hasAttribution ? (
            <figcaption className={styles.attribution}>
              <div className={styles.portrait}>
                <ImageSlot slot={portrait} className={styles.portraitImage} alt={name ?? ''} />
              </div>
              <div>
                {name ? <div className={styles.name}>{name}</div> : null}
                {attribution ? <div className={styles.role}>{attribution}</div> : null}
              </div>
            </figcaption>
          ) : null}
        </figure>

        <div className={styles.video}>
          <ImageSlot slot={videoStill} className={styles.videoImage} />
          <PlayOverlay />
        </div>
      </div>
    </section>
  )
}

export default Testimonial
