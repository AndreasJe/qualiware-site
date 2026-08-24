import type { Field } from 'payload'

/**
 * The audience gate, shared by Docs, Pages and Posts.
 *
 * One mechanism rather than three, so there is a single thing for an editor to
 * understand and a single access rule (`audienceVisibility`) enforcing it.
 *
 * **Empty means public, and that is the default.** Content is open unless
 * someone deliberately restricts it — the whole point of moving off the gated
 * knowledge base.
 *
 * Gate on cost, not on value. Most content earns more by being open: it ranks,
 * it deflects support cases, and it lets a buyer research quietly. Restrict only
 * where giving it away costs something real — partner commercial material,
 * scoping and pricing guidance, deal registration.
 *
 * Every gated page is invisible to search. That is the price, and it is worth
 * paying rarely.
 */
export const audiencesField: Field = {
  name: 'audiences',
  type: 'select',
  hasMany: true,
  options: [
    { label: 'Customers', value: 'customer' },
    { label: 'Partners', value: 'partner' },
  ],
  admin: {
    position: 'sidebar',
    description:
      'Leave empty for public — the default, and right for almost everything. Listing an audience restricts this to signed-in accounts holding it, and removes it from search engines.',
  },
}
