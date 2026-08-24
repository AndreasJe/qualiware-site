import type { CollectionConfig } from 'payload'
import { anyone, authenticated, superAdminOnly } from '../access'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    group: 'Settings',
    defaultColumns: ['formName', 'createdAt'],
  },
  access: {
    create: anyone,
    read: authenticated,
    update: superAdminOnly,
    delete: superAdminOnly,
  },
  fields: [
    { name: 'formName', type: 'text' },
    { name: 'data', type: 'json' },
  ],
}
