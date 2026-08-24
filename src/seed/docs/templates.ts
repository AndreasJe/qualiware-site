import type { RichBlock } from '../index'

export type DocTemplate = {
  slug: string
  title: string
  category: string
  order: number
  appliesTo?: string
  excerpt: string
  audiences?: ('customer' | 'partner')[]
  body: RichBlock[]
}

/**
 * Template articles.
 *
 * These exist to show every element the docs renderer supports, so an editor
 * can open one in the admin panel, see how it is built, and copy the pattern:
 *
 *   - `{ h2 }` / `{ h3 }`  headings, which the on-this-page TOC indexes
 *   - `{ note }`           the ice-blue note block with a dark-green left rule
 *   - `{ code }`           a fenced code block on deep green
 *   - `{ ul }` / `{ ol }`  bullet and numbered lists
 *   - plain strings        body paragraphs
 *
 * They also carry deliberately distinctive vocabulary so full-text search can
 * be demonstrated — searching "ontology" or "webhook" should land here.
 */
export const templateArticles: DocTemplate[] = [
  {
    slug: 'article-template-reference',
    title: 'Article template — every element, annotated',
    category: 'getting-started',
    order: 5,
    appliesTo: '10.9 and later',
    excerpt:
      'The reference article. Shows every content element the docs support — headings, note blocks, code, lists — and explains when to use each.',
    body: [
      'This article is a template. It demonstrates every element the documentation renderer supports, so you can open it in the admin panel and copy the structure into a new article rather than inventing one.',
      { h2: 'Headings build the table of contents' },
      'Every level-two heading in an article appears in the “On this page” list in the right rail, with the neon marker tracking your scroll position. Level-three headings are for detail inside a section and are not indexed, which keeps the rail short enough to scan.',
      { h3: 'When to use a level-three heading' },
      'Use one when a section has two or three distinct sub-topics that a reader might need to skim. If you find yourself writing more than four in one section, the section probably wants to be two articles.',
      { h2: 'Note blocks carry the thing people miss' },
      'A note block is ice blue with a dark-green left rule. Reserve it for the consequence a reader will hit if they skip the paragraph above — not for restating what was just said.',
      {
        note: 'Publishing to the web portal is asynchronous. If the portal looks empty immediately after your first publish, the job is queued rather than failed — check the job log before changing configuration.',
      },
      { h2: 'Code blocks for anything a reader will copy' },
      'Code renders on deep green in monospace, and scrolls horizontally rather than wrapping mid-token. Use it for API calls, configuration snippets and command-line invocations.',
      {
        code: 'GET /api/v1/objects?type=BusinessProcess&modifiedSince=2026-01-01\nAuthorization: Bearer <token>\nAccept: application/json',
      },
      'Endpoint reference and authentication live in this documentation, never on the marketing site. The marketing site says what an integration syncs; this says how to authenticate to it.',
      { h2: 'Lists' },
      'Use a bullet list when order does not matter:',
      {
        ul: [
          'Repository — the ontology-driven object store',
          'Application services — modelling, governance and the API',
          'Web portal — the published, read-only view',
        ],
      },
      'Use a numbered list when it does:',
      {
        ol: [
          'Install the application services and let them create the schema',
          'Bring up the web portal and point it at the application service',
          'Publish once, and confirm the model appears in the portal',
        ],
      },
      { h2: 'How this article is stored' },
      'Every article is a record in the Docs collection. The body is a rich-text field, the category places it in the navigation tree, and the order field sets its position among its siblings. Renaming or moving a category rewrites the URL of every article beneath it automatically.',
    ],
  },

  {
    slug: 'search-and-find-articles',
    title: 'Searching the documentation',
    category: 'getting-started',
    order: 6,
    appliesTo: '10.9 and later',
    excerpt:
      'How documentation search works, what it matches, and why the whole wiki is open without a login.',
    body: [
      'Documentation search matches article titles, summaries and full body text. There is no login wall — the whole wiki is open, deliberately, because a customer who cannot find an answer opens a support case instead.',
      { h2: 'What search matches' },
      'Each article keeps a plain-text mirror of its body, so a search for a phrase buried in the third paragraph of an article will still find it. Rich text is stored as structured data, and searching that structure directly would match formatting rather than prose.',
      {
        ul: [
          'Article titles',
          'Article summaries, shown under each result',
          'Full body text, including headings, lists and note blocks',
        ],
      },
      {
        note: 'Search covers this documentation property only. The marketing site has its own search, and support cases are searched separately in the help centre.',
      },
      { h2: 'Finding things by browsing instead' },
      'The category tree on the left is the other way in. Nodes remember which sections you left open as you move between articles, and each one shows how many articles sit beneath it, including everything in its sub-categories.',
      { h3: 'A worked example' },
      'Search for the word ontology. It appears in the repository articles rather than in any title, so a title-only search would return nothing — this one returns the articles that actually discuss it.',
      { h2: 'If you cannot find something' },
      'Every article has a “Suggest an edit” link in the right rail. Use it. A missing article is a signal, and the fastest way to get one written is to say which question you were trying to answer.',
    ],
  },

  {
    slug: 'ontology-and-typed-relations',
    title: 'The ontology and typed relations',
    category: 'metamodel-and-ontology',
    order: 5,
    appliesTo: '10.8 and later',
    excerpt:
      'Why relationships in the repository carry meaning, and what that buys you when you ask the model a question.',
    body: [
      'The repository is ontology-driven. Objects have types, and so do the relationships between them — a process does not merely point at an application, it is supported by one. That distinction is what makes traversal reliable.',
      { h2: 'Why typed relations matter' },
      'An arrow on a diagram means whatever the person who drew it intended. A typed relation means the same thing every time, which is what lets impact analysis answer a question rather than suggest an answer.',
      {
        ul: [
          'Supports — an application supports a business process',
          'Owns — an organisational unit owns a capability',
          'Governs — a control governs a process',
          'Consumes — a process consumes an information object',
        ],
      },
      {
        note: 'Adding a new relation type changes what every existing query can traverse. Treat metamodel changes as governed changes, with the same review your content goes through.',
      },
      { h2: 'One object, many views' },
      'Because an application is a single object, it appears in the capability map, the process model and the risk register at once. Changing its owner changes it everywhere, and no view drifts out of step with another.',
      { h2: 'Querying relations through the API' },
      'Relations are traversable through the API, which is how the integration catalogue keeps external systems in step:',
      {
        code: 'GET /api/v1/objects/{id}/relations?type=Supports&depth=2\nAuthorization: Bearer <token>',
      },
      'Depth greater than three on a large repository will be slow. Filter by relation type rather than raising depth.',
    ],
  },

  {
    slug: 'webhooks-and-event-subscriptions',
    title: 'Webhooks and event subscriptions',
    category: 'api-reference',
    order: 5,
    appliesTo: '10.10 and later',
    excerpt:
      'Subscribe to repository events so downstream systems react to model changes instead of polling for them.',
    body: [
      'A webhook subscription tells the repository to post to an endpoint you control whenever a subscribed event occurs. Use them instead of polling — a nightly full export of a large repository is slow, and it misses everything that changed and changed back.',
      { h2: 'Creating a subscription' },
      {
        code: 'POST /api/v1/subscriptions\nAuthorization: Bearer <token>\nContent-Type: application/json\n\n{\n  "events": ["object.published", "object.deleted"],\n  "endpoint": "https://example.com/hooks/qualiware",\n  "secret": "<shared-secret>"\n}',
      },
      { h2: 'Verifying a delivery' },
      'Every delivery carries a signature header derived from the shared secret and the raw request body. Verify it before trusting the payload, and compare using a constant-time function rather than string equality.',
      {
        note: 'Deliveries are retried with backoff on any non-2xx response. Make your handler idempotent — the same event can legitimately arrive twice.',
      },
      { h2: 'Choosing events' },
      {
        ul: [
          'object.published — the model changed in a way portal readers can see',
          'object.deleted — an object was removed from the repository',
          'workflow.completed — a governance approval finished',
        ],
      },
      'Subscribe narrowly. A subscription to every event on a repository of any size will spend most of its deliveries on changes your integration does not care about.',
    ],
  },

  {
    slug: 'publishing-approval-checklist',
    title: 'Publishing checklist for approvers',
    category: 'publishing-web-portal',
    order: 5,
    appliesTo: '10.9 and later',
    excerpt:
      'What to check before approving a publish, and what readers see when you get it wrong.',
    body: [
      'Approving a publish makes a version visible to everyone with portal access. This checklist is the short version of what an approver should confirm before clicking through.',
      { h2: 'Before you approve' },
      {
        ol: [
          'Confirm the change has a stated reason — “updated” is not a reason',
          'Check that every new object has an owner assigned',
          'Open the affected process in the portal preview, not the modelling client',
          'Confirm no control or risk lost its link during the edit',
        ],
      },
      {
        note: 'A published version stays in the history permanently. Withdrawing one is possible, but readers who bookmarked it will see it disappear — prefer publishing a correction.',
      },
      { h2: 'What readers actually see' },
      'The portal shows the approval date and the approver on every published view. That is the whole point of the governance workflow: a reader can tell whether they are looking at something current, without asking anyone.',
      { h3: 'If a publish looks wrong' },
      'Check the job log first. A publish that appears to have done nothing has usually been queued behind a larger one, and cancelling it mid-run leaves the portal cache half-updated.',
    ],
  },
]
