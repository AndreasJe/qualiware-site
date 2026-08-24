import type { DocTemplate } from './templates'

/**
 * Audience-restricted articles.
 *
 * `audiences` is empty on every other article, which means public. Listing an
 * audience here restricts the article to accounts holding it — see
 * `audienceVisibility` in `src/access`.
 *
 * These exist so the gating is demonstrable: sign in as the partner account and
 * the partner article appears in the tree, the search results and the sitemap;
 * sign out and it 404s.
 */
export const restrictedArticles: (DocTemplate & { audiences: ('customer' | 'partner')[] })[] = [
  {
    slug: 'partner-implementation-playbook',
    title: 'Partner implementation playbook',
    category: 'getting-started',
    order: 90,
    audiences: ['partner'],
    appliesTo: '10.9 and later',
    excerpt:
      'Partner-only. How to scope, price and run a QualiWare implementation, including the discovery questions that predict a difficult delivery.',
    body: [
      'This article is visible to partner accounts only. It exists to show audience gating working — sign out and it returns a 404 rather than a sign-in wall, because advertising the existence of restricted material is itself a leak.',
      { h2: 'Scoping a first engagement' },
      'The single best predictor of a difficult delivery is a customer who cannot name the person who will own the model after go-live. Ask that question first, and treat a vague answer as a scoping risk rather than a detail to settle later.',
      {
        ol: [
          'Identify the model owner by name, before estimating',
          'Agree the first published view — one, not a programme',
          'Confirm who approves a publish, and their availability',
          'Fix the metamodel scope in writing; extensions are a change request',
        ],
      },
      {
        note: 'Do not quote a fixed price against an unfixed metamodel. Metamodel scope creep is the most common cause of margin loss on QualiWare implementations.',
      },
      { h2: 'Discovery questions that matter' },
      {
        ul: [
          'What decision will this model inform in the first quarter?',
          'Which existing tool are you retiring, and who owns it today?',
          'Who is accountable when the model goes stale?',
          'Is there an approval workflow already, or are we creating one?',
        ],
      },
      { h2: 'Deal registration' },
      'Register the opportunity before the second customer meeting. Registration governs margin and protects against channel conflict; retrospective registration is not accepted.',
    ],
  },

  {
    slug: 'production-upgrade-runbook',
    title: 'Production upgrade runbook',
    category: 'administration',
    order: 90,
    /*
     * Deliberately NOT gated.
     *
     * A customer hitting an upgrade problem at 2am should find this, and a
     * competitor learns nothing from it. Gate on cost, not on value — the
     * partner playbook above is commercial, this is operational.
     */
    audiences: [],
    appliesTo: '10.9 and later',
    excerpt:
      'Customer and partner accounts. The sequence for upgrading a production repository, including the rollback point.',
    body: [
      'Visible to customers and partners — an article can list more than one audience. Anonymous readers get a 404.',
      { h2: 'Before the window' },
      {
        ol: [
          'Take a full repository backup and verify it restores somewhere else',
          'Record the current schema version and any metamodel extensions',
          'Drain the publish queue — an in-flight job across an upgrade is the usual cause of a half-updated portal',
          'Confirm the rollback decision-maker is reachable for the whole window',
        ],
      },
      {
        note: 'The rollback point is the verified backup, not the upgrade installer. An installer that fails halfway can leave the schema partially migrated.',
      },
      { h2: 'Verifying afterwards' },
      'Publish one known-good process and compare the portal output against the pre-upgrade version. A successful installer is not evidence that publishing still works.',
      {
        code: 'GET /api/v1/system/version\nAuthorization: Bearer <token>\nAccept: application/json',
      },
    ],
  },
]
