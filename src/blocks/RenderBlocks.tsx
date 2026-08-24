import type { Page } from '../payload-types'
import type { TenantSlug } from '../lib/tenant'
import { tenantPath } from '../lib/links'

import { Hero } from './Hero'
import { LogoWall } from './LogoWall'
import { GartnerCallout } from './GartnerCallout'
import { FeatureGrid } from './FeatureGrid'
import { ValueProps } from './ValueProps'
import { Testimonial } from './Testimonial'
import { CaseStudyCards } from './CaseStudyCards'
import { CaseStudyArchive } from './CaseStudyArchive'
import { ComparisonTable } from './ComparisonTable'
import { PricingTable } from './PricingTable'
import { CTABanner } from './CTABanner'
import { ResourceGrid } from './ResourceGrid'
import { FormBlock } from './FormBlock'

type Block = NonNullable<Page['layout']>[number]

export const RenderBlocks = ({
  blocks,
  tenantSlug,
}: {
  blocks?: Page['layout']
  tenantSlug: TenantSlug
}) => {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block: Block, i) => {
        const key = block.id ?? `${block.blockType}-${i}`

        switch (block.blockType) {
          case 'hero':
            return <Hero key={key} {...block} searchAction={tenantPath(tenantSlug, '/search')} />
          case 'logoWall':
            return <LogoWall key={key} {...block} />
          case 'gartnerCallout':
            return <GartnerCallout key={key} {...block} />
          case 'featureGrid':
            return <FeatureGrid key={key} {...block} />
          case 'valueProps':
            return <ValueProps key={key} {...block} />
          case 'testimonial':
            return <Testimonial key={key} {...block} />
          case 'caseStudyCards':
            return <CaseStudyCards key={key} {...block} />
          case 'caseStudyArchive':
            // Queries its own docs, so it needs the tenant to stay scoped.
            return <CaseStudyArchive key={key} {...block} tenantSlug={tenantSlug} />
          case 'comparisonTable':
            return <ComparisonTable key={key} {...block} />
          case 'pricingTable':
            return <PricingTable key={key} {...block} />
          case 'ctaBanner':
            return <CTABanner key={key} {...block} />
          case 'resourceGrid':
            return <ResourceGrid key={key} {...block} />
          case 'formBlock':
            return <FormBlock key={key} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
