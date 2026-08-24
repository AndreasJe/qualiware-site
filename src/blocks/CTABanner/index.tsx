import Link from 'next/link'
import { Arrow } from '../../components/Arrow'
import type { CTABannerBlock } from '../../payload-types'
import styles from './CTABanner.module.css'

type Background = NonNullable<CTABannerBlock['background']>

const groundClass: Record<Background, string> = {
  iceBlue: styles.iceBlue,
  darkGreen: styles.darkGreen,
  tinted: styles.tinted,
}

export const CTABanner = ({
  background,
  heading,
  text,
  ctaLabel,
  ctaHref,
}: CTABannerBlock) => {
  const ground: Background = background ?? 'iceBlue'
  const onDark = ground === 'darkGreen'

  // On dark green the button is the neon fill with a deep-green arrow; on the
  // two light grounds it is the dark-green fill with a neon arrow.
  const buttonClass = onDark ? 'qw-btn--neon' : 'qw-btn--solid'
  const arrowStroke = onDark ? 'var(--qw-green-deep)' : 'var(--qw-neon)'

  if (!heading && !text && !ctaLabel) return null

  return (
    <section className={`${styles.root} ${groundClass[ground]}`}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}
          {text ? <p className={`qw-lead ${styles.text}`}>{text}</p> : null}
        </div>

        {ctaLabel ? (
          <Link href={ctaHref ?? '#'} className={`qw-btn ${buttonClass} ${styles.cta}`}>
            {ctaLabel}
            <Arrow width={26} stroke={arrowStroke} />
          </Link>
        ) : null}
      </div>
    </section>
  )
}

export default CTABanner
