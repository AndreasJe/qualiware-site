'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Arrow } from '../../components/Arrow'
import { ImageSlot } from '../../components/ImageSlot'
import type { ResourceGridBlock } from '../../payload-types'
import styles from './ResourceGrid.module.css'

type ResourceItem = NonNullable<ResourceGridBlock['items']>[number]
type ResourceType = NonNullable<ResourceItem['resourceType']>

/** Chip labels, in the order the handoff lists them (1h). */
const CHIPS: { value: ResourceType; label: string }[] = [
  { value: 'blog', label: 'Blog' },
  { value: 'webinar', label: 'Webinars' },
  { value: 'analyst', label: 'Analyst research' },
  { value: 'story', label: 'Customer stories' },
  { value: 'guide', label: 'Guides' },
  { value: 'newsletter', label: 'Newsletter' },
]

/** Singular label used as the card eyebrow. */
const TYPE_LABEL: Record<ResourceType, string> = {
  blog: 'Blog',
  webinar: 'Webinar',
  analyst: 'Analyst research',
  story: 'Customer story',
  guide: 'Guide',
  newsletter: 'Newsletter',
}

const LINK_LABEL: Record<ResourceType, string> = {
  blog: 'Read the article',
  webinar: 'Save your seat',
  analyst: 'Read the analysis',
  story: 'Read the story',
  guide: 'Read the guide',
  newsletter: 'Subscribe',
}

const linkLabelFor = (type?: ResourceType | null) => (type ? LINK_LABEL[type] : 'Read more')

const typeLabelFor = (type?: ResourceType | null) => (type ? TYPE_LABEL[type] : null)

/** Wraps a card in a link when the item has an href, otherwise a plain box. */
const CardShell = ({
  href,
  className,
  children,
}: {
  href?: string | null
  className: string
  children: React.ReactNode
}) =>
  href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  )

const ArrowRow = ({
  item,
  onIce = false,
}: {
  item: ResourceItem
  onIce?: boolean
}) =>
  item.href ? (
    <span className={onIce ? `${styles.arrowRow} ${styles.arrowRowIce}` : styles.arrowRow}>
      {linkLabelFor(item.resourceType)}
      <Arrow width={26} stroke={onIce ? 'var(--qw-green)' : 'var(--qw-neon)'} />
    </span>
  ) : null

/** Large featured card: image over eyebrow, oversized title, summary, meta. */
const FeaturedCard = ({ item }: { item: ResourceItem }) => {
  const label = typeLabelFor(item.resourceType)

  return (
    <CardShell href={item.href} className={`qw-card ${styles.card} ${styles.featuredCard}`}>
      <ImageSlot slot={item.image} className={styles.featuredImage} />
      <div className={styles.featuredBody}>
        {label ? <div className={styles.eyebrow}>{`${label} · Featured`}</div> : null}
        {item.title ? <h3 className={`qw-h3 ${styles.featuredTitle}`}>{item.title}</h3> : null}
        {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}
        {item.meta ? <div className={styles.meta}>{item.meta}</div> : null}
        <ArrowRow item={item} />
      </div>
    </CardShell>
  )
}

/**
 * Compact card in the column beside the featured item. Webinars sit on ice
 * blue with the meta line (date · time · duration) shown prominently.
 */
const StackCard = ({ item }: { item: ResourceItem }) => {
  const isWebinar = item.resourceType === 'webinar'
  const label = isWebinar ? 'Next webinar' : typeLabelFor(item.resourceType)

  return (
    <CardShell
      href={item.href}
      className={
        isWebinar
          ? `${styles.card} ${styles.stackCard} ${styles.webinarCard}`
          : `qw-card ${styles.card} ${styles.stackCard}`
      }
    >
      {label ? (
        <div className={isWebinar ? `${styles.eyebrow} ${styles.eyebrowIce}` : styles.eyebrow}>
          {label}
        </div>
      ) : null}
      {item.title ? <h3 className={`qw-h3 ${styles.stackTitle}`}>{item.title}</h3> : null}
      {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}
      {item.meta ? (
        <div className={isWebinar ? `${styles.meta} ${styles.webinarMeta}` : styles.meta}>
          {item.meta}
        </div>
      ) : null}
      <ArrowRow item={item} onIce={isWebinar} />
    </CardShell>
  )
}

/** Card in the 3-up grid: type and meta share one eyebrow line. */
const GridCard = ({ item }: { item: ResourceItem }) => {
  const eyebrow = [typeLabelFor(item.resourceType), item.meta].filter(Boolean).join(' · ')

  return (
    <CardShell href={item.href} className={`qw-card ${styles.card} ${styles.gridCard}`}>
      <ImageSlot slot={item.image} className={styles.gridImage} />
      <div className={styles.gridBody}>
        {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}
        {item.title ? <h3 className={`qw-h3 ${styles.gridTitle}`}>{item.title}</h3> : null}
        {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}
        <ArrowRow item={item} />
      </div>
    </CardShell>
  )
}

/**
 * Resources hub listing (1h). Client component because the filter chips own
 * interactive state; filtering is client-side on `resourceType`.
 */
export const ResourceGrid = ({ heading, showFilters, items }: ResourceGridBlock) => {
  const all = useMemo(() => items ?? [], [items])
  const [activeType, setActiveType] = useState<ResourceType | 'all'>('all')

  const chips = useMemo(() => {
    const present = new Set(
      all.map((item) => item.resourceType).filter((type): type is ResourceType => Boolean(type)),
    )
    return CHIPS.filter((chip) => present.has(chip.value))
  }, [all])

  const visible = useMemo(
    () => (activeType === 'all' ? all : all.filter((item) => item.resourceType === activeType)),
    [all, activeType],
  )

  const featured = visible.find((item) => item.featured)
  const others = featured ? visible.filter((item) => item !== featured) : visible
  const stack = featured ? others.filter((item) => !item.featured).slice(0, 3) : []
  const rest = featured ? others.filter((item) => !stack.includes(item)) : visible

  const keyFor = (item: ResourceItem, index: number) => item.id ?? `${item.title ?? 'item'}-${index}`

  return (
    <section className={styles.section}>
      <div className="qw-shell">
        {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}

        {showFilters && chips.length > 0 ? (
          <div className={styles.chips} role="group" aria-label="Filter resources by type">
            <button
              type="button"
              className={activeType === 'all' ? `${styles.chip} ${styles.chipActive}` : styles.chip}
              aria-pressed={activeType === 'all'}
              onClick={() => setActiveType('all')}
            >
              All
            </button>
            {chips.map((chip) => (
              <button
                key={chip.value}
                type="button"
                className={
                  activeType === chip.value ? `${styles.chip} ${styles.chipActive}` : styles.chip
                }
                aria-pressed={activeType === chip.value}
                onClick={() => setActiveType(chip.value)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        ) : null}

        {featured ? (
          <div className={styles.featureRow}>
            <FeaturedCard item={featured} />
            {stack.length > 0 ? (
              <div className={styles.stack}>
                {stack.map((item, index) => (
                  <StackCard key={keyFor(item, index)} item={item} />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {rest.length > 0 ? (
          <div className={styles.grid}>
            {rest.map((item, index) => (
              <GridCard key={keyFor(item, index)} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default ResourceGrid
