import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageShell } from '../../../../components/PageShell'
import { DocsArticle } from '../../../../components/DocsArticle'
import { DocsCategoryIndex } from '../../../../components/DocsCategoryIndex'
import { resolvePath } from '../../../../lib/resolve'
import { isTenantSlug } from '../../../../lib/tenant'

type Props = { params: Promise<{ tenant: string; slug: string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant, slug } = await params
  if (!isTenantSlug(tenant)) return {}

  const resolved = await resolvePath(tenant, slug)
  if (!resolved) return {}

  // Canonical is the path only; metadataBase in the layout makes it absolute
  // against this property's own origin.
  const canonical = `/${slug.join('/')}`

  if (resolved.kind === 'page') {
    const title = resolved.page.seo?.metaTitle || resolved.page.title
    const description = resolved.page.seo?.metaDescription ?? undefined
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, url: canonical, type: 'article' },
    }
  }
  if (resolved.kind === 'doc') {
    return {
      title: resolved.doc.title,
      description: resolved.doc.excerpt ?? undefined,
      alternates: { canonical },
      openGraph: {
        title: resolved.doc.title,
        description: resolved.doc.excerpt ?? undefined,
        url: canonical,
        type: 'article',
      },
    }
  }

  return {
    title: resolved.category.title,
    alternates: { canonical },
    openGraph: { title: resolved.category.title, url: canonical },
  }
}

export default async function TenantPath({ params }: Props) {
  const { tenant, slug } = await params
  if (!isTenantSlug(tenant)) notFound()

  const resolved = await resolvePath(tenant, slug)
  if (!resolved) notFound()

  switch (resolved.kind) {
    case 'page':
      return <PageShell page={resolved.page} tenantSlug={tenant} />
    case 'doc':
      return <DocsArticle doc={resolved.doc} tenantSlug={tenant} />
    case 'category':
      return <DocsCategoryIndex category={resolved.category} tenantSlug={tenant} />
  }
}
