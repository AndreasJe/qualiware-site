/**
 * QualiWare seed — populates all three tenants with the final copy from the
 * design handoff (`design_handoff_qualiware_site/README.md` + the artboards in
 * `QualiWare Website.dc.html`).
 *
 * Run with `npm run seed`. Idempotent: every document is looked up by its
 * unique field first and updated rather than duplicated.
 *
 * Create order matters: tenants -> user -> categories -> docs -> partners ->
 * integrations -> pages (pages last, because `caseStudyCards` references the
 * real ids of the case-study pages).
 *
 * Every image field is a placeholder carrying the shot brief. No media is
 * uploaded or referenced.
 */
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Doc, Page } from '../payload-types'
import type { SeedAuthorship } from './types'

import { platformPages } from './pages/platform'
import { platformApiPages } from './pages/platform-api'
import { solutionPages } from './pages/solutions'
import { regulationPages } from './pages/regulations'
import { resourcePages, companyPages, legalPages, utilityPages } from './pages/resources'
import { partnerTenantPages } from './pages/partners'
import { templateArticles } from './docs/templates'
import { restrictedArticles } from './docs/restricted'

/** Shape every page module in `./pages` exports. */
type SeedPage = {
  title: string
  slug: string
  pageType?: Page['pageType']
  seo?: Page['seo']
  authorship?: SeedAuthorship
  sources?: Page['sources']
  regulation?: Page['regulation']
  relatedCapabilitySlugs?: string[]
  layout: NonNullable<Page['layout']>
}

type Layout = NonNullable<Page['layout']>

/* ------------------------------------------------------------------ *
 * Lexical helpers
 * ------------------------------------------------------------------ */

/**
 * A block in an article body.
 *
 * `string`   paragraph
 * `{h2}`     section heading (indexed by the on-this-page TOC)
 * `{h3}`     sub-heading
 * `{note}`   the ice-blue NOTE block with a dark-green left rule
 * `{code}`   fenced code block — a paragraph of inline-code text, which is how
 *            Lexical's default feature set expresses one
 * `{ul}`     bullet list
 * `{ol}`     numbered list
 */
export type RichBlock =
  | string
  | { h2: string }
  | { h3: string }
  | { note: string }
  | { code: string }
  | { ul: string[] }
  | { ol: string[] }

const textNode = (text: string) => ({
  type: 'text',
  text,
  version: 1,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
})

const BASE = { version: 1, direction: 'ltr' as const, format: '' as const, indent: 0 }

/** Lexical's inline-code format bit. */
const IS_CODE = 16

const paragraph = (children: unknown[], textFormat = 0) => ({
  ...BASE,
  type: 'paragraph',
  textFormat,
  children,
})

const heading = (tag: 'h2' | 'h3', text: string) => ({
  ...BASE,
  type: 'heading',
  tag,
  children: [textNode(text)],
})

const list = (tag: 'ul' | 'ol', items: string[]) => ({
  ...BASE,
  type: 'list',
  listType: tag === 'ul' ? 'bullet' : 'number',
  tag,
  start: 1,
  children: items.map((item, i) => ({
    ...BASE,
    type: 'listitem',
    value: i + 1,
    checked: undefined,
    children: [textNode(item)],
  })),
})

const toNode = (block: RichBlock): unknown => {
  if (typeof block === 'string') return paragraph([textNode(block)])
  if ('h2' in block) return heading('h2', block.h2)
  if ('h3' in block) return heading('h3', block.h3)
  if ('ul' in block) return list('ul', block.ul)
  if ('ol' in block) return list('ol', block.ol)
  if ('note' in block) {
    return { ...BASE, type: 'quote', children: [textNode(block.note)] }
  }
  // A paragraph whose text is entirely inline-code renders as a fenced block.
  return paragraph([{ ...textNode(block.code), format: IS_CODE }], IS_CODE)
}

/** Turns an array of blocks into Lexical JSON. */
const rich = (blocks: RichBlock[]) =>
  ({
    root: { ...BASE, type: 'root', children: blocks.map(toNode) },
  }) as unknown as NonNullable<Doc['body']>

/* ------------------------------------------------------------------ *
 * Content data — docs category tree
 * ------------------------------------------------------------------ */

type CategorySeed = { slug: string; title: string; parent?: string; order: number }

/**
 * Six top-level categories (artboard 1k) with `order` in tens so categories
 * can be inserted between them later. 47 categories over three levels, so the
 * collapsible tree can be tested at realistic scale.
 */
const categories: CategorySeed[] = [
  // ---- 1. Getting started -----------------------------------------------
  { slug: 'getting-started', title: 'Getting started', order: 10 },
  { slug: 'installation', title: 'Installation', parent: 'getting-started', order: 10 },
  { slug: 'install-windows-server', title: 'Windows Server', parent: 'installation', order: 10 },
  { slug: 'install-cloud', title: 'Cloud provisioning', parent: 'installation', order: 20 },
  { slug: 'first-steps', title: 'First steps', parent: 'getting-started', order: 20 },
  { slug: 'users-and-roles', title: 'Users & roles', parent: 'getting-started', order: 30 },
  { slug: 'publishing-web-portal', title: 'Publishing to the web portal', parent: 'getting-started', order: 40 },

  // ---- 2. Modelling ------------------------------------------------------
  { slug: 'modelling', title: 'Modelling', order: 20 },
  { slug: 'diagram-types', title: 'Diagram types', parent: 'modelling', order: 10 },
  { slug: 'process-diagrams', title: 'Process diagrams', parent: 'diagram-types', order: 10 },
  { slug: 'architecture-diagrams', title: 'Architecture diagrams', parent: 'diagram-types', order: 20 },
  { slug: 'metamodel-and-ontology', title: 'Metamodel & ontology', parent: 'modelling', order: 20 },
  { slug: 'object-types', title: 'Object types', parent: 'metamodel-and-ontology', order: 10 },
  { slug: 'relation-types', title: 'Relation types', parent: 'metamodel-and-ontology', order: 20 },
  { slug: 'relations-and-traceability', title: 'Relations and traceability', parent: 'modelling', order: 30 },
  { slug: 'templates-and-conventions', title: 'Templates & conventions', parent: 'modelling', order: 40 },
  { slug: 'validation-rules', title: 'Validation rules', parent: 'modelling', order: 50 },

  // ---- 3. Governance, risk & compliance ---------------------------------
  { slug: 'grc', title: 'Governance, risk & compliance', order: 30 },
  { slug: 'control-libraries', title: 'Control libraries', parent: 'grc', order: 10 },
  { slug: 'risk-registers', title: 'Risk registers', parent: 'grc', order: 20 },
  { slug: 'audit-workflows', title: 'Audit workflows', parent: 'grc', order: 30 },
  { slug: 'framework-mappings', title: 'Framework mappings', parent: 'grc', order: 40 },
  { slug: 'framework-nis2', title: 'NIS2', parent: 'framework-mappings', order: 10 },
  { slug: 'framework-dora', title: 'DORA', parent: 'framework-mappings', order: 20 },
  { slug: 'framework-iso-27001', title: 'ISO 27001', parent: 'framework-mappings', order: 30 },

  // ---- 4. Administration -------------------------------------------------
  { slug: 'administration', title: 'Administration', order: 40 },
  { slug: 'repository-configuration', title: 'Repository configuration', parent: 'administration', order: 10 },
  { slug: 'access-control', title: 'Access control', parent: 'administration', order: 20 },
  { slug: 'single-sign-on', title: 'Single sign-on', parent: 'access-control', order: 10 },
  { slug: 'role-design', title: 'Role design', parent: 'access-control', order: 20 },
  { slug: 'backup-and-restore', title: 'Backup & restore', parent: 'administration', order: 30 },
  { slug: 'monitoring-and-performance', title: 'Monitoring & performance', parent: 'administration', order: 40 },
  { slug: 'upgrades', title: 'Upgrades', parent: 'administration', order: 50 },

  // ---- 5. API reference --------------------------------------------------
  { slug: 'api-reference', title: 'API reference', order: 50 },
  { slug: 'rest-endpoints', title: 'REST endpoints', parent: 'api-reference', order: 10 },
  { slug: 'endpoint-objects', title: 'Objects', parent: 'rest-endpoints', order: 10 },
  { slug: 'endpoint-relations', title: 'Relations', parent: 'rest-endpoints', order: 20 },
  { slug: 'endpoint-diagrams', title: 'Diagrams', parent: 'rest-endpoints', order: 30 },
  { slug: 'authentication', title: 'Authentication', parent: 'api-reference', order: 20 },
  { slug: 'webhooks', title: 'Webhooks', parent: 'api-reference', order: 30 },
  { slug: 'rate-limits', title: 'Rate limits', parent: 'api-reference', order: 40 },
  { slug: 'sdks-and-samples', title: 'SDKs & samples', parent: 'api-reference', order: 50 },

  // ---- 6. Release notes --------------------------------------------------
  { slug: 'release-notes', title: 'Release notes', order: 60 },
  { slug: 'qualiware-10-10', title: 'QualiWare 10.10', parent: 'release-notes', order: 10 },
  { slug: 'qualiware-10-9', title: 'QualiWare 10.9', parent: 'release-notes', order: 20 },
  { slug: 'qualiware-10-8', title: 'QualiWare 10.8', parent: 'release-notes', order: 30 },
  { slug: 'deprecations', title: 'Deprecations', parent: 'release-notes', order: 40 },
]

/* ------------------------------------------------------------------ *
 * Content data — docs articles
 * ------------------------------------------------------------------ */

type DocSeed = {
  slug: string
  title: string
  category: string
  order: number
  excerpt: string
  appliesTo: string
  audiences?: ('customer' | 'partner')[]
  body: RichBlock[]
}

const docs: DocSeed[] = [
  {
    slug: 'install-on-windows-server',
    title: 'Install QualiWare on Windows Server',
    category: 'install-windows-server',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Prerequisites, service accounts and the order in which the components come up.',
    body: [
      'A QualiWare installation is three parts: the repository database, the application services and the web portal. They can share a host for a pilot, but a production repository should have its own database instance.',
      { h2: 'Before you start' },
      'You need a service account with rights to create the database, an inbound HTTPS certificate for the portal host, and a decision on whether authentication goes through your identity provider from day one. Retro-fitting single sign-on later means re-mapping every user account.',
      { h2: 'Install the components' },
      'Run the installer on the application host first and let it create the repository schema. Bring the web portal up afterwards and point it at the application service; the portal caches the published model, so it will look empty until the first publish completes.',
      { h2: 'Verify the installation' },
      'Sign in as the service account, create a throwaway process diagram, publish it and confirm it appears in the portal. If the portal returns an empty result set, the publish job is queued rather than failed — check the job log before touching configuration.',
    ],
  },
  {
    slug: 'provision-a-cloud-repository',
    title: 'Provision a cloud repository',
    category: 'install-cloud',
    order: 10,
    appliesTo: '10.10 and later',
    excerpt: 'What QualiWare provisions for you in the EU-hosted cloud, and what you still own.',
    body: [
      'Cloud repositories are provisioned per environment. Most organizations start with two — a production repository and a sandbox for metamodel changes — and add a third for training later.',
      { h2: 'What you supply' },
      'A tenant name, the identity provider you want federated, and the list of initial administrators. Everything else is provisioned and patched by QualiWare.',
      { h2: 'What stays yours' },
      'The model, the metamodel and the publishing configuration. Export is available at any time through the REST API, so a cloud repository can be moved on-premise without a migration project.',
    ],
  },
  {
    slug: 'create-your-first-model',
    title: 'Create your first model',
    category: 'first-steps',
    order: 10,
    appliesTo: '10.8 and later',
    excerpt: 'Model one real process end to end before you model anything at scale.',
    body: [
      'Resist the urge to start with a capability map of the whole organization. Model one process that somebody already argues about — order intake, incident handling, supplier onboarding — and take it all the way through review and publishing.',
      { h2: 'Pick the process' },
      'A good first process has a named owner, between five and fifteen steps, and at least one hand-off between departments. That hand-off is where the model earns its keep.',
      { h2: 'Model it' },
      'Create the process diagram, add the roles that perform each step, then attach the applications the steps run on. The relations are the point: a diagram with no relations is a picture, not a model.',
      { h2: 'Publish it' },
      'Send it through review, publish to the web portal and send the link to the people who perform the process. Their corrections in the first week are worth more than another month of modelling.',
    ],
  },
  {
    slug: 'your-first-two-weeks',
    title: 'Your first two weeks',
    category: 'first-steps',
    order: 20,
    appliesTo: '10.9 and later',
    excerpt: 'Set up the repository, model your first process, add owners and review cycles, publish to the web portal.',
    body: [
      'This is the sequence we recommend to every new repository owner. It is deliberately short: four steps over two weeks, each of which produces something a colleague can look at.',
      { h2: 'Week one' },
      'Set up the repository and agree the naming convention. Model your first process and get it reviewed by the person who owns it in real life.',
      { h2: 'Week two' },
      'Add owners and review cycles so the model has a maintenance rhythm before it has volume. Publish to the web portal and measure whether anybody opens it.',
      'If nobody opens the portal in week three, the problem is not the model — it is that the content does not answer a question anybody has. Go back and model the process people argue about.',
    ],
  },
  {
    slug: 'add-users-and-assign-roles',
    title: 'Add users and assign roles',
    category: 'users-and-roles',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Editors, reviewers, owners and readers — and why readers should always outnumber editors.',
    body: [
      'QualiWare separates the people who change the model from the people who read it. Readers need no licence-consuming editor rights, which is why a published management system can reach every employee.',
      { h2: 'The four roles' },
      'Editors create and change objects. Reviewers approve changes. Owners are accountable for a named part of the model and appear on the published pages. Readers consume the portal.',
      { h2: 'Assigning them' },
      'Assign roles to groups from your identity provider rather than to individuals. Individual grants are the reason access reviews take a week.',
    ],
  },
  {
    slug: 'publish-to-the-web-portal',
    title: 'Publish to the web portal',
    category: 'publishing-web-portal',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'How a publish job builds the portal, and what to check when a page does not appear.',
    body: [
      'Publishing renders the approved state of the model into the web portal. It never publishes work in progress, which is why the portal can be linked from an intranet without a disclaimer.',
      { h2: 'Run a publish' },
      'Select the scope — a folder, a process hierarchy or the whole repository — and queue the job. Incremental publishes take seconds; a full repository publish is an overnight job on a large model.',
      { h2: 'When a page is missing' },
      'The three usual causes, in order of likelihood: the object is not approved, the object is outside the published scope, or the reader lacks access to the folder. Check them in that order.',
    ],
  },
  {
    slug: 'choosing-a-diagram-type',
    title: 'Choosing a diagram type',
    category: 'diagram-types',
    order: 10,
    appliesTo: '10.8 and later',
    excerpt: 'The question the diagram has to answer decides the type — not the preference of the modeller.',
    body: [
      'Every diagram type in QualiWare exists to answer a particular question. Choosing by habit is how a repository ends up with the same information drawn four ways.',
      { h2: 'Match type to question' },
      'Use a process diagram for "who does what, in what order". Use an architecture diagram for "what runs on what". Use a capability map for "what are we able to do", and never for "what systems do we own".',
      { h2: 'One object, many views' },
      'The same application object appears in the architecture diagram, in the process diagrams of the processes it supports and in the risk view. You are not duplicating it — you are looking at it from a different side.',
    ],
  },
  {
    slug: 'process-diagram-conventions',
    title: 'Process diagram conventions',
    category: 'process-diagrams',
    order: 10,
    appliesTo: '10.8 and later',
    excerpt: 'Conventions that keep a process library readable once it passes a few hundred diagrams.',
    body: [
      'Conventions matter more than notation. A library where every diagram reads the same way survives a change of modeller; one where each author had their own style does not.',
      { h2: 'Level of detail' },
      'Three levels is usually enough: value chain, process, procedure. If a diagram needs a fourth level to be understood, the process underneath it is probably two processes.',
      { h2: 'Naming' },
      'Verb plus object, in the present tense: "Approve invoice", not "Invoice approval process". The published portal reads as instructions rather than as an inventory.',
    ],
  },
  {
    slug: 'metamodel-basics',
    title: 'Metamodel basics',
    category: 'metamodel-and-ontology',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'What the ontology defines, and why impact analysis is a query rather than an interpretation.',
    body: [
      'An ontology defines what a process, application, control or capability is, and which relations are legal between them. That is why a question about impact is a query rather than an interpretation.',
      { h2: 'Types and relations' },
      'Every object has a type. Every type declares the relations it may participate in and the direction they run. A relation that is not declared cannot be created, which is what keeps a large repository queryable.',
      { h2: 'Changing the metamodel' },
      'Metamodel changes are repository-wide. Make them in the sandbox, review the effect on existing diagrams, and only then promote. Agree the naming convention before you add a type, not after.',
    ],
  },
  {
    slug: 'object-types-and-properties',
    title: 'Object types and their properties',
    category: 'object-types',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Which properties belong on the type, which belong on the instance, and which belong nowhere.',
    body: [
      'The temptation with a new repository is to add every attribute somebody asks for. Six months later half of them are empty and nobody trusts the other half.',
      { h2: 'A property earns its place' },
      'Add a property only when somebody will query or report on it. If the answer to "who reads this field" is nobody, the field is documentation of an intention rather than data.',
      { h2: 'Mandatory fields' },
      'Make a property mandatory only if a modeller can actually know the value at the moment of creation. Mandatory fields that cannot be filled produce placeholder values, which are worse than blanks.',
    ],
  },
  {
    slug: 'relation-types-and-when-to-add-one',
    title: 'Relation types and when to add one',
    category: 'relation-types',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Adding a relation type affects every diagram in the repository. Agree the convention first.',
    body: [
      'Relation types are part of the metamodel. Adding one affects every diagram in the repository, so agree the naming convention first.',
      { h2: 'When an existing type will do' },
      'Most requests for a new relation type are really requests for a property on an existing one. "Supports, but only partially" is a property of the relation, not a second kind of support.',
      { h2: 'When a new type is justified' },
      'A new type is justified when the two relations answer different questions and would be queried separately. "Satisfies" and "documents" look similar and are not: one is a compliance claim, the other is a pointer.',
    ],
  },
  {
    slug: 'linking-requirements-to-processes',
    title: 'Linking requirements to the processes that satisfy them',
    category: 'relations-and-traceability',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt:
      'How to attach a requirement to the processes, controls and applications that satisfy it, and how those links behave when the underlying objects change.',
    body: [
      'Traceability is the reason the model is worth maintaining. This article covers how to attach a requirement to the processes, controls and applications that satisfy it, and how those links behave when the underlying objects change.',
      { h2: 'Before you start' },
      'You need edit rights on the repository and at least one published process hierarchy. If you are working in a governed environment, check whether your organization requires a change request before adding relation types.',
      'Note: relation types are part of the metamodel. Adding one affects every diagram in the repository, so agree the naming convention first.',
      { h2: 'Create the relation' },
      'Open the requirement, choose Add relation, and pick the target object. The relation is stored on both objects, so it appears in the process view as well as in the requirement view.',
      'GET /api/v1/objects/{id}/relations?type=satisfiedBy&depth=2',
      { h2: 'Verify the trace' },
      'Run the traceability report from the requirement. Every process in the result should have an owner; unowned processes are the usual reason an audit trail breaks.',
      { h2: 'Common problems' },
      'If a relation disappears after a merge, the target object was probably replaced rather than edited. Re-point the relation to the surviving object and record the change in the review log.',
    ],
  },
  {
    slug: 'templates-and-naming-conventions',
    title: 'Templates and naming conventions',
    category: 'templates-and-conventions',
    order: 10,
    appliesTo: '10.8 and later',
    excerpt: 'Templates make the convention the path of least resistance instead of a document nobody reads.',
    body: [
      'A naming convention written in a Word document is a suggestion. A naming convention built into a template is a convention.',
      { h2: 'What to put in a template' },
      'The diagram frame, the mandatory properties, the default owner role and the review cycle. A modeller starting from the template should not have to remember anything.',
      { h2: 'Keeping templates current' },
      'Version templates alongside the metamodel. When a template changes, existing diagrams do not — which is correct, but it means a template change needs a plan for the back catalogue.',
    ],
  },
  {
    slug: 'validation-rules-on-save',
    title: 'Validation rules on save',
    category: 'validation-rules',
    order: 10,
    appliesTo: '10.10 and later',
    excerpt: 'Typed relations are validated on save, so a broken model cannot be committed in the first place.',
    body: [
      'Validation runs when an object is saved, not when a report is run. The difference matters: an invalid relation never enters the repository, so reports do not need to defend against it.',
      { h2: 'What is checked' },
      'Relation legality against the metamodel, mandatory properties, and any custom rules the repository owner has configured — for example that every published process has an owner.',
      { h2: 'Working with a failing save' },
      'The validation message names the object and the rule. Fix the object; do not disable the rule. A rule that is regularly disabled is a rule the metamodel got wrong.',
    ],
  },
  {
    slug: 'build-a-control-library',
    title: 'Build a control library',
    category: 'control-libraries',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Controls attached to the processes and systems they govern, rather than listed in a separate register.',
    body: [
      'A control library in QualiWare is not a list. Each control is attached to the processes, applications and information objects it governs, which is what makes coverage a query.',
      { h2: 'Structure the library' },
      'Group controls by the obligation they serve, not by the department that owns them. Departments reorganize; obligations do not.',
      { h2: 'Evidence' },
      'Attach evidence to the control, and the control to the process. An auditor asking "show me this working" then follows one path instead of three.',
    ],
  },
  {
    slug: 'maintain-a-risk-register',
    title: 'Maintain a risk register',
    category: 'risk-registers',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'A register that lives on the model shows which processes and applications a risk actually touches.',
    body: [
      'A spreadsheet risk register can tell you a risk exists. A register on the model can tell you which processes stop if it materialises.',
      { h2: 'Register a risk' },
      'Create the risk, relate it to the objects it threatens, and relate the controls that mitigate it. The relations are what turn a score into an impact statement.',
      { h2: 'Reviewing' },
      'Review risks on the same cycle as the processes they attach to. A risk reviewed annually against a process that changed quarterly is decorative.',
    ],
  },
  {
    slug: 'run-an-audit-workflow',
    title: 'Run an audit workflow',
    category: 'audit-workflows',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Audit preparation as a query against the governed model instead of a document-gathering exercise.',
    body: [
      'Audit preparation is expensive when the picture has to be rebuilt each time. When requirements link to the processes that satisfy them, preparation becomes a report.',
      { h2: 'Scope the audit' },
      'Start from the requirement set in scope and let the model produce the affected processes, controls and owners. That list is the audit scope.',
      { h2: 'During the audit' },
      'Answer from the published portal rather than from exports. The auditor sees the same version the organization sees, which removes an entire category of argument.',
    ],
  },
  {
    slug: 'map-nis2-onto-processes',
    title: 'Map NIS2 requirements onto processes',
    category: 'framework-nis2',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Mapping the directive onto the processes and systems you have already documented.',
    body: [
      'NIS2 arrives as a deadline rather than as a discipline. The fastest route is to map its requirements onto the processes and systems already in the repository, not to start a parallel programme.',
      { h2: 'Load the requirement set' },
      'Import the requirement structure, then relate each requirement to the controls that satisfy it. Requirements with no related control are the gap list.',
      { h2: 'Report coverage' },
      'Coverage is a query over the relations, so it updates as the model does. A coverage figure produced by hand is out of date the day after it is produced.',
    ],
  },
  {
    slug: 'dora-reporting-from-the-model',
    title: 'DORA reporting from the model',
    category: 'framework-dora',
    order: 20,
    appliesTo: '10.10 and later',
    audiences: ['customer'],
    excerpt:
      'Customer-only guidance: register of information, critical-function mapping and the reporting templates.',
    body: [
      'This article is restricted to signed-in customers because it contains the reporting templates and the mapping tables we maintain under our own regulatory obligations.',
      { h2: 'Register of information' },
      'The register is generated from the application and supplier objects already in the repository. Fields that regulators require and the model does not hold are listed in the template as explicit gaps rather than left blank.',
      { h2: 'Critical functions' },
      'Mark the business functions in scope, and the dependency chain — processes, applications, suppliers — is derived. Marking functions by hand in a spreadsheet is the step this replaces.',
    ],
  },
  {
    slug: 'repository-configuration-reference',
    title: 'Repository configuration reference',
    category: 'repository-configuration',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Every repository setting, what it affects, and whether changing it needs a restart.',
    body: [
      'Configuration is held in the repository rather than on the application host, so a configuration change follows the model between environments.',
      { h2: 'Settings that need a restart' },
      'Authentication, database connection and publishing target. Everything else takes effect on the next save.',
      { h2: 'Settings worth reviewing quarterly' },
      'Review cycle defaults, retention on old versions, and the publish scope. All three drift as the repository grows.',
    ],
  },
  {
    slug: 'design-a-role-model',
    title: 'Design a role model',
    category: 'role-design',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Grant to groups, not to people — and keep the number of distinct roles small enough to review.',
    body: [
      'A role model that cannot be reviewed in an afternoon will not be reviewed. Aim for a number of roles that fits on one page.',
      { h2: 'Group-based grants' },
      'Map identity-provider groups to QualiWare roles. Individual grants are the reason an access review turns into an archaeology project.',
      { h2: 'Separating edit from approve' },
      'The person who changes a process should not be the person who approves the change. Enforce this in the role model rather than in a policy document.',
    ],
  },
  {
    slug: 'configure-single-sign-on',
    title: 'Configure single sign-on',
    category: 'single-sign-on',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Federating QualiWare with your identity provider, and the claims it expects.',
    body: [
      'QualiWare federates with any provider that speaks SAML 2.0 or OpenID Connect. Group membership arrives as a claim and maps onto repository roles.',
      { h2: 'Claims' },
      'The provider must supply a stable subject identifier, an email address and the group claim you intend to map. A configuration that maps on email alone breaks the first time somebody changes their name.',
      { h2: 'Testing' },
      'Test with an account that holds exactly one group before you test with an administrator. An administrator account passes for the wrong reason.',
    ],
  },
  {
    slug: 'backup-and-restore',
    title: 'Backup and restore',
    category: 'backup-and-restore',
    order: 10,
    appliesTo: '10.8 and later',
    excerpt: 'What to back up, how often, and the restore rehearsal that proves the backup works.',
    body: [
      'A backup nobody has restored is a hypothesis. Rehearse a restore into the sandbox at least twice a year.',
      { h2: 'What to back up' },
      'The repository database and the publishing configuration. Portal caches are rebuilt by a publish and do not need to be backed up.',
      { h2: 'Restore rehearsal' },
      'Restore into an isolated environment, publish, and open three pages you know well. If the pages render, the backup is sound.',
    ],
  },
  {
    slug: 'monitor-repository-performance',
    title: 'Monitor repository performance',
    category: 'monitoring-and-performance',
    order: 10,
    appliesTo: '10.10 and later',
    excerpt: 'The four numbers worth watching on a growing repository, and what each one means when it moves.',
    body: [
      'Large repositories rarely slow down evenly. Watch four numbers and you will see the cause before users report the symptom.',
      { h2: 'The four numbers' },
      'Publish duration, average query time on the traceability report, object count growth per month, and the depth of the deepest relation chain in regular use.',
      { h2: 'When publish duration jumps' },
      'Almost always scope, not volume. Somebody has widened the publish scope rather than added content.',
    ],
  },
  {
    slug: 'plan-an-upgrade',
    title: 'Plan an upgrade',
    category: 'upgrades',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'What to test, in what order, and which deprecations to plan around.',
    body: [
      'Upgrades are routine, but a metamodel is not. Test the metamodel before you test the application.',
      { h2: 'Order of testing' },
      'Restore production into the sandbox, upgrade the sandbox, then run the validation report over the whole model. Relation types removed by a deprecation surface here rather than in production.',
      { h2: 'Then the application' },
      'Publishing, integrations and reports, in that order. Integrations are the most likely to need attention because they depend on endpoint shapes.',
    ],
  },
  {
    slug: 'rest-authentication',
    title: 'REST authentication',
    category: 'authentication',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Obtaining and refreshing a token, and the scopes the API recognises.',
    body: [
      'The REST API authenticates with a bearer token issued against a service principal. Interactive user credentials are not accepted, deliberately — an integration should be identifiable in the audit log.',
      { h2: 'Obtain a token' },
      'POST the client credentials to the token endpoint. Tokens are short-lived; refresh rather than caching for the lifetime of a job.',
      { h2: 'Scopes' },
      'Read scopes cover objects, relations and diagrams. Write scopes are granted per object type, so an integration that only creates applications cannot also edit controls.',
    ],
  },
  {
    slug: 'objects-endpoint',
    title: 'Objects endpoint',
    category: 'endpoint-objects',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Reading, filtering and paging repository objects.',
    body: [
      'The objects endpoint is the entry point for most integrations. It returns typed objects with their properties, and links to their relations rather than the relations themselves.',
      { h2: 'Filtering' },
      'Filter by type, by folder or by property value. Filters compose with AND; there is no OR, deliberately, because an OR filter over a large repository is almost always a sign the query belongs in a report.',
      { h2: 'Paging' },
      'Results are cursor-paged. Do not assume a stable offset across pages — the repository is live while you read it.',
    ],
  },
  {
    slug: 'relations-endpoint',
    title: 'Relations endpoint',
    category: 'endpoint-relations',
    order: 10,
    appliesTo: '10.9 and later',
    excerpt: 'Traversing relations by type and depth, and reading the result as a graph.',
    body: [
      'The relations endpoint is what impact analysis runs on. Traversal is by relation type and depth, and the response is a graph rather than a nested tree.',
      { h2: 'Depth' },
      'Depth is capped per repository, because an uncapped traversal on a connected model will return most of it. Two or three levels answers nearly every real question.',
      { h2: 'Direction' },
      'Relations are directed but traversable both ways. Ask for the direction you mean; "what depends on this" and "what does this depend on" are different questions with different answers.',
    ],
  },
  {
    slug: 'webhooks',
    title: 'Webhooks',
    category: 'webhooks',
    order: 10,
    appliesTo: '10.10 and later',
    excerpt: 'Subscribing to repository events, delivery guarantees and replay.',
    body: [
      'Webhooks fire on approved changes, not on drafts. An integration that needs draft events is usually an integration that should be a report.',
      { h2: 'Subscribing' },
      'Register an endpoint and the event types you want. Deliveries are signed; verify the signature before acting on the payload.',
      { h2: 'Delivery and replay' },
      'Delivery is at-least-once, so handlers must be idempotent. Failed deliveries are retried with backoff and can be replayed from the delivery log for seven days.',
    ],
  },
  {
    slug: 'rate-limits',
    title: 'Rate limits',
    category: 'rate-limits',
    order: 10,
    appliesTo: '10.10 and later',
    excerpt: 'Per-principal limits, the headers that report them, and how to behave when throttled.',
    body: [
      'Limits are applied per service principal, so one badly behaved integration cannot starve the others.',
      { h2: 'Reading the headers' },
      'Every response carries the remaining allowance and the reset time. Read them rather than guessing from failures.',
      { h2: 'When throttled' },
      'Back off using the reset header. Retrying immediately on a 429 will extend the throttle rather than shorten it.',
    ],
  },
  {
    slug: 'qualiware-10-10-release-notes',
    title: 'QualiWare 10.10 release notes',
    category: 'qualiware-10-10',
    order: 10,
    appliesTo: '10.10',
    excerpt: 'What changed, what to test, and the deprecations to plan for.',
    body: [
      'QualiWare 10.10 focuses on the publishing pipeline and on the REST surface. Nothing in this release requires a metamodel change.',
      { h2: 'New' },
      'Incremental publishing for large repositories, webhook subscriptions on approved changes, and per-principal rate limit headers on every API response.',
      { h2: 'Changed' },
      'The traceability report now returns owners inline rather than as a second call. Existing integrations continue to work; the second call becomes redundant.',
      { h2: 'What to test' },
      'Publishing scope, any integration that reads relations, and single sign-on if you federate group claims.',
    ],
  },
  {
    slug: 'deprecations-in-10-10',
    title: 'Deprecations in 10.10',
    category: 'deprecations',
    order: 10,
    appliesTo: '10.10',
    excerpt: 'What is deprecated, when it is removed, and what replaces it.',
    body: [
      'Deprecated features keep working in 10.10 and are removed no earlier than 10.12. Plan against the removal release, not the deprecation release.',
      { h2: 'Deprecated in this release' },
      'The v0 REST endpoints, the legacy publish scheduler, and property-level export to the old spreadsheet format.',
      { h2: 'Replacements' },
      'v1 REST endpoints, the job-based publish scheduler, and the reporting API. All three are available in 10.10, so migration does not have to wait for the removal.',
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Content data — partners (artboards 1i, 1j, 1o)
 *
 * The handoff marks partner records as illustrative. The four prototype
 * types (Implementation / Consulting / Reseller / Technology) collapse onto
 * the schema's two values: resellers and technology partners map to
 * `technology`, implementation and consulting firms to `solution`.
 * ------------------------------------------------------------------ */

type PartnerSeed = {
  slug: string
  name: string
  partnerType: 'technology' | 'solution'
  tier: 'silver' | 'gold' | 'platinum'
  region: 'nordics' | 'europe' | 'north-america' | 'mea' | 'apac' | 'global'
  industries: (
    | 'public-sector'
    | 'finance'
    | 'defence'
    | 'energy'
    | 'manufacturing'
    | 'life-sciences'
    | 'cross-industry'
  )[]
  blurb: string
  description: RichBlock[]
  website: string
  contactEmail: string
  services: { name: string; scope: string }[]
  atAGlance: { certifiedConsultants: number; partnerSince: string; languages: string }
  quote: { text: string; attribution: string }
  featured?: boolean
  integrationSlugs?: string[]
  /**
   * End customers this partner may raise support cases for, and what they sold
   * them. Deliberately includes a customer with no agreement, because that is
   * the case the support form has to refuse.
   */
  supportedCustomers?: {
    customerName: string
    supportLevelSold: 'none' | 'standard' | 'enhanced' | 'premium'
    zohoAccountId?: string
  }[]
}

const partners: PartnerSeed[] = [
  {
    slug: 'devoteam',
    name: 'Devoteam',
    supportedCustomers: [
      { customerName: 'Nordic Utility A/S', supportLevelSold: 'premium' },
      { customerName: 'Kommunernes Landsforening', supportLevelSold: 'standard' },
      // No agreement sold — Devoteam supports them directly, and the case form says so.
      { customerName: 'Vestjysk Forsyning', supportLevelSold: 'none' },
    ],
    partnerType: 'solution',
    tier: 'platinum',
    region: 'europe',
    industries: ['public-sector', 'finance', 'energy'],
    blurb: 'EA practice build-out and application portfolio programmes.',
    description: [
      'EA practice build-out and application portfolio programmes for European enterprises and public bodies.',
      { h2: 'What they do with QualiWare' },
      'Devoteam runs the first ninety days for organizations standing up an EA practice: repository setup, metamodel conventions, capability model workshops and the governance that keeps the model current after the consultants leave.',
      'Their compliance team also delivers NIS2 and DORA readiness programmes on the same repository, so architecture and control work share one source.',
    ],
    website: 'https://www.devoteam.com',
    contactEmail: 'qualiware@devoteam.com',
    services: [
      { name: 'Repository setup & conventions', scope: 'Fixed-scope, four to six weeks' },
      { name: 'Application portfolio assessment', scope: 'Inventory, cost and rationalisation plan' },
      { name: 'NIS2 & DORA readiness', scope: 'Control mapping onto existing processes' },
      { name: 'Managed model maintenance', scope: 'Ongoing, per quarter' },
    ],
    atAGlance: { certifiedConsultants: 24, partnerSince: '2016', languages: 'EN, FR, NL, DA' },
    quote: {
      text: 'They set the conventions we still use four years later. That is the part nobody sells you.',
      attribution: 'Head of Architecture, European utility',
    },
    featured: true,
    integrationSlugs: ['public-sector-reference-model', 'nis2-control-pack'],
  },
  {
    slug: 'nexer-group',
    name: 'Nexer Group',
    partnerType: 'solution',
    tier: 'gold',
    region: 'nordics',
    industries: ['defence', 'manufacturing'],
    blurb: 'Management-system and compliance rollouts for defence and industrial groups.',
    description: [
      'Management-system and compliance rollouts for defence and industrial groups across the Nordics.',
      { h2: 'What they do with QualiWare' },
      'Nexer builds group-wide management systems: process libraries with named owners, standards mapped onto the processes that satisfy them, and the review cycles that keep an audit trail intact between audits.',
    ],
    website: 'https://www.nexergroup.com',
    contactEmail: 'qualiware@nexergroup.com',
    services: [
      { name: 'Management-system rollout', scope: 'Group-wide, phased by division' },
      { name: 'Standards mapping', scope: 'ISO 9001, ISO 27001, sector requirements' },
      { name: 'Process owner enablement', scope: 'Workshops plus twelve months of support' },
    ],
    atAGlance: { certifiedConsultants: 11, partnerSince: '2018', languages: 'SV, EN, DA' },
    quote: {
      text: 'Audit preparation went from weeks of document gathering to a report we run in the meeting.',
      attribution: 'Quality Director, Nordic industrial group',
    },
    featured: true,
  },
  {
    slug: 'sopra-steria',
    name: 'Sopra Steria',
    partnerType: 'solution',
    tier: 'gold',
    region: 'europe',
    industries: ['public-sector'],
    blurb: 'Public-sector architecture governance at national scale.',
    description: [
      'Public-sector architecture governance at national scale.',
      { h2: 'What they do with QualiWare' },
      'Sopra Steria works with ministries and agencies that have to publish architecture and process content to tens of thousands of readers, and to keep it governed while doing so.',
    ],
    website: 'https://www.soprasteria.com',
    contactEmail: 'qualiware@soprasteria.com',
    services: [
      { name: 'National reference architecture', scope: 'Programme, multi-year' },
      { name: 'Publishing at scale', scope: 'Portal design and readership measurement' },
      { name: 'Architecture governance', scope: 'Boards, cadence and decision records' },
    ],
    atAGlance: { certifiedConsultants: 18, partnerSince: '2019', languages: 'EN, FR, NO, DA' },
    quote: {
      text: 'The model became the thing agencies argue from, instead of the thing they argue about.',
      attribution: 'Programme Director, national agency',
    },
  },
  {
    slug: 'fujitsu-nordics',
    name: 'Fujitsu Nordics',
    partnerType: 'solution',
    tier: 'gold',
    region: 'nordics',
    industries: ['finance'],
    blurb: 'Regulatory programmes for banking and insurance.',
    description: [
      'Regulatory programmes for banking and insurance in the Nordic market.',
      { h2: 'What they do with QualiWare' },
      'Fujitsu delivers DORA and operational-resilience programmes on the repository the bank already uses for its application landscape, so the register of information is generated rather than assembled.',
    ],
    website: 'https://www.fujitsu.com',
    contactEmail: 'qualiware@fujitsu.com',
    services: [
      { name: 'DORA readiness', scope: 'Register of information and critical functions' },
      { name: 'Operational resilience mapping', scope: 'Per business service' },
      { name: 'Supplier dependency modelling', scope: 'Fixed-scope, six weeks' },
    ],
    atAGlance: { certifiedConsultants: 9, partnerSince: '2020', languages: 'FI, SV, EN' },
    quote: {
      text: 'We stopped maintaining a separate regulatory inventory. There is one landscape now.',
      attribution: 'Head of Operational Resilience, Nordic bank',
    },
  },
  {
    slug: 'cgi-canada',
    name: 'CGI Canada',
    supportedCustomers: [
      { customerName: 'Province of Ontario — Digital Service', supportLevelSold: 'enhanced' },
      { customerName: 'City of Calgary', supportLevelSold: 'none' },
    ],
    partnerType: 'solution',
    tier: 'platinum',
    region: 'north-america',
    industries: ['public-sector'],
    blurb: 'Large-scale public-sector deployments and change management.',
    description: [
      'Large-scale public-sector deployments and change management in North America.',
      { h2: 'What they do with QualiWare' },
      'CGI runs deployments measured in tens of thousands of readers, where the hard part is adoption rather than modelling. Their change practice is the reason those deployments hold.',
    ],
    website: 'https://www.cgi.com',
    contactEmail: 'qualiware@cgi.com',
    services: [
      { name: 'Enterprise deployment', scope: 'Programme, multi-year' },
      { name: 'Adoption & change management', scope: 'Per department wave' },
      { name: 'Bilingual publishing', scope: 'EN / FR portal governance' },
    ],
    atAGlance: { certifiedConsultants: 31, partnerSince: '2014', languages: 'EN, FR' },
    quote: {
      text: '125,000 people can find the process they need. That was the whole objective.',
      attribution: 'Director of Business Architecture, federal department',
    },
  },
  {
    slug: 'arribatec',
    name: 'Arribatec',
    partnerType: 'technology',
    tier: 'silver',
    region: 'nordics',
    industries: ['manufacturing'],
    blurb: 'Process management and BMS for mid-market manufacturers.',
    description: [
      'Process management and business management systems for mid-market manufacturers.',
      { h2: 'What they do with QualiWare' },
      'Arribatec packages a starting configuration for manufacturers — process templates, an ISO 9001 control set and reporting connectors — so a first repository is productive in weeks rather than quarters.',
    ],
    website: 'https://www.arribatec.com',
    contactEmail: 'qualiware@arribatec.com',
    services: [
      { name: 'BMS starter configuration', scope: 'Fixed-scope, three weeks' },
      { name: 'Reporting connectors', scope: 'Power BI and Teams publishing' },
      { name: 'Process template library', scope: 'Manufacturing, licensed annually' },
    ],
    atAGlance: { certifiedConsultants: 6, partnerSince: '2021', languages: 'NO, SV, EN' },
    quote: {
      text: 'A working management system in a month, not a modelling project with no end date.',
      attribution: 'Operations Manager, Nordic manufacturer',
    },
    integrationSlugs: ['power-bi-connector', 'microsoft-teams-publishing'],
  },
  {
    slug: 'sapphire-systems',
    name: 'Sapphire Systems',
    partnerType: 'technology',
    tier: 'silver',
    region: 'europe',
    industries: ['finance'],
    blurb: 'Risk and audit management implementations.',
    description: [
      'Risk and audit management implementations for financial services in the UK and Ireland.',
      { h2: 'What they do with QualiWare' },
      'Sapphire builds and maintains the delivery-tooling integrations — identity, issue tracking and pipeline links — that keep a governed model connected to the systems the business runs on.',
    ],
    website: 'https://www.sapphiresystems.com',
    contactEmail: 'qualiware@sapphiresystems.com',
    services: [
      { name: 'Identity integration', scope: 'SSO and user provisioning' },
      { name: 'Delivery tooling links', scope: 'Jira and Azure DevOps' },
      { name: 'Risk & audit configuration', scope: 'Fixed-scope, eight weeks' },
    ],
    atAGlance: { certifiedConsultants: 5, partnerSince: '2022', languages: 'EN' },
    quote: {
      text: 'Single sign-on and the Jira link were done in the first sprint. Nobody had to be convinced after that.',
      attribution: 'IT Director, UK insurer',
    },
    integrationSlugs: ['microsoft-entra-id', 'jira-delivery-link'],
  },
  {
    slug: 'vodacom-business',
    name: 'Vodacom Business',
    partnerType: 'technology',
    tier: 'gold',
    region: 'mea',
    industries: ['energy', 'cross-industry'],
    blurb: 'Connectivity and platform integration in emerging markets.',
    description: [
      'Connectivity and platform integration across Africa and the Middle East.',
      { h2: 'What they do with QualiWare' },
      'Vodacom Business builds and operates the platform integrations — CMDB, ERP inventory and GRC bridges — for customers running QualiWare alongside large operational estates.',
    ],
    website: 'https://www.vodacombusiness.co.za',
    contactEmail: 'qualiware@vodacombusiness.co.za',
    services: [
      { name: 'CMDB synchronisation', scope: 'ServiceNow, bidirectional' },
      { name: 'ERP inventory feed', scope: 'SAP application and supplier objects' },
      { name: 'Managed hosting', scope: 'In-country, per region' },
    ],
    atAGlance: { certifiedConsultants: 8, partnerSince: '2021', languages: 'EN, PT, AR' },
    quote: {
      text: 'The landscape stopped being a spreadsheet the day the CMDB started feeding it.',
      attribution: 'Enterprise Architect, regional utility',
    },
    integrationSlugs: ['servicenow-cmdb-sync', 'sap-application-inventory'],
  },
  {
    slug: 'innoveto',
    name: 'Innoveto',
    partnerType: 'solution',
    tier: 'silver',
    region: 'europe',
    industries: ['manufacturing', 'life-sciences'],
    blurb: 'Capability-driven transformation for industrial groups.',
    description: [
      'Capability-driven transformation for industrial groups in German-speaking Europe.',
      { h2: 'What they do with QualiWare' },
      'Innoveto starts from the capability model rather than the application list, and sequences transformation initiatives against the capabilities they actually move.',
    ],
    website: 'https://www.innoveto.com',
    contactEmail: 'qualiware@innoveto.com',
    services: [
      { name: 'Capability model workshops', scope: 'Three sessions per business unit' },
      { name: 'Transformation sequencing', scope: 'Roadmap against the documented landscape' },
      { name: 'Scenario comparison', scope: 'Per investment decision' },
    ],
    atAGlance: { certifiedConsultants: 4, partnerSince: '2023', languages: 'DE, EN, FR' },
    quote: {
      text: 'The roadmap finally had the same objects in it as the architecture.',
      attribution: 'Head of Strategy, industrial group',
    },
  },
]

/* ------------------------------------------------------------------ *
 * Content data — integrations (artboards 1e, 1i, 1o)
 * ------------------------------------------------------------------ */

type IntegrationSeed = {
  slug: string
  name: string
  /** Only set when builtBy is 'partner'. */
  partner?: string
  builtBy: 'qualiware' | 'partner'
  status: 'available' | 'inDevelopment' | 'planned' | 'retired'
  expectedAvailability?: string
  category: 'itsm' | 'identity' | 'data' | 'collaboration' | 'devops' | 'grc'
  summary: string
  docsUrl?: string
  logoPlaceholder: string
}

/**
 * The integration catalogue.
 *
 * Most are first-party: QualiWare builds and maintains them. A few are genuinely
 * partner-built extensions, and those name their partner.
 *
 * Status is public on purpose. A catalogue that only lists what already works
 * answers half the buyer's question — "is X coming?" is the other half, and
 * answering it is worth more than the roadmap secrecy it costs. Expected
 * availability stays deliberately coarse.
 */
const integrations: IntegrationSeed[] = [
  /* ---- Available, first-party ---- */
  {
    slug: 'rest-api',
    name: 'REST API',
    builtBy: 'qualiware',
    status: 'available',
    category: 'devops',
    summary:
      'Read and write repository objects and their typed relations. The foundation every other integration is built on.',
    docsUrl: 'https://docs.qualiware.com/api-reference',
    logoPlaceholder: 'ICON — REST API',
  },
  {
    slug: 'webhooks',
    name: 'Webhooks & event subscriptions',
    builtBy: 'qualiware',
    status: 'available',
    category: 'devops',
    summary:
      'Subscribe to publish, delete and workflow events so downstream systems react to model changes instead of polling.',
    docsUrl: 'https://docs.qualiware.com/api-reference/webhooks-and-event-subscriptions',
    logoPlaceholder: 'ICON — Webhooks',
  },
  {
    slug: 'microsoft-entra-id',
    name: 'Microsoft Entra ID',
    builtBy: 'qualiware',
    status: 'available',
    category: 'identity',
    summary:
      'Single sign-on and group-based access, so repository permissions follow the directory rather than a separate user list.',
    docsUrl: 'https://docs.qualiware.com/administration/configure-single-sign-on',
    logoPlaceholder: 'LOGO — Microsoft Entra ID',
  },
  {
    slug: 'excel-visio-import',
    name: 'Excel & Visio import',
    builtBy: 'qualiware',
    status: 'available',
    category: 'data',
    summary:
      'Bulk-load an existing application list or process library, so a first model does not start from an empty repository.',
    docsUrl: 'https://docs.qualiware.com/modelling',
    logoPlaceholder: 'LOGO — Microsoft Excel and Visio',
  },
  {
    slug: 'archimate-bpmn-exchange',
    name: 'ArchiMate & BPMN exchange',
    builtBy: 'qualiware',
    status: 'available',
    category: 'data',
    summary:
      'Import and export using the open exchange formats, so the model is portable and not locked to one tool.',
    docsUrl: 'https://docs.qualiware.com/modelling',
    logoPlaceholder: 'ICON — ArchiMate and BPMN',
  },
  {
    slug: 'power-bi-connector',
    name: 'Power BI connector',
    builtBy: 'qualiware',
    status: 'available',
    category: 'data',
    summary:
      'Report on the model alongside the rest of the business: capability coverage, application spend, control status.',
    docsUrl: 'https://docs.qualiware.com/api-reference',
    logoPlaceholder: 'LOGO — Microsoft Power BI',
  },

  /* ---- Available, partner-built ---- */
  {
    slug: 'servicenow-cmdb-sync',
    name: 'ServiceNow CMDB Sync',
    builtBy: 'partner',
    partner: 'devoteam',
    status: 'available',
    category: 'itsm',
    summary:
      'Reconciles the CMDB against the modelled application landscape and reports the difference, so the inventory has one owner instead of two.',
    docsUrl: 'https://docs.qualiware.com/api-reference',
    logoPlaceholder: 'LOGO — ServiceNow',
  },
  {
    slug: 'grc-evidence-bridge',
    name: 'GRC evidence bridge',
    builtBy: 'partner',
    partner: 'cgi-canada',
    status: 'available',
    category: 'grc',
    summary:
      'Exports controls, owners and approval dates on a schedule, in the shape an external GRC platform expects.',
    logoPlaceholder: 'ICON — GRC evidence export',
  },

  /* ---- In development ---- */
  {
    slug: 'jira-initiative-sync',
    name: 'Jira initiative sync',
    builtBy: 'qualiware',
    status: 'inDevelopment',
    expectedAvailability: 'H1 2027',
    category: 'devops',
    summary:
      'Keeps roadmap initiatives in step with delivery epics, so the architecture roadmap and the backlog stop disagreeing.',
    logoPlaceholder: 'LOGO — Atlassian Jira',
  },
  {
    slug: 'teams-notifications',
    name: 'Microsoft Teams notifications',
    builtBy: 'qualiware',
    status: 'inDevelopment',
    expectedAvailability: 'H1 2027',
    category: 'collaboration',
    summary:
      'Notifies the owning team in Teams when a process they own is republished or sent for review.',
    logoPlaceholder: 'LOGO — Microsoft Teams',
  },

  /* ---- Planned ---- */
  {
    slug: 'sap-application-inventory',
    name: 'SAP application inventory',
    builtBy: 'qualiware',
    status: 'planned',
    expectedAvailability: 'Under evaluation',
    category: 'data',
    summary:
      'Import the SAP landscape as modelled applications with their owners, rather than maintaining it twice.',
    logoPlaceholder: 'LOGO — SAP',
  },
  {
    slug: 'entra-privileged-access',
    name: 'Entra privileged access review',
    builtBy: 'qualiware',
    status: 'planned',
    expectedAvailability: 'Under evaluation',
    category: 'identity',
    summary:
      'Pull privileged role assignments in as evidence for access-control reviews, tied to the systems they govern.',
    logoPlaceholder: 'LOGO — Microsoft Entra ID',
  },
]

/* ------------------------------------------------------------------ *
 * Seed
 * ------------------------------------------------------------------ */

const seed = async () => {
  const payload = await getPayload({ config: configPromise })

  const created: Record<string, number> = {}
  const updated: Record<string, number> = {}
  const bump = (bucket: Record<string, number>, key: string) => {
    bucket[key] = (bucket[key] ?? 0) + 1
  }

  /* ---------------------------------------------------------------- *
   * 1. Tenants
   * ---------------------------------------------------------------- */

  const tenantIds = {} as Record<'main' | 'docs' | 'partners' | 'support', number>

  for (const tenant of [
    { name: 'QualiWare', slug: 'main', domain: 'qualiware.com' },
    { name: 'Docs', slug: 'docs', domain: 'docs.qualiware.com' },
    { name: 'Partners', slug: 'partners', domain: 'partners.qualiware.com' },
    { name: 'Support', slug: 'support', domain: 'support.qualiware.com' },
  ] as const) {
    const existing = await payload.find({
      collection: 'tenants',
      where: { slug: { equals: tenant.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      const doc = await payload.update({
        collection: 'tenants',
        id: existing.docs[0].id,
        data: tenant,
      })
      tenantIds[tenant.slug] = doc.id
      bump(updated, 'tenants')
      console.log(`= tenant ${tenant.slug}`)
    } else {
      const doc = await payload.create({ collection: 'tenants', data: tenant })
      tenantIds[tenant.slug] = doc.id
      bump(created, 'tenants')
      console.log(`+ tenant ${tenant.slug}`)
    }
  }

  const allTenants = [
    { tenant: tenantIds.main },
    { tenant: tenantIds.docs },
    { tenant: tenantIds.partners },
  ]

  /* ---------------------------------------------------------------- *
   * 2. Super admin
   * ---------------------------------------------------------------- */

  const adminEmail = 'andreas.jensen@qualiware.com'
  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })

  if (existingAdmin.docs[0]) {
    await payload.update({
      collection: 'users',
      id: existingAdmin.docs[0].id,
      data: { roles: ['super-admin'], tenants: allTenants },
    })
    bump(updated, 'users')
    console.log(`= user ${adminEmail}`)
  } else {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: 'qualiware-dev',
        roles: ['super-admin'],
        tenants: allTenants,
      },
    })
    bump(created, 'users')
    console.log(`+ user ${adminEmail}`)
  }

  /* ---------------------------------------------------------------- *
   * 3. Docs categories (parents before children)
   * ---------------------------------------------------------------- */

  const categoryIds: Record<string, number> = {}

  for (const category of categories) {
    const data = {
      tenant: tenantIds.docs,
      title: category.title,
      slug: category.slug,
      order: category.order,
      ...(category.parent ? { parent: categoryIds[category.parent] } : { parent: null }),
    }

    const existing = await payload.find({
      collection: 'categories',
      where: {
        and: [{ slug: { equals: category.slug } }, { tenant: { equals: tenantIds.docs } }],
      },
      limit: 1,
    })

    if (existing.docs[0]) {
      const doc = await payload.update({
        collection: 'categories',
        id: existing.docs[0].id,
        data,
      })
      categoryIds[category.slug] = doc.id
      bump(updated, 'categories')
    } else {
      const doc = await payload.create({ collection: 'categories', data })
      categoryIds[category.slug] = doc.id
      bump(created, 'categories')
    }
  }
  console.log(`  categories: +${created.categories ?? 0} / =${updated.categories ?? 0}`)


  /* ---------------------------------------------------------------- *
   * 3b. End-user accounts — customers and partners
   *
   * Separate from `users`, which is CMS staff. `audiences` is the entitlement
   * primitive: it gates documentation, decides post-login routing and tells the
   * support form how to attribute a ticket.
   * ---------------------------------------------------------------- */

  const demoAccounts: {
    email: string
    fullName: string
    audiences: ('customer' | 'partner')[]
    organisation?: string
    supportTierHint?: 'standard' | 'enhanced' | 'premium'
  }[] = [
    {
      email: 'customer@example.com',
      fullName: 'Anna Lindqvist',
      audiences: ['customer'],
      organisation: 'Nordic Utility A/S',
      supportTierHint: 'premium',
    },
    {
      email: 'partner@example.com',
      fullName: 'Jonas Berg',
      audiences: ['partner'],
      organisation: 'Devoteam',
      supportTierHint: 'standard',
    },
    {
      email: 'both@example.com',
      fullName: 'Sofia Rasmussen',
      audiences: ['customer', 'partner'],
      organisation: 'CGI',
      supportTierHint: 'enhanced',
    },
  ]

  for (const account of demoAccounts) {
    const existing = await payload.find({
      collection: 'accounts',
      where: { email: { equals: account.email } },
      limit: 1,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'accounts',
        id: existing.docs[0].id,
        data: { ...account },
      })
      console.log(`= account ${account.email}`)
    } else {
      await payload.create({
        collection: 'accounts',
        data: { ...account, password: 'qualiware-dev' },
      })
      console.log(`+ account ${account.email}`)
    }
  }

  /* ---------------------------------------------------------------- *
   * 4. Docs articles
   * ---------------------------------------------------------------- */

  // Template articles demonstrate every supported element; see src/seed/docs/templates.ts
  for (const article of [...docs, ...templateArticles, ...restrictedArticles]) {
    const data = {
      tenant: tenantIds.docs,
      title: article.title,
      slug: article.slug,
      category: categoryIds[article.category],
      order: article.order,
      audiences: article.audiences ?? [],
      appliesTo: article.appliesTo,
      excerpt: article.excerpt,
      body: rich(article.body),
    }

    const existing = await payload.find({
      collection: 'docs',
      where: {
        and: [{ slug: { equals: article.slug } }, { tenant: { equals: tenantIds.docs } }],
      },
      limit: 1,
    })

    if (existing.docs[0]) {
      await payload.update({ collection: 'docs', id: existing.docs[0].id, data })
      bump(updated, 'docs')
    } else {
      await payload.create({ collection: 'docs', data })
      bump(created, 'docs')
    }
  }
  console.log(`  docs articles: +${created.docs ?? 0} / =${updated.docs ?? 0}`)

  /* ---------------------------------------------------------------- *
   * 5. Partners
   * ---------------------------------------------------------------- */

  const partnerIds: Record<string, number> = {}

  for (const partner of partners) {
    const data = {
      tenant: tenantIds.partners,
      name: partner.name,
      slug: partner.slug,
      logo: { placeholder: `PARTNER LOGO — ${partner.name}` },
      partnerType: partner.partnerType,
      tier: partner.tier,
      region: partner.region,
      industries: partner.industries,
      blurb: partner.blurb,
      description: rich(partner.description),
      website: partner.website,
      contactEmail: partner.contactEmail,
      services: partner.services,
      atAGlance: partner.atAGlance,
      quote: partner.quote,
      featured: partner.featured ?? false,
      supportedCustomers: partner.supportedCustomers ?? [],
    }

    const existing = await payload.find({
      collection: 'partners',
      where: {
        and: [{ slug: { equals: partner.slug } }, { tenant: { equals: tenantIds.partners } }],
      },
      limit: 1,
    })

    if (existing.docs[0]) {
      const doc = await payload.update({
        collection: 'partners',
        id: existing.docs[0].id,
        data,
      })
      partnerIds[partner.slug] = doc.id
      bump(updated, 'partners')
    } else {
      const doc = await payload.create({ collection: 'partners', data })
      partnerIds[partner.slug] = doc.id
      bump(created, 'partners')
    }
  }
  console.log(`  partners: +${created.partners ?? 0} / =${updated.partners ?? 0}`)

  /*
   * Link the demo partner accounts to their partner record.
   *
   * Done here rather than in 3b because partners do not exist yet at that
   * point. Without the link, a partner signs in but the support form has no
   * customer list to offer — the entitlement rule would be untestable.
   *
   * `partner` is a staff-only field on Accounts, so this is the only way it is
   * ever set: an account holder cannot claim a partner for themselves.
   */
  const accountPartners: Record<string, string> = {
    'partner@example.com': 'devoteam',
    'both@example.com': 'cgi-canada',
  }

  for (const [email, partnerSlug] of Object.entries(accountPartners)) {
    const found = await payload.find({
      collection: 'accounts',
      where: { email: { equals: email } },
      limit: 1,
    })
    const account = found.docs[0]
    if (!account || !partnerIds[partnerSlug]) continue

    await payload.update({
      collection: 'accounts',
      id: account.id,
      data: { partner: partnerIds[partnerSlug] },
    })
    console.log(`= account ${email} → partner ${partnerSlug}`)
  }

  /* ---------------------------------------------------------------- *
   * 6. Integrations (reference partners; partners are back-linked after)
   * ---------------------------------------------------------------- */

  const integrationIds: Record<string, number> = {}

  for (const integration of integrations) {
    const data = {
      tenant: tenantIds.partners,
      name: integration.name,
      slug: integration.slug,
      logo: { placeholder: integration.logoPlaceholder },
      builtBy: integration.builtBy,
      // Only partner-built integrations carry a partner.
      partner: integration.partner ? partnerIds[integration.partner] : null,
      status: integration.status,
      expectedAvailability: integration.expectedAvailability ?? null,
      category: integration.category,
      summary: integration.summary,
      docsUrl: integration.docsUrl ?? null,
    }

    const existing = await payload.find({
      collection: 'integrations',
      where: {
        and: [{ slug: { equals: integration.slug } }, { tenant: { equals: tenantIds.partners } }],
      },
      limit: 1,
    })

    if (existing.docs[0]) {
      const doc = await payload.update({
        collection: 'integrations',
        id: existing.docs[0].id,
        data,
      })
      integrationIds[integration.slug] = doc.id
      bump(updated, 'integrations')
    } else {
      const doc = await payload.create({ collection: 'integrations', data })
      integrationIds[integration.slug] = doc.id
      bump(created, 'integrations')
    }
  }
  console.log(`  integrations: +${created.integrations ?? 0} / =${updated.integrations ?? 0}`)

  /*
   * Remove integrations left over from an earlier seed, so re-running converges
   * on the canonical catalogue instead of accumulating entries nobody listed.
   */
  const canonicalSlugs = integrations.map((i) => i.slug)
  const { docs: staleIntegrations } = await payload.find({
    collection: 'integrations',
    where: { slug: { not_in: canonicalSlugs } },
    limit: 0,
  })
  for (const stale of staleIntegrations) {
    await payload.delete({ collection: 'integrations', id: stale.id })
  }
  if (staleIntegrations.length) {
    console.log(`  removed ${staleIntegrations.length} stale integration(s)`)
  }

  /*
   * Back-link partners -> integrations.
   *
   * Derived from each integration's own `partner`, rather than from a second
   * list kept on the partner. Two hand-maintained lists of the same
   * relationship drift the moment one is edited — and did: removing an
   * integration left partners pointing at a slug that no longer existed, which
   * failed validation with an unhelpful "field is invalid".
   */
  const integrationsByPartner = new Map<string, number[]>()

  for (const integration of integrations) {
    if (integration.builtBy !== 'partner' || !integration.partner) continue
    const id = integrationIds[integration.slug]
    if (id === undefined) continue

    const list = integrationsByPartner.get(integration.partner) ?? []
    list.push(id)
    integrationsByPartner.set(integration.partner, list)
  }

  for (const [partnerSlug, ids] of integrationsByPartner) {
    const partnerId = partnerIds[partnerSlug]
    if (partnerId === undefined) {
      console.warn(`  ! integration references unknown partner "${partnerSlug}"`)
      continue
    }
    await payload.update({
      collection: 'partners',
      id: partnerId,
      data: { integrations: ids },
    })
  }

  // Partners that no longer build anything must not keep a stale list.
  for (const partner of partners) {
    if (integrationsByPartner.has(partner.slug)) continue
    await payload.update({
      collection: 'partners',
      id: partnerIds[partner.slug],
      data: { integrations: [] },
    })
  }

  console.log(`  partner -> integration links: ${integrationsByPartner.size} partner(s)`)


  /* ---------------------------------------------------------------- *
   * 6b. Authors
   *
   * A small, realistic team rather than one invented person per page. The
   * previous seed derived an author from whatever name each content module
   * happened to use, which produced 28 fabricated staff for a company that
   * would plausibly have five or six people writing.
   *
   * Pages are assigned by topic, so the byline is credible: a Compliance
   * Manager signs the regulation pages, a Solution Architect the platform
   * machinery, and so on. Reviewer is always a different person, because a
   * self-reviewed page is not a review.
   *
   * STILL PLACEHOLDERS. These are test people. Replace with real, consenting
   * staff before launch, and give each a real LinkedIn URL — see the README.
   * ---------------------------------------------------------------- */

  const COMPANY_LINKEDIN = 'https://www.linkedin.com/company/qualiware'

  type AuthorKey = 'compliance' | 'solution' | 'enterprise' | 'marketing' | 'ceo'

  const AUTHOR_TEAM: Record<
    AuthorKey,
    { name: string; slug: string; role: string; credentials: string; bio: string }
  > = {
    compliance: {
      name: 'Mette Holm',
      slug: 'mette-holm',
      role: 'Compliance Manager, QualiWare',
      credentials: 'ISO 27001 Lead Auditor · 14 years in governance and risk',
      bio: 'Works with customers on NIS2, DORA and ISO 27001 programmes, mostly on the unglamorous part: what an auditor will actually accept as evidence.',
    },
    solution: {
      name: 'Rasmus Vestergaard',
      slug: 'rasmus-vestergaard',
      role: 'Solution Architect, QualiWare',
      credentials: 'TOGAF 9 certified · 11 years implementing QualiWare',
      bio: 'Designs QualiWare implementations and integrations, and is usually the person asked why the publish job has not finished yet.',
    },
    enterprise: {
      name: 'Anne Sofie Dahl',
      slug: 'anne-sofie-dahl',
      role: 'Enterprise Architect, QualiWare',
      credentials: 'TOGAF 9 certified · 16 years in enterprise architecture',
      bio: 'Advises architecture practices on capability modelling and impact analysis, with a particular interest in why models stop being trusted.',
    },
    marketing: {
      name: 'Line Toft Sørensen',
      slug: 'line-toft-sorensen',
      role: 'Head of Marketing, QualiWare',
      credentials: '12 years marketing enterprise software · MSc Communication',
      bio: 'Responsible for how QualiWare explains itself, and for keeping the claims on this site attached to something checkable.',
    },
    ceo: {
      name: 'Peter Dahl',
      slug: 'peter-dahl',
      role: 'Chief Executive Officer, QualiWare',
      credentials: '20 years in enterprise software · QualiWare CEO since 2019',
      bio: 'Leads QualiWare. Reviews the pages that make commitments on the company’s behalf.',
    },
  }

  /** Who signs a page, decided by what the page is about. */
  const authorFor = (slug: string, pageType?: string): AuthorKey => {
    if (pageType === 'solutionRegulation') return 'compliance'
    if (pageType === 'legal') return 'compliance'
    if (/^(legal|trust)/.test(slug)) return 'compliance'
    if (/^solutions\/(grc|ai-governance)/.test(slug)) return 'compliance'
    if (/^platform\/(certifications|access-control)/.test(slug)) return 'compliance'

    if (/^company\/(story|culture)/.test(slug)) return 'ceo'

    if (pageType === 'resourceHub') return 'marketing'
    if (/^(resources|company|customers|sign-in|program|become-a-partner|directory|integrations)/.test(slug)) {
      return 'marketing'
    }

    if (
      pageType === 'solutionDiscipline' ||
      pageType === 'solutionIndustry' ||
      /^platform\/(application-portfolio-management|business-capability-management|strategy-roadmapping|impact-analysis)/.test(slug)
    ) {
      return 'enterprise'
    }

    // Everything else is platform machinery.
    return 'solution'
  }

  /** A page is never reviewed by the person who wrote it. */
  const REVIEWER_OF: Record<AuthorKey, AuthorKey | null> = {
    compliance: 'ceo',
    solution: 'enterprise',
    enterprise: 'solution',
    marketing: 'enterprise',
    ceo: null,
  }

  const authorIdByKey = new Map<AuthorKey, number>()

  for (const [key, person] of Object.entries(AUTHOR_TEAM) as [AuthorKey, (typeof AUTHOR_TEAM)[AuthorKey]][]) {
    const data = {
      name: person.name,
      slug: person.slug,
      role: person.role,
      credentials: person.credentials,
      bio: person.bio,
      linkedin: COMPANY_LINKEDIN,
    }

    const existing = await payload.find({
      collection: 'authors',
      where: { slug: { equals: person.slug } },
      limit: 1,
    })

    const doc = existing.docs[0]
      ? await payload.update({ collection: 'authors', id: existing.docs[0].id, data })
      : await payload.create({ collection: 'authors', data })

    authorIdByKey.set(key, doc.id)
  }

  // Remove authors left over from earlier seeds, so re-running converges on the
  // canonical team rather than accumulating people.
  const keepSlugs = Object.values(AUTHOR_TEAM).map((p) => p.slug)
  const { docs: strays } = await payload.find({
    collection: 'authors',
    where: { slug: { not_in: keepSlugs } },
    limit: 0,
  })
  for (const stray of strays) {
    await payload.delete({ collection: 'authors', id: stray.id })
  }

  console.log(`  authors: ${keepSlugs.length} (removed ${strays.length} stray)`)

  /**
   * Maps the inline seed shape onto Author relationships.
   *
   * `experienceNote` and `lastReviewed` stay per page — they describe the work
   * behind that page, not the person.
   */
  const toAuthorship = (
    a: SeedAuthorship | undefined,
    slug: string,
    pageType?: string,
  ): Page['authorship'] => {
    if (!a) return undefined

    const key = authorFor(slug, pageType)
    const reviewerKey = a.reviewerName ? REVIEWER_OF[key] : null

    return {
      author: authorIdByKey.get(key) ?? null,
      reviewer: reviewerKey ? (authorIdByKey.get(reviewerKey) ?? null) : null,
      lastReviewed: a.lastReviewed ?? null,
      experienceNote: a.experienceNote ?? null,
    }
  }

  /* ---------------------------------------------------------------- *
   * 7. Pages
   * ---------------------------------------------------------------- */

  const upsertPage = async (
    tenant: number,
    data: {
      title: string
      slug: string
      pageType?: Page['pageType']
      caseStudy?: Page['caseStudy']
      seo?: Page['seo']
      authorship?: SeedAuthorship
      sources?: Page['sources']
      regulation?: Page['regulation']
      relatedCapabilities?: number[]
      layout: Layout
    },
  ) => {
    const mapped = {
      ...data,
      authorship: toAuthorship(data.authorship, data.slug, data.pageType ?? undefined),
    }

    const existing = await payload.find({
      collection: 'pages',
      where: { and: [{ slug: { equals: data.slug } }, { tenant: { equals: tenant } }] },
      limit: 1,
    })

    if (existing.docs[0]) {
      const doc = await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: { ...mapped, tenant },
      })
      bump(updated, 'pages')
      console.log(`= page ${data.slug}`)
      return doc.id
    }

    const doc = await payload.create({ collection: 'pages', data: { ...mapped, tenant } })
    bump(created, 'pages')
    console.log(`+ page ${data.slug}`)
    return doc.id
  }

  /* ---- 7a. Case-study pages (created first — the homepage references them) */

  const bookADemoCta: Layout[number] = {
    blockType: 'ctaBanner',
    background: 'darkGreen',
    heading: 'See the repository on your own architecture',
    text: '45 minutes, on your own scenario. Bring a real question and we will model it with you.',
    ctaLabel: 'BOOK A DEMO',
    ctaHref: '/pricing#demo',
  }

  const saabId = await upsertPage(tenantIds.main, {
    title: 'One management system for a global defence group',
    slug: 'saab-global-management-system',
    pageType: 'caseStudy',
    caseStudy: {
      category: 'DEFENCE · SWEDEN',
      summary: 'Standards, audits and process ownership in one governed model.',
      image: {
        placeholder: 'PHOTO · Defence manufacturing floor — real environment, diverse, candid, not staged',
      },
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'CUSTOMER STORY · DEFENCE · SWEDEN',
        heading: 'One management system for a global defence group',
        lead: 'Saab operates around the globe and has to keep up with a long list of regulations and standards. QualiWare holds the management system that keeps it traceable.',
        showConstellation: true,
        stats: [
          { value: 'One', label: 'group-wide management system' },
          { value: 'Days', label: 'audit preparation, not weeks' },
          { value: 'Global', label: 'sites on one process library' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'THE CHALLENGE',
        heading: 'Every audit meant rebuilding the same picture',
        lead: 'Standards, audits and process ownership were documented in different places by different parts of the group. Every audit meant rebuilding the same picture, and no one could say with confidence which processes a new requirement touched.',
        image: {
          placeholder:
            'HERO PHOTO — full bleed — Process architect on site, real environment · 1440 × 420',
        },
        items: [
          {
            title: 'What they built',
            text: 'A single governed model of processes, roles, standards and controls, published to the organization and maintained by named owners. Requirements link to the processes that satisfy them, so scope is a query rather than a workshop.',
          },
          {
            title: 'Requirements link to processes',
            text: 'Scope for a new requirement is a query against the model, not a workshop with the divisions.',
          },
          {
            title: 'Named owners, not a central team',
            text: 'Process owners maintain their own part of the model on a review cycle.',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'We can show an auditor how a requirement flows into the processes that satisfy it — in the same session.',
        name: 'Kristin Lilja',
        role: 'Process Architect, Global Management System',
        org: 'Saab AB',
        portrait: { placeholder: 'PORTRAIT — Kristin Lilja, candid, real office' },
        videoStill: { placeholder: 'VIDEO STILL — Interview clip' },
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'AT A GLANCE',
        heading: 'Defence & aerospace, headquartered in Sweden',
        features: [
          { title: 'Industry', description: 'Defence & aerospace' },
          { title: 'Headquarters', description: 'Sweden' },
          { title: 'Used for', description: 'Management system, compliance, process governance' },
          { title: 'Standards in scope', description: 'ISO 9001, ISO 27001, sector requirements' },
        ],
      },
      bookADemoCta,
    ],
  })

  const nis2Id = await upsertPage(tenantIds.main, {
    title: 'NIS2 readiness without a new tool',
    slug: 'nordic-utility-nis2-readiness',
    pageType: 'caseStudy',
    caseStudy: {
      category: 'ENERGY · NORDICS',
      summary: 'Controls mapped onto the processes and systems already documented.',
      image: { placeholder: 'PHOTO · Utility control room — real environment, candid, not staged' },
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'CUSTOMER STORY · ENERGY · NORDICS',
        heading: 'NIS2 readiness without a new tool',
        lead: 'The directive arrived as a deadline, not as a discipline. Rather than start a parallel programme, the utility mapped its requirements onto the processes and systems it had already documented.',
        showConstellation: true,
        stats: [
          { value: 'One', label: 'repository for architecture and controls' },
          { value: 'Weeks', label: 'to a first coverage report' },
          { value: 'Live', label: 'coverage, recalculated as the model changes' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'THE CHALLENGE',
        heading: 'A deadline, a directive, and a landscape already documented',
        lead: 'Compliance had been asked for a coverage figure and had no way to produce one that would still be true a month later. The architecture team, meanwhile, held an application landscape nobody in compliance was using.',
        image: {
          placeholder: 'PHOTO — Control room operators at work, real environment, diverse, candid',
        },
        items: [
          {
            title: 'What they built',
            text: 'The NIS2 requirement set loaded into the same repository as the landscape, with each requirement related to the controls that satisfy it and each control related to the processes it governs.',
          },
          {
            title: 'Gaps became a list, not an opinion',
            text: 'Requirements with no related control are the gap list, produced by query.',
          },
          {
            title: 'Coverage stays current',
            text: 'Coverage is a query over relations, so it moves when the model moves.',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'We answered the regulator from the model we already maintained. There was no second spreadsheet.',
        name: 'Head of Compliance',
        role: 'Nordic energy utility',
        org: 'Anonymised at the customer’s request',
        portrait: { placeholder: 'PORTRAIT — Compliance lead, candid, real office' },
        videoStill: { placeholder: 'VIDEO STILL — Customer interview thumbnail with play control' },
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'AT A GLANCE',
        heading: 'Energy & utilities, Nordics',
        features: [
          { title: 'Industry', description: 'Energy & utilities' },
          { title: 'Headquarters', description: 'Nordics' },
          { title: 'Used for', description: 'GRC, control libraries, application landscape' },
          { title: 'Regulation in scope', description: 'NIS2, ISO 27001' },
        ],
      },
      bookADemoCta,
    ],
  })

  const publicSectorId = await upsertPage(tenantIds.main, {
    title: '125,000 users on one shared model',
    slug: 'public-sector-shared-model',
    pageType: 'caseStudy',
    caseStudy: {
      category: 'PUBLIC SECTOR · CANADA',
      summary: 'Publishing architecture and process content at national scale.',
      image: { placeholder: 'PHOTO · Public sector service desk — diverse, candid, not staged' },
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'CUSTOMER STORY · PUBLIC SECTOR · CANADA',
        heading: '125,000 users on one shared model',
        lead: 'Publishing architecture and process content at national scale, in two official languages, to readers who never open a modelling tool.',
        showConstellation: true,
        stats: [
          { value: '125,000', label: 'users in a single deployment' },
          { value: 'Two', label: 'official languages, one model' },
          { value: 'One', label: 'shared repository across departments' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'THE CHALLENGE',
        heading: 'The hard part was adoption, not modelling',
        lead: 'Departments each held their own process documentation, in their own format, at their own level of currency. A shared model was only useful if the people who perform the processes would actually open it.',
        image: {
          placeholder:
            'PHOTO — Two colleagues reviewing a process wall together in a real office — diverse, candid, not staged',
        },
        items: [
          {
            title: 'What they built',
            text: 'One governed repository with departmental ownership, published bilingually to a portal that readers reach from the intranet without a licence or a login.',
          },
          {
            title: 'Readers outnumber editors by three orders of magnitude',
            text: 'The published portal carries the audience; the repository carries the governance.',
          },
          {
            title: 'Departmental ownership, central conventions',
            text: 'Naming and metamodel conventions are central; content ownership is not.',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote: '125,000 people can find the process they need. That was the whole objective.',
        name: 'Director of Business Architecture',
        role: 'Federal department',
        org: 'Canada',
        portrait: { placeholder: 'PORTRAIT — Business architecture director, candid, real office' },
        videoStill: { placeholder: 'VIDEO STILL — Interview clip' },
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'AT A GLANCE',
        heading: 'Public sector, Canada',
        features: [
          { title: 'Industry', description: 'Public sector' },
          { title: 'Headquarters', description: 'Canada' },
          { title: 'Used for', description: 'Process management, publishing, architecture governance' },
          { title: 'Scale', description: '125,000 users in a single deployment' },
        ],
      },
      bookADemoCta,
    ],
  })

  const caseStudyIds = [saabId, nis2Id, publicSectorId]

  /* ---- 7b. Main tenant — homepage (artboard 1a) ----------------------- */

  await upsertPage(tenantIds.main, {
    title: 'Build a living digital model of your organization',
    slug: 'home',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'ENTERPRISE ARCHITECTURE & DIGITAL TWIN',
        heading: 'Build a living digital model of your organization',
        lead: 'Connect business processes, applications, information, technologies, risks, compliance and strategy in one platform — so you can see what a change really touches before you decide.',
        ctas: [
          { label: 'GET A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'EXPLORE THE PLATFORM', href: '/platform', style: 'outline' },
        ],
        showProductPanel: true,
        showConstellation: true,
        showScrollCue: true,
        stats: [
          { value: '99%', label: 'annual renewal rate' },
          { value: '26 years', label: 'longest customer relationship' },
          { value: '125,000', label: 'users in a single deployment' },
          { value: 'ISO 27001', label: 'certified' },
        ],
      },
      {
        blockType: 'logoWall',
        label: 'TRUSTED BY ORGANIZATIONS THAT CANNOT AFFORD TO GUESS',
        logos: [
          { name: 'SAAB', logo: { placeholder: 'LOGO — SAAB' } },
          { name: 'FOSS', logo: { placeholder: 'LOGO — FOSS' } },
          { name: 'KK Wind', logo: { placeholder: 'LOGO — KK Wind' } },
          { name: 'Coop', logo: { placeholder: 'LOGO — Coop' } },
          { name: 'Vattenfall', logo: { placeholder: 'LOGO — Vattenfall' } },
          { name: 'Trafikverket', logo: { placeholder: 'LOGO — Trafikverket' } },
          { name: 'FMV', logo: { placeholder: 'LOGO — FMV' } },
        ],
      },
      {
        blockType: 'gartnerCallout',
        eyebrow: 'ANALYST RECOGNITION',
        heading: 'Recognized by leading industry analysts',
        lead: 'Named a Leader in the Gartner® Magic Quadrant™ for Enterprise Architecture Tools three years running, and a Visionary in the inaugural 2026 Magic Quadrant™ for Digital Twin of an Organization Platforms.',
        linkLabel: 'Read the analyst research',
        linkHref: '/resources/analyst-research',
        cards: [
          {
            title: 'Leader',
            subtitle: 'Gartner® MQ™ for Enterprise Architecture Tools',
            meta: '2023 · 2024 · 2025',
          },
          {
            title: 'Visionary',
            subtitle: 'Gartner® MQ™ for Digital Twin of Organization Platforms',
            meta: 'Inaugural 2026',
          },
        ],
        peerInsights: {
          score: '4.1/5',
          source: 'Gartner Peer Insights, 110 reviews',
          quote:
            'QualiWare’s average lifetime customer contract duration is 15 years — the longest in the EA tools market.',
        },
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE PLATFORM',
        heading: 'One platform. One connected view of your organization.',
        features: [
          {
            title: 'Digital Twin of an Organization',
            description:
              'A continuously maintained model of how the business actually works, not a folder of diagrams.',
            linkLabel: 'Explore the discipline',
            href: '/solutions/digital-twin',
          },
          {
            title: 'Governance, risk & compliance',
            description:
              'Controls, risks and evidence attached to the processes and systems they govern.',
            linkLabel: 'Explore the discipline',
            href: '/solutions/grc',
          },
          {
            title: 'Transformation roadmapping',
            description:
              'Plan target states and sequence initiatives against the landscape you already documented.',
            linkLabel: 'Explore the discipline',
            href: '/solutions/business-transformation',
          },
          {
            title: 'Process management',
            description:
              'Publish the management system everyone actually reads, on web and on mobile.',
            linkLabel: 'Explore the discipline',
            href: '/solutions/process-management',
          },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHY IT STAYS CONNECTED',
        heading: 'Organizations don’t outgrow QualiWare. They grow with it.',
        lead: 'Most organizations keep architecture, processes, applications, risks and compliance in separate tools. As things change, those connections quietly go stale. Start with the challenge that creates the most value today. As new priorities emerge, expand the same connected model — every investment builds on the last.',
        image: {
          placeholder:
            'PHOTO — Two colleagues reviewing a process wall together in a real office — diverse, candid, not staged',
        },
        items: [
          { title: 'Understand dependencies across the organization' },
          { title: 'Analyze the impact of change before deciding' },
          { title: 'Maintain information once, not in five places' },
          { title: 'Strengthen governance and regulatory compliance' },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'Saab relies on QualiWare to stay compliant with the many regulations and standards it has to follow — across operations around the globe.',
        name: 'Kristin Lilja',
        role: 'Process Architect, Global Management System',
        org: 'Saab AB',
        portrait: { placeholder: 'PORTRAIT — Kristin Lilja, candid, real office' },
        videoStill: { placeholder: 'VIDEO STILL — Customer interview thumbnail with play control' },
      },
      {
        blockType: 'caseStudyCards',
        heading: 'Customer stories',
        caseStudies: caseStudyIds,
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Ready to build your digital organization?',
        text: 'Start with the challenge that matters today. Expand as your organization evolves.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  })

  /* ---- 7c. Main tenant — platform (artboard 1e) ----------------------- */

  await upsertPage(tenantIds.main, {
    title: 'How one repository holds the whole organization',
    slug: 'platform',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'THE PLATFORM',
        heading: 'How one repository holds the whole organization',
        lead: 'This page explains the machinery: the ontology, how relations stay governed, how content is published and where it can be hosted. What you do with it lives under Solutions.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'COMPARE QUALIWARE', href: '/comparison', style: 'outline' },
        ],
        showConstellation: true,
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: '01 · THE REPOSITORY',
        heading: 'Every object has one meaning and knows its neighbours',
        lead: 'An ontology defines what a process, application, control or capability is, and which relations are legal between them. That is why a question about impact is a query rather than an interpretation.',
        image: {
          placeholder: 'SCREEN · IMPACT EXPLORER — node diagram with a selected application highlighted',
        },
        items: [
          { title: 'Typed relations, validated on save' },
          { title: 'Versioning and review on every object' },
          { title: 'One object, many views' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: '02 · CAPABILITIES',
        heading: 'The capability pages that used to sit under Solutions',
        lead: 'Application Portfolio Management, Business Capability Management, Information Architecture, process modelling, strategy & roadmapping, control libraries and mobile access. Each is a way of working with the repository — features, so they live here. The Solutions pages state the problem, then link down into these.',
        image: {
          placeholder: 'SCREENSHOT — Capability heat-map with the application portfolio beneath it',
        },
        items: [
          {
            title: 'Application Portfolio Management',
            text: 'What you run, what it costs and what depends on it.',
          },
          {
            title: 'Business Capability Management',
            text: 'What the organization is able to do, and how well.',
          },
          {
            title: 'Information Architecture',
            text: 'Which information objects the business relies on, and where they live.',
          },
          {
            title: 'Process modelling & publishing',
            text: 'The management system, published to every employee.',
          },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: '03 · STRATEGY & ROADMAPPING',
        heading: 'Target states planned against the real landscape',
        lead: 'Sequence initiatives, see which capabilities they move, and keep the roadmap tied to the same model that documents today.',
        image: { placeholder: 'SCREEN · ROADMAP — Gantt-style initiative bars across four quarters' },
        items: [
          { title: 'Sequence initiatives against documented dependencies' },
          { title: 'Compare scenarios before committing' },
          { title: 'Keep the roadmap on the same objects as the architecture' },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: '04 · SECURITY & HOSTING',
        heading: 'Where the model lives is your choice',
        features: [
          { title: 'Cloud', description: 'EU-hosted, managed by QualiWare' },
          { title: 'Sovereign', description: 'In-country hosting for regulated sectors' },
          { title: 'On-premise', description: 'Your data centre, your controls' },
          { title: 'ISO 27001', description: 'Certified, with SSO and access control' },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: '05 · INTEGRATIONS & API',
        heading: 'Connects to the systems you already run',
        features: [
          {
            title: 'ServiceNow',
            description: 'Sync the CMDB with the application landscape.',
            linkLabel: 'What it syncs',
            href: '/platform/integrations',
          },
          {
            title: 'Microsoft Entra ID',
            description: 'Single sign-on and user provisioning.',
            linkLabel: 'What it syncs',
            href: '/platform/integrations',
          },
          {
            title: 'SAP',
            description: 'Application and supplier records as governed objects.',
            linkLabel: 'What it syncs',
            href: '/platform/integrations',
          },
          {
            title: 'Jira',
            description: 'Link initiatives to delivery work items.',
            linkLabel: 'What it syncs',
            href: '/platform/integrations',
          },
          {
            title: 'Power BI',
            description: 'Report on model data in existing dashboards.',
            linkLabel: 'What it syncs',
            href: '/platform/integrations',
          },
          {
            title: 'REST API',
            description:
              'What each integration syncs is here. Endpoints, authentication and webhooks are maintained in Docs.',
            linkLabel: 'Developer documentation',
            href: 'https://docs.qualiware.com/api-reference',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'See the repository on your own architecture',
        text: '45 minutes, on your own scenario, with an architect on the call.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  })

  /* ---- 7d. Main tenant — solutions (artboard 1d) ---------------------- */

  await upsertPage(tenantIds.main, {
    title: 'Start where it matters most. Expand from there.',
    slug: 'solutions',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'SOLUTIONS',
        heading: 'Start where it matters most. Expand from there.',
        lead: 'You don’t have to model the whole organization on day one. Pick the challenge with the most value today — every next initiative builds on the same connected model.',
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'BY DISCIPLINE',
        heading: 'Six disciplines, one repository underneath',
        features: [
          {
            title: 'Enterprise Architecture',
            description:
              'Align IT with strategy and know what your application landscape actually costs you. Platform pages: Application Portfolio Management, Business Capability Management, Information Architecture',
            linkLabel: 'Enterprise Architecture',
            href: '/solutions/enterprise-architecture',
          },
          {
            title: 'Governance, Risk & Compliance',
            description:
              'Answer a regulator from the model you already maintain, not a new spreadsheet. Platform pages: control libraries, risk registers, audit workflows',
            linkLabel: 'Governance, Risk & Compliance',
            href: '/solutions/grc',
          },
          {
            title: 'Process Management',
            description:
              'Publish a management system employees open on their own, on web and on mobile. Platform pages: process modelling & publishing, review cycles',
            linkLabel: 'Process Management',
            href: '/solutions/process-management',
          },
          {
            title: 'Digital Twin of an Organization',
            description:
              'One connected model of how the organization works, kept current as it changes. A discipline in its own right, not a campaign theme',
            linkLabel: 'Digital Twin of an Organization',
            href: '/solutions/digital-twin',
          },
          {
            title: 'AI Governance',
            description:
              'Know where AI touches your processes, data and obligations before an auditor asks. Platform pages: control libraries, impact analysis',
            linkLabel: 'AI Governance',
            href: '/solutions/ai-governance',
          },
          {
            title: 'Business Transformation',
            description:
              'Plan the target state and sequence initiatives against the landscape you documented. Platform pages: strategy & roadmapping, scenario comparison',
            linkLabel: 'Business Transformation',
            href: '/solutions/business-transformation',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'BY INDUSTRY',
        heading: 'The sector pages buyers arrive on',
        features: [
          { title: 'Public Sector', linkLabel: 'Public Sector', href: '/solutions/public-sector' },
          { title: 'Finance', linkLabel: 'Finance', href: '/solutions/finance' },
          { title: 'Defence', linkLabel: 'Defence', href: '/solutions/defence' },
          {
            title: 'Energy & Utilities',
            linkLabel: 'Energy & Utilities',
            href: '/solutions/energy-utilities',
          },
          { title: 'Manufacturing', linkLabel: 'Manufacturing', href: '/solutions/manufacturing' },
          { title: 'Life sciences', linkLabel: 'Life sciences', href: '/solutions/life-sciences' },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'BY REGULATION',
        heading:
          'Buyers arrive with a deadline, not a discipline. These pages are the entry point for one obligation and route into GRC.',
        features: [
          { title: 'NIS2', linkLabel: 'NIS2', href: '/solutions/nis2' },
          { title: 'DORA', linkLabel: 'DORA', href: '/solutions/dora' },
          { title: 'CSRD', linkLabel: 'CSRD', href: '/solutions/csrd' },
          { title: 'ISO 27001', linkLabel: 'ISO 27001', href: '/solutions/iso-27001' },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Not sure which starting point fits your organization?',
        text: 'Answer four questions and we’ll point you at the discipline with the fastest payback.',
        ctaLabel: 'TALK TO AN ARCHITECT',
        ctaHref: '/solutions/find-your-starting-point',
      },
    ],
  })

  /* ---- 7e. Main tenant — comparison (artboard 1f) --------------------- */

  const toVerify = [{ value: 'To verify' }, { value: 'To verify' }, { value: 'To verify' }]

  await upsertPage(tenantIds.main, {
    title: 'QualiWare compared with LeanIX, Ardoq and BiZZdesign',
    slug: 'comparison',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'COMPARE',
        heading: 'QualiWare compared with LeanIX, Ardoq and BiZZdesign',
        lead: 'EA tools look similar on a feature list. The difference shows up in year three — when compliance, process management and transformation all need to sit on the same model.',
      },
      {
        blockType: 'comparisonTable',
        heading: 'Capability by capability',
        lead: 'The QualiWare column states what the platform does today. The competitor columns are deliberately unfilled.',
        note: 'Cells marked “To verify” are placeholders. Any published claim about another vendor should be sourced and dated before this page goes live.',
        vendors: [
          { name: 'QualiWare', highlighted: true },
          { name: 'LeanIX', highlighted: false },
          { name: 'Ardoq', highlighted: false },
          { name: 'BiZZdesign', highlighted: false },
        ],
        rows: [
          {
            capability: 'Ontology-driven repository shared across all disciplines',
            cells: [{ value: 'Core' }, ...toVerify],
          },
          {
            capability: 'Enterprise Architecture and GRC in one model',
            cells: [{ value: 'Core' }, ...toVerify],
          },
          {
            capability: 'Published management system for every employee',
            cells: [{ value: 'Core' }, ...toVerify],
          },
          {
            capability: 'Digital Twin of an Organization scope',
            cells: [{ value: 'Core' }, ...toVerify],
          },
          {
            capability: 'On-premise and sovereign hosting options',
            cells: [{ value: 'Available' }, ...toVerify],
          },
          {
            capability: 'Typical customer relationship length',
            cells: [{ value: '15 years avg.' }, ...toVerify],
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHERE THE DIFFERENCE SHOWS UP',
        heading: 'Three differences that only appear in year three',
        features: [
          {
            title: 'One model, not three tools',
            description:
              'Architecture, process and compliance teams work on the same objects instead of reconciling exports.',
          },
          {
            title: 'Built for the long horizon',
            description:
              'A 99% annual renewal rate and a 26-year longest customer relationship — the model outlives the reorganisation.',
          },
          {
            title: 'Recognised on both fronts',
            description:
              'Leader in the Gartner® MQ™ for EA Tools three years running, and Visionary in the inaugural 2026 DTO MQ™.',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Run your own comparison — on your architecture',
        text: 'Bring the capability list you are evaluating against and we will work through it with an architect.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  })

  /* ---- 7f. Main tenant — pricing / book a demo (artboard 1m) ---------- */

  await upsertPage(tenantIds.main, {
    title: 'Priced for the scope you start with, not the size of your org chart',
    slug: 'pricing',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'PRICING',
        heading: 'Priced for the scope you start with, not the size of your org chart',
        lead: 'Every plan runs on the same repository. You add disciplines and users as the model grows — there is no migration between tiers.',
      },
      {
        blockType: 'pricingTable',
        heading: 'Three tiers, one repository',
        note: 'Licensing depends on disciplines in scope, number of editors and hosting model. We quote once we understand the scope — usually in the first call.',
        tiers: [
          {
            name: 'Foundation',
            description:
              'One discipline, one team. The usual entry point for a first EA or process initiative.',
            emphasized: false,
            features: [
              { text: 'Ontology-driven repository' },
              { text: 'Modelling & publishing' },
              { text: 'Web portal for readers' },
              { text: 'Standard support' },
            ],
            ctaLabel: 'CONTACT SALES',
            ctaHref: '/company/contact',
          },
          {
            name: 'Connected',
            description:
              'Two or more disciplines on one model — typically EA plus compliance or process management.',
            emphasized: true,
            tabLabel: 'MOST CHOSEN',
            features: [
              { text: 'Everything in Foundation' },
              { text: 'Impact analysis & scenarios' },
              { text: 'Control libraries & framework mapping' },
              { text: 'Integrations & REST API' },
              { text: 'Named onboarding lead' },
            ],
            ctaLabel: 'CONTACT SALES',
            ctaHref: '/company/contact',
          },
          {
            name: 'Enterprise',
            description:
              'Organization-wide deployment, sovereign or on-premise hosting, and formal governance.',
            emphasized: false,
            features: [
              { text: 'Everything in Connected' },
              { text: 'Unlimited readers' },
              { text: 'On-premise / sovereign hosting' },
              { text: 'Dedicated architect & SLA' },
            ],
            ctaLabel: 'CONTACT SALES',
            ctaHref: '/company/contact',
          },
        ],
      },
      {
        blockType: 'formBlock',
        eyebrow: 'BOOK A DEMO',
        heading: 'Book a demo',
        lead: '45 minutes, on your own scenario. Bring a real question — an application you want to retire, a regulation you have to answer for — and we will model it with you.',
        expectations: [
          { text: 'No slide deck unless you ask for one' },
          { text: 'An architect on the call, not only sales' },
          { text: 'Written follow-up with a suggested starting point' },
        ],
        sideQuote:
          '“QualiWare’s average lifetime customer contract duration is 15 years — the longest in the EA tools market.” — Gartner® 2025 Magic Quadrant™ for Enterprise Architecture Tools',
        formFields: [
          { label: 'First name', name: 'firstName', fieldType: 'text', required: true, width: 'half' },
          { label: 'Last name', name: 'lastName', fieldType: 'text', required: true, width: 'half' },
          { label: 'Work email', name: 'email', fieldType: 'email', required: true, width: 'half' },
          {
            label: 'Organization',
            name: 'organization',
            fieldType: 'text',
            required: true,
            width: 'half',
          },
          {
            label: 'Country',
            name: 'country',
            fieldType: 'select',
            required: true,
            width: 'half',
            options: [
              { value: 'Denmark' },
              { value: 'Sweden' },
              { value: 'Norway' },
              { value: 'Finland' },
              { value: 'Germany' },
              { value: 'Netherlands' },
              { value: 'United Kingdom' },
              { value: 'Canada' },
              { value: 'United States' },
              { value: 'Other' },
            ],
          },
          {
            label: 'Role',
            name: 'role',
            fieldType: 'select',
            required: true,
            width: 'half',
            options: [
              { value: 'Enterprise Architect' },
              { value: 'Process Architect' },
              { value: 'Compliance / Risk' },
              { value: 'IT leadership' },
              { value: 'Business leadership' },
              { value: 'Consultant / Partner' },
            ],
          },
          {
            label: 'Where would you start?',
            name: 'startingPoint',
            fieldType: 'chips',
            required: true,
            width: 'full',
            options: [
              { value: 'Enterprise Architecture' },
              { value: 'GRC' },
              { value: 'Process Management' },
              { value: 'Digital Twin' },
            ],
          },
          {
            label: 'What would you like to see?',
            name: 'message',
            fieldType: 'textarea',
            required: false,
            width: 'full',
          },
        ],
        submitLabel: 'BOOK THE DEMO',
        privacyNote:
          'We use your details only to prepare and follow up on the demo. See the privacy notice.',
      },
    ],
  })

  /* ---- 7g. Main tenant — resources hub (artboard 1h) ------------------ */

  await upsertPage(tenantIds.main, {
    title: 'Insight from people who do this for a living',
    slug: 'resources',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'RESOURCES',
        heading: 'Insight from people who do this for a living',
        showSearch: true,
        searchPlaceholder: 'Search articles, webinars and research',
        popularSearches: [
          { label: 'NIS2', href: '/resources/blog?tag=nis2' },
          { label: 'Capability maps', href: '/resources/blog?tag=capability-maps' },
          { label: 'Digital twin', href: '/resources/guides' },
          { label: 'Magic Quadrant', href: '/resources/analyst-research' },
        ],
      },
      {
        blockType: 'resourceGrid',
        heading: 'Latest',
        showFilters: true,
        items: [
          {
            resourceType: 'analyst',
            title:
              'What the 2026 Digital Twin of an Organization Magic Quadrant™ means for architects',
            summary:
              'Where DTO fits next to classic EA tooling, and what to expect from the category over the next two years.',
            meta: 'ANALYST RESEARCH · FEATURED',
            featured: true,
            image: { placeholder: 'FEATURED PHOTO — Analyst research cover or event photo' },
            href: '/resources/analyst-research/dto-magic-quadrant-2026',
          },
          {
            resourceType: 'webinar',
            title: 'NIS2 in practice: mapping controls onto the processes you already have',
            summary: 'Save your seat — 45 minutes, with time for questions at the end.',
            meta: '18 September · 14:00 CET · 45 minutes',
            image: { placeholder: 'PHOTO · Webinar host presenting, real environment' },
            href: '/resources/webinars/nis2-in-practice',
          },
          {
            resourceType: 'guide',
            title: 'Where to start with a digital twin of your organization',
            summary: 'A short, practical sequence for the first 90 days.',
            meta: 'GUIDE',
            image: { placeholder: 'PHOTO · Guide cover — process wall detail' },
            href: '/resources/guides/where-to-start-digital-twin',
          },
          {
            resourceType: 'blog',
            title: 'Why application portfolios go stale — and what to do about it',
            summary:
              'Portfolios do not decay because nobody cares. They decay because maintenance has no owner.',
            meta: 'BLOG · 7 MIN',
            image: { placeholder: 'PHOTO · Architect at a whiteboard, candid' },
            href: '/resources/blog/why-application-portfolios-go-stale',
          },
          {
            resourceType: 'blog',
            title: 'Capability maps that survive contact with the business',
            summary:
              'The difference between a capability map people use and one they nod at is about six words per box.',
            meta: 'BLOG · 6 MIN',
            image: { placeholder: 'PHOTO · Workshop — diverse group, candid, not staged' },
            href: '/resources/blog/capability-maps-that-survive',
          },
          {
            resourceType: 'webinar',
            title: 'AI governance without slowing the business down',
            summary: 'Where AI touches processes, data and obligations — and how to keep track.',
            meta: 'WEBINAR · ON DEMAND',
            image: { placeholder: 'PHOTO · Webinar host' },
            href: '/resources/webinars/ai-governance-on-demand',
          },
          {
            resourceType: 'story',
            title: 'From spreadsheet inventory to a governed landscape',
            summary: 'How one manufacturer cleaned up its application landscape in two quarters.',
            meta: 'CUSTOMER STORY',
            image: { placeholder: 'PHOTO · Team reviewing a landscape on screen, candid' },
            href: '/customers',
          },
          {
            resourceType: 'newsletter',
            title: 'The monthly architects’ note',
            summary:
              'One practical piece a month for people who maintain a model rather than talk about one.',
            meta: 'NEWSLETTER · MONTHLY',
            image: { placeholder: 'PHOTO · Desk detail, real environment' },
            href: '/resources/newsletter',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'tinted',
        heading: 'Product documentation lives in Docs',
        text: 'How-to articles, admin guides and the API reference — open, no login required.',
        ctaLabel: 'GO TO DOCS',
        ctaHref: 'https://docs.qualiware.com',
      },
    ],
  })

  /* ---- 7h. Main tenant — customers archive ---------------------------- */

  await upsertPage(tenantIds.main, {
    title: 'Customer stories',
    slug: 'customers',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'CUSTOMERS',
        heading: 'Organizations that cannot afford to guess',
        lead: 'Defence groups, national agencies, utilities and manufacturers — the common thread is a model they have kept current for years, not a project they finished.',
        stats: [
          { value: '99%', label: 'annual renewal rate' },
          { value: '26 years', label: 'longest customer relationship' },
          { value: '125,000', label: 'users in a single deployment' },
          { value: 'ISO 27001', label: 'certified' },
        ],
      },
      {
        blockType: 'caseStudyArchive',
        heading: 'All customer stories',
        lead: 'Filter by industry or by the discipline the customer started with.',
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Ready to build your digital organization?',
        text: 'Start with the challenge that matters today. Expand as your organization evolves.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  })

  /* ---- 7i. Docs tenant — home (artboard 1k) --------------------------- */

  await upsertPage(tenantIds.docs, {
    title: 'Documentation & wiki',
    slug: 'home',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        heading: 'Documentation & wiki',
        lead: 'Open documentation for the whole platform — no login required.',
        showSearch: true,
        searchPlaceholder: 'Search 600+ articles — try “publish a process”',
        popularSearches: [
          { label: 'Install QualiWare', href: '/getting-started/installation/install-on-windows-server' },
          { label: 'Metamodel basics', href: '/modelling/metamodel-and-ontology/metamodel-basics' },
          { label: 'Web portal publishing', href: '/getting-started/publishing-web-portal/publish-to-the-web-portal' },
          { label: 'REST authentication', href: '/api-reference/authentication/rest-authentication' },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'START HERE',
        heading: 'Three ways in',
        features: [
          {
            title: 'New in 10.10',
            description: 'What changed, what to test, and the deprecations to plan for.',
            linkLabel: 'Read the notes',
            href: '/release-notes/qualiware-10-10/qualiware-10-10-release-notes',
          },
          {
            title: 'Your first two weeks',
            description:
              'Set up the repository, model your first process, add owners and review cycles, publish to the web portal.',
            linkLabel: 'Start the sequence',
            href: '/getting-started/first-steps/your-first-two-weeks',
          },
          {
            title: 'This wiki is open',
            description:
              'Suggest an edit on any article, or add a page to the community section.',
            linkLabel: 'How to contribute',
            href: '/getting-started/first-steps',
          },
        ],
      },
    ],
  })

  /* ---- 7j. Partners tenant — home (artboard 1i) ----------------------- */

  await upsertPage(tenantIds.partners, {
    title: 'Build a practice on a platform customers keep for 15 years',
    slug: 'home',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'navy',
        eyebrow: 'PARTNER PROGRAM',
        heading: 'Build a practice on a platform customers keep for 15 years',
        lead: 'Implementation partners, consultancies, resellers and technology partners — with certification, deal support and a shared model your clients grow into rather than out of.',
        ctas: [
          { label: 'BECOME A PARTNER', href: '/become-a-partner', style: 'neon' },
          { label: 'BROWSE THE DIRECTORY', href: '/directory', style: 'outline' },
        ],
        showConstellation: true,
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHY PARTNER WITH US',
        heading: 'What the programme is actually worth',
        features: [
          {
            title: 'Certification that means something',
            description:
              'Role-based tracks for architects, process consultants and administrators, with exams and refreshers per release.',
          },
          {
            title: 'Long engagements, not one-off projects',
            description:
              'Customers expand from one discipline to the next, so advisory work compounds instead of ending at go-live.',
          },
          {
            title: 'Co-selling with a small team',
            description:
              'Direct access to the people who build the product, not a tiered support queue.',
          },
        ],
      },
      {
        blockType: 'formBlock',
        eyebrow: 'BECOME A PARTNER',
        heading: 'Apply to the program',
        lead: 'Tell us where you work and what you build. We reply within five working days.',
        expectations: [{ text: 'No fee for Silver tier' }, { text: 'Training sandbox from day one' }],
        formFields: [
          { label: 'First name', name: 'firstName', fieldType: 'text', required: true, width: 'half' },
          { label: 'Last name', name: 'lastName', fieldType: 'text', required: true, width: 'half' },
          { label: 'Company', name: 'company', fieldType: 'text', required: true, width: 'half' },
          { label: 'Work email', name: 'email', fieldType: 'email', required: true, width: 'half' },
          {
            label: 'Partner type',
            name: 'partnerType',
            fieldType: 'select',
            required: true,
            width: 'half',
            options: [
              { value: 'Implementation' },
              { value: 'Consulting' },
              { value: 'Reseller' },
              { value: 'Technology' },
            ],
          },
          {
            label: 'Region',
            name: 'region',
            fieldType: 'select',
            required: true,
            width: 'half',
            options: [
              { value: 'Nordics' },
              { value: 'Europe' },
              { value: 'UK & Ireland' },
              { value: 'DACH' },
              { value: 'North America' },
              { value: 'Middle East & Africa' },
              { value: 'Asia-Pacific' },
            ],
          },
          {
            label: 'What do you want to build with QualiWare?',
            name: 'message',
            fieldType: 'textarea',
            required: false,
            width: 'full',
          },
        ],
        submitLabel: 'SUBMIT APPLICATION',
        privacyNote:
          'We use your details only to assess the application and get back to you. See the privacy notice.',
      },
    ],
  })

  /* ---- 7k. Partners tenant — directory + integrations ----------------- */

  await upsertPage(tenantIds.partners, {
    title: 'Find a partner who knows your industry',
    slug: 'directory',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'PARTNER DIRECTORY',
        heading: 'Find a partner who knows your industry',
        showSearch: true,
        searchPlaceholder: 'Search by name, capability or country',
      },
    ],
  })

  await upsertPage(tenantIds.partners, {
    title: 'Integrations marketplace',
    slug: 'integrations',
    pageType: 'standard',
    layout: [
      {
        blockType: 'hero',
        variant: 'navy',
        eyebrow: 'INTEGRATIONS MARKETPLACE',
        heading: 'Extensions and integrations built by partners',
        lead: 'What each integration syncs is here. Endpoints, authentication and webhooks are maintained in Docs.',
        showSearch: true,
        searchPlaceholder: 'Search integrations',
      },
    ],
  })

  /* ---- 7i. Bulk page sets ---------------------------------------------- *
   *
   * Platform, Solutions, regulations, Resources, Company, Legal and the two
   * remaining Partners pages live in `src/seed/pages/`, one module per section.
   *
   * Two passes: create every page first, then patch `relatedCapabilities`,
   * because a Solutions page links down into Platform pages that may not have
   * existed when it was written.
   * ---------------------------------------------------------------------- */

  const mainPageSets: SeedPage[][] = [
    platformPages,
    platformApiPages,
    solutionPages,
    regulationPages,
    resourcePages,
    companyPages,
    legalPages,
    utilityPages,
  ]

  const pageIdBySlug = new Map<string, number>()

  for (const set of mainPageSets) {
    for (const page of set) {
      const { relatedCapabilitySlugs: _ignored, ...data } = page
      const id = await upsertPage(tenantIds.main, data)
      pageIdBySlug.set(page.slug, id)
    }
  }

  for (const page of partnerTenantPages) {
    const { relatedCapabilitySlugs: _ignored, ...data } = page
    await upsertPage(tenantIds.partners, data)
  }

  // Pass two: resolve capability slugs to ids now that every page exists.
  let linked = 0
  for (const set of mainPageSets) {
    for (const page of set) {
      const slugs = page.relatedCapabilitySlugs
      if (!slugs?.length) continue

      const ids = slugs
        .map((slug) => {
          const id = pageIdBySlug.get(slug)
          if (id === undefined) {
            console.warn(`  ! ${page.slug}: no page for related capability "${slug}"`)
          }
          return id
        })
        .filter((id): id is number => id !== undefined)

      if (!ids.length) continue

      const id = pageIdBySlug.get(page.slug)
      if (id === undefined) continue

      await payload.update({
        collection: 'pages',
        id,
        data: { relatedCapabilities: ids },
      })
      linked += 1
    }
  }
  console.log(`  linked related capabilities on ${linked} pages`)

  /* ---------------------------------------------------------------- *
   * Summary
   * ---------------------------------------------------------------- */

  console.log('\nSeed complete.')
  for (const collection of [
    'tenants',
    'users',
    'categories',
    'docs',
    'partners',
    'integrations',
    'pages',
  ]) {
    console.log(
      `  ${collection}: ${created[collection] ?? 0} created, ${updated[collection] ?? 0} updated`,
    )
  }
}

await seed()
process.exit(0)
