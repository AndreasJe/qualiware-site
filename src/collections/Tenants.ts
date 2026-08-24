import type { CollectionConfig } from 'payload'
import { anyone, superAdminOnly } from '../access'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    group: 'Settings',
    useAsTitle: 'name',
  },
  access: {
    read: anyone,
    create: superAdminOnly,
    update: superAdminOnly,
    // The multi-tenant plugin cascades deletes of all tenant-owned content
    // when a tenant record is removed — only super admins may trigger that.
    delete: superAdminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Path segment used for routing: main, docs, partners' },
    },
    {
      name: 'domain',
      type: 'text',
      admin: { description: 'Public domain for this property, e.g. docs.qualiware.com' },
    },
  ],
}
