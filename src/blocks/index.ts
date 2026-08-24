import type { Block, Field } from 'payload'
import { GOVERNED_TYPES } from './archetypes'

/**
 * Design knobs — hero variant, CTA background, layout mode — are hidden on
 * archetype pages. The archetype owns how it looks, and an editor picking
 * `navy` on a Solutions page would simply be making it wrong. On free-form
 * `standard` pages the knob stays available.
 */
const governed = {
  condition: (data: { pageType?: string | null }) =>
    !GOVERNED_TYPES.includes((data?.pageType ?? 'standard') as never),
}

const link = (name = 'href'): Field => ({ name, type: 'text' })

/** Every image slot pairs an upload with a placeholder brief, per the design handoff. */
const imageSlot = (name = 'image'): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'media', type: 'upload', relationTo: 'media' },
    {
      name: 'placeholder',
      type: 'text',
      admin: { description: 'Shot brief shown while no image is uploaded' },
    },
  ],
})

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'darkGreen',
      admin: governed,
      options: [
        { label: 'Dark green', value: 'darkGreen' },
        { label: 'Ice blue', value: 'iceBlue' },
        { label: 'Navy', value: 'navy' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'lead', type: 'textarea' },
    {
      name: 'ctas',
      type: 'array',
      maxRows: 2,
      fields: [
        { name: 'label', type: 'text' },
        link(),
        {
          name: 'style',
          type: 'select',
          defaultValue: 'neon',
          options: [
            { label: 'Neon fill', value: 'neon' },
            { label: 'Outlined', value: 'outline' },
            { label: 'Dark green fill', value: 'solid' },
          ],
        },
      ],
    },
    { name: 'showProductPanel', type: 'checkbox', defaultValue: false, admin: { description: 'Animated platform mock panel (homepage hero)' } },
    { name: 'showConstellation', type: 'checkbox', defaultValue: false },
    { name: 'showScrollCue', type: 'checkbox', defaultValue: false },
    { name: 'showSearch', type: 'checkbox', defaultValue: false, admin: { description: 'Large search field (docs / resources hero)' } },
    { name: 'searchPlaceholder', type: 'text' },
    { name: 'popularSearches', type: 'array', fields: [{ name: 'label', type: 'text' }, link()] },
    {
      name: 'stats',
      type: 'array',
      admin: { description: 'Ice-blue proof band rendered under the hero' },
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
  ],
}

export const LogoWall: Block = {
  slug: 'logoWall',
  interfaceName: 'LogoWallBlock',
  fields: [
    { name: 'label', type: 'text', defaultValue: 'TRUSTED BY ORGANIZATIONS THAT CANNOT AFFORD TO GUESS' },
    {
      name: 'logos',
      type: 'array',
      fields: [{ name: 'name', type: 'text' }, imageSlot('logo')],
    },
  ],
}

export const GartnerCallout: Block = {
  slug: 'gartnerCallout',
  interfaceName: 'GartnerCalloutBlock',
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'ANALYST RECOGNITION' },
    { name: 'heading', type: 'text' },
    { name: 'lead', type: 'textarea' },
    { name: 'linkLabel', type: 'text' },
    link('linkHref'),
    {
      name: 'cards',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'subtitle', type: 'text' },
        { name: 'meta', type: 'text' },
      ],
    },
    {
      name: 'peerInsights',
      type: 'group',
      fields: [
        { name: 'score', type: 'text' },
        { name: 'source', type: 'text' },
        { name: 'quote', type: 'textarea' },
      ],
    },
  ],
}

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'features',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'linkLabel', type: 'text' },
        link(),
      ],
    },
  ],
}

export const ValuePropsIconGrid: Block = {
  slug: 'valueProps',
  interfaceName: 'ValuePropsBlock',
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'split',
      admin: governed,
      options: [
        { label: 'Editorial split (image + arrow bullets)', value: 'split' },
        { label: 'Icon grid', value: 'grid' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'lead', type: 'textarea' },
    imageSlot(),
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'text', type: 'textarea' },
      ],
    },
  ],
}

export const TestimonialQuote: Block = {
  slug: 'testimonial',
  interfaceName: 'TestimonialBlock',
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'name', type: 'text' },
    { name: 'role', type: 'text' },
    { name: 'org', type: 'text' },
    imageSlot('portrait'),
    imageSlot('videoStill'),
  ],
}

export const CaseStudyCard: Block = {
  slug: 'caseStudyCards',
  interfaceName: 'CaseStudyCardsBlock',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      filterOptions: { pageType: { equals: 'caseStudy' } },
    },
  ],
}

export const CaseStudyArchive: Block = {
  slug: 'caseStudyArchive',
  interfaceName: 'CaseStudyArchiveBlock',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'lead', type: 'textarea' },
  ],
}

export const ComparisonTable: Block = {
  slug: 'comparisonTable',
  interfaceName: 'ComparisonTableBlock',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'lead', type: 'textarea' },
    { name: 'note', type: 'textarea', admin: { description: 'Italic sourcing note under the table' } },
    {
      name: 'vendors',
      type: 'array',
      admin: { description: 'First vendor with "highlighted" is rendered as the QualiWare column' },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'highlighted', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      fields: [
        { name: 'capability', type: 'text' },
        {
          name: 'cells',
          type: 'array',
          admin: { description: 'One cell per vendor, in vendor order' },
          fields: [{ name: 'value', type: 'text' }],
        },
      ],
    },
  ],
}

export const PricingTable: Block = {
  slug: 'pricingTable',
  interfaceName: 'PricingTableBlock',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'lead', type: 'textarea' },
    { name: 'note', type: 'textarea' },
    {
      name: 'tiers',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'emphasized', type: 'checkbox', defaultValue: false },
        { name: 'tabLabel', type: 'text', admin: { description: 'e.g. MOST CHOSEN — shown on the emphasized card' } },
        { name: 'features', type: 'array', fields: [{ name: 'text', type: 'text' }] },
        { name: 'ctaLabel', type: 'text', defaultValue: 'CONTACT SALES' },
        link('ctaHref'),
      ],
    },
  ],
}

export const CTABanner: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CTABannerBlock',
  fields: [
    {
      name: 'background',
      type: 'select',
      defaultValue: 'iceBlue',
      admin: governed,
      options: [
        { label: 'Ice blue', value: 'iceBlue' },
        { label: 'Dark green', value: 'darkGreen' },
        { label: 'Tinted', value: 'tinted' },
      ],
    },
    { name: 'heading', type: 'text' },
    { name: 'text', type: 'textarea' },
    { name: 'ctaLabel', type: 'text' },
    link('ctaHref'),
  ],
}

export const ResourceGrid: Block = {
  slug: 'resourceGrid',
  interfaceName: 'ResourceGridBlock',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'showFilters', type: 'checkbox', defaultValue: false },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'resourceType',
          type: 'select',
          options: [
            { label: 'Blog', value: 'blog' },
            { label: 'Webinar', value: 'webinar' },
            { label: 'Analyst research', value: 'analyst' },
            { label: 'Customer story', value: 'story' },
            { label: 'Guide', value: 'guide' },
            { label: 'Newsletter', value: 'newsletter' },
          ],
        },
        { name: 'title', type: 'text' },
        { name: 'summary', type: 'textarea' },
        { name: 'meta', type: 'text', admin: { description: 'e.g. "6 min read" or a date' } },
        { name: 'featured', type: 'checkbox', defaultValue: false },
        imageSlot(),
        link(),
      ],
    },
  ],
}

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlockBlock',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'lead', type: 'textarea' },
    {
      name: 'expectations',
      type: 'array',
      admin: { description: 'Arrow-bulleted promises shown beside the form' },
      fields: [{ name: 'text', type: 'text' }],
    },
    { name: 'sideQuote', type: 'textarea', admin: { description: 'Ice-blue quote panel beside the form' } },
    {
      name: 'formFields',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'name', type: 'text' },
        {
          name: 'fieldType',
          type: 'select',
          defaultValue: 'text',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Select', value: 'select' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Chip set', value: 'chips' },
          ],
        },
        { name: 'options', type: 'array', fields: [{ name: 'value', type: 'text' }] },
        { name: 'required', type: 'checkbox', defaultValue: false },
        { name: 'width', type: 'select', defaultValue: 'half', options: [
          { label: 'Half', value: 'half' },
          { label: 'Full', value: 'full' },
        ] },
      ],
    },
    { name: 'submitLabel', type: 'text', defaultValue: 'SUBMIT' },
    { name: 'privacyNote', type: 'textarea' },
  ],
}

export const allBlocks: Block[] = [
  Hero,
  LogoWall,
  GartnerCallout,
  FeatureGrid,
  ValuePropsIconGrid,
  TestimonialQuote,
  CaseStudyCard,
  CaseStudyArchive,
  ComparisonTable,
  PricingTable,
  CTABanner,
  ResourceGrid,
  FormBlock,
]
