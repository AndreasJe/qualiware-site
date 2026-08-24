import type { CollectionBeforeValidateHook } from 'payload'

/**
 * The sections a page can belong to, in the order they appear in the admin
 * filter. Derived from the slug rather than chosen by hand, so it can never
 * disagree with the URL.
 */
export const SECTIONS = [
  { label: 'Home', value: 'home' },
  { label: 'Platform', value: 'platform' },
  { label: 'Solutions', value: 'solutions' },
  { label: 'Resources', value: 'resources' },
  { label: 'Customers & case studies', value: 'customers' },
  { label: 'Company', value: 'company' },
  { label: 'Legal', value: 'legal' },
  { label: 'Partner programme', value: 'partners' },
  { label: 'Support', value: 'support' },
  { label: 'Other', value: 'other' },
] as const

export type Section = (typeof SECTIONS)[number]['value']

/**
 * Second axis of the page taxonomy.
 *
 * The first axis is the property, which the tenant selector handles. Within a
 * property there is nothing to group by, and the main site is the one that will
 * reach thousands of pages — so `section` gives the list view something to
 * filter and sort on that always matches the URL.
 */
export const deriveSection = (slug: string, pageType?: string | null): Section => {
  const clean = (slug ?? '').replace(/^\/+/, '')
  const top = clean.split('/')[0] ?? ''

  if (clean === 'home' || clean === '') return 'home'
  if (pageType === 'caseStudy') return 'customers'

  switch (top) {
    case 'platform':
    case 'trust':
      return 'platform'
    case 'solutions':
      return 'solutions'
    case 'resources':
      return 'resources'
    case 'customers':
      return 'customers'
    case 'company':
      return 'company'
    case 'legal':
      return 'legal'
    case 'program':
    case 'become-a-partner':
    case 'directory':
    case 'integrations':
      return 'partners'
    default:
      return 'other'
  }
}

/** Kept in step on every save; never edited by hand. */
export const setSection: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) return data

  const slug = (data.slug ?? originalDoc?.slug ?? '') as string
  const pageType = (data.pageType ?? originalDoc?.pageType) as string | undefined

  return { ...data, section: deriveSection(slug, pageType) }
}
