import type { CollectionConfig } from 'payload'
import { audienceVisibility, staffOnly } from '../access'
import { audiencesField } from './fields/audiences'
import { uniqueSlugPerTenant } from './hooks/uniqueSlug'

/**
 * Posts — blog articles, webinars, guides and analyst research.
 *
 * Previously these were array items inside a ResourceGrid block: a title, a
 * summary and a link that went nowhere. That made them impossible to open,
 * search, date, attribute to an author, or reuse — a webinar shown on two hub
 * pages was two copies that would drift apart.
 *
 * Deliberately NOT included:
 *
 *   Customer stories — they are long-form with their own layout, and already
 *   exist as Pages with `pageType: 'caseStudy'`. One collection serving two
 *   very different page shapes helps nobody.
 *
 *   Newsletters — a newsletter is a delivery channel, not a content type. Its
 *   contents are links to posts that already exist here, so an archive would be
 *   thin, duplicative pages: bad for readers and actively bad for E-E-A-T. The
 *   signup page is what matters, and that is an ordinary Page.
 */
export const POST_TYPES = [
  { label: 'Blog', value: 'blog' },
  { label: 'Webinar', value: 'webinar' },
  { label: 'Guide or template', value: 'guide' },
  { label: 'Analyst research', value: 'analystResearch' },
] as const

/** URL segment per type, matching the hub page slugs. */
export const POST_TYPE_SEGMENT: Record<string, string> = {
  blog: 'blog',
  webinar: 'webinars',
  guide: 'guides',
  analystResearch: 'analyst-research',
}

export const postPath = (type: string, slug: string): string =>
  `/resources/${POST_TYPE_SEGMENT[type] ?? 'blog'}/${slug}`

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'postType', 'publishedAt', 'author', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'summary'],
    description:
      'Blog articles, webinars, guides and analyst research. Customer stories are Pages, not Posts.',
  },
  access: {
    read: audienceVisibility,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  folders: true,
  defaultSort: '-publishedAt',
  hooks: {
    beforeValidate: [uniqueSlugPerTenant('posts')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'The last part of the URL only, e.g. "who-owns-the-model". The type decides the rest.',
      },
    },
    audiencesField,
    {
      name: 'postType',
      type: 'select',
      required: true,
      defaultValue: 'blog',
      options: POST_TYPES.map(({ label, value }) => ({ label, value })),
      admin: {
        position: 'sidebar',
        description: 'Decides the URL and which hub pages this appears on.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'Sorts the listings. Newest first.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      admin: {
        position: 'sidebar',
        description: 'Shown as the byline. Manage the person in Authors.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'One or two sentences. Shown on every card that links here.' },
    },
    {
      name: 'image',
      type: 'group',
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media' },
        {
          name: 'placeholder',
          type: 'text',
          admin: { description: 'Shot brief, shown while no image is uploaded' },
        },
      ],
    },
    {
      // Type-specific practicalities, only shown where they apply.
      name: 'meta',
      type: 'group',
      admin: { description: 'Practical detail shown on the card' },
      fields: [
        {
          name: 'readTime',
          type: 'text',
          admin: {
            condition: (data) => ['blog', 'guide', 'analystResearch'].includes(data?.postType),
            description: 'e.g. "6 min read"',
          },
        },
        {
          name: 'duration',
          type: 'text',
          admin: {
            condition: (data) => data?.postType === 'webinar',
            description: 'e.g. "45 minutes"',
          },
        },
        {
          name: 'onDemand',
          type: 'checkbox',
          admin: {
            condition: (data) => data?.postType === 'webinar',
            description: 'Already recorded, rather than upcoming',
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Shown large at the top of its hub page. Use sparingly.',
      },
    },
    { name: 'body', type: 'richText' },
  ],
}
