'use client'

import { useState } from 'react'
import type { ComparisonTableBlock } from '../../payload-types'
import styles from './ComparisonTable.module.css'

const EM_DASH = '—'

/** Capability column is 1.6fr, each vendor column 1fr. */
const CAPABILITY_FR = 1.6

/**
 * Vendor comparison (artboard 1f).
 *
 * Desktop (>= 900px) is a real `<table>`: a 1.6fr capability column then 1fr
 * per vendor, header row on --qw-green, the highlighted vendor's header on
 * --qw-green-pressed and its body cells tinted.
 *
 * Below 900px the table is dropped entirely — per the handoff, "never a
 * horizontally scrolling table" — and replaced by one card per capability row
 * with a vendor chip selector above it. Both trees are always rendered and
 * swapped with CSS `display`, so there is no layout shift and no client-side
 * media query is needed.
 */
export const ComparisonTable = ({ heading, lead, note, vendors, rows }: ComparisonTableBlock) => {
  const vendorList = (vendors ?? []).filter((vendor) => Boolean(vendor?.name))
  const rowList = (rows ?? []).filter((row) => Boolean(row?.capability))

  const highlightedIndex = vendorList.findIndex((vendor) => vendor.highlighted === true)
  const defaultIndex = highlightedIndex >= 0 ? highlightedIndex : 0

  const [selectedVendor, setSelectedVendor] = useState(defaultIndex)

  const cellValue = (row: (typeof rowList)[number], index: number) =>
    (row.cells ?? [])[index]?.value || EM_DASH

  // The only genuinely dynamic values in this block: the column widths depend
  // on how many vendors the editor added.
  const totalFr = CAPABILITY_FR + vendorList.length
  const capabilityWidth = `${(CAPABILITY_FR / totalFr) * 100}%`
  const vendorWidth = `${(1 / totalFr) * 100}%`

  const activeVendor = vendorList[selectedVendor]
  const hasTable = vendorList.length > 0 && rowList.length > 0

  return (
    <section className={`qw-section ${styles.section}`}>
      <div className="qw-shell">
        {heading ? <h2 className={`qw-h2 ${styles.heading}`}>{heading}</h2> : null}
        {lead ? <p className={`qw-lead ${styles.lead}`}>{lead}</p> : null}

        {hasTable ? (
          <>
            {/* ---------- Desktop (>= 900px): a real table ---------- */}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <colgroup>
                  <col style={{ width: capabilityWidth }} />
                  {vendorList.map((vendor, index) => (
                    <col key={vendor.id ?? index} style={{ width: vendorWidth }} />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col" className={`${styles.headCell} ${styles.headCapability}`}>
                      Capability
                    </th>
                    {vendorList.map((vendor, index) => (
                      <th
                        key={vendor.id ?? index}
                        scope="col"
                        className={
                          vendor.highlighted
                            ? `${styles.headCell} ${styles.headVendor} ${styles.headVendorHighlighted}`
                            : `${styles.headCell} ${styles.headVendor}`
                        }
                      >
                        {vendor.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowList.map((row, rowIndex) => (
                    <tr key={row.id ?? rowIndex}>
                      <th scope="row" className={styles.capabilityCell}>
                        {row.capability}
                      </th>
                      {vendorList.map((vendor, vendorIndex) => (
                        <td
                          key={vendor.id ?? vendorIndex}
                          className={
                            vendor.highlighted
                              ? `${styles.valueCell} ${styles.valueCellHighlighted}`
                              : styles.valueCell
                          }
                        >
                          {cellValue(row, vendorIndex)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ---------- Below 900px: chip selector + one card per capability ---------- */}
            <div className={styles.cardsWrap}>
              <div className={styles.chips} role="group" aria-label="Choose a vendor to compare">
                {vendorList.map((vendor, index) => (
                  <button
                    key={vendor.id ?? index}
                    type="button"
                    aria-pressed={index === selectedVendor}
                    className={
                      index === selectedVendor
                        ? `${styles.chip} ${styles.chipActive}`
                        : styles.chip
                    }
                    onClick={() => setSelectedVendor(index)}
                  >
                    {vendor.name}
                  </button>
                ))}
              </div>

              <ul className={styles.cards}>
                {rowList.map((row, rowIndex) => (
                  <li key={row.id ?? rowIndex} className={styles.card}>
                    <div className={styles.cardCapability}>{row.capability}</div>
                    <div className={styles.cardValueRow}>
                      <span className={styles.cardVendor}>{activeVendor?.name}</span>
                      <span className={styles.cardValue}>{cellValue(row, selectedVendor)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}

        {note ? <p className={`qw-small ${styles.note}`}>{note}</p> : null}
      </div>
    </section>
  )
}

export default ComparisonTable
