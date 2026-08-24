import type { CollectionConfig } from 'payload'
import { uniqueSlugPerTenant } from './hooks/uniqueSlug'
import { audienceVisibility, authenticated } from '../access'
import { audiencesField } from './fields/audiences'
import { allBlocks } from '../blocks'
import { scaffoldFromArchetype } from './hooks/scaffold'
import { setSection, SECTIONS } from './hooks/section'

/**
 * Page archetypes. Each renders a distinct, recognisable layout so a reader can
 * tell what kind of page they are on before reading a word — see
 * `src/components/PageShell`.
 */
export const PAGE_TYPES = [
  { label: 'Standard', value: 'standard' },
  { label: 'Case study', value: 'caseStudy' },
  { label: 'Platform capability (how it works)', value: 'platformCapability' },
  { label: 'Solution — discipline', value: 'solutionDiscipline' },
  { label: 'Solution — industry', value: 'solutionIndustry' },
  { label: 'Solution — regulation', value: 'solutionRegulation' },
  { label: 'Resource hub', value: 'resourceHub' },
  { label: 'Company', value: 'company' },
  { label: 'Legal document', value: 'legal' },
] as const

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    // Section first: it is how an editor narrows a long list.
    defaultColumns: ['title', 'section', 'slug', 'pageType', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
    group: 'Content',
  },
  access: {
    read: audienceVisibility,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  folders: true,
  hooks: {
    // Picking an archetype scaffolds the page, so editors fill in text rather
    // than designing from a blank layout.
    beforeValidate: [scaffoldFromArchetype, setSection, uniqueSlugPerTenant('pages')],
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
          'Full path without a leading slash, e.g. "solutions/nis2". Use "home" for the property root.',
      },
    },
    {
      /*
       * Derived from the slug, never typed. Gives the list view a second axis
       * to filter on — the tenant selector handles the property, this handles
       * where a page sits inside it.
       */
      name: 'section',
      type: 'select',
      options: SECTIONS.map(({ label, value }) => ({ label, value })),
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Set automatically from the slug.',
      },
    },
    audiencesField,
    {
      name: 'pageType',
      type: 'select',
      defaultValue: 'standard',
      options: PAGE_TYPES.map(({ label, value }) => ({ label, value })),
      admin: {
        position: 'sidebar',
        description:
          'Choose this FIRST. On a new page it builds the right blocks in the right order, already styled — you then replace the placeholder text. It also decides the page’s look, so the styling options inside blocks are hidden.',
      },
    },

    // ---------------------------------------------------------------- SEO
    {
      name: 'seo',
      type: 'group',
      admin: { description: 'Search and social metadata' },
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },

    // -------------------------------------------------- E-E-A-T signals
    {
      name: 'authorship',
      type: 'group',
      admin: {
        description:
          'Experience, Expertise, Authoritativeness, Trustworthiness. Who stands behind this page, and when it was last checked.',
      },
      fields: [
        {
          /*
           * A relationship, not free text. Author identity is an entity — one
           * edit updates every page, and the byline resolves to a real person
           * with a photo and a verifiable profile.
           */
          name: 'author',
          type: 'relationship',
          relationTo: 'authors',
          admin: {
            description:
              'Who wrote this. Manage the person in the Authors collection — name, role and credentials all come from there.',
          },
        },
        {
          name: 'reviewer',
          type: 'relationship',
          relationTo: 'authors',
          admin: {
            description:
              'Subject-matter reviewer, shown as "Reviewed by". Required in practice on regulation pages, which carry legal consequence.',
          },
        },
        {
          name: 'lastReviewed',
          type: 'date',
          admin: {
            description: 'Shown on the page. Regulation pages should be re-reviewed regularly.',
            date: { pickerAppearance: 'dayOnly' },
          },
        },
        {
          name: 'experienceNote',
          type: 'textarea',
          admin: {
            description:
              'First-hand experience signal, e.g. "Based on 40+ NIS2 scoping engagements since 2023."',
          },
        },
      ],
    },
    {
      name: 'sources',
      type: 'array',
      admin: {
        description:
          'Citations. Every external claim, regulation reference or analyst statement needs one, with a date.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'publisher', type: 'text' },
        { name: 'url', type: 'text' },
        {
          name: 'date',
          type: 'text',
          admin: { description: 'Publication or access date, e.g. "December 2024"' },
        },
      ],
    },

    // ------------------------------------------------- Archetype extras
    {
      name: 'caseStudy',
      type: 'group',
      admin: { condition: (data) => data?.pageType === 'caseStudy' },
      fields: [
        { name: 'category', type: 'text', admin: { description: 'Eyebrow, e.g. DEFENCE & AEROSPACE' } },
        { name: 'summary', type: 'textarea' },
        {
          name: 'image',
          type: 'group',
          fields: [
            { name: 'media', type: 'upload', relationTo: 'media' },
            { name: 'placeholder', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'regulation',
      type: 'group',
      admin: {
        condition: (data) => data?.pageType === 'solutionRegulation',
        description: 'Buyers arrive with a deadline, not a discipline — lead with the facts.',
      },
      fields: [
        {
          name: 'instrument',
          type: 'text',
          admin: { description: 'Legal instrument, e.g. "Directive (EU) 2022/2555"' },
        },
        { name: 'inForceSince', type: 'text' },
        { name: 'deadline', type: 'text', admin: { description: 'e.g. "17 October 2024"' } },
        { name: 'appliesTo', type: 'textarea', admin: { description: 'Who is in scope' } },
        { name: 'penalty', type: 'text' },
        {
          name: 'requirements',
          type: 'array',
          admin: { description: 'What the regulation requires, and what must be evidenced' },
          fields: [
            { name: 'requirement', type: 'text' },
            { name: 'evidence', type: 'textarea' },
            {
              name: 'article',
              type: 'text',
              admin: { description: 'Article reference, e.g. "Art. 21(2)(a)"' },
            },
          ],
        },
      ],
    },
    {
      name: 'relatedCapabilities',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      admin: {
        description:
          'Solutions pages link *down* into the Platform capability pages that deliver them.',
      },
    },

    {
      name: 'layout',
      type: 'blocks',
      blocks: allBlocks,
      admin: {
        description:
          'Built for you from the archetype. Replace any text in [square brackets]. Add or remove blocks only if the page genuinely needs it — the default order is the argument the page makes.',
      },
    },
  ],
}
