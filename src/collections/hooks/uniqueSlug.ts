import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'

/**
 * Rejects a slug already used by another document in the same tenant.
 *
 * The slug *is* the URL, and `resolvePath` takes the first match. Without this,
 * two pages can both claim `solutions/nis2`: one wins silently and the other
 * becomes an orphan that is live in the admin, unreachable on the site, and
 * almost impossible to spot. At sixty pages nobody would notice. At two
 * thousand, with several editors, it is inevitable.
 *
 * Payload's field-level `unique` is not enough here, because uniqueness has to
 * be *per tenant* — `home` legitimately exists once per property.
 */
export const uniqueSlugPerTenant =
  (collection: 'pages' | 'posts' | 'docs' | 'categories'): CollectionBeforeValidateHook =>
  async ({ data, originalDoc, req, operation }) => {
    const slug = data?.slug ?? originalDoc?.slug
    if (!slug) return data

    // On update the tenant may not be in the payload; fall back to the stored one.
    const tenant = data?.tenant ?? originalDoc?.tenant
    const tenantId = typeof tenant === 'object' && tenant ? tenant.id : tenant

    const id = originalDoc?.id ?? data?.id

    const conflicts = await req.payload.find({
      collection,
      where: {
        and: [
          { slug: { equals: slug } },
          ...(tenantId ? [{ tenant: { equals: tenantId } }] : []),
          // Editing a document must not collide with itself.
          ...(operation === 'update' && id ? [{ id: { not_equals: id } }] : []),
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })

    const clash = conflicts.docs[0]

    if (clash) {
      const title = (clash as { title?: string }).title ?? `#${clash.id}`
      throw new APIError(
        `The URL "${slug}" is already used by "${title}" in this property. ` +
          `Two documents cannot share a URL — one would become unreachable. ` +
          `Choose a different slug, or edit the existing document instead.`,
        400,
      )
    }

    return data
  }
