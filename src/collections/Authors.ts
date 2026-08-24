import type { CollectionConfig } from 'payload'
import { anyone, staffOnly } from '../access'

/**
 * Authors and reviewers.
 *
 * Author identity used to be free text repeated on every page — "TOGAF 9
 * certified" typed into fifty records, drifting the moment anyone's role
 * changed. It is an entity, so it gets a collection.
 *
 * This also matters for E-E-A-T. A byline that resolves to a real person with a
 * photo, a role, credentials and a LinkedIn profile is a far stronger
 * authorship signal than a repeated name string.
 *
 * The required fields are deliberate: a byline is only worth carrying if it is
 * complete, so Payload will not let a half-filled author be saved.
 */
export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'credentials', 'updatedAt'],
    group: 'People',
    description:
      'People who write or review content. Every field except the biography is required — an incomplete byline is worse than none.',
  },
  access: {
    read: anyone,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Full name, as it should appear in a byline' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Used if author profile pages are added later, e.g. "mette-holm"' },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Principal Enterprise Architect, QualiWare"' },
    },
    {
      name: 'credentials',
      type: 'text',
      required: true,
      maxLength: 120,
      admin: {
        description:
          'Short and checkable, e.g. "TOGAF 9 certified · 16 years in enterprise architecture". Kept to one line — this is a credibility signal, not a CV.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Head-and-shoulders, real photo. Falls back to initials until one is uploaded.',
      },
    },
    {
      name: 'linkedin',
      type: 'text',
      required: true,
      admin: {
        description:
          'Full LinkedIn profile URL. Required: an author a reader cannot verify is not much of a signal.',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim() === '') return 'A LinkedIn URL is required.'
        return /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\//i.test(value.trim())
          ? true
          : 'Must be a full LinkedIn profile URL, starting https://www.linkedin.com/'
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description:
          'Optional. Two or three sentences on what this person actually does, for a future profile page.',
      },
    },
  ],
}
