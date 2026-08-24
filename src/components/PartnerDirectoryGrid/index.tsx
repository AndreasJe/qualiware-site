'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Arrow } from '../Arrow'
import { ImageSlot } from '../ImageSlot'
import { tenantPath } from '../../lib/links'
import type { Partner } from '../../payload-types'
import styles from './PartnerDirectoryGrid.module.css'

const ALL = 'All'

/** URL parameter names — filter state is reflected here so results are shareable. */
const PARAM_TYPE = 'type'
const PARAM_REGION = 'region'
const PARAM_INDUSTRY = 'industry'
const PARAM_QUERY = 'q'

/**
 * Canonical presentation order and labels, taken from the collection option
 * lists. Which of these actually appear as chips is derived from the partner
 * records passed in — never hardcoded — so the filters stay correct as records
 * are added or removed. These maps only decide order and wording.
 */
const TYPE_LABELS: Record<string, string> = {
  technology: 'Technology',
  solution: 'Implementation',
}

const REGION_LABELS: Record<string, string> = {
  nordics: 'Nordics',
  europe: 'Europe',
  'north-america': 'North America',
  mea: 'Middle East & Africa',
  apac: 'Asia-Pacific',
  global: 'Global',
}

const INDUSTRY_LABELS: Record<string, string> = {
  'public-sector': 'Public Sector',
  finance: 'Finance',
  defence: 'Defence',
  energy: 'Energy & Utilities',
  manufacturing: 'Manufacturing',
  'life-sciences': 'Life sciences',
  'cross-industry': 'Cross-industry',
}

const TIER_LABELS: Record<string, string> = {
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
}

/** Directory order: highest tier first, then alphabetical. */
const TIER_RANK: Record<string, number> = { platinum: 0, gold: 1, silver: 2 }

type FilterKey = typeof PARAM_TYPE | typeof PARAM_REGION | typeof PARAM_INDUSTRY

type Filters = Record<FilterKey, string> & { [PARAM_QUERY]: string }

type Option = { value: string; label: string }

type ParamReader = { get: (key: string) => string | null }

const readFilters = (params: ParamReader): Filters => ({
  [PARAM_TYPE]: params.get(PARAM_TYPE) || ALL,
  [PARAM_REGION]: params.get(PARAM_REGION) || ALL,
  [PARAM_INDUSTRY]: params.get(PARAM_INDUSTRY) || ALL,
  [PARAM_QUERY]: params.get(PARAM_QUERY) || '',
})

const EMPTY_FILTERS: Filters = {
  [PARAM_TYPE]: ALL,
  [PARAM_REGION]: ALL,
  [PARAM_INDUSTRY]: ALL,
  [PARAM_QUERY]: '',
}

/** Options present in the data, ordered by the canonical label map. */
const deriveOptions = (present: Set<string>, labels: Record<string, string>): Option[] => {
  const known = Object.keys(labels)
    .filter((value) => present.has(value))
    .map((value) => ({ value, label: labels[value] }))

  // Anything in the data that the label map does not know about still gets a chip.
  const extra = [...present]
    .filter((value) => !(value in labels))
    .sort()
    .map((value) => ({ value, label: value }))

  return [...known, ...extra]
}

const label = (labels: Record<string, string>, value?: string | null) =>
  value ? labels[value] || value : null

/**
 * Partner directory with filters (artboard 1j).
 *
 * Three independent single-select filters — type, region, industry — each
 * defaulting to "All"; results are the AND of all three. Filter state lives in
 * the URL so a filtered view can be shared.
 *
 * Initial filter state arrives as a prop read from `searchParams` on the
 * server, rather than from `useSearchParams()`. That hook would force this
 * component to suspend, and a suspended boundary on a dynamic route gets
 * postponed — the streamed markup parks in a hidden container and never moves
 * into place. Props avoid the boundary altogether.
 *
 * Desktop (>= 900px): a 280px filter rail beside the results grid.
 * Below 900px: a search field plus a FILTER button that opens a drawer holding
 * the same three chip groups — not a reflowed rail. Chips apply immediately;
 * SHOW RESULTS only closes the drawer.
 */
export const PartnerDirectoryGrid = ({
  partners,
  initialFilters,
}: {
  partners: Partner[]
  /** Raw query values from the server, e.g. `{ type: 'technology' }`. */
  initialFilters?: Record<string, string | undefined>
}) => {
  const router = useRouter()
  const pathname = usePathname()

  const paramsKey = useMemo(() => {
    const params = new URLSearchParams()
    for (const key of [PARAM_TYPE, PARAM_REGION, PARAM_INDUSTRY, PARAM_QUERY]) {
      const value = initialFilters?.[key]
      if (value) params.set(key, value)
    }
    return params.toString()
  }, [initialFilters])

  const [filters, setFilters] = useState<Filters>(() =>
    readFilters({ get: (key) => initialFilters?.[key] ?? null }),
  )
  const [drawerOpen, setDrawerOpen] = useState(false)

  /** The query string this component wrote most recently, to tell our own
   *  navigations apart from back/forward navigation. */
  const lastWritten = useRef<string | null>(null)
  const filterButtonRef = useRef<HTMLButtonElement | null>(null)
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null)

  // Adopt filter state coming from the URL (initial load, shared link, back button).
  useEffect(() => {
    if (lastWritten.current === paramsKey) return
    lastWritten.current = null
    setFilters(readFilters(new URLSearchParams(paramsKey)))
  }, [paramsKey])

  const apply = useCallback(
    (next: Filters) => {
      setFilters(next)

      const params = new URLSearchParams()
      if (next[PARAM_TYPE] !== ALL) params.set(PARAM_TYPE, next[PARAM_TYPE])
      if (next[PARAM_REGION] !== ALL) params.set(PARAM_REGION, next[PARAM_REGION])
      if (next[PARAM_INDUSTRY] !== ALL) params.set(PARAM_INDUSTRY, next[PARAM_INDUSTRY])
      if (next[PARAM_QUERY]) params.set(PARAM_QUERY, next[PARAM_QUERY])

      const qs = params.toString()
      lastWritten.current = qs
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router],
  )

  const pick = useCallback(
    (key: FilterKey, value: string) => apply({ ...filters, [key]: value }),
    [apply, filters],
  )

  const reset = useCallback(() => apply(EMPTY_FILTERS), [apply])

  // ---------- Options, derived from the records actually present ----------
  const options = useMemo(() => {
    const types = new Set<string>()
    const regions = new Set<string>()
    const industries = new Set<string>()

    for (const partner of partners) {
      if (partner.partnerType) types.add(partner.partnerType)
      if (partner.region) regions.add(partner.region)
      for (const industry of partner.industries ?? []) {
        if (industry) industries.add(industry)
      }
    }

    return {
      [PARAM_TYPE]: deriveOptions(types, TYPE_LABELS),
      [PARAM_REGION]: deriveOptions(regions, REGION_LABELS),
      [PARAM_INDUSTRY]: deriveOptions(industries, INDUSTRY_LABELS),
    }
  }, [partners])

  // ---------- Results: the AND of all three filters ----------
  const results = useMemo(() => {
    const needle = filters[PARAM_QUERY].trim().toLowerCase()

    const matched = partners.filter((partner) => {
      if (filters[PARAM_TYPE] !== ALL && partner.partnerType !== filters[PARAM_TYPE]) return false
      if (filters[PARAM_REGION] !== ALL && partner.region !== filters[PARAM_REGION]) return false
      if (
        filters[PARAM_INDUSTRY] !== ALL &&
        !(partner.industries ?? []).includes(
          filters[PARAM_INDUSTRY] as NonNullable<Partner['industries']>[number],
        )
      ) {
        return false
      }
      if (needle) {
        const haystack = `${partner.name} ${partner.blurb ?? ''} ${
          label(REGION_LABELS, partner.region) ?? ''
        }`.toLowerCase()
        if (!haystack.includes(needle)) return false
      }
      return true
    })

    return [...matched].sort((a, b) => {
      const rankA = a.tier ? TIER_RANK[a.tier] ?? 9 : 9
      const rankB = b.tier ? TIER_RANK[b.tier] ?? 9 : 9
      if (rankA !== rankB) return rankA - rankB
      return a.name.localeCompare(b.name)
    })
  }, [filters, partners])

  const countLine = `${results.length} of ${partners.length} ${
    partners.length === 1 ? 'partner' : 'partners'
  }`

  // ---------- Drawer: escape to close, focus in on open, body scroll lock ----------
  useEffect(() => {
    if (!drawerOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    drawerCloseRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [drawerOpen])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    filterButtonRef.current?.focus()
  }, [])

  const renderGroup = (key: FilterKey, groupLabel: string, idPrefix: string) => {
    const groupId = `${idPrefix}-${key}`
    return (
      <div className={styles.group} role="group" aria-labelledby={groupId}>
        <div className={styles.groupTitle} id={groupId}>
          {groupLabel}
        </div>
        <div className={styles.chips}>
          <button
            type="button"
            className={filters[key] === ALL ? `${styles.chip} ${styles.chipActive}` : styles.chip}
            aria-pressed={filters[key] === ALL}
            onClick={() => pick(key, ALL)}
          >
            {ALL}
          </button>
          {options[key].map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                filters[key] === option.value ? `${styles.chip} ${styles.chipActive}` : styles.chip
              }
              aria-pressed={filters[key] === option.value}
              onClick={() => pick(key, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className={`qw-section ${styles.section}`}>
      <div className={`qw-shell ${styles.layout}`}>
        {/* ---------- Desktop (>= 900px): 280px filter rail ---------- */}
        <div className={styles.rail}>
          <div className={styles.railHead}>
            <span className={styles.railTitle}>FILTERS</span>
            <button type="button" className={styles.resetLink} onClick={reset}>
              Reset
            </button>
          </div>
          {renderGroup(PARAM_TYPE, 'Partner type', 'rail')}
          {renderGroup(PARAM_REGION, 'Region', 'rail')}
          {renderGroup(PARAM_INDUSTRY, 'Industry', 'rail')}
        </div>

        <div className={styles.results}>
          {/* ---------- Below 900px: search field + FILTER button ---------- */}
          <div className={styles.mobileBar}>
            <label className="qw-sr" htmlFor="partner-directory-search">
              Search partners
            </label>
            <input
              id="partner-directory-search"
              type="search"
              className={styles.search}
              placeholder="Search partners"
              value={filters[PARAM_QUERY]}
              onChange={(event) => apply({ ...filters, [PARAM_QUERY]: event.target.value })}
            />
            <button
              type="button"
              ref={filterButtonRef}
              className={styles.filterButton}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
                <path d="M0 2h16M3 7h10M6 12h4" stroke="var(--qw-neon)" strokeWidth="1.8" />
              </svg>
              FILTER
            </button>
          </div>

          <div className={styles.countRow}>
            <span className={styles.count} aria-live="polite">
              {countLine}
            </span>
            <span className={styles.sorted}>Sorted by tier</span>
          </div>

          {results.length > 0 ? (
            <ul className={styles.grid}>
              {results.map((partner) => {
                const meta = [
                  label(TYPE_LABELS, partner.partnerType),
                  label(REGION_LABELS, partner.region),
                  (partner.industries ?? [])
                    .map((industry) => label(INDUSTRY_LABELS, industry))
                    .filter(Boolean)
                    .join(', ') || null,
                ].filter(Boolean)

                return (
                  <li key={partner.id} className={`qw-card ${styles.card}`}>
                    <div className={styles.cardTop}>
                      <ImageSlot
                        slot={{
                          media: partner.logo?.media,
                          placeholder: partner.logo?.placeholder || 'LOGO',
                        }}
                        className={styles.logo}
                        alt={partner.name}
                      />
                      {partner.tier ? (
                        <span className={styles.tierChip}>
                          {(TIER_LABELS[partner.tier] || partner.tier).toUpperCase()}
                        </span>
                      ) : null}
                    </div>
                    <h3 className={`qw-h3 ${styles.cardName}`}>{partner.name}</h3>
                    {meta.length > 0 ? <p className={styles.cardMeta}>{meta.join(' · ')}</p> : null}
                    {partner.blurb ? <p className={styles.cardBlurb}>{partner.blurb}</p> : null}
                    <Link href={tenantPath('partners', `/directory/${partner.slug}`)} className={styles.profileLink}>
                      View profile
                      <Arrow width={22} />
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>No partners match these filters.</p>
              <button type="button" className={styles.resetLink} onClick={reset}>
                Reset the filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Below 900px: the filter drawer, not a reflowed rail ---------- */}
      {drawerOpen ? (
        <div className={styles.drawerRoot}>
          <div className={styles.drawerBackdrop} onClick={closeDrawer} aria-hidden="true" />
          <div
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-filter-drawer-title"
          >
            <div className={styles.drawerHead}>
              <span className={styles.drawerTitle} id="partner-filter-drawer-title">
                Filter partners
              </span>
              <button
                type="button"
                ref={drawerCloseRef}
                className={styles.drawerClose}
                onClick={closeDrawer}
              >
                <span aria-hidden="true">×</span>
                <span className="qw-sr">Close filters</span>
              </button>
            </div>

            <div className={styles.drawerBody}>
              {renderGroup(PARAM_TYPE, 'Partner type', 'drawer')}
              {renderGroup(PARAM_REGION, 'Region', 'drawer')}
              {renderGroup(PARAM_INDUSTRY, 'Industry', 'drawer')}
            </div>

            {/* Filters are already applied — SHOW RESULTS only closes the drawer. */}
            <div className={styles.drawerFooter}>
              <button
                type="button"
                className={`qw-btn qw-btn--outline-green ${styles.drawerAction}`}
                onClick={reset}
              >
                RESET
              </button>
              <button
                type="button"
                className={`qw-btn qw-btn--solid ${styles.drawerAction}`}
                onClick={closeDrawer}
              >
                SHOW RESULTS
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default PartnerDirectoryGrid
