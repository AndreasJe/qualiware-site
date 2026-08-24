import styles from './PartnerTierTable.module.css'

const EM_DASH = '—'

export type PartnerTier = { name: string; highlighted?: boolean }
export type PartnerTierRow = { benefit: string; values: string[] }

/**
 * Program tier table (artboard 1i): Silver / Gold / Platinum against five
 * benefit rows. Prop-driven — the tiers and rows come from page content.
 *
 * Desktop (>= 900px) is a real `<table>` with `<th scope>`; the highlighted
 * (Platinum) header cell sits on --qw-green and its column is tinted.
 *
 * Below 900px the table is dropped entirely — never a horizontally scrolling
 * table — and replaced by one card per tier, the same principle as the
 * comparison table. Both trees are always rendered and swapped with CSS
 * `display`, so no client-side media query is needed and this stays a server
 * component.
 */
export const PartnerTierTable = ({
  tiers,
  rows,
  heading,
  benefitLabel = 'BENEFIT',
}: {
  tiers: PartnerTier[]
  rows: PartnerTierRow[]
  heading?: string
  benefitLabel?: string
}) => {
  const tierList = (tiers ?? []).filter((tier) => Boolean(tier?.name))
  const rowList = (rows ?? []).filter((row) => Boolean(row?.benefit))

  if (tierList.length === 0 || rowList.length === 0) return null

  const valueAt = (row: PartnerTierRow, index: number) => (row.values ?? [])[index] || EM_DASH

  return (
    <section className={`qw-section ${styles.section}`}>
      <div className="qw-shell">
        {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}

        {/* ---------- Desktop (>= 900px): a real table ---------- */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={`${styles.headCell} ${styles.headBenefit}`}>
                  {benefitLabel}
                </th>
                {tierList.map((tier) => (
                  <th
                    key={tier.name}
                    scope="col"
                    className={
                      tier.highlighted
                        ? `${styles.headCell} ${styles.headTier} ${styles.headTierHighlighted}`
                        : `${styles.headCell} ${styles.headTier}`
                    }
                  >
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowList.map((row) => (
                <tr key={row.benefit}>
                  <th scope="row" className={styles.benefitCell}>
                    {row.benefit}
                  </th>
                  {tierList.map((tier, index) => (
                    <td
                      key={tier.name}
                      className={
                        tier.highlighted
                          ? `${styles.valueCell} ${styles.valueCellHighlighted}`
                          : styles.valueCell
                      }
                    >
                      {valueAt(row, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------- Below 900px: one card per tier ---------- */}
        <ul className={styles.cards}>
          {tierList.map((tier, index) => (
            <li
              key={tier.name}
              className={
                tier.highlighted ? `${styles.card} ${styles.cardHighlighted}` : styles.card
              }
            >
              <div
                className={
                  tier.highlighted
                    ? `${styles.cardHead} ${styles.cardHeadHighlighted}`
                    : styles.cardHead
                }
              >
                {tier.name}
              </div>
              <dl className={styles.cardList}>
                {rowList.map((row) => (
                  <div key={row.benefit} className={styles.cardRow}>
                    <dt className={styles.cardBenefit}>{row.benefit}</dt>
                    <dd className={styles.cardValue}>{valueAt(row, index)}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default PartnerTierTable
