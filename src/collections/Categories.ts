import type { CollectionConfig } from 'payload'
import { uniqueSlugPerTenant } from './hooks/uniqueSlug'
import { anyone, authenticated } from '../access'
import { cascadeCategoryPath } from './hooks/categoryPath'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    group: 'Documentation',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'parent', 'order', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'order',
  hooks: {
    beforeValidate: [uniqueSlugPerTenant('categories')],
    // Renaming or moving a category rewrites the URLs of every article beneath it.
    afterChange: [cascadeCategoryPath],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Manual sort order within a sibling level — all docs-nav queries sort by this.',
      },
    },
  ],
}
