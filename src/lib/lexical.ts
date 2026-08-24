export type ExtractedHeading = { id: string; text: string; level: number }

/**
 * Flattens a Lexical document to plain text.
 *
 * Rich text is stored as JSON, so `like` queries against it match punctuation
 * and node names rather than prose. Docs denormalise this into a `searchText`
 * column so article bodies are actually searchable.
 */
export const extractPlainText = (content: unknown): string => {
  const root = (content as { root?: unknown } | null | undefined)?.root
  if (!root) return ''

  const parts: string[] = []

  const walk = (node: unknown) => {
    const n = node as { text?: string; children?: unknown[]; type?: string } | null
    if (!n) return
    if (typeof n.text === 'string') parts.push(n.text)
    n.children?.forEach(walk)
  }

  walk(root)

  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
}

export const slugifyHeading = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const nodeText = (node: LexicalNode): string => {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(nodeText).join('')
}

/**
 * Walks a Lexical document for heading nodes so the article TOC can be built on
 * the server. Ids are derived the same way the renderer derives them, and
 * duplicates get a numeric suffix so anchors stay unique.
 */
export const extractHeadings = (
  content: unknown,
  levels: number[] = [2, 3],
): ExtractedHeading[] => {
  const root = (content as { root?: LexicalNode } | null | undefined)?.root
  if (!root) return []

  const found: ExtractedHeading[] = []
  const seen = new Map<string, number>()

  const walk = (node: LexicalNode) => {
    if (node.type === 'heading' && typeof node.tag === 'string') {
      const level = Number(node.tag.replace('h', ''))
      if (levels.includes(level)) {
        const text = nodeText(node).trim()
        if (text) {
          const base = slugifyHeading(text)
          const count = seen.get(base) ?? 0
          seen.set(base, count + 1)
          found.push({ id: count === 0 ? base : `${base}-${count}`, text, level })
        }
      }
    }
    node.children?.forEach(walk)
  }

  walk(root)
  return found
}
