import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { slugifyHeading } from '../../lib/lexical'
import styles from './DocsArticle.module.css'

const headingText = (node: { children?: unknown[] }): string =>
  (node.children ?? [])
    .map((child) => {
      const c = child as { text?: string; children?: unknown[] }
      if (typeof c.text === 'string') return c.text
      return c.children ? headingText(c) : ''
    })
    .join('')

/**
 * Headings get the same ids the server-side TOC extractor derives, so the
 * right-rail marker and the in-page anchors agree. Duplicates are suffixed
 * identically by tracking counts across a single render.
 */
const makeConverters = (): JSXConvertersFunction => {
  const seen = new Map<string, number>()

  return ({ defaultConverters }) => ({
    ...defaultConverters,
    /*
     * A paragraph whose every text child carries the inline-code format renders
     * as the artboard's code block — deep green, monospace — rather than as a
     * run of inline code chips. Lexical's default feature set has no dedicated
     * code-block node, so this is how a fenced block is expressed.
     */
    paragraph: (args) => {
      const { node, nodesToJSX } = args
      const children = (node.children ?? []) as { type?: string; format?: number; text?: string }[]
      const isCodeBlock =
        children.length > 0 &&
        children.every(
          (child) => child.type === 'text' && typeof child.format === 'number' && child.format & 16,
        )

      if (isCodeBlock) {
        return (
          <pre className={styles.codeBlock}>
            <code>{children.map((child) => child.text).join('')}</code>
          </pre>
        )
      }

      const rendered = defaultConverters.paragraph
      return typeof rendered === 'function'
        ? rendered(args as never)
        : <p>{nodesToJSX({ nodes: node.children })}</p>
    },
    heading: ({ node, nodesToJSX }) => {
      const text = headingText(node).trim()
      const base = slugifyHeading(text)
      const count = seen.get(base) ?? 0
      seen.set(base, count + 1)
      const id = count === 0 ? base : `${base}-${count}`

      const Tag = (node.tag ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

      return (
        <Tag id={id} className={styles.heading} data-level={Tag}>
          {nodesToJSX({ nodes: node.children })}
        </Tag>
      )
    },
  })
}

export const RichTextBody = ({ data }: { data: unknown }) => {
  if (!data) return null
  return <RichText data={data as never} converters={makeConverters()} className={styles.body} />
}
