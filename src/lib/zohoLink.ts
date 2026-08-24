import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { deskFetch, isZohoConfigured } from './zohoClient'

/**
 * Linking a Payload account to its Zoho Desk contact.
 *
 * The threat this guards against: `zohoContactId` is the authoritative support
 * identity. Whoever holds it can read that contact's ticket history. So the
 * link must never be derivable from anything a user controls.
 *
 * Four rules, all enforced below:
 *
 *   1. WRITE-ONCE. A link is only ever set on an account where it is null.
 *      Re-linking is an administrative act, never automatic — otherwise
 *      changing an input could move someone onto another contact.
 *   2. EXACT SINGLE MATCH ONLY. Zero matches leaves it unlinked. Two or more
 *      leaves it unlinked and flags for staff. Never guess.
 *   3. SERVER-SIDE ONLY. The email searched is the stored account email, which
 *      is staff-only, never a value from the request.
 *   4. AUDITED. Every automatic link records how it happened.
 *
 * Field-level access on `zohoContactId` blocks the API route entirely; this
 * module is the only sanctioned writer, and it runs with `overrideAccess`.
 */

export type LinkOutcome =
  | { status: 'linked'; contactId: string }
  | { status: 'already-linked'; contactId: string }
  | { status: 'no-match' }
  | { status: 'ambiguous'; count: number }
  | { status: 'unavailable'; message: string }

type ZohoContact = { id?: string | number; email?: string }

/**
 * Finds the Zoho contact for an email. Returns the id only on an exact,
 * unambiguous, case-insensitive match — Zoho's search is fuzzy, so a substring
 * hit on someone else's address must never count.
 */
export async function findContactByEmail(
  email: string,
): Promise<{ status: 'one'; id: string } | { status: 'none' } | { status: 'many'; count: number }> {
  const params = new URLSearchParams({ email, limit: '10' })
  const response = await deskFetch(`/contacts/search?${params}`, {
    cache: 'no-store',
  } as RequestInit)

  if (!response?.ok) return { status: 'none' }

  const json = (await response.json()) as { data?: ZohoContact[] }
  const wanted = email.trim().toLowerCase()

  const exact = (json.data ?? []).filter(
    (contact) => typeof contact.email === 'string' && contact.email.trim().toLowerCase() === wanted,
  )

  if (exact.length === 0) return { status: 'none' }
  if (exact.length > 1) return { status: 'many', count: exact.length }
  return { status: 'one', id: String(exact[0].id ?? '') }
}

/**
 * Links one account, if it is safe to do so.
 *
 * `dryRun` reports what would happen without writing, which is what the bulk
 * import uses so staff can review before anything is committed.
 */
export async function linkAccount(
  accountId: number,
  options: { dryRun?: boolean } = {},
): Promise<LinkOutcome> {
  if (!isZohoConfigured()) {
    return { status: 'unavailable', message: 'Zoho Desk is not configured.' }
  }

  const payload = await getPayload({ config: configPromise })

  const account = await payload.findByID({
    collection: 'accounts',
    id: accountId,
    depth: 0,
    overrideAccess: true,
  })

  if (!account) return { status: 'unavailable', message: 'No such account.' }

  // Rule 1: write-once.
  if (account.zohoContactId) {
    return { status: 'already-linked', contactId: account.zohoContactId }
  }

  // Rule 3: search the STORED email, never a request value.
  const found = await findContactByEmail(account.email)

  // Rule 2: exact single match only.
  if (found.status === 'none') return { status: 'no-match' }
  if (found.status === 'many') return { status: 'ambiguous', count: found.count }

  if (options.dryRun) return { status: 'linked', contactId: found.id }

  await payload.update({
    collection: 'accounts',
    id: accountId,
    data: { zohoContactId: found.id },
    overrideAccess: true, // the only sanctioned writer
  })

  // Rule 4: audited.
  payload.logger.info(
    `zoho-link: account ${accountId} (${account.email}) linked to contact ${found.id} by exact email match`,
  )

  return { status: 'linked', contactId: found.id }
}

/**
 * Bulk link every unlinked account. Defaults to a dry run so it can be pointed
 * at production safely and the result reviewed before committing.
 */
export async function linkAllAccounts(options: { dryRun?: boolean } = {}) {
  const dryRun = options.dryRun ?? true
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'accounts',
    where: { zohoContactId: { exists: false } },
    limit: 0,
    depth: 0,
    overrideAccess: true,
  })

  const results: { email: string; id: number; outcome: LinkOutcome }[] = []

  for (const account of docs) {
    results.push({
      email: account.email,
      id: account.id,
      outcome: await linkAccount(account.id, { dryRun }),
    })
  }

  return { dryRun, considered: docs.length, results }
}
