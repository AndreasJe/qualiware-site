import Link from 'next/link'
import { Arrow } from './Arrow'
import { companyDetails, footerColumns, utilityNav } from '../lib/nav'
import { propertyHref, mainHref, SUPPORT_URL } from '../lib/links'
import type { TenantSlug } from '../lib/tenant'
import styles from './SiteFooter.module.css'

export const SiteFooter = ({ tenant = 'main' }: { tenant?: TenantSlug }) => {
  /** Footer navigation belongs to the main site wherever it is rendered. */
  const main = (href: string) => (href.startsWith('/') ? mainHref(tenant, href) : href)

  return (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.newsletter}>
        <div>
          <div className={styles.newsletterEyebrow}>Newsletter</div>
          <div className={styles.newsletterHeading}>
            Tips, tech news &amp; new insights — delivered to your inbox
          </div>
        </div>
        <form className={styles.subscribeForm} action={main('/api/newsletter')} method="post">
          <label className="qw-sr" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="your.name@company.com"
            className={styles.subscribeInput}
          />
          <button type="submit" className={styles.subscribeButton}>
            Subscribe
            <Arrow width={24} />
          </button>
        </form>
      </div>

      <div className={styles.columns}>
        <div className={styles.brandColumn}>
          <span className={styles.wordmark}>qualiware</span>
          <address className={styles.address}>
            {companyDetails.name}
            <br />
            {companyDetails.address.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </address>
          <div className={styles.address}>
            <a href={`tel:${companyDetails.phone.replace(/\s/g, '')}`}>{companyDetails.phone}</a>
            <br />
            {companyDetails.emails.map((email) => (
              <span key={email}>
                <a href={`mailto:${email}`}>{email}</a>
                <br />
              </span>
            ))}
          </div>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.title} className={styles.linkColumn} aria-label={column.title}>
            <div className={styles.columnTitle}>{column.title}</div>
            {column.links.map((link) => (
              <Link key={link.label} href={main(link.href)} className={styles.footerLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className={styles.customerRow}>
        <span className={styles.customerRowLabel}>For customers &amp; partners</span>
        <Link href={propertyHref('partners')} className={styles.footerLink}>
          Partner program &amp; directory
        </Link>
        <Link href={propertyHref('docs')} className={styles.footerLink}>
          Documentation &amp; wiki
        </Link>
        <Link href={SUPPORT_URL} className={styles.footerLink}>
          Support
        </Link>
        <Link href={main('/sign-in')} className={styles.footerLink}>
          Sign in
        </Link>
      </div>

      <div className={styles.legalRow}>
        <div className={styles.legalText}>{companyDetails.legal}</div>
        <div className={styles.legalLinks}>
          {companyDetails.legalLinks.map((link) => (
            <Link key={link.label} href={main(link.href)} className={styles.footerLink}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile-only condensed utility row, mirroring the desktop customer row. */}
      <div className={styles.mobileUtility}>
        {utilityNav.map((item) => (
          <Link key={item.label} href={main(item.href)} className={styles.mobileUtilityLink}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  </footer>
  )
}

export default SiteFooter
