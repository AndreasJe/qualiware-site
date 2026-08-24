'use client'

import { useActionState } from 'react'
import { Arrow } from '../Arrow'
import { searchHelpCentre, type SearchState } from './actions'
import styles from './SupportHome.module.css'

const initial: SearchState = { status: 'idle' }

/**
 * Help-centre search. Results come from the Zoho Desk knowledge base via a
 * server action, and render in our own components — same type scale, same
 * arrow motif as the rest of the site.
 */
export const HelpCentreSearch = () => {
  const [state, action, pending] = useActionState(searchHelpCentre, initial)

  return (
    <div className={styles.searchWrap}>
      <form action={action} className={styles.searchForm} role="search">
        <label className="qw-sr" htmlFor="help-search">
          Search the help centre
        </label>
        <input
          id="help-search"
          name="q"
          type="search"
          className={styles.searchInput}
          placeholder="Search the help centre"
          defaultValue={state.query}
        />
        <button type="submit" className={styles.searchSubmit} disabled={pending}>
          <span className="qw-sr">Search</span>
          {pending ? (
            <span className={styles.searchPending} aria-hidden="true" />
          ) : (
            <Arrow width={26} stroke="var(--qw-green-deep)" strokeWidth={1.8} />
          )}
        </button>
      </form>

      <div className={styles.popular}>
        <span className={styles.popularLabel}>Popular:</span>
        {['licence key', 'single sign-on', 'publish failed', 'upgrade'].map((term) => (
          <span key={term} className={styles.popularTerm}>
            {term}
          </span>
        ))}
      </div>

      {state.status === 'ok' && (
        <div className={styles.results} aria-live="polite">
          <p className={styles.resultsCount}>
            {state.articles?.length ?? 0} article
            {state.articles?.length === 1 ? '' : 's'} for “{state.query}”
          </p>
          <ul className={styles.resultList}>
            {state.articles?.map((article) => (
              <li key={article.id}>
                <a href={article.url} className={styles.resultLink}>
                  <span className={styles.resultTitle}>{article.title}</span>
                  {article.summary && (
                    <span className={styles.resultSummary}>{article.summary}</span>
                  )}
                  {article.category && (
                    <span className={styles.resultCategory}>{article.category}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.status === 'unavailable' && (
        <p className={styles.searchNotice} role="status">
          {state.message}
        </p>
      )}
    </div>
  )
}
