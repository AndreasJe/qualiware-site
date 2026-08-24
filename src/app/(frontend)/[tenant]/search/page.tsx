import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { Arrow } from '../../../../components/Arrow'
import { DocsSearch } from '../../../../components/DocsSearch'
import { isTenantSlug, type TenantSlug } from '../../../../lib/tenant'
import { tenantPath } from '../../../../lib/links'
import { accessUserFor } from '../../../../lib/session'
import styles from './search.module.css'

export const metadata: Metadata = { title: 'Search' }

type Props = {
  params: Promise<{ tenant: string }>
  searchParams: Promise<{ q?: string }>
}

type Result = { title: string; href: string; excerpt?: string | null; kind: string }

export default async function SearchPage({ params, searchParams }: Props) {
  const { tenant } = await params
  const { q } = await searchParams
  if (!isTenantSlug(tenant)) notFound()

  const query = (q ?? '').trim()
  const results = query ? await search(tenant, query) : []

  return (
    <div className={`qw-section ${styles.wrap}`}>
      <div className="qw-shell">
        <h1 className={`qw-h1 ${styles.title}`}>Search</h1>
        <div className={styles.searchRow}>
          <DocsSearch variant="compact" defaultValue={query} action={tenantPath(tenant, '/search')} />
        </div>

        {query === '' ? (
          <p className={styles.empty}>Enter a term to search {tenant === 'docs' ? 'the documentation' : 'the site'}.</p>
        ) : (
          <>
            <p className={styles.count} aria-live="polite">
              {results.length} {results.length === 1 ? 'result' : 'results'} for “{query}”
            </p>
            <ul className={styles.results}>
              {results.map((result) => (
                <li key={`${result.kind}-${result.href}`}>
                  <Link href={result.href} className={styles.result}>
                    <span className={styles.resultKind}>{result.kind}</span>
                    <span className={styles.resultTitle}>{result.title}</span>
                    {result.excerpt && (
                      <span className={styles.resultExcerpt}>{result.excerpt}</span>
                    )}
                    <span className={styles.resultArrow}>
                      <Arrow width={22} stroke="var(--qw-green)" strokeWidth={1.6} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

/** Title/excerpt matching across the tenant's docs and pages. */
async function search(tenant: TenantSlug, query: string): Promise<Result[]> {
  const payload = await getPayload({ config: configPromise })
  const tenantWhere = { 'tenant.slug': { equals: tenant } }

  const [docs, pages] = await Promise.all([
    tenant === 'docs'
      ? payload.find({
          collection: 'docs',
          where: {
            and: [
              tenantWhere,
              // searchText is the plain-text mirror of the body, so this matches
              // article prose and not just titles.
              {
                or: [
                  { title: { like: query } },
                  { excerpt: { like: query } },
                  { searchText: { like: query } },
                ],
              },
            ],
          },
          limit: 25,
          depth: 1,
          overrideAccess: false,
          user: await accessUserFor(),
        })
      : Promise.resolve({ docs: [] as never[] }),
    payload.find({
      collection: 'pages',
      where: { and: [tenantWhere, { title: { like: query } }] },
      limit: 25,
      depth: 0,
    }),
  ])

  return [
    ...docs.docs.map((doc) => ({
      kind: 'Documentation',
      title: doc.title,
      excerpt: doc.excerpt,
      href: tenantPath(tenant, doc.breadcrumbs?.[doc.breadcrumbs.length - 1]?.url ?? `/${doc.slug}`),
    })),
    ...pages.docs.map((page) => ({
      kind: 'Page',
      title: page.title,
      excerpt: page.caseStudy?.summary ?? null,
      href: tenantPath(tenant, page.slug === 'home' ? '/' : `/${page.slug}`),
    })),
  ]
}
