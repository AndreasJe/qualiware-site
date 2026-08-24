import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

export const Integrations: CollectionConfig = {
  slug: 'integrations',
  admin: {
    group: 'Partners',
    useAsTitle: 'name',
    defaultColumns: ['name', 'partner', 'category', 'updatedAt'],
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
      /*
       * Not every integration is partner-built — QualiWare ships first-party
       * connectors too, and the catalogue has to be honest about which is
       * which. This also lets one dataset serve two surfaces: the full
       * catalogue on the main site, and partner-built extensions on the partner
       * site.
       */
      name: 'builtBy',
      type: 'select',
      required: true,
      defaultValue: 'qualiware',
      options: [
        { label: 'QualiWare', value: 'qualiware' },
        { label: 'Partner', value: 'partner' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'partner',
      type: 'relationship',
      relationTo: 'partners',
      admin: {
        description: 'The partner that builds and maintains this integration',
        condition: (data) => data?.builtBy === 'partner',
      },
    },
    {
      /*
       * A catalogue that only lists what already works answers half the buyer's
       * question. "Is X coming?" is the other half, and answering it in public
       * is worth more than the roadmap secrecy it costs.
       */
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'available',
      options: [
        { label: 'Available now', value: 'available' },
        { label: 'In development', value: 'inDevelopment' },
        { label: 'Planned', value: 'planned' },
        { label: 'Retired', value: 'retired' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Drives the roadmap view. Only "Available now" is presented as something you can use today.',
      },
    },
    {
      name: 'expectedAvailability',
      type: 'text',
      admin: {
        position: 'sidebar',
        condition: (data) => ['inDevelopment', 'planned'].includes(data?.status),
        description:
          'Deliberately vague, e.g. "H1 2027". Never commit to a date the roadmap cannot hold.',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'ITSM & CMDB', value: 'itsm' },
        { label: 'Identity & access', value: 'identity' },
        { label: 'Data & analytics', value: 'data' },
        { label: 'Collaboration', value: 'collaboration' },
        { label: 'DevOps & delivery', value: 'devops' },
        { label: 'GRC & risk', value: 'grc' },
      ],
    },
    { name: 'summary', type: 'textarea' },
    { name: 'docsUrl', type: 'text', admin: { description: 'Deep link into docs.qualiware.com — how to authenticate lives in Docs' } },
  ],
}
