'use client'

import { useRouter } from 'next/navigation'
import { Arrow } from '../../../components/Arrow'
import styles from './not-found.module.css'

/**
 * Returns to wherever the reviewer came from.
 *
 * Uses `history.back()` rather than a fixed href, because a dead link can be
 * reached from anywhere and the useful destination is always the page they were
 * just on. Falls back to the property root when there is no history — someone
 * opening the URL directly.
 */
export const BackLink = ({ fallback }: { fallback: string }) => {
  const router = useRouter()

  return (
    <button
      type="button"
      className={styles.backButton}
      onClick={() => {
        if (window.history.length > 1) router.back()
        else window.location.href = fallback
      }}
    >
      Click here to return to the last page
      <Arrow width={30} stroke="var(--qw-green-deep)" strokeWidth={2} />
    </button>
  )
}
