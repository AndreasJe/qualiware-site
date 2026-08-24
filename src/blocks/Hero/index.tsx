import Link from 'next/link'
import { Arrow, ScrollCue } from '../../components/Arrow'
import type { HeroBlock } from '../../payload-types'
import styles from './Hero.module.css'

type HeroVariant = NonNullable<HeroBlock['variant']>
type HeroCta = NonNullable<HeroBlock['ctas']>[number]
type CtaStyle = NonNullable<HeroCta['style']>

const groundClass: Record<HeroVariant, string> = {
  darkGreen: styles.darkGreen,
  iceBlue: styles.iceBlue,
  navy: styles.navy,
}

/** Button helper class for a CTA style, adjusted for the ground it sits on. */
const ctaClass = (style: CtaStyle, variant: HeroVariant): string => {
  if (style === 'solid') return 'qw-btn--solid'
  if (style === 'outline') {
    // The global outline button is white-on-dark; ice blue needs the green edge.
    return variant === 'iceBlue' ? 'qw-btn--outline-green' : 'qw-btn--outline'
  }
  return 'qw-btn--neon'
}

/** Arrow stroke: dark green on the neon fill, neon on dark grounds and fills. */
const ctaArrowStroke = (style: CtaStyle, variant: HeroVariant): string => {
  if (style === 'neon') return 'var(--qw-green-deep)'
  if (style === 'solid') return 'var(--qw-neon)'
  return variant === 'iceBlue' ? 'var(--qw-green)' : 'var(--qw-neon)'
}

/**
 * The decorative node-link constellation from the QMS login screen: white nodes,
 * thin ice-blue links, one neon path tracing a route through the graph.
 */
const constellationNodes: { cx: number; cy: number; r: number; dur: number; delay: number }[] = [
  { cx: 60, cy: 120, r: 3.5, dur: 5, delay: 0 },
  { cx: 180, cy: 60, r: 3, dur: 6.5, delay: 0.4 },
  { cx: 250, cy: 170, r: 4, dur: 4.4, delay: 0.9 },
  { cx: 380, cy: 110, r: 3, dur: 7, delay: 0.2 },
  { cx: 470, cy: 210, r: 4, dur: 5.6, delay: 1.2 },
  { cx: 610, cy: 170, r: 3, dur: 6, delay: 0 },
  { cx: 660, cy: 300, r: 3.5, dur: 5.2, delay: 0.7 },
  { cx: 520, cy: 340, r: 3, dur: 6.8, delay: 1.5 },
  { cx: 360, cy: 280, r: 4.5, dur: 4.8, delay: 0.3 },
  { cx: 140, cy: 240, r: 3.5, dur: 6.2, delay: 1.1 },
  { cx: 120, cy: 360, r: 3, dur: 5.4, delay: 0.6 },
  { cx: 300, cy: 400, r: 4, dur: 7.2, delay: 0.1 },
  { cx: 60, cy: 480, r: 3, dur: 5.8, delay: 1.4 },
  { cx: 250, cy: 560, r: 3.5, dur: 6.4, delay: 0.5 },
  { cx: 340, cy: 520, r: 3, dur: 4.6, delay: 1 },
  { cx: 560, cy: 470, r: 4, dur: 6.6, delay: 0.8 },
]

const constellationLinks = [
  'M60 120L180 60L250 170L140 240Z',
  'M250 170L380 110L470 210L360 280Z',
  'M140 240L360 280L300 400L120 360Z',
  'M470 210L610 170L660 300L520 340Z',
  'M300 400L520 340L560 470L340 520Z',
  'M120 360L60 480L250 560L340 520',
  'M180 60L470 210M360 280L610 170M250 560L560 470',
]

const Constellation = () => (
  <svg
    viewBox="0 0 700 620"
    className={styles.constellation}
    aria-hidden="true"
    focusable="false"
  >
    <g className={`${styles.links} qw-anim-drift`} fill="none">
      {constellationLinks.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
    <g className={`${styles.nodes} qw-anim-drift`}>
      {constellationNodes.map((n) => (
        <circle
          key={`${n.cx}-${n.cy}`}
          cx={n.cx}
          cy={n.cy}
          r={n.r}
          className={styles.node}
          // Per-node timing is data, not styling — the only honest inline use.
          style={{ animationDuration: `${n.dur}s`, animationDelay: `${n.delay}s` }}
        />
      ))}
    </g>
    <path
      d="M60 120L250 170L360 280L520 340L560 470"
      className={`${styles.trace} qw-anim-trace`}
      fill="none"
    />
  </svg>
)

/** The static platform mock in the hero's right column. */
const productBars: { label: string; value: number; tone: string }[] = [
  { label: 'NIS2 controls', value: 82, tone: 'green' },
  { label: 'Process coverage', value: 64, tone: 'navy' },
  { label: 'Data quality', value: 91, tone: 'grey' },
]

const barFillClass: Record<string, string> = {
  green: styles.barFillGreen,
  navy: styles.barFillNavy,
  grey: styles.barFillGrey,
}

const barValueClass: Record<string, string> = {
  green: styles.barValueGreen,
  navy: styles.barValueNavy,
  grey: styles.barValueGrey,
}

const ProductPanel = () => (
  <div className={styles.panel}>
    <div className={styles.panelHead}>
      <span className={styles.panelDot} aria-hidden="true" />
      <span className={styles.panelHeadLabel}>Live model · Impact of change</span>
    </div>

    <div className={styles.mock}>
      <div className={styles.sweep} aria-hidden="true">
        <span className={`${styles.sweepBand} qw-anim-sweep`} />
      </div>

      <div className={styles.mockLabel}>Capability &rarr; Application &rarr; Risk</div>

      <div className={styles.mockGrid}>
        <div className={styles.capability}>Order Management</div>
        <div className={styles.capability}>Customer Service</div>
        <div className={styles.capability}>Logistics</div>
        <div className={styles.application}>SAP S/4</div>
        <div className={`${styles.application} ${styles.applicationFlagged}`}>Legacy CRM</div>
        <div className={styles.application}>WMS</div>
      </div>

      <div className={styles.bars}>
        {productBars.map((bar) => (
          <div className={styles.barRow} key={bar.label}>
            <span className={styles.barLabel}>{bar.label}</span>
            <div className={styles.barTrack}>
              <span
                className={`${styles.barFill} ${barFillClass[bar.tone]} qw-anim-bar`}
                // Genuinely dynamic: the bar's own measurement.
                style={{ width: `${bar.value}%` }}
              />
            </div>
            <span className={`${styles.barValue} ${barValueClass[bar.tone]}`}>{bar.value}%</span>
          </div>
        ))}
      </div>

      <p className={styles.conclusion}>
        Replacing <b>Legacy CRM</b> affects 3 capabilities, 11 processes and 2 open risks.
      </p>
    </div>
  </div>
)

const SearchIcon = () => (
  <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="8.5" cy="8.5" r="6" stroke="var(--qw-green-deep)" strokeWidth="1.8" />
    <path d="M13 13l5 5" stroke="var(--qw-green-deep)" strokeWidth="1.8" />
  </svg>
)

export const Hero = (props: HeroBlock & { searchAction?: string }) => {
  const {
    variant,
    eyebrow,
    heading,
    lead,
    ctas,
    showProductPanel,
    showConstellation,
    showScrollCue,
    showSearch,
    searchPlaceholder,
    popularSearches,
    stats,
    id,
  } = props

  const ground: HeroVariant = variant ?? 'darkGreen'
  const accent = ground === 'iceBlue' ? 'var(--qw-green)' : 'var(--qw-neon)'
  const buttons = (ctas ?? []).filter((cta) => cta.label)
  const popular = (popularSearches ?? []).filter((item) => item.label)
  const proof = (stats ?? []).filter((stat) => stat.value || stat.label)
  const searchId = `hero-search-${id ?? 'default'}`

  return (
    <>
      <section className={`${styles.root} ${groundClass[ground]}`}>
        {showConstellation ? <Constellation /> : null}

        <div className={`${styles.inner} ${showProductPanel ? styles.innerSplit : ''}`}>
          <div className={styles.copy}>
            {eyebrow ? (
              <p className={styles.eyebrow}>
                <Arrow width={30} stroke={accent} />
                <span className="qw-eyebrow">{eyebrow}</span>
              </p>
            ) : null}

            <h1 className={`qw-h1-hero ${styles.heading}`}>{heading}</h1>

            {lead ? <p className={`qw-lead ${styles.lead}`}>{lead}</p> : null}

            {showSearch ? (
              <form className={styles.search} method="get" action={props.searchAction ?? "/search"} role="search">
                <label className="qw-sr" htmlFor={searchId}>
                  Search
                </label>
                <input
                  id={searchId}
                  name="q"
                  type="search"
                  className={styles.searchInput}
                  placeholder={searchPlaceholder ?? 'Search'}
                />
                <button type="submit" className={styles.searchSubmit}>
                  <SearchIcon />
                  <span className="qw-sr">Submit search</span>
                </button>
              </form>
            ) : null}

            {showSearch && popular.length > 0 ? (
              <p className={styles.popular}>
                <span className={styles.popularLabel}>Popular:</span>
                {popular.map((item, index) => (
                  <Link
                    key={item.id ?? `${item.label}-${index}`}
                    href={item.href ?? '#'}
                    className={styles.popularLink}
                  >
                    {item.label}
                  </Link>
                ))}
              </p>
            ) : null}

            {buttons.length > 0 ? (
              <div className={styles.ctas}>
                {buttons.map((cta, index) => {
                  const style: CtaStyle = cta.style ?? 'neon'
                  return (
                    <Link
                      key={cta.id ?? `${cta.label}-${index}`}
                      href={cta.href ?? '#'}
                      className={`qw-btn ${ctaClass(style, ground)} ${styles.cta}`}
                    >
                      {cta.label}
                      <Arrow width={26} stroke={ctaArrowStroke(style, ground)} />
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>

          {showScrollCue ? (
            <div className={styles.scrollCue}>
              <ScrollCue stroke={accent} />
            </div>
          ) : null}

          {/* One instance only: CSS moves it out of the hero column and onto its
              own white band below the hero at mobile widths. */}
          {showProductPanel ? (
            <div className={styles.panelHolder}>
              <ProductPanel />
            </div>
          ) : null}
        </div>
      </section>

      {proof.length > 0 ? (
        <section className={styles.proof}>
          <div className={styles.proofInner}>
            {proof.map((stat, index) => (
              <div key={stat.id ?? `${stat.value}-${index}`}>
                {stat.value ? <div className={styles.proofValue}>{stat.value}</div> : null}
                {stat.label ? <div className={styles.proofLabel}>{stat.label}</div> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}

export default Hero
