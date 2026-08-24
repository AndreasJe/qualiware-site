/**
 * Author details as written inline in the page modules.
 *
 * Pages now hold a *relationship* to the Authors collection, but the seed
 * content still describes people inline. The seed derives a distinct Author
 * record per person from these and links the pages to it, so the content
 * modules stay readable and nobody has to hand-maintain ids.
 */
export type SeedAuthorship = {
  authorName?: string
  authorRole?: string
  authorCredentials?: string
  reviewerName?: string
  reviewerRole?: string
  lastReviewed?: string
  experienceNote?: string
}
