import type { CollectionConfig } from 'payload'
import { uniqueSlugPerTenant } from './hooks/uniqueSlug'
import { staffOnly, audienceVisibility } from '../access'
import { audiencesField } from './fields/audiences'
import { setCategoryPath, setSearchText } from './hooks/categoryPath'

export const Docs: CollectionConfig = {
  slug: 'docs',
  admin: {
    group: 'Documentation',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'audiences', 'updatedAt'],
  },
  access: {
    // Open by default — deliberate reversal of the gated WordPress knowledge base.
    read: audienceVisibility,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  folders: true,
  hooks: {
    // beforeValidate, not beforeChange — the Nested Docs plugin prepends its
    // own beforeChange hook, which needs categoryPath already populated.
    beforeValidate: [setCategoryPath, setSearchText, uniqueSlugPerTenant('docs')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    {
      // Denormalised category portion of the URL; maintained by hooks, never
      // edited by hand. `generateURL` prefixes the parent chain with it.
      name: 'categoryPath',
      type: 'text',
      admin: { hidden: true },
      index: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { description: 'Where this article lives in the docs navigation tree' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { description: 'Manual sort within the category' } },
    audiencesField,
    { name: 'appliesTo', type: 'text', admin: { description: 'e.g. "10.8 and later"', position: 'sidebar' } },
    { name: 'excerpt', type: 'textarea' },
    {
      // Plain-text mirror of the body, maintained by a hook. Rich text is stored
      // as JSON, so a `like` query against `body` matches node names, not prose.
      name: 'searchText',
      type: 'textarea',
      admin: { hidden: true },
    },
    { name: 'body', type: 'richText' },
  ],
}
