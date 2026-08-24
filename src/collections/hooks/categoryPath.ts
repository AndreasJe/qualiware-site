import type { CollectionAfterChangeHook, CollectionBeforeValidateHook } from 'payload'
import { extractPlainText } from '../../lib/lexical'

/**
 * Docs articles nest under *categories*, but the Nested Docs plugin's `parent`
 * chain on Docs is article-to-article. So the category portion of an article's
 * URL is denormalised onto the article as `categoryPath`, and
 * `generateURL` in the plugin config prefixes the parent chain with it.
 *
 * The pair of hooks here keeps that denormalised value honest:
 *   - `setCategoryPath` recomputes it whenever an article is saved.
 *   - `cascadeCategoryPath` re-saves affected articles when a category moves or
 *     is renamed, so descendants follow their ancestor the way the plugin's own
 *     cascade does for the category tree itself.
 *
 * `setCategoryPath` must be a `beforeValidate` hook, not `beforeChange`: the
 * Nested Docs plugin *prepends* its own `beforeChange` hook, so anything this
 * collection registers there would run after breadcrumbs were already built.
 */

const relationId = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

/** The stored breadcrumb URL of a category, e.g. `/modelling/diagrams`. */
const categoryUrl = async (
  req: Parameters<CollectionBeforeValidateHook>[0]['req'],
  categoryId: number,
): Promise<string> => {
  const category = await req.payload.findByID({
    collection: 'categories',
    id: categoryId,
    depth: 0,
    req,
  })

  const crumbs = category?.breadcrumbs
  const url = crumbs?.[crumbs.length - 1]?.url
  return typeof url === 'string' ? url : ''
}

/**
 * Denormalises the article body to plain text so search can match prose.
 * Runs alongside `setCategoryPath` on the same hook.
 */
export const setSearchText: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) return data

  // On a partial update the body may be absent; keep whatever was stored.
  const body = 'body' in data ? data.body : (originalDoc as { body?: unknown })?.body
  const text = extractPlainText(body)

  return {
    ...data,
    searchText: [data.title ?? originalDoc?.title, data.excerpt ?? originalDoc?.excerpt, text]
      .filter(Boolean)
      .join(' ')
      .slice(0, 20000),
  }
}

export const setCategoryPath: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  // On a partial update `data.category` may be absent; fall back to the stored value.
  const categoryId =
    relationId(data?.category) ?? relationId((originalDoc as { category?: unknown })?.category)

  return {
    ...data,
    categoryPath: categoryId === null ? '' : await categoryUrl(req, categoryId),
  }
}

export const cascadeCategoryPath: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  // Only a move or rename changes descendant URLs.
  const slugChanged = doc?.slug !== previousDoc?.slug
  const parentChanged = relationId(doc?.parent) !== relationId(previousDoc?.parent)
  if (!slugChanged && !parentChanged) return doc

  // Guard against re-entry when this cascade triggers further category saves.
  if (context?.qwCascading) return doc

  const tenantId = relationId(doc?.tenant)

  // Every category in this one's subtree, found by breadcrumb prefix.
  const { docs: affected } = await req.payload.find({
    collection: 'categories',
    where: {
      and: [
        ...(tenantId === null ? [] : [{ tenant: { equals: tenantId } }]),
        { 'breadcrumbs.url': { like: doc.breadcrumbs?.[doc.breadcrumbs.length - 1]?.url ?? '' } },
      ],
    },
    limit: 0,
    depth: 0,
    req,
  })

  const categoryIds = [doc.id, ...affected.map((category) => category.id)]

  const { docs: articles } = await req.payload.find({
    collection: 'docs',
    where: { category: { in: categoryIds } },
    limit: 0,
    depth: 0,
    req,
  })

  // Touching each article re-runs setCategoryPath and the plugin's URL rebuild.
  for (const article of articles) {
    await req.payload.update({
      collection: 'docs',
      id: article.id,
      data: {},
      context: { ...context, qwCascading: true },
      req,
    })
  }

  return doc
}
