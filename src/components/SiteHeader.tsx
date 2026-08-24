'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Arrow, Chevron } from './Arrow'
import {
  megaMenus,
  mobileNavGroups,
  primaryNav,
  subBars,
  utilityNav,
  type MegaMenu,
  type SubBarKey,
} from '../lib/nav'
import { mainHref } from '../lib/links'
import type { TenantSlug } from '../lib/tenant'
import styles from './SiteHeader.module.css'

const OPEN_DELAY = 100
const CLOSE_DELAY = 300

type MenuKey = MegaMenu['key'] | ''

export const SiteHeader = ({
  subBar,
  tenant = 'main',
  session,
}: {
  subBar?: SubBarKey
  /** Signed-in end user, if any. Swaps SIGN IN for their name. */
  session?: { fullName: string; audiences: string[] } | null
  /** Current property. Main-site links must cross back to the main host from here. */
  tenant?: TenantSlug
}) => {
  /** Header nav belongs to the main site wherever it is rendered. */
  const main = (href: string) => (href.startsWith('/') ? mainHref(tenant, href) : href)
  const [openMenu, setOpenMenu] = useState<MenuKey>('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  /** Intent delays prevent flicker when the pointer crosses nav items. */
  const scheduleOpen = useCallback((key: MenuKey) => {
    clearTimer()
    timer.current = setTimeout(() => setOpenMenu(key), OPEN_DELAY)
  }, [])

  const scheduleClose = useCallback(() => {
    clearTimer()
    timer.current = setTimeout(() => setOpenMenu(''), CLOSE_DELAY)
  }, [])

  useEffect(() => clearTimer, [])

  // Escape closes whichever surface is open; focus returns to the trigger.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (openMenu) {
        setOpenMenu('')
        headerRef.current
          ?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${openMenu}"]`)
          ?.focus()
      }
      if (mobileOpen) setMobileOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openMenu, mobileOpen])

  // Lock scroll behind the mobile overlay.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const activeMenu = megaMenus.find((m) => m.key === openMenu)

  return (
    <header className={styles.header} ref={headerRef}>
      {/* ---------- Desktop ---------- */}
      <div className={styles.desktop}>
        <div className={styles.utilityRow}>
          <span className={styles.tagline}>
            Enterprise Architecture, GRC and Digital Twin of an Organization
          </span>
          {utilityNav.map((item) =>
            item.label === 'SIGN IN' && session ? (
              <Link key={item.label} href={main('/sign-in')} className={styles.utilityLink}>
                {session.fullName.split(' ')[0].toUpperCase()}
              </Link>
            ) : (
              <Link key={item.label} href={main(item.href)} className={styles.utilityLink}>
                {item.label}
              </Link>
            ),
          )}
          <span className={styles.utilityLink}>EN</span>
        </div>

        <div className={styles.primaryBar} onMouseLeave={scheduleClose}>
          <Link href={main('/')} className={styles.wordmark}>
            qualiware
          </Link>

          <nav className={styles.nav} aria-label="Main">
            {primaryNav.map((item) =>
              item.menu ? (
                <button
                  key={item.label}
                  type="button"
                  data-menu-trigger={item.menu}
                  className={styles.navItem}
                  aria-expanded={openMenu === item.menu}
                  aria-haspopup="true"
                  onMouseEnter={() => scheduleOpen(item.menu)}
                  onFocus={() => setOpenMenu(item.menu)}
                  onClick={() =>
                    setOpenMenu((cur) => (cur === item.menu ? '' : item.menu))
                  }
                >
                  {item.label}
                  <Chevron open={openMenu === item.menu} />
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={main(item.href)}
                  className={styles.navItem}
                  onMouseEnter={() => scheduleOpen('')}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className={styles.primaryActions}>
            <button type="button" className={styles.searchButton} aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="6" stroke="#4a5a55" strokeWidth="1.6" />
                <path d="M13 13l5 5" stroke="#4a5a55" strokeWidth="1.6" />
              </svg>
            </button>
            <Link href={main('/pricing#demo')} className={`qw-btn qw-btn--solid ${styles.demoButton}`}>
              Book a demo
              <Arrow width={26} strokeWidth={1.6} />
            </Link>
          </div>
        </div>

        {activeMenu && (
          <div
            className={styles.panel}
            data-menu={activeMenu.key}
            onMouseEnter={clearTimer}
            onMouseLeave={scheduleClose}
          >
            <div
              className={styles.panelInner}
              data-columns={activeMenu.groups.length}
            >
              {activeMenu.groups.map((group) => (
                <div key={group.title} className={styles.panelColumn}>
                  <div className={styles.groupTitle}>{group.title}</div>
                  <div
                    className={
                      group.links.some((l) => l.description)
                        ? styles.describedLinks
                        : styles.plainLinks
                    }
                  >
                    {group.links.map((link) => (
                      <Link
                        key={link.label}
                        href={main(link.href)}
                        className={
                          link.description
                            ? styles.describedLink
                            : link.crossProperty
                              ? styles.crossPropertyLink
                              : styles.panelLink
                        }
                      >
                        <span className={link.description ? styles.describedLabel : undefined}>
                          {link.label}
                        </span>
                        {link.crossProperty && (
                          <Arrow width={16} stroke="var(--qw-meta)" strokeWidth={1.8} />
                        )}
                        {link.description && (
                          <span className={styles.describedText}>{link.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Cross-property hand-off, deliberately not a menu item. */}
                  {group.note && (
                    <a href={group.note.href} className={styles.groupNote}>
                      {group.note.text}
                      <Arrow width={16} stroke="var(--qw-meta)" strokeWidth={1.8} />
                    </a>
                  )}
                </div>
              ))}

              {activeMenu.promo && (
                <div
                  className={styles.promo}
                  data-bg={activeMenu.promo.background}
                >
                  <div>
                    <div className={styles.promoEyebrow}>{activeMenu.promo.eyebrow}</div>
                    <div className={styles.promoHeading}>{activeMenu.promo.heading}</div>
                    <p className={styles.promoText}>{activeMenu.promo.text}</p>
                  </div>
                  <Link href={main(activeMenu.promo.href)} className={styles.promoLink}>
                    {activeMenu.promo.linkLabel}
                    <Arrow width={26} stroke="var(--qw-green)" strokeWidth={1.6} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---------- Mobile ---------- */}
      <div className={styles.mobile}>
        <div className={styles.mobileBar}>
          <Link href={main('/')} className={styles.mobileWordmark}>
            qualiware
          </Link>
          <div className={styles.mobileActions}>
            <Link href={main('/pricing#demo')} className={styles.mobileDemo}>
              Demo
            </Link>
            <button
              type="button"
              className={styles.burger}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className={styles.mobilePanel}>
            <div className={styles.mobileSearch}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="6" stroke="#7d8f8a" strokeWidth="1.6" />
                <path d="M13 13l5 5" stroke="#7d8f8a" strokeWidth="1.6" />
              </svg>
              <input
                type="search"
                placeholder="Search qualiware.com"
                className={styles.mobileSearchInput}
              />
            </div>

            {primaryNav.map((item) => {
              const open = openAccordion === item.label
              return (
                <div key={item.label} className={styles.accordionRow}>
                  <button
                    type="button"
                    className={styles.accordionTrigger}
                    aria-expanded={open}
                    onClick={() => setOpenAccordion(open ? '' : item.label)}
                  >
                    <span>{item.label}</span>
                    <span className={styles.accordionSign} aria-hidden="true">
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  {open && (
                    <div className={styles.accordionBody}>
                      {(mobileNavGroups[item.label] ?? []).map((group) => (
                        <div key={group.title} className={styles.accordionGroup}>
                          <div className={styles.accordionGroupTitle}>{group.title}</div>
                          {group.links.map((link) => (
                            <Link
                              key={link.label}
                              href={main(link.href)}
                              className={styles.accordionLink}
                              onClick={() => setMobileOpen(false)}
                            >
                              <Arrow width={18} strokeWidth={1.4} />
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            <div className={styles.mobileUtility}>
              {utilityNav.map((item) => (
                <Link key={item.label} href={main(item.href)} className={styles.mobileUtilityLink}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className={styles.mobileCta}>
              <Link href={main('/pricing#demo')} className="qw-btn qw-btn--solid qw-btn--full">
                Book a demo
                <Arrow width={26} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Property sub-bar ---------- */}
      {subBar && (
        <div className={styles.subBar} style={{ background: subBars[subBar].background }}>
          <span className={styles.subBarLabel}>{subBars[subBar].label}</span>
          <nav className={styles.subBarNav} aria-label={subBars[subBar].label}>
            {/* Sub-bar links stay inside the current property — never rewritten to main. */}
            {subBars[subBar].links.map((link) => (
              <Link key={link.label} href={link.href} className={styles.subBarLink}>
                {link.label}
              </Link>
            ))}
          </nav>
          <span className={styles.subBarDomain}>{subBars[subBar].domain}</span>
        </div>
      )}
    </header>
  )
}
