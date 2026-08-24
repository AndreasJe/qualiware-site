import type { CollectionConfig } from 'payload'
import type { FieldAccess } from 'payload'
import { isSuperAdmin } from '../access'

/**
 * The governing rule for this collection:
 *
 *   An account holder may edit presentation facts about themselves.
 *   They may never edit anything that ASSERTS organisational identity or
 *   entitlement.
 *
 * Everything in the second category carries this. Getting it wrong is a
 * privilege escalation, not a cosmetic bug — a self-editable \n * lets someone claim to work for another customer, and a self-editable
 *  lets them claim a partner org.
 */
const staffOnlyField: FieldAccess = ({ req }) => req.user?.collection === 'users'

/**
 * End-user accounts — customers and partners.
 *
 * Deliberately separate from `users`, which is CMS staff. Different population,
 * different lifecycle, and staff should not gain content-editing rights by
 * being a customer contact.
 *
 * `audiences` is the entitlement primitive: it gates documentation, decides
 * post-login routing, and tells the support form how to attribute a ticket.
 * Someone can legitimately hold both — a partner who is also a licensed
 * customer — so it is a list, never a single role.
 *
 * What this collection deliberately does NOT own: the support level. SLA belongs
 * to the contract, which lives in Zoho Desk. `supportTierHint` is a cached label
 * for display only; if it disagrees with Zoho, Zoho is right.
 */
export const Accounts: CollectionConfig = {
  slug: 'accounts',
  auth: {
    tokenExpiration: 60 * 60 * 8,
    cookies: {
      // One session across qualiware.com, docs., partners. and support.
      // Unset locally, because browsers do not share cookies across
      // `.localhost` subdomains the way they do across a real domain.
      domain: process.env.SESSION_COOKIE_DOMAIN || undefined,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'fullName', 'audiences', 'organisation', 'updatedAt'],
    group: 'People',
  },
  access: {
    // Staff manage accounts; an account can read itself.
    read: ({ req }) => {
      if (isSuperAdmin(req.user)) return true
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'accounts') return { id: { equals: req.user.id } }
      return false
    },
    create: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'accounts') return { id: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    {
      /*
       * Email is the login credential AND the bootstrap link to a Zoho Desk
       * contact, which makes it an identity claim rather than a profile detail.
       * If a person could edit it, they could point their account at somebody
       * else's Zoho contact and read that customer's tickets. Staff only.
       */
      name: 'email',
      type: 'email',
      access: { update: staffOnlyField },
      admin: {
        description:
          'Login credential and the link to the Zoho Desk contact. Changing it re-points support history — staff only.',
      },
    },
    { name: 'fullName', type: 'text', required: true },
    {
      name: 'audiences',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['customer'],
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Partner', value: 'partner' },
      ],
      admin: {
        description:
          'What this person is entitled to see. Both is valid — a partner who also holds a licence.',
      },
      // Never self-serve an entitlement.
      access: { update: staffOnlyField },
    },
    {
      name: 'organisation',
      type: 'text',
      // Asserts who this person works for, and is used for ticket attribution.
      access: { update: staffOnlyField },
      admin: {
        description:
          'Customer organisation. Used for ticket attribution, so staff only — a self-editable value here is an impersonation route.',
      },
    },
    {
      name: 'partner',
      type: 'relationship',
      relationTo: 'partners',
      // Claiming a partner org must be an administrative act.
      access: { update: staffOnlyField },
      admin: {
        description: 'Set when this person works for a partner. Drives the partner directory link.',
        condition: (data) => Boolean(data?.audiences?.includes('partner')),
      },
    },
    {
      name: 'zohoContactId',
      type: 'text',
      /*
       * The authoritative link to Zoho Desk. Everything support-related — case
       * attribution, and ticket history — keys off this, so it must never be
       * settable by the account holder: writing another contact's id here would
       * hand over their entire support history.
       *
       * Set by staff during onboarding, or once by a server-side lookup against
       * a verified email. Never from client input.
       */
      access: { update: staffOnlyField },
      admin: {
        description:
          'Zoho Desk contact id — the authoritative support identity. Set during onboarding. Never derived from anything the user can type.',
        position: 'sidebar',
      },
    },
    {
      name: 'supportTierHint',
      type: 'select',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Enhanced', value: 'enhanced' },
        { label: 'Premium', value: 'premium' },
      ],
      // Not an entitlement, but a person should not be able to display a
      // support tier they do not hold.
      access: { update: staffOnlyField },
      admin: {
        position: 'sidebar',
        description:
          'DISPLAY ONLY, and not authoritative. The contract in Zoho Desk decides the real SLA — never compute entitlement from this field.',
      },
    },
  ],
}
