import Link from 'next/link'
import { Arrow } from '../Arrow'
import styles from './PartnerPortalTeaser.module.css'

/**
 * Locked Partner Portal teaser (artboard 1i, ice-blue panel).
 *
 * v1 TEASER ONLY — there is no partner login and no auth behind this in this
 * phase. Nothing here is functional: the SIGN IN button is rendered disabled so
 * it cannot pretend to work, and the secondary link goes to the real
 * /become-a-partner page rather than a fake /portal route. When the gated phase
 * lands, swap the disabled button for a real sign-in link.
 */
export const PartnerPortalTeaser = ({
  eyebrow = 'PARTNER PORTAL',
  heading = 'Deal registration, enablement material and release previews',
  body = 'Sign in with your partner account. Access is granted per tier.',
  requestHref = '/become-a-partner',
  requestLabel = 'Request access',
}: {
  eyebrow?: string
  heading?: string
  body?: string
  requestHref?: string
  requestLabel?: string
} = {}) => (
  <div className={styles.panel}>
    <div>
      <div className={styles.eyebrowRow}>
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true">
          <rect x="1" y="7" width="14" height="10" stroke="var(--qw-green)" strokeWidth="1.6" />
          <path d="M4 7V4.5a4 4 0 018 0V7" stroke="var(--qw-green)" strokeWidth="1.6" />
        </svg>
        <span className={`qw-eyebrow ${styles.eyebrow}`}>{eyebrow}</span>
        <span className={styles.lockedTag}>LOCKED</span>
      </div>
      <p className={styles.heading}>{heading}</p>
      <p className={styles.body}>{body}</p>
    </div>

    <div className={styles.actions}>
      <button
        type="button"
        disabled
        className={`qw-btn qw-btn--solid qw-btn--full ${styles.signIn}`}
      >
        SIGN IN
        <Arrow width={26} stroke="var(--qw-neon)" />
      </button>
      <p className={`qw-small ${styles.note}`}>
        The portal opens in a later phase — there is no partner sign-in yet.
      </p>
      <Link href={requestHref} className={styles.requestLink}>
        {requestLabel}
        <Arrow width={22} stroke="var(--qw-green)" />
      </Link>
    </div>
  </div>
)

export default PartnerPortalTeaser
