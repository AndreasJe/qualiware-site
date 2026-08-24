import type { Author, Page } from '../../payload-types'
import styles from './PageShell.module.css'

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

const isAuthor = (value: unknown): value is Author =>
  typeof value === 'object' && value !== null && 'name' in value

/** Initials, so a byline still reads as a person before photos are uploaded. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

const Person = ({ author, label }: { author: Author; label: string }) => {
  const photo = author.photo && typeof author.photo === 'object' ? author.photo : null

  return (
    <div className={styles.person}>
      <div className={styles.avatar} aria-hidden={photo ? undefined : 'true'}>
        {photo?.url ? (
          <img src={photo.url} alt={photo.alt ?? author.name} className={styles.avatarImage} />
        ) : (
          <span className={styles.avatarInitials}>{initials(author.name)}</span>
        )}
      </div>

      <div className={styles.personText}>
        <span className={styles.bylineLabel}>{label}</span>
        <span className={styles.bylineName}>
          {author.linkedin ? (
            <a href={author.linkedin} rel="noopener noreferrer" className={styles.bylineLink}>
              {author.name}
            </a>
          ) : (
            author.name
          )}
        </span>
        <span className={styles.bylineRole}>{author.role}</span>
        <span className={styles.bylineCredentials}>{author.credentials}</span>
      </div>
    </div>
  )
}

/**
 * E-E-A-T signals, rendered as a byline strip.
 *
 * Experience        — `experienceNote`, first-hand grounding
 * Expertise         — the author's role and credentials
 * Authoritativeness — a named reviewer, and a profile a reader can verify
 * Trustworthiness   — an explicit last-reviewed date
 *
 * Author and reviewer come from the Authors collection, so a person's details
 * live in one place rather than being retyped on every page they touch.
 */
export const Authorship = ({ authorship }: { authorship?: Page['authorship'] }) => {
  if (!authorship) return null

  const author = isAuthor(authorship.author) ? authorship.author : null
  const reviewer = isAuthor(authorship.reviewer) ? authorship.reviewer : null
  const reviewed = formatDate(authorship.lastReviewed)

  if (!author && !reviewer && !reviewed && !authorship.experienceNote) return null

  return (
    <div className={styles.byline}>
      <div className={styles.bylineRow}>
        {author && <Person author={author} label="Written by" />}
        {reviewer && <Person author={reviewer} label="Reviewed by" />}

        {reviewed && (
          <div className={styles.person}>
            <div className={styles.personText}>
              <span className={styles.bylineLabel}>Last reviewed</span>
              <time className={styles.bylineName} dateTime={authorship.lastReviewed ?? undefined}>
                {reviewed}
              </time>
            </div>
          </div>
        )}
      </div>

      {authorship.experienceNote && (
        <p className={styles.experienceNote}>{authorship.experienceNote}</p>
      )}
    </div>
  )
}

/** Citations. Every external claim carries a source and a date. */
export const Sources = ({ sources }: { sources?: Page['sources'] }) => {
  if (!sources?.length) return null

  return (
    <section className={`qw-section ${styles.sourcesSection}`} aria-labelledby="sources-heading">
      <div className="qw-shell">
        <h2 id="sources-heading" className={`qw-eyebrow ${styles.sourcesHeading}`}>
          Sources &amp; references
        </h2>
        <ol className={styles.sourcesList}>
          {sources.map((source, i) => (
            <li key={source.id ?? i} className={styles.source}>
              <span className={styles.sourceLabel}>
                {source.url ? (
                  <a href={source.url} rel="noopener noreferrer" className={styles.sourceLink}>
                    {source.label}
                  </a>
                ) : (
                  source.label
                )}
              </span>
              <span className={styles.sourceMeta}>
                {[source.publisher, source.date].filter(Boolean).join(' · ')}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
