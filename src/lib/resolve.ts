import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'
import type { Category, Doc, Page } from '../payload-types'
import type { TenantSlug } from './tenant'
import { findNode, getDocsTree } from './docsTree'
import { accessUserFor } from './session'

export type Resolved =
  | { kind: 'page'; page: Page }
  | { kind: 'doc'; doc: Doc }
  | { kind: 'category'; category: Category }
  | null

/** The full path of a nested-docs document is its *last* breadcrumb. */
const ownUrl = (doc: { breadcrumbs?: { url?: string | null }[] | null }): string | null =>
  doc.breadcrumbs?.[doc.breadcrumbs.length - 1]?.url ?? null

/**
 * Resolves a public path within one tenant.
 *
 * Lookups deliberately avoid `where: { 'breadcrumbs.url': { equals: path } }`.
 * A document's `breadcrumbs` array holds one row per ancestor, so that query
 * matches every descendant as well — `/getting-started` would resolve to an
 * arbitrary category several levels down. Instead the last segment is matched
 * against the indexed `slug`, then the candidate's own full path is verified.
 */
export const resolvePath = cache(
  async (tenantSlug: TenantSlug, segments: string[]): Promise<Resolved> => {
    const payload = await getPayload({ config: configPromise })
    const path = `/${segments.join('/')}`
    // Docs and Categories key on their own last segment; Pages store the full
    // path, so `/solutions/nis2` cannot be satisfied by any page called `nis2`.
    const slug = segments[segments.length - 1] ?? 'home'
    const pageSlug = segments.length ? segments.join('/') : 'home'
    const tenantWhere = { 'tenant.slug': { equals: tenantSlug } }

    if (tenantSlug === 'docs') {
      const { docs: articles } = await payload.find({
        collection: 'docs',
        where: { and: [tenantWhere, { slug: { equals: slug } }] },
        limit: 10,
        depth: 2,
        overrideAccess: false,
        user: await accessUserFor(),
      })
      const article = articles.find((candidate) => ownUrl(candidate) === path)
      if (article) return { kind: 'doc', doc: article }

      // Categories resolve against the assembled tree, which knows each node's
      // exact URL — and is already cached for the navigation on the same request.
      const node = findNode(await getDocsTree(tenantSlug), path)
      if (node) {
        const category = await payload.findByID({
          collection: 'categories',
          id: node.id,
          depth: 1,
        })
        if (category) return { kind: 'category', category }
      }
    }

    const { docs: pages } = await payload.find({
      collection: 'pages',
      where: { and: [tenantWhere, { slug: { equals: pageSlug } }] },
      limit: 1,
      depth: 2,
      // Pages can now carry audiences too, so the reader must be passed in.
      overrideAccess: false,
      user: await accessUserFor(),
      /*
       * Without this, `depth: 2` drags in the *entire* layout of every related
       * page — a Solutions page links to five Platform pages, each carrying a
       * full block tree and its own relations. That was the bulk of the
       * server render time.
       *
       * Related pages are only ever rendered as a title and a link
       * (`PageShell`) or a card (`CaseStudyCards`), so fetch just those fields.
       */
      populate: {
        pages: { title: true, slug: true, caseStudy: true },
      },
    })
    if (pages[0]) return { kind: 'page', page: pages[0] }

    return null
  },
)

/** Docs articles in a category, ordered for prev/next and category index listings. */
export const getCategoryArticles = cache(
  async (tenantSlug: TenantSlug, categoryId: number): Promise<Doc[]> => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'docs',
      where: {
        and: [{ 'tenant.slug': { equals: tenantSlug } }, { category: { equals: categoryId } }],
      },
      sort: 'order',
      limit: 0,
      depth: 1,
      overrideAccess: false,
      user: await accessUserFor(),
    })
    return docs
  },
)
