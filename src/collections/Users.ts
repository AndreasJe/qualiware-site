import type { CollectionConfig } from 'payload'
import { authenticated, superAdminOnly } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    group: 'Settings',
    useAsTitle: 'email',
  },
  access: {
    read: authenticated,
    create: superAdminOnly,
    update: superAdminOnly,
    delete: superAdminOnly,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      required: true,
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        update: ({ req }) =>
          req.user?.collection === 'users' &&
          Boolean((req.user as { roles?: string[] }).roles?.includes('super-admin')),
      },
    },
  ],
}
