import Link from 'next/link'
import { Arrow } from '../Arrow'
import { DocsNav } from '../DocsNav'
import { DocsTOC } from '../DocsTOC'
import { DocsSearch } from '../DocsSearch'
import { RichTextBody } from './RichTextBody'
import { extractHeadings } from '../../lib/lexical'
import { getDocsBreadcrumbs, getDocsTree } from '../../lib/docsTree'
import { tenantPath, tenantBase } from '../../lib/links'
import { getCategoryArticles } from '../../lib/resolve'
import type { Doc } from '../../payload-types'
import type { TenantSlug } from '../../lib/tenant'
import styles from './DocsArticle.module.css'

const READ_WORDS_PER_MINUTE = 220

const countWords = (node: unknown): number => {
  const n = node as { text?: string; children?: unknown[] } | null
  if (!n) return 0
  if (typeof n.text === 'string') return n.text.trim().split(/\s+/).filter(Boolean).length
  return (n.children ?? []).reduce<number>((sum, child) => sum + countWords(child), 0)
}

const readTime = (body: unknown): string => {
  const root = (body as { root?: unknown } | null)?.root
  const words = countWords(root)
  return `${Math.max(1, Math.round(words / READ_WORDS_PER_MINUTE))} min read`
}

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

export const DocsArticle = async ({
  doc,
  tenantSlug,
}: {
  doc: Doc
  tenantSlug: TenantSlug
}) => {
  // Level two only. The right rail is 260px and has to stay scannable; indexing
  // h3 as well makes it as long as the article on a detailed page.
  const headings = extractHeadings(doc.body, [2])

  // Breadcrumbs walk the *category* chain, which is what the reader navigates.
  // The plugin's own `breadcrumbs` field only covers the article-to-article
  // `parent` chain, so it would render as "Docs / <title>" on its own.
  const [tree, breadcrumbs] = await Promise.all([
    getDocsTree(tenantSlug),
    getDocsBreadcrumbs(doc),
  ])

  const activeUrl = breadcrumbs[breadcrumbs.length - 1]?.url ?? undefined

  // Prev/next walk the article's own category in its manual `order`.
  const categoryId =
    typeof doc.category === 'object' && doc.category ? doc.category.id : doc.category
  const siblings = categoryId ? await getCategoryArticles(tenantSlug, categoryId) : []
  const index = siblings.findIndex((sibling) => sibling.id === doc.id)
  const prev = index > 0 ? siblings[index - 1] : undefined
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined

  const urlFor = (article: Doc) =>
    article.breadcrumbs?.[article.breadcrumbs.length - 1]?.url ?? `/${article.slug}`

  const updated = formatDate(doc.updatedAt)

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <DocsSearch variant="compact" action={tenantPath(tenantSlug, '/search')} />
        <DocsNav nodes={tree} activeUrl={activeUrl} variant="sidebar" basePath={tenantBase(tenantSlug)} />
      </aside>

      <article className={styles.article}>
        {breadcrumbs.length > 0 && (
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href={tenantPath(tenantSlug)}>Docs</Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.url}>
                <span className={styles.crumbSeparator} aria-hidden="true">
                  /
                </span>
                <Link href={tenantPath(tenantSlug, crumb.url)}>{crumb.label}</Link>
              </span>
            ))}
          </nav>
        )}

        <h1 className={styles.title}>{doc.title}</h1>

        <div className={styles.meta}>
          {updated && <span>Updated {updated}</span>}
          {doc.appliesTo && (
            <>
              <span aria-hidden="true">·</span>
              <span>Applies to {doc.appliesTo}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{readTime(doc.body)}</span>
          {Boolean(doc.audiences?.length) && (
            <span className={styles.gatedChip}>
              {doc.audiences?.join(' & ')} only
            </span>
          )}
        </div>

        <RichTextBody data={doc.body} />

        {(prev || next) && (
          <nav className={styles.prevNext} aria-label="Article navigation">
            {prev ? (
              <Link href={tenantPath(tenantSlug, urlFor(prev))} className={styles.prevNextLink} data-direction="prev">
                <span className={styles.prevNextLabel}>Previous</span>
                <span className={styles.prevNextTitle}>{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={tenantPath(tenantSlug, urlFor(next))} className={styles.prevNextLink} data-direction="next">
                <span className={styles.prevNextLabel}>Next</span>
                <span className={styles.prevNextTitle}>{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </article>

      <aside className={styles.rail}>
        <DocsTOC headings={headings} />

        <div className={styles.helpful}>
          <div className={styles.helpfulTitle}>Was this helpful?</div>
          <div className={styles.helpfulActions}>
            <button type="button" className={styles.helpfulButton}>
              Yes
            </button>
            <button type="button" className={styles.helpfulButton}>
              No
            </button>
          </div>
        </div>

        <a
          href={`mailto:docs@qualiware.com?subject=${encodeURIComponent(`Suggested edit: ${doc.title}`)}`}
          className={styles.suggestEdit}
        >
          Suggest an edit
          <Arrow width={22} stroke="var(--qw-green)" strokeWidth={1.6} />
        </a>
      </aside>
    </div>
  )
}

export default DocsArticle
