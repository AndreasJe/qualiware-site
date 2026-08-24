import type { Metadata } from 'next'
import { Arrow } from '../../../../components/Arrow'
import { SignInForm } from './SignInForm'
import { signOutAction } from './actions'
import { getSession, landingFor } from '../../../../lib/session'
import { propertyHref } from '../../../../lib/links'
import styles from './sign-in.module.css'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to QualiWare — one account for customers and partners.',
  robots: { index: false },
}

/**
 * One sign-in for both audiences.
 *
 * Deliberately does not ask "customer or partner". Entitlement is a property of
 * the account, not a question for the visitor, and someone can hold both.
 */
export default async function SignInPage() {
  const session = await getSession()

  if (session) {
    const destination = landingFor(session)

    return (
      <div className={`qw-section ${styles.wrap}`}>
        <div className={`qw-shell ${styles.shell}`}>
          <div className={`qw-eyebrow ${styles.eyebrow}`}>Signed in</div>
          <h1 className={`qw-h1 ${styles.heading}`}>{session.fullName}</h1>
          <p className={styles.lead}>
            {session.organisation ? `${session.organisation} · ` : ''}
            {session.audiences.map(labelFor).join(' and ')}
          </p>

          <div className={styles.panel}>
            <div className={`qw-eyebrow ${styles.panelEyebrow}`}>What this account opens</div>
            <ul className={styles.entitlements}>
              <li>
                <Arrow width={22} stroke="var(--qw-green)" strokeWidth={1.6} />
                <span>
                  Documentation restricted to{' '}
                  {session.audiences.map(labelFor).join(' and ').toLowerCase()}
                </span>
              </li>
              <li>
                <Arrow width={22} stroke="var(--qw-green)" strokeWidth={1.6} />
                <span>
                  Cases raised against{' '}
                  {session.audiences.includes('partner')
                    ? 'the partner account'
                    : 'your organisation’s contract'}
                </span>
              </li>
              {session.audiences.includes('partner') && (
                <li>
                  <Arrow width={22} stroke="var(--qw-green)" strokeWidth={1.6} />
                  <span>The partner programme and directory</span>
                </li>
              )}
            </ul>

            {session.supportTierHint && (
              <p className={styles.tierNote}>
                Support plan shown as <strong>{session.supportTierHint}</strong>. The contract in
                our support desk is authoritative — this is a cached label.
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <a
              href={propertyHref(destination.tenant, destination.path)}
              className={`qw-btn qw-btn--solid ${styles.continue}`}
            >
              Continue
              <Arrow width={26} strokeWidth={1.6} />
            </a>

            <form action={signOutAction}>
              <button type="submit" className={styles.signOut}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`qw-section ${styles.wrap}`}>
      <div className={`qw-shell ${styles.shell}`}>
        <div className={`qw-eyebrow ${styles.eyebrow}`}>Sign in</div>
        <h1 className={`qw-h1 ${styles.heading}`}>One account, everything you are entitled to</h1>
        <p className={`qw-lead ${styles.lead}`}>
          Customers and partners sign in here. We work out what you have access to from your
          account — there is nothing to choose.
        </p>

        <SignInForm />

        <div className={styles.help}>
          <p className={styles.helpText}>
            <strong>No account?</strong> Customer accounts are created by your QualiWare contact.
            Partners get one when the partner agreement is signed.
          </p>
          <p className={styles.helpText}>
            Looking for documentation? It is{' '}
            <a href={propertyHref('docs')} className={styles.helpLink}>
              open without signing in
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

const labelFor = (audience: string) => (audience === 'partner' ? 'Partner' : 'Customer')

export const dynamic = 'force-dynamic'
