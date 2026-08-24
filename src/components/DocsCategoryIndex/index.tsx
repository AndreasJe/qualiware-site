import Link from 'next/link'
import { Arrow } from '../Arrow'
import { DocsNav } from '../DocsNav'
import { DocsSearch } from '../DocsSearch'
import { getDocsTree, findNode, flattenNodes } from '../../lib/docsTree'
import { tenantPath, tenantBase } from '../../lib/links'
import { getCategoryArticles } from '../../lib/resolve'
import type { Category } from '../../payload-types'
import type { TenantSlug } from '../../lib/tenant'
import styles from './DocsCategoryIndex.module.css'

/** The landing page for a docs category: its child categories plus its own articles. */
export const DocsCategoryIndex = async ({
  category,
  tenantSlug,
}: {
  category: Category
  tenantSlug: TenantSlug
}) => {
  const tree = await getDocsTree(tenantSlug)
  const node = findNode(tree, category.id)
  const articles = await getCategoryArticles(tenantSlug, category.id)

  const breadcrumbs = (category.breadcrumbs ?? []).filter((crumb) => crumb.url && crumb.label)
  const activeUrl = node?.url ?? breadcrumbs[breadcrumbs.length - 1]?.url ?? undefined

  const urlFor = (slug: string, crumbUrl?: string | null) =>
    tenantPath(tenantSlug, crumbUrl ?? `/${slug}`)

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <DocsSearch variant="compact" action={tenantPath(tenantSlug, '/search')} />
        <DocsNav nodes={tree} activeUrl={activeUrl} variant="sidebar" basePath={tenantBase(tenantSlug)} />
      </aside>

      <div className={styles.content}>
        {breadcrumbs.length > 0 && (
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href={tenantPath(tenantSlug)}>Docs</Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.id ?? crumb.url}>
                <span className={styles.crumbSeparator} aria-hidden="true">
                  /
                </span>
                <Link href={tenantPath(tenantSlug, crumb.url as string)}>{crumb.label}</Link>
              </span>
            ))}
          </nav>
        )}

        <h1 className={`qw-h1 ${styles.title}`}>{category.title}</h1>
        <p className={styles.count}>
          {node?.articleCount ?? articles.length}{' '}
          {(node?.articleCount ?? articles.length) === 1 ? 'article' : 'articles'} in this section
        </p>

        {Boolean(node?.children.length) && (
          <section className={styles.section}>
            <h2 className={`qw-eyebrow ${styles.sectionTitle}`}>Subcategories</h2>
            <div className={styles.childGrid}>
              {node?.children.map((child) => (
                <Link key={child.id} href={tenantPath(tenantSlug, child.url)} className={`qw-card ${styles.childCard}`}>
                  <span className={styles.childTitle}>{child.title}</span>
                  <span className={styles.childCount}>{child.articleCount}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className={styles.section}>
            <h2 className={`qw-eyebrow ${styles.sectionTitle}`}>Articles</h2>
            <ul className={styles.articleList}>
              {articles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={urlFor(
                      article.slug,
                      article.breadcrumbs?.[article.breadcrumbs.length - 1]?.url,
                    )}
                    className={styles.articleLink}
                  >
                    <Arrow width={20} stroke="var(--qw-green)" strokeWidth={1.6} />
                    <span>
                      <span className={styles.articleTitle}>{article.title}</span>
                      {article.excerpt && (
                        <span className={styles.articleExcerpt}>{article.excerpt}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {articles.length === 0 && !node?.children.length && (
          <p className={styles.empty}>
            Nothing published in this section yet. Try the{' '}
            {flattenNodes(tree).length} other sections in the navigation.
          </p>
        )}
      </div>
    </div>
  )
}

export default DocsCategoryIndex
