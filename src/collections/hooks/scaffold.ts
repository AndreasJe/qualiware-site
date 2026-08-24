import type { CollectionBeforeValidateHook } from 'payload'
import { skeletonFor } from '../../blocks/archetypes'

/**
 * Scaffolds a new page from its archetype.
 *
 * An editor who picks "Solution — discipline" gets the right blocks, in the
 * right order, with the design values already correct and placeholder copy
 * telling them what belongs where. Their job is to replace text, not to design
 * a page from thirteen blocks and four style dropdowns.
 *
 * Only ever fills an *empty* layout, and only on create. It will never
 * overwrite an editor's work, and changing the archetype later leaves existing
 * content alone — silently rewriting a page someone had already written would
 * be far worse than an imperfect skeleton.
 */
export const scaffoldFromArchetype: CollectionBeforeValidateHook = ({
  data,
  operation,
}) => {
  if (!data) return data
  if (operation !== 'create') return data
  if (Array.isArray(data.layout) && data.layout.length > 0) return data

  const skeleton = skeletonFor(data.pageType)
  if (!skeleton) return data

  return { ...data, layout: skeleton }
}
