'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import styles from './DocsTOC.module.css'

export type TOCHeading = { id: string; text: string; level: number }

export type DocsTOCProps = { headings: TOCHeading[] }

const INDENT_STEP = 12
const MAX_INDENT = 24

/**
 * "ON THIS PAGE" right-rail table of contents (artboard 1l). A 2px border track
 * with a neon marker that moves to whichever heading is currently in view.
 * Desktop only — the rail does not exist below 900px.
 */
export const DocsTOC = ({ headings }: DocsTOCProps) => {
  const items = (headings ?? []).filter((heading) => heading?.id && heading?.text)
  const [activeId, setActiveId] = useState<string>('')
  const activeRef = useRef<string>('')

  const keys = items.map((heading) => heading.id).join('|')

  useEffect(() => {
    const ids = keys.split('|').filter(Boolean)
    if (ids.length === 0) return

    // Graceful fallback: the first heading is active until something intersects.
    const fallback = ids[0]
    activeRef.current = fallback
    setActiveId(fallback)

    if (typeof IntersectionObserver === 'undefined') return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }

        // First visible heading in document order wins; if none is intersecting
        // (mid-scroll through a long section) keep the last known heading.
        const next = ids.find((id) => visible.has(id)) ?? activeRef.current ?? fallback
        if (next && next !== activeRef.current) {
          activeRef.current = next
          setActiveId(next)
        }
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 },
    )

    for (const element of elements) observer.observe(element)

    return () => observer.disconnect()
  }, [keys])

  if (items.length === 0) return null

  return (
    <nav className={styles.toc} aria-labelledby="qw-docs-toc-title">
      <div id="qw-docs-toc-title" className={`qw-eyebrow ${styles.eyebrow}`}>
        On this page
      </div>
      <ul className={styles.track}>
        {items.map((heading) => {
          const depth = Math.max(0, (heading.level || 2) - 2)
          const indentStyle = {
            '--qw-toc-indent': `${Math.min(depth * INDENT_STEP, MAX_INDENT)}px`,
          } as CSSProperties
          const active = heading.id === activeId

          return (
            <li key={heading.id} style={indentStyle}>
              <a
                href={`#${heading.id}`}
                className={`${styles.link} ${active ? styles.active : ''}`}
                aria-current={active ? 'location' : undefined}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default DocsTOC
