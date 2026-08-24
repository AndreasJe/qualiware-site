import type { Page } from '../../payload-types'
import styles from './PageShell.module.css'

/**
 * The identifying element of a regulation page. Buyers arrive with a deadline,
 * not a discipline, so the instrument, dates, scope and penalty come first —
 * before any product framing — and the requirement table states what has to be
 * evidenced, with an article reference for each row.
 */
export const RegulationFacts = ({ regulation }: { regulation?: Page['regulation'] }) => {
  if (!regulation) return null

  const facts = [
    { term: 'Legal instrument', value: regulation.instrument },
    { term: 'In force since', value: regulation.inForceSince },
    { term: 'Compliance deadline', value: regulation.deadline },
    { term: 'Applies to', value: regulation.appliesTo },
    { term: 'Maximum penalty', value: regulation.penalty },
  ].filter((fact) => Boolean(fact.value))

  if (!facts.length && !regulation.requirements?.length) return null

  return (
    <section className={`qw-section ${styles.regSection}`} aria-labelledby="reg-facts-heading">
      <div className="qw-shell">
        <h2 id="reg-facts-heading" className={`qw-eyebrow ${styles.regHeading}`}>
          At a glance
        </h2>

        {facts.length > 0 && (
          <dl className={styles.factGrid}>
            {facts.map((fact) => (
              <div key={fact.term} className={styles.fact}>
                <dt className={styles.factTerm}>{fact.term}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {Boolean(regulation.requirements?.length) && (
          <div className={styles.reqWrap}>
            <h3 className={`qw-h3 ${styles.reqHeading}`}>
              What it requires, and what you must be able to show
            </h3>

            {/* Desktop: a real table. Mobile: one card per requirement. */}
            <table className={styles.reqTable}>
              <thead>
                <tr>
                  <th scope="col">Requirement</th>
                  <th scope="col">Evidence expected</th>
                  <th scope="col">Reference</th>
                </tr>
              </thead>
              <tbody>
                {regulation.requirements?.map((row, i) => (
                  <tr key={row.id ?? i}>
                    <th scope="row">{row.requirement}</th>
                    <td>{row.evidence}</td>
                    <td className={styles.reqArticle}>{row.article}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className={styles.reqCards}>
              {regulation.requirements?.map((row, i) => (
                <li key={row.id ?? i} className={styles.reqCard}>
                  <div className={styles.reqCardTitle}>{row.requirement}</div>
                  {row.evidence && <p className={styles.reqCardBody}>{row.evidence}</p>}
                  {row.article && <div className={styles.reqCardArticle}>{row.article}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
