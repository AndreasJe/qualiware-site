'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import styles from './DocsSearch.module.css'

export type PopularSearch = { label: string; href: string }

export type DocsSearchProps = {
  variant?: 'hero' | 'compact'
  /** Where the form submits. Supply a tenant-prefixed path in path mode. */
  action?: string
  /** Defaults to the copy from the artboard for the given variant. */
  placeholder?: string
  /** Visible only to assistive tech — the design hides the label in both variants. */
  label?: string
  defaultValue?: string
  /** Hero only: the "Popular:" links under the field. */
  popularSearches?: PopularSearch[]
}

const MagnifierIcon = ({ stroke }: { stroke: string }) => (
  <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="8.5" cy="8.5" r="6" stroke={stroke} strokeWidth="1.8" />
    <path d="M13 13l5 5" stroke={stroke} strokeWidth="1.8" />
  </svg>
)

/**
 * Docs search. No client-side index — the form submits to `/search` with `q`,
 * so results are a real, shareable URL.
 *
 * `hero` is the large field on the dark-green docs home hero (1k), with the neon
 * submit button. `compact` is the small field above the sidebar tree (1l).
 */
export const DocsSearch = ({
  variant = 'hero',
  action = '/search',
  placeholder,
  label,
  defaultValue = '',
  popularSearches,
}: DocsSearchProps) => {
  const inputId = useId()
  const [value, setValue] = useState(defaultValue)

  const hero = variant === 'hero'
  const fieldPlaceholder =
    placeholder ?? (hero ? 'Search 600+ articles — try “publish a process”' : 'Search docs')
  const fieldLabel = label ?? 'Search the documentation'
  const popular = (popularSearches ?? []).filter((item) => item?.label && item?.href)

  return (
    <div className={`${styles.wrap} ${hero ? styles.hero : styles.compact}`}>
      <form className={styles.form} method="get" action={action} role="search">
        <label className="qw-sr" htmlFor={inputId}>
          {fieldLabel}
        </label>
        <input
          id={inputId}
          className={styles.input}
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={fieldPlaceholder}
          autoComplete="off"
        />
        <button type="submit" className={styles.submit}>
          <MagnifierIcon stroke={hero ? 'var(--qw-green-deep)' : 'var(--qw-green)'} />
          <span className="qw-sr">Search</span>
        </button>
      </form>

      {hero && popular.length > 0 ? (
        <div className={styles.popular}>
          <span className={styles.popularLabel}>Popular:</span>
          {popular.map((item) => (
            <Link key={item.href} href={item.href} className={styles.popularLink}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default DocsSearch
