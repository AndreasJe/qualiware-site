import { linkAllAccounts } from '../lib/zohoLink'

/**
 * Links Payload accounts to their Zoho Desk contacts.
 *
 *   npm run zoho:link          dry run — reports what would happen, writes nothing
 *   npm run zoho:link -- --commit   performs the links
 *
 * Dry run is the default deliberately: this writes the field that governs whose
 * support history a person can read, so it should be reviewed before it runs.
 *
 * Only ever links accounts where `zohoContactId` is null, and only on an exact,
 * unambiguous email match. Anything ambiguous is reported for a human to
 * resolve rather than guessed.
 */
const commit = process.argv.includes('--commit')

const { dryRun, considered, results } = await linkAllAccounts({ dryRun: !commit })

console.log(`\n${dryRun ? 'DRY RUN' : 'COMMITTING'} — ${considered} unlinked account(s)\n`)

const tally: Record<string, number> = {}

for (const { email, outcome } of results) {
  tally[outcome.status] = (tally[outcome.status] ?? 0) + 1

  switch (outcome.status) {
    case 'linked':
      console.log(`  ${dryRun ? 'would link' : 'linked'}   ${email} -> ${outcome.contactId}`)
      break
    case 'already-linked':
      console.log(`  skipped     ${email} — already linked`)
      break
    case 'no-match':
      console.log(`  no match    ${email} — create the Zoho contact first`)
      break
    case 'ambiguous':
      console.log(
        `  AMBIGUOUS   ${email} — ${outcome.count} contacts share this address; resolve in Zoho`,
      )
      break
    case 'unavailable':
      console.log(`  unavailable ${email} — ${outcome.message}`)
      break
  }
}

console.log(
  `\n${Object.entries(tally)
    .map(([status, count]) => `${status}: ${count}`)
    .join('  ')}`,
)

if (dryRun && (tally.linked ?? 0) > 0) {
  console.log('\nRe-run with --commit to apply.')
}

process.exit(0)
