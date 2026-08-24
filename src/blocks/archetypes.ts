import type { Page } from '../payload-types'

type Layout = NonNullable<Page['layout']>
type PageType = NonNullable<Page['pageType']>

/**
 * Page skeletons.
 *
 * Editors are not designers, and a blank layout with thirteen blocks in any
 * order asks them to make decisions they have no basis for. So choosing an
 * archetype scaffolds the page: the right blocks, in the right order, with the
 * design values already correct and placeholder copy that says what belongs
 * there.
 *
 * The job becomes "replace this text", not "design a page".
 *
 * The design values set here — hero `variant`, cta `background` — are hidden
 * from editors on archetype pages (see the `governed` condition in
 * `src/blocks/index.ts`), so the scaffold stays the single source of truth for
 * how an archetype looks.
 */

const TODO = (what: string) => `[${what}]`

const hero = (
  variant: 'darkGreen' | 'iceBlue' | 'navy',
  eyebrow: string,
  extra: Record<string, unknown> = {},
): Layout[number] =>
  ({
    blockType: 'hero',
    variant,
    eyebrow,
    heading: TODO('Page heading — one clear sentence'),
    lead: TODO('Two sentences. What this page is for, and who it is for.'),
    ctas: [{ label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' }],
    ...extra,
  }) as Layout[number]

const valueProps = (eyebrow: string, heading: string): Layout[number] =>
  ({
    blockType: 'valueProps',
    layout: 'split',
    eyebrow,
    heading: TODO(heading),
    lead: TODO('One paragraph setting up the four points below.'),
    image: { placeholder: TODO('PHOTO — describe the shot you need') },
    items: [1, 2, 3, 4].map((n) => ({
      title: TODO(`Point ${n} — a short claim`),
      text: TODO('One sentence of evidence for it.'),
    })),
  }) as Layout[number]

const featureGrid = (eyebrow: string, heading: string): Layout[number] =>
  ({
    blockType: 'featureGrid',
    eyebrow,
    heading: TODO(heading),
    features: [1, 2, 3, 4].map((n) => ({
      title: TODO(`Feature ${n}`),
      description: TODO('One or two sentences. Concrete, not aspirational.'),
    })),
  }) as Layout[number]

const cta = (
  background: 'iceBlue' | 'darkGreen' | 'tinted',
  heading: string,
): Layout[number] =>
  ({
    blockType: 'ctaBanner',
    background,
    heading: TODO(heading),
    text: TODO('One sentence on what happens next.'),
    ctaLabel: 'BOOK A DEMO',
    ctaHref: '/pricing#demo',
  }) as Layout[number]

/**
 * The skeleton for each archetype. Order matters — it is the argument the page
 * makes. Platform explains machinery; Solutions states problem, outcome, proof.
 */
export const SKELETONS: Partial<Record<PageType, () => Layout>> = {
  platformCapability: () => [
    hero('darkGreen', 'PLATFORM'),
    valueProps('HOW IT WORKS', 'How this capability actually works'),
    featureGrid('WHAT IT DOES', 'What you can do with it'),
    cta('darkGreen', 'See it on your own architecture'),
  ],

  solutionDiscipline: () => [
    hero('iceBlue', 'BY DISCIPLINE'),
    valueProps('THE PROBLEM', 'The problem this discipline solves'),
    featureGrid('THE OUTCOME', 'What becomes possible'),
    {
      blockType: 'testimonial',
      quote: TODO('A customer quote that proves the outcome above.'),
      name: TODO('Name'),
      role: TODO('Role'),
      org: TODO('Organisation'),
      portrait: { placeholder: TODO('PORTRAIT — candid, real office') },
    } as Layout[number],
    cta('iceBlue', 'Ready to start with this discipline?'),
  ],

  solutionIndustry: () => [
    hero('iceBlue', 'BY INDUSTRY'),
    valueProps('WHAT IS DIFFERENT HERE', 'What is different in this sector'),
    featureGrid('PROOF', 'What organisations in this sector use it for'),
    cta('iceBlue', 'Talk to someone who knows this sector'),
  ],

  // Facts, deadline and the requirements table render above these blocks,
  // from the Regulation group — do not restate them here.
  solutionRegulation: () => [
    hero('navy', 'BY REGULATION'),
    featureGrid('WHAT IT MEANS FOR YOU', 'What this regulation asks of you'),
    valueProps('HOW QUALIWARE HELPS', 'How the model evidences it'),
    cta('iceBlue', 'Get your obligations mapped'),
  ],

  resourceHub: () => [
    hero('darkGreen', 'RESOURCES', {
      showSearch: true,
      searchPlaceholder: 'Search resources',
    }),
    {
      blockType: 'resourceGrid',
      heading: TODO('Section heading'),
      showFilters: true,
      items: [],
    } as Layout[number],
    cta('tinted', 'Want this in your inbox?'),
  ],

  company: () => [
    hero('iceBlue', 'COMPANY'),
    valueProps('WHO WE ARE', 'The thing worth knowing about us'),
    cta('tinted', 'Come and talk to us'),
  ],

  // Legal pages are documents, not landing pages: no hero, no CTA.
  legal: () => [
    {
      blockType: 'valueProps',
      layout: 'grid',
      heading: TODO('Document title'),
      items: [1, 2, 3].map((n) => ({
        title: TODO(`Section ${n} heading`),
        text: TODO('Section body.'),
      })),
    } as Layout[number],
  ],
}

/** Archetypes whose design values the scaffold owns, so editors cannot break them. */
export const GOVERNED_TYPES: PageType[] = [
  'platformCapability',
  'solutionDiscipline',
  'solutionIndustry',
  'solutionRegulation',
  'resourceHub',
  'company',
  'legal',
]

export const skeletonFor = (pageType?: PageType | null): Layout | null => {
  if (!pageType) return null
  const build = SKELETONS[pageType]
  return build ? build() : null
}
