import { headers } from 'next/headers'
import { BackLink } from './BackLink'
import { tenantPath } from '../../../lib/links'
import { isTenantSlug, type TenantSlug } from '../../../lib/tenant'
import styles from './not-found.module.css'

/**
 * The page a dead link lands on.
 *
 * A prototype always has routes that are not built yet. Dimming or disabling
 * those links would make the design look unfinished on every screen, so instead
 * every link stays live and fully styled and the destination says plainly that
 * it is out of scope. A reviewer is never left wondering whether they found a
 * bug.
 *
 * In production the wording drops to an ordinary "page not found", because
 * "doesn't exist in this prototype" would be wrong there.
 */
const PROTOTYPE =
  process.env.NEXT_PUBLIC_PROTOTYPE_MODE === 'true' ||
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'false'

export default async function NotFound() {
  // `not-found` receives no params, so recover the property from the path.
  const headerList = await headers()
  const pathname = headerList.get('x-invoke-path') ?? headerList.get('x-matched-path') ?? ''
  const candidate = pathname.split('/')[1] ?? ''
  const tenant: TenantSlug = isTenantSlug(candidate) ? candidate : 'main'

  return (
    <div className={styles.wrap}>
      <div className={`qw-shell ${styles.shell}`}>
        {PROTOTYPE ? (
          <>
            <h1 className={styles.shout}>
              Doesn’t exist in
              <br />
              this prototype
            </h1>
            <p className={styles.lead}>
              Every link is live and styled so you can click through the real navigation. This
              particular destination isn’t part of the build.
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.shout}>Page not found</h1>
            <p className={styles.lead}>
              The page may have moved, or the link that brought you here may be out of date.
            </p>
          </>
        )}

        <BackLink fallback={tenantPath(tenant, '/')} />
      </div>
    </div>
  )
}
