import { Arrow } from '../Arrow'
import { HelpCentreSearch } from './HelpCentreSearch'
import { SubmitCaseForm } from './SubmitCaseForm'
import { propertyHref, SUPPORT_URL } from '../../lib/links'
import { isZohoConfigured } from '../../lib/zohoDesk'
import { getSession } from '../../lib/session'
import styles from './SupportHome.module.css'

/**
 * Support home — artboard 1n.
 *
 * The whole page is our own components; Zoho Desk stays the system of record
 * behind them. Help-centre search and case submission call the Desk API on the
 * server (see `src/lib/zohoDesk.ts`); everything else is content.
 *
 * Reading this page requires nothing; submitting a case requires a session. The
 * help centre, response targets and service status are the parts that deflect
 * cases and are worth ranking, so they stay open — gate the action, not the
 * page.
 *
 * Ticket history is still deliberately absent. It needs a per-contact link into
 * Zoho (`accounts.zohoContactId`), and rebuilding Zoho's own views would be the
 * wrong trade. Use their ASAP widget for that one piece when it is needed.
 */

/** Where each kind of request actually gets resolved. */
const COMMON_REQUESTS: { request: string; resolvesIn: string; href: string }[] = [
  {
    request: 'I need a licence key or a new user account',
    resolvesIn: 'Case',
    href: '#submit-a-case',
  },
  {
    request: 'How do I publish a process to the web portal?',
    resolvesIn: 'Docs',
    href: propertyHref('docs', '/publishing-web-portal'),
  },
  {
    request: 'A scheduled publish job did not complete',
    resolvesIn: 'Case',
    href: '#submit-a-case',
  },
  {
    request: 'How do I configure single sign-on?',
    resolvesIn: 'Docs',
    href: propertyHref('docs', '/administration'),
  },
  {
    request: 'We are onboarding a new modelling team',
    resolvesIn: 'Onboarding',
    href: propertyHref('main', '/customers/onboarding'),
  },
  {
    request: 'Is the cloud service degraded right now?',
    resolvesIn: 'Service status',
    href: '#service-status',
  },
]

const RESPONSE_TIMES = [
  { severity: 'Critical', target: '2 hours', note: 'Production down, no workaround' },
  { severity: 'High', target: '1 working day', note: 'Major function impaired' },
  { severity: 'Normal', target: '3 working days', note: 'Questions and requests' },
]

export const SupportHome = async () => {
  /*
   * The page itself is public — help centre, status and response targets all
   * deflect cases and are worth ranking. Only *submitting* needs an account.
   */
  const session = await getSession()

  return (
  <>
    {/* ---------- Hero ---------- */}
    <section className={styles.hero} id="help-centre">
      <div className={`qw-shell ${styles.heroInner}`}>
        <div className={`qw-eyebrow ${styles.heroEyebrow}`}>Support</div>
        <h1 className={`qw-h1-hero ${styles.heroHeading}`}>How can we help?</h1>
        <p className={`qw-lead ${styles.heroLead}`}>
          Search the help centre, check service status, or open a case. Every customer has a
          named support contact — not a queue.
        </p>

        <HelpCentreSearch />
      </div>
    </section>

    {/* ---------- Three routes in ---------- */}
    <section className={`qw-section ${styles.cardsSection}`} id="service-status">
      <div className={`qw-shell ${styles.cardRow}`}>
        <div className={`qw-card ${styles.routeCard}`}>
          <h2 className={`qw-h3 ${styles.routeTitle}`}>Submit a case</h2>
          <p className={styles.routeText}>
            Raise it with the support team. You will get a case number immediately and a named
            engineer, with response targets by severity.
          </p>
          <a href="#submit-a-case" className={styles.routeLink}>
            Open a case
            <Arrow width={24} stroke="var(--qw-green)" strokeWidth={1.6} />
          </a>
        </div>

        <div className={`qw-card ${styles.routeCard}`}>
          <h2 className={`qw-h3 ${styles.routeTitle}`}>Service status</h2>
          <div className={styles.statusRow}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>All cloud regions operational</span>
          </div>
          <p className={styles.routeMeta}>Last incident: 14 March 2026, resolved in 41 minutes.</p>
          <a href="#service-status" className={styles.routeLink}>
            Status history
            <Arrow width={24} stroke="var(--qw-green)" strokeWidth={1.6} />
          </a>
        </div>

        <div className={styles.contactCard}>
          <div className={`qw-eyebrow ${styles.contactEyebrow}`}>Your support contact</div>
          <h2 className={`qw-h3 ${styles.contactTitle}`}>Named, not anonymous</h2>
          <p className={styles.contactText}>
            Every customer has a named contact who knows your deployment. Sign in to see who
            yours is and what is open.
          </p>
          <a href={SUPPORT_URL} className={`qw-btn qw-btn--solid ${styles.contactButton}`}>
            Sign in
            <Arrow width={24} strokeWidth={1.6} />
          </a>
        </div>
      </div>
    </section>

    {/* ---------- Common requests + rail ---------- */}
    <section className={`qw-section ${styles.split}`}>
      <div className={`qw-shell ${styles.splitInner}`}>
        <div className={styles.requestsColumn}>
          <h2 className={`qw-h2 ${styles.sectionHeading}`}>Common requests</h2>
          <p className={styles.sectionLead}>
            Each of these resolves somewhere specific. Going straight there is faster than
            opening a case and being redirected.
          </p>

          <ul className={styles.requestList}>
            {COMMON_REQUESTS.map((item) => (
              <li key={item.request}>
                <a href={item.href} className={styles.requestRow}>
                  <span className={styles.requestText}>{item.request}</span>
                  <span className={styles.requestTag} data-kind={item.resolvesIn}>
                    {item.resolvesIn}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <aside className={styles.rail}>
          <div className={styles.railCard}>
            <div className={`qw-eyebrow ${styles.railEyebrow}`}>Documentation</div>
            <h3 className={`qw-h3 ${styles.railTitle}`}>Most answers are in Docs</h3>
            <p className={styles.railText}>
              How-to articles, admin guides and the full API reference — open, no login required.
            </p>
            <a href={propertyHref('docs')} className={styles.railLink}>
              Go to Docs
              <Arrow width={22} stroke="var(--qw-green)" strokeWidth={1.6} />
            </a>
          </div>

          <div className={styles.railCard}>
            <div className={`qw-eyebrow ${styles.railEyebrow}`}>Community</div>
            <h3 className={`qw-h3 ${styles.railTitle}`}>Center of Excellence</h3>
            <p className={styles.railText}>
              Practitioners solving the same problems, and the people who build the platform.
            </p>
            <a
              href={propertyHref('main', '/resources/center-of-excellence')}
              className={styles.railLink}
            >
              Join the community
              <Arrow width={22} stroke="var(--qw-green)" strokeWidth={1.6} />
            </a>
          </div>

          <div className={styles.responseCard}>
            <div className={`qw-eyebrow ${styles.railEyebrow}`}>Response targets</div>
            <table className={styles.responseTable}>
              <thead>
                <tr>
                  <th scope="col">Severity</th>
                  <th scope="col">First response</th>
                </tr>
              </thead>
              <tbody>
                {RESPONSE_TIMES.map((row) => (
                  <tr key={row.severity}>
                    <th scope="row">
                      {row.severity}
                      <span className={styles.responseNote}>{row.note}</span>
                    </th>
                    <td>{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </div>
    </section>

    {/* ---------- Submit a case ---------- */}
    <section className={`qw-section ${styles.formSection}`} id="submit-a-case">
      <div className={`qw-shell ${styles.formInner}`}>
        <div className={styles.formIntro}>
          <div className={`qw-eyebrow ${styles.formEyebrow}`}>Submit a case</div>
          <h2 className={`qw-h2 ${styles.sectionHeading}`}>Tell us what is happening</h2>
          <p className={styles.sectionLead}>
            Cases go straight into our support desk. You will get a case number by email
            immediately.
          </p>

          <ul className={`qw-arrow-list ${styles.formPoints}`}>
            <li>
              <Arrow width={26} stroke="var(--qw-green)" />
              <span>
                Include your QualiWare version and whether the issue affects production.
              </span>
            </li>
            <li>
              <Arrow width={26} stroke="var(--qw-green)" />
              <span>A screenshot or the exact error text almost always saves a round trip.</span>
            </li>
            <li>
              <Arrow width={26} stroke="var(--qw-green)" />
              <span>Critical means production is down with no workaround.</span>
            </li>
          </ul>

          {!isZohoConfigured() && (
            <p className={styles.integrationNote} role="note">
              <strong>Preview mode.</strong> Zoho Desk credentials are not configured in this
              environment, so submissions are stored locally instead of creating a ticket. Set the
              <code> ZOHO_DESK_*</code> variables to connect the EU desk.
            </p>
          )}
        </div>

        <SubmitCaseForm session={session} />
      </div>
    </section>

    {/* ---------- Non-customers ---------- */}
    <section className={`qw-section ${styles.nonCustomer}`}>
      <div className={`qw-shell ${styles.nonCustomerInner}`}>
        <div>
          <h2 className={`qw-h3 ${styles.nonCustomerHeading}`}>Not a customer yet?</h2>
          <p className={styles.nonCustomerText}>
            Support is for licensed customers. If you are evaluating QualiWare, talk to us
            instead — a demo answers more than a support case will.
          </p>
        </div>
        <a
          href={propertyHref('main', '/pricing#demo')}
          className={`qw-btn qw-btn--solid ${styles.nonCustomerButton}`}
        >
          Book a demo
          <Arrow width={26} strokeWidth={1.6} />
        </a>
      </div>
    </section>
  </>
  )
}

export default SupportHome
