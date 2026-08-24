'use client'

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { Arrow, Chevron } from '../Arrow'
import type { CategoryNode } from '../../lib/docsTree'
import styles from './DocsNav.module.css'

/** Docs home shows six children before the "and more" affordance takes over. */
const HOME_VISIBLE_CHILDREN = 6

const INDENT_STEP = 22
const MAX_INDENT = 44

type Variant = 'home' | 'sidebar'

export type DocsNavProps = {
  nodes: CategoryNode[]
  activeUrl?: string
  variant?: Variant
  /**
   * Prefix for rendered hrefs, e.g. `/docs` in path mode. Node urls stay
   * un-prefixed so they remain the stable keys for open state and active
   * matching — only the link gets the prefix.
   */
  basePath?: string
}

const isOnPath = (url: string, activeUrl?: string): boolean => {
  if (!activeUrl || !url) return false
  return activeUrl === url || activeUrl.startsWith(`${url}/`)
}

/** Every node url that leads to `activeUrl`, so the current article is revealed. */
const collectActivePath = (nodes: CategoryNode[], activeUrl?: string): string[] => {
  if (!activeUrl) return []

  const path: string[] = []
  const walk = (list: CategoryNode[]) => {
    for (const node of list) {
      if (!isOnPath(node.url, activeUrl)) continue
      path.push(node.url)
      walk(node.children)
    }
  }
  walk(nodes)

  return path
}

/**
 * The docs category tree. Nested `<ul>`s with `<button aria-expanded>`
 * disclosures — one consistent pattern, no `role="tree"` mixed in.
 *
 * Scale notes: open/closed state is per node (several may be open at once) and a
 * closed subtree is not rendered at all, so a 150-category tree only ever mounts
 * the rows that are visible.
 */
export const DocsNav = ({ nodes, activeUrl, variant = 'home', basePath = '' }: DocsNavProps) => {
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set<string>())
  const [expandedMore, setExpandedMore] = useState<ReadonlySet<string>>(() => new Set<string>())

  const activePath = useMemo(() => collectActivePath(nodes, activeUrl), [nodes, activeUrl])
  const activePathKey = activePath.join('|')

  /*
   * Only the branch leading to the current article is open; everything else
   * starts closed.
   *
   * Open state is deliberately NOT persisted. It used to live in
   * sessionStorage and be unioned with the active path on every navigation,
   * which meant open nodes accumulated until most of a 47-category tree was
   * expanded and the sidebar was unreadable. Resetting to the active path on
   * each article makes the tree show you where you are.
   */
  useEffect(() => {
    setOpen(new Set<string>(activePathKey.split('|').filter(Boolean)))
  }, [activePathKey])

  const toggle = useCallback((key: string) => {
    setOpen((previous) => {
      const next = new Set(previous)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const showMore = useCallback((key: string) => {
    setExpandedMore((previous) => new Set(previous).add(key))
  }, [])

  if (nodes.length === 0) return null

  return (
    <nav
      className={`${styles.nav} ${variant === 'home' ? styles.home : styles.sidebar}`}
      aria-label="Documentation categories"
    >
      <NodeList
        nodes={nodes}
        level={0}
        variant={variant}
        activeUrl={activeUrl}
        open={open}
        expandedMore={expandedMore}
        onToggle={toggle}
        onShowMore={showMore}
        basePath={basePath}
      />
    </nav>
  )
}

type ListProps = {
  nodes: CategoryNode[]
  level: number
  variant: Variant
  activeUrl?: string
  open: ReadonlySet<string>
  expandedMore: ReadonlySet<string>
  onToggle: (key: string) => void
  onShowMore: (key: string) => void
  basePath: string
}

const NodeList = ({
  nodes,
  level,
  variant,
  activeUrl,
  open,
  expandedMore,
  onToggle,
  onShowMore,
  basePath,
}: ListProps) => (
  <ul className={level === 0 ? styles.rootList : styles.childList}>
    {nodes.map((node) => (
      <NodeRow
        key={node.url || node.id}
        node={node}
        level={level}
        variant={variant}
        activeUrl={activeUrl}
        open={open}
        expandedMore={expandedMore}
        onToggle={onToggle}
        onShowMore={onShowMore}
        basePath={basePath}
      />
    ))}
  </ul>
)

type RowProps = Omit<ListProps, 'nodes'> & { node: CategoryNode }

const NodeRow = ({
  node,
  level,
  variant,
  activeUrl,
  open,
  expandedMore,
  onToggle,
  onShowMore,
  basePath,
}: RowProps) => {
  const children = node.children ?? []
  const hasChildren = children.length > 0
  const isOpen = open.has(node.url)
  const active = isOnPath(node.url, activeUrl)

  // Indent grows 22px per level but stops at 44px so deep trees stay on screen.
  const indent = Math.min(level * INDENT_STEP, MAX_INDENT)
  const indentStyle = { '--qw-nav-indent': `${indent}px` } as CSSProperties

  const count = Number.isFinite(node.articleCount) ? node.articleCount : 0
  const countLabel = variant === 'home' && level === 0 ? `${count} articles` : String(count)

  if (!hasChildren) {
    return (
      <li className={styles.item} style={indentStyle}>
        <Link
          href={node.url ? `${basePath}${node.url}` : '#'}
          className={`${styles.leaf} ${active ? styles.leafActive : ''}`}
          aria-current={active ? 'page' : undefined}
        >
          <Arrow width={18} stroke={active ? 'var(--qw-green)' : 'var(--qw-neon)'} />
          <span className={styles.title}>{node.title}</span>
          {count > 0 ? <span className={styles.count}>{countLabel}</span> : null}
        </Link>
      </li>
    )
  }

  // "… and more subcategories" — the affordance that keeps a 100+ category
  // tenant readable on the docs home without paginating the tree.
  const capped = variant === 'home' && !expandedMore.has(node.url)
  const visible = capped ? children.slice(0, HOME_VISIBLE_CHILDREN) : children
  const hiddenCount = children.length - visible.length

  return (
    <li className={styles.item} style={indentStyle}>
      <button
        type="button"
        className={`${styles.row} ${active ? styles.rowActive : ''}`}
        aria-expanded={isOpen}
        onClick={() => onToggle(node.url)}
      >
        <span className={styles.chevron}>
          <Chevron size={variant === 'home' ? 17 : 15} open={isOpen} stroke="var(--qw-green)" />
        </span>
        <span className={styles.title}>{node.title}</span>
        <span className={styles.count}>{countLabel}</span>
      </button>

      {/* Collapsed subtrees are not rendered — not merely hidden with CSS. */}
      {isOpen ? (
        <div className={styles.children}>
          <NodeList
            nodes={visible}
            level={level + 1}
            variant={variant}
            activeUrl={activeUrl}
            open={open}
            expandedMore={expandedMore}
            onToggle={onToggle}
            onShowMore={onShowMore}
            basePath={basePath}
          />
          {hiddenCount > 0 ? (
            <button type="button" className={styles.more} onClick={() => onShowMore(node.url)}>
              … and {hiddenCount} more {hiddenCount === 1 ? 'subcategory' : 'subcategories'}
            </button>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

export default DocsNav
