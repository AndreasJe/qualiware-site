import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    group: 'Partners',
    useAsTitle: 'name',
    defaultColumns: ['name', 'partnerType', 'tier', 'region', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    {
      name: 'logo',
      type: 'group',
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media' },
        { name: 'placeholder', type: 'text' },
      ],
    },
    {
      name: 'partnerType',
      type: 'select',
      required: true,
      options: [
        { label: 'Technology / integration', value: 'technology' },
        { label: 'Solution / consulting', value: 'solution' },
      ],
    },
    {
      name: 'tier',
      type: 'select',
      options: [
        { label: 'Silver', value: 'silver' },
        { label: 'Gold', value: 'gold' },
        { label: 'Platinum', value: 'platinum' },
      ],
    },
    {
      name: 'region',
      type: 'select',
      options: [
        { label: 'Nordics', value: 'nordics' },
        { label: 'Europe', value: 'europe' },
        { label: 'North America', value: 'north-america' },
        { label: 'Middle East & Africa', value: 'mea' },
        { label: 'Asia-Pacific', value: 'apac' },
        { label: 'Global', value: 'global' },
      ],
    },
    {
      name: 'industries',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Public Sector', value: 'public-sector' },
        { label: 'Finance', value: 'finance' },
        { label: 'Defence', value: 'defence' },
        { label: 'Energy & Utilities', value: 'energy' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Life sciences', value: 'life-sciences' },
        { label: 'Cross-industry', value: 'cross-industry' },
      ],
    },
    { name: 'blurb', type: 'textarea', admin: { description: 'Short description for directory cards' } },
    { name: 'description', type: 'richText' },
    { name: 'website', type: 'text' },
    { name: 'contactEmail', type: 'email' },
    {
      name: 'services',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'scope', type: 'text' },
      ],
    },
    {
      name: 'atAGlance',
      type: 'group',
      fields: [
        { name: 'certifiedConsultants', type: 'number' },
        { name: 'partnerSince', type: 'text' },
        { name: 'languages', type: 'text' },
      ],
    },
    {
      name: 'quote',
      type: 'group',
      fields: [
        { name: 'text', type: 'textarea' },
        { name: 'attribution', type: 'text' },
      ],
    },
    {
      name: 'integrations',
      type: 'relationship',
      relationTo: 'integrations',
      hasMany: true,
    },
    {
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      filterOptions: { pageType: { equals: 'caseStudy' } },
    },
    {
      /*
       * End customers this partner supports, and what they sold them.
       *
       * Partners raise cases *on behalf of* their customers, after failing to
       * resolve something themselves. Whether QualiWare provides that support
       * depends entirely on the support level the partner sold on: if they sold
       * none, we do not provide it, and the partner needs to see that before
       * writing a case rather than after.
       *
       * NOT AUTHORITATIVE. The contract lives in Zoho Desk, and Zoho decides.
       * This mirrors it so the form can warn early, in the same way
       * `accounts.supportTierHint` mirrors a customer's own level. If the two
       * disagree, Zoho is right.
       */
      name: 'supportedCustomers',
      type: 'array',
      admin: {
        description:
          'End customers this partner may raise cases for. Mirrors the contract in Zoho Desk — Zoho remains authoritative.',
      },
      fields: [
        { name: 'customerName', type: 'text', required: true },
        {
          name: 'supportLevelSold',
          type: 'select',
          required: true,
          defaultValue: 'none',
          options: [
            { label: 'None — partner supports them directly', value: 'none' },
            { label: 'Standard', value: 'standard' },
            { label: 'Enhanced', value: 'enhanced' },
            { label: 'Premium', value: 'premium' },
          ],
          admin: {
            description:
              '"None" means QualiWare does not provide support for this customer. The case form says so plainly.',
          },
        },
        {
          name: 'zohoAccountId',
          type: 'text',
          admin: { description: 'Zoho Desk account id for this end customer, once known' },
        },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
