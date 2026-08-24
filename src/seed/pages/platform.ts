import type { Page } from '../../payload-types'
import type { SeedAuthorship } from '../types'

type Layout = NonNullable<Page['layout']>

export type SeedPage = {
  title: string
  slug: string
  pageType?: Page['pageType']
  seo?: Page['seo']
  authorship?: SeedAuthorship
  sources?: Page['sources']
  layout: Layout
}

/* -------------------------------------------------------------------------- *
 * Platform pages — artboard 1e is the model.
 *
 * Platform answers "how does it work", never "what is it for". Every lead on
 * these pages says so where artboard 1e does: the page explains machinery, and
 * what you do with the machinery lives under Solutions.
 *
 * Skeleton per ARCHETYPES.md:
 *   hero(darkGreen) → valueProps(split) → featureGrid → proof → ctaBanner
 * `caseStudyCards` needs page ids the main seed owns, so the proof slot is a
 * `testimonial` or a second `featureGrid` here.
 * -------------------------------------------------------------------------- */

/** The dark-green hero is the constant signature of a Platform page. */
const demoCta: Layout[number] = {
  blockType: 'ctaBanner',
  background: 'iceBlue',
  heading: 'See the repository on your own architecture',
  text: '45 minutes, on your own scenario. Bring a real question and we will model it with you.',
  ctaLabel: 'BOOK A DEMO',
  ctaHref: '/pricing#demo',
}

export const platformPages: SeedPage[] = [
  /* ====================================================================== *
   * HOW IT WORKS
   * ====================================================================== */

  {
    title: 'Ontology-driven repository',
    slug: 'platform/repository',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Ontology-driven repository — QualiWare Platform',
      metaDescription:
        'How the QualiWare repository is built: an ontology that types every object and relation, validation on save, versioning, and one object rendered in many views.',
    },
    authorship: {
      authorName: 'Søren Dalgaard',
      authorRole: 'Product Manager, Repository & Ontology, QualiWare',
      authorCredentials: 'MSc Computer Science · 12 years on metamodel design',
      lastReviewed: '2026-02-19',
      experienceNote:
        'Written from the metamodel review work on QualiWare 10.9 and 10.10, covering 60+ customer ontology extensions migrated between the two releases since January 2025.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: '01 · THE REPOSITORY',
        heading: 'Every object has one meaning and knows its neighbours',
        lead: 'This page explains the machinery underneath everything else in the platform: what an object is, which relations are legal between objects, and how a change is recorded. What you do with the model lives under Solutions.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'WATCH THE 8-MINUTE TOUR', href: '/platform/tour', style: 'outline' },
        ],
        showConstellation: true,
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'An ontology, not a drawing tool',
        lead: 'A drawing tool stores shapes. The QualiWare repository stores objects with a defined meaning — a process, an application, a control, a capability, an information object, an organisational unit — and a rule set that says which relations may exist between them. Because the relations are typed, a question about impact is a query rather than an interpretation.',
        image: {
          placeholder:
            'SCREEN · METAMODEL EXPLORER — object types on the left, legal relation types for the selected type on the right',
        },
        items: [
          {
            title: 'Typed relations, validated on save',
            text: 'A control can govern a process; it cannot "kind of relate to" one. Invalid relations are refused at save time, not found in an audit two years later.',
          },
          {
            title: 'One object, many views',
            text: 'The same application appears in a process diagram, a capability heat-map, an APM list and a risk register. Edit it once and every view is correct.',
          },
          {
            title: 'Versioning on every change',
            text: 'Each object carries its own version history with author, timestamp and the state it moved from. You can read the model as it stood on any past date.',
          },
          {
            title: 'Extensible without a fork',
            text: 'Customers add object types, attributes and relation types on top of the shipped ontology. Extensions are declared, so they survive an upgrade.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHAT THE REPOSITORY GIVES YOU',
        heading: 'The mechanics a practitioner asks about',
        features: [
          {
            title: 'Metamodel administration',
            description:
              'Object types, attributes, relation types and their cardinality are configured by an administrator in the platform, not by a consultant in code.',
          },
          {
            title: 'Naming and uniqueness rules',
            description:
              'Uniqueness can be enforced per object type, so two teams cannot quietly create two applications with the same name and different owners.',
          },
          {
            title: 'Baselines and comparison',
            description:
              'Freeze the model as a named baseline, then compare a later state against it to see exactly which objects and relations changed.',
          },
          {
            title: 'Reference data as objects',
            description:
              'Lifecycle states, criticality scales and technology standards are governed objects, so a report never depends on how someone typed a free-text field.',
          },
          {
            title: 'Repository-wide search',
            description:
              'Search across every object type and attribute, then filter by owner, lifecycle state or relation to a selected object.',
          },
          {
            title: 'Typed impact queries',
            description:
              'Follow relations outward from any object to any depth. This is the same engine the impact analysis pages use.',
            linkLabel: 'How impact analysis works',
            href: '/platform/impact-analysis',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'The metamodel discussion was the hardest month of the project and the reason everything since has been easy. Once "application" meant one thing, the arguments about which report was right simply stopped.',
        name: 'Head of Enterprise Architecture',
        role: 'Named on request',
        org: 'Nordic energy group',
        portrait: {
          placeholder: 'PORTRAIT — Enterprise architect at a workstation, real office, no stock photography',
        },
      },
      demoCta,
    ],
  },

  {
    title: 'Impact analysis & traceability',
    slug: 'platform/impact-analysis',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Impact analysis & traceability — QualiWare Platform',
      metaDescription:
        'How QualiWare answers "what breaks if we change this": typed relations traversed to any depth, dependency views, and traceability from strategy to a control.',
    },
    authorship: {
      authorName: 'Mette Holm',
      authorRole: 'Principal Enterprise Architect, QualiWare',
      authorCredentials: 'TOGAF 9 certified · 14 years in EA',
      lastReviewed: '2026-03-11',
      experienceNote:
        'Based on 30+ dependency-mapping workshops run with customers since 2023, including four application-decommissioning programmes where the analysis had to hold up in a change board.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: '02 · IMPACT ANALYSIS',
        heading: 'What breaks if we change this, answered as a query',
        lead: 'This page explains how the traversal works — which relations it follows, how far, and what it returns. The business cases for using it sit under Solutions.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'HOW THE REPOSITORY WORKS', href: '/platform/repository', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'Select an object, choose a direction, set a depth',
        lead: 'Impact analysis starts from any object in the repository. You choose which relation types to follow, whether to follow them upstream, downstream or both, and how many hops to travel. The result is a set of objects with the path that connected them — not a picture, a list you can act on and export.',
        image: {
          placeholder:
            'SCREEN · IMPACT EXPLORER — node diagram with a selected application highlighted and the dependency count panel beneath it',
        },
        items: [
          {
            title: 'Direction matters',
            text: 'Upstream tells you what this object depends on. Downstream tells you who depends on it. The two questions have different answers and the tool keeps them separate.',
          },
          {
            title: 'Depth is yours to set',
            text: 'One hop shows the direct neighbours. Three hops usually reveals the surprise — the report a decommissioning misses.',
          },
          {
            title: 'The path is shown, not implied',
            text: 'Every result carries the chain of relations that produced it, so a reviewer can check the reasoning instead of trusting the number.',
          },
          {
            title: 'Results leave the tool',
            text: 'Export the affected set to a spreadsheet, publish it to the web portal, or attach it to a change request as evidence of what was assessed.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'TRACEABILITY',
        heading: 'From a strategic objective to a single control',
        features: [
          {
            title: 'Vertical traceability',
            description:
              'Objective → capability → process → application → control. Each link is a typed relation, so the chain can be queried rather than reconstructed by hand.',
          },
          {
            title: 'Coverage gaps',
            description:
              'The same traversal run in reverse finds what is missing: processes with no control, applications with no owner, capabilities no initiative touches.',
          },
          {
            title: 'Change-over-time views',
            description:
              'Because objects are versioned, an impact analysis can be run against a baseline to show how dependencies looked before a programme started.',
            linkLabel: 'Versioning in the repository',
            href: '/platform/repository',
          },
          {
            title: 'Analysis matrices',
            description:
              'Cross two object types to see every intersection at once — applications against business units, controls against processes, risks against capabilities.',
          },
          {
            title: 'Saved analyses',
            description:
              'A traversal definition can be saved and re-run, so the quarterly review asks the same question every quarter.',
          },
          {
            title: 'Published for non-modellers',
            description:
              'The dependency view can be published to the web portal, where a manager reads it without a modelling licence.',
            linkLabel: 'Publishing & the web portal',
            href: '/platform/publishing',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'We ran the decommissioning list through impact analysis and found eleven processes and two open risks nobody had connected to the application. That single query moved the go-live by a quarter, and it was the right call.',
        name: 'Programme Director',
        role: 'Application rationalisation programme',
        org: 'European public-sector agency',
        portrait: {
          placeholder: 'PORTRAIT — Programme director in a meeting room, whiteboard visible behind',
        },
      },
      demoCta,
    ],
  },

  {
    title: 'Governance & workflow',
    slug: 'platform/governance-workflow',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Governance & workflow — QualiWare Platform',
      metaDescription:
        'How content is governed in QualiWare: object lifecycle states, review and approval workflow, delegated ownership, recurring review dates and a full audit trail.',
    },
    authorship: {
      authorName: 'Lars Bek Jensen',
      authorRole: 'Head of Compliance Practice, QualiWare',
      authorCredentials: 'Lead Auditor ISO 27001 · 16 years in governance and internal control',
      lastReviewed: '2026-04-08',
      experienceNote:
        'Drawn from 25+ management-system implementations configured since 2022, including nine that were subsequently audited against ISO 9001 or ISO 27001 with the QualiWare audit trail as evidence.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: '03 · GOVERNANCE & WORKFLOW',
        heading: 'Nothing becomes official until someone owns it',
        lead: 'This page explains the governance machinery: lifecycle states, who may move an object between them, and what the platform records when they do. Which regulation you are governing for lives under Solutions.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'ACCESS CONTROL & SSO', href: '/platform/access-control', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'A lifecycle state on every object, and a workflow between the states',
        lead: 'Each object type carries a lifecycle — typically draft, in review, approved, published, retired. Moving an object forward is a workflow step with a named actor, a decision and a timestamp. The published web portal only ever shows approved content, so employees cannot read a draft by accident.',
        image: {
          placeholder:
            'SCREEN · APPROVAL QUEUE — a reviewer’s task list with object name, requester, state transition and due date',
        },
        items: [
          {
            title: 'Ownership is an attribute, not a convention',
            text: 'Every object has an owner and, where needed, a separate approver. An object without an owner is a reportable gap.',
          },
          {
            title: 'Review dates that come round',
            text: 'Set a review interval per object type. When it falls due, the owner gets a task — the model ages visibly instead of silently.',
          },
          {
            title: 'Comment and reject, in place',
            text: 'A reviewer can reject with a comment attached to the object. The conversation stays with the content rather than in an inbox.',
          },
          {
            title: 'Delegation without losing accountability',
            text: 'Owners can delegate editing while remaining the accountable party of record, which is what an auditor asks about.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE AUDIT TRAIL',
        heading: 'What the platform records, without being asked',
        features: [
          {
            title: 'Who changed what, and when',
            description:
              'Every attribute change, relation change and state transition is written to the object’s history with the acting user and a timestamp.',
          },
          {
            title: 'Approval evidence',
            description:
              'The approval record names the approver and the version approved, so "which version was in force in March" has one answer.',
          },
          {
            title: 'Read receipts on published content',
            description:
              'Where required, the portal can record that a named employee has read a published document — the evidence a management-system audit asks for.',
            linkLabel: 'Publishing & the web portal',
            href: '/platform/publishing',
          },
          {
            title: 'Configurable workflows per object type',
            description:
              'A process definition and a risk record can follow different routes. The workflow is configuration, not custom development.',
          },
          {
            title: 'Task inbox and email notification',
            description:
              'Reviewers work from a queue in the platform or from a notification. Overdue tasks escalate to the owner’s manager where configured.',
          },
          {
            title: 'Reporting on the governance itself',
            description:
              'How much content is approved, how much is overdue for review, which owners are behind — reportable in the same way as any other object data.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'ROLES IN A TYPICAL SETUP',
        heading: 'Four roles cover most organisations',
        features: [
          {
            title: 'Modeller',
            description:
              'Creates and edits objects and diagrams. Works in the modelling client, holds a full licence.',
          },
          {
            title: 'Content owner',
            description:
              'Accountable for a defined set of objects, responds to review tasks, may edit or delegate.',
          },
          {
            title: 'Approver',
            description:
              'Moves content to approved. Often a process owner or a line manager rather than an architect.',
          },
          {
            title: 'Reader',
            description:
              'Reads published content in the web portal or on mobile. No modelling licence required.',
            linkLabel: 'QualiWare Go',
            href: '/platform/qualiware-go',
          },
        ],
      },
      demoCta,
    ],
  },

  {
    title: 'Publishing & the web portal',
    slug: 'platform/publishing',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Publishing & the web portal — QualiWare Platform',
      metaDescription:
        'How approved model content becomes a web portal people read: role-based landing pages, generated documents, search, feedback and controlled publication.',
    },
    authorship: {
      authorName: 'Anne-Sofie Krogh',
      authorRole: 'Lead Solution Architect, Process & Publishing, QualiWare',
      authorCredentials: 'BPMN 2.0 practitioner · 11 years implementing management systems',
      lastReviewed: '2026-01-28',
      experienceNote:
        'Based on portal rollouts to organisations from 400 to 26,000 employees since 2021, including three where the portal replaced an intranet document library outright.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: '04 · PUBLISHING',
        heading: 'The model, readable by people who will never open a modelling tool',
        lead: 'This page explains how publication works: what gets published, who sees it, and how a reader navigates it. Why you would publish a management system is a Solutions question.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'GOVERNANCE & WORKFLOW', href: '/platform/governance-workflow', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'Publication is a state, not an export',
        lead: 'Nothing is copied out of the repository. The web portal reads approved versions of the same objects, so a diagram in the portal is the diagram in the model — one version behind the modeller’s draft, and never a stale PDF. Publishing a change is a governance step, and unpublishing it is too.',
        image: {
          placeholder:
            'SCREENSHOT — Web portal process page: diagram, roles, linked documents and the approval footer showing version and date',
        },
        items: [
          {
            title: 'Role-based landing pages',
            text: 'A nurse, a case worker and an internal auditor arrive at different front pages assembled from the same repository.',
          },
          {
            title: 'Clickable diagrams',
            text: 'Readers drill from a value chain into a process, then into the work instruction, without being taught notation.',
          },
          {
            title: 'Search that respects the ontology',
            text: 'Results are typed. A reader can filter to processes, policies or applications rather than scrolling a single undifferentiated list.',
          },
          {
            title: 'Feedback from the reader back to the owner',
            text: 'A comment on a published page becomes a task for the object owner, which is how a management system stays honest.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'OUTPUT FORMATS',
        heading: 'The same content, in the form each audience needs',
        features: [
          {
            title: 'Web portal',
            description:
              'The primary channel. Responsive, searchable, no client software, and readable without a modelling licence.',
          },
          {
            title: 'Generated documents',
            description:
              'Word and PDF documents assembled from the model on demand, so a handbook is never edited separately from the objects it describes.',
          },
          {
            title: 'Mobile',
            description:
              'Published content on a phone for people who work away from a desk, including offline reading of a downloaded set.',
            linkLabel: 'QualiWare Go',
            href: '/platform/qualiware-go',
          },
          {
            title: 'Embedded views',
            description:
              'A published diagram or list can be embedded in an existing intranet page, so the portal does not have to win a turf war.',
          },
          {
            title: 'Multiple languages',
            description:
              'Object attributes can carry translations, and the portal serves the reader’s language while the model stays single-sourced.',
          },
          {
            title: 'Audience-scoped publication',
            description:
              'Publication can be restricted by group, so commercially sensitive content is published without being public.',
            linkLabel: 'Access control & SSO',
            href: '/platform/access-control',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'The measure we agreed on was portal visits per employee per month, because a management system nobody opens is just a filing cabinet. It is the first documentation platform here that people use without being reminded.',
        name: 'Quality Manager',
        role: 'Named on request',
        org: 'Danish healthcare organisation',
        portrait: {
          placeholder: 'PORTRAIT — Quality manager on a hospital ward corridor, real environment',
        },
      },
      demoCta,
    ],
  },

  /* ====================================================================== *
   * CAPABILITIES
   * ====================================================================== */

  {
    title: 'Application Portfolio Management',
    slug: 'platform/application-portfolio-management',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Application Portfolio Management — QualiWare Platform',
      metaDescription:
        'How APM works in QualiWare: one governed application record, lifecycle and cost attributes, capability mapping, and portfolio views from the same repository.',
    },
    authorship: {
      authorName: 'Katrine Bjerre',
      authorRole: 'APM Practice Lead, QualiWare',
      authorCredentials: 'ITIL 4 Managing Professional · 13 years in IT portfolio management',
      lastReviewed: '2026-03-24',
      experienceNote:
        'Based on 18 portfolio onboardings since 2022, the largest a 2,300-application estate loaded from a ServiceNow CMDB and reconciled over eleven weeks.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'CAPABILITY',
        heading: 'One application record the whole organisation argues from',
        lead: 'This page explains how the application portfolio is modelled and kept current — the record, its attributes, and where the data comes from. Rationalisation and cost cases live under Solutions.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'INTEGRATION CATALOGUE', href: '/platform/integrations', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'An application is an object, so it can be related to everything else',
        lead: 'The application record is not a spreadsheet row. It is a repository object with an owner, a lifecycle state, cost and contract attributes, and typed relations to the capabilities it supports, the processes that use it, the information objects it holds and the risks and controls attached to it. That is what makes a portfolio view more than an inventory.',
        image: {
          placeholder:
            'SCREENSHOT — Application record: owner, lifecycle, cost attributes and the related-objects panel showing capabilities, processes and controls',
        },
        items: [
          {
            title: 'One record, many portfolio views',
            text: 'Technical fit against business value, cost against criticality, lifecycle against renewal date — all rendered from the same attributes.',
          },
          {
            title: 'Loaded from the systems that already know',
            text: 'A CMDB, a contract register or a finance export can populate and refresh attributes, with QualiWare governing the meaning.',
          },
          {
            title: 'Owners are named and reviewed',
            text: 'Applications with no owner or a stale review date show up as a gap, which is the only way a portfolio stays trustworthy.',
          },
          {
            title: 'Decommissioning as an assessed decision',
            text: 'Run impact analysis before you retire anything, and keep the assessment attached to the change record.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHAT YOU CAN BUILD',
        heading: 'Views practitioners set up in the first month',
        features: [
          {
            title: 'Lifecycle timeline',
            description:
              'Every application on one timeline with support-end and contract-end dates, so a renewal cliff is visible a year out.',
          },
          {
            title: 'Capability coverage map',
            description:
              'Which capabilities are served by how many applications. Overlap and white space read off the same map.',
            linkLabel: 'Business Capability Management',
            href: '/platform/business-capability-management',
          },
          {
            title: 'Technology standards compliance',
            description:
              'Applications checked against governed technology-standard objects, so "off-standard" is a query and not an opinion.',
          },
          {
            title: 'Cost and licence attributes',
            description:
              'Run cost, project cost and licence counts held as attributes on the record and aggregated up the capability tree.',
          },
          {
            title: 'Risk and control linkage',
            description:
              'Open risks and the controls that mitigate them attach to the application, which is what a regulator asks to see.',
          },
          {
            title: 'Dependency map',
            description:
              'Application-to-application interfaces modelled as typed relations, traversable to any depth.',
            linkLabel: 'Impact analysis & traceability',
            href: '/platform/impact-analysis',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'We had four application lists and no agreement. Loading the CMDB into a governed record forced the reconciliation we had avoided for years — 2,300 applications became 1,740 real ones with named owners.',
        name: 'Head of IT Governance',
        role: 'Named on request',
        org: 'Nordic financial services group',
        portrait: { placeholder: 'PORTRAIT — IT governance lead at a desk with two monitors, real office' },
      },
      demoCta,
    ],
  },

  {
    title: 'Business Capability Management',
    slug: 'platform/business-capability-management',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Business Capability Management — QualiWare Platform',
      metaDescription:
        'How capability modelling works in QualiWare: a governed capability tree, assessment attributes, heat-maps rendered from real data, and links to the model.',
    },
    authorship: {
      authorName: 'Mette Holm',
      authorRole: 'Principal Enterprise Architect, QualiWare',
      authorCredentials: 'TOGAF 9 certified · 14 years in EA',
      lastReviewed: '2026-02-05',
      experienceNote:
        'Based on 20+ capability-map facilitations since 2021. The pattern that holds: three levels, no more than nine level-one capabilities, and an owner on every level-two node.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'CAPABILITY',
        heading: 'A capability map that is wired to the rest of the model',
        lead: 'This page explains how capabilities are structured, assessed and rendered as heat-maps. Using the map to decide where to invest is a Solutions question.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'STRATEGY & ROADMAPPING', href: '/platform/strategy-roadmapping', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'A tree of governed objects, each carrying its own assessment',
        lead: 'Capabilities are objects in a hierarchy, usually three levels deep. Each node has an owner and a set of assessment attributes — maturity, strategic importance, performance, cost. A heat-map is not drawn by hand; it is a rendering of those attributes, so it changes when the assessment changes and nowhere else.',
        image: {
          placeholder:
            'SCREENSHOT — Capability heat-map, three levels, coloured by maturity, with the application portfolio beneath it',
        },
        items: [
          {
            title: 'The map is a query result',
            text: 'Recolour by any attribute — maturity, cost, number of supporting applications, open risks — without redrawing anything.',
          },
          {
            title: 'Capabilities connect downward',
            text: 'Typed relations to the processes that realise a capability and the applications that support it. That is where the interesting questions live.',
          },
          {
            title: 'Assessment is versioned',
            text: 'This year’s maturity score sits beside last year’s, so improvement is evidenced rather than asserted.',
          },
          {
            title: 'Reference models as a starting point',
            text: 'Import an industry reference map and adapt it. Faster than a blank canvas, and the provenance stays recorded.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE MECHANICS',
        heading: 'What makes a capability map hold up under scrutiny',
        features: [
          {
            title: 'Levelling rules',
            description:
              'Depth and naming conventions enforced by the ontology, so the map does not drift into a process list at level three.',
          },
          {
            title: 'Multiple assessment scales',
            description:
              'Configure the scales your organisation already uses. The heat-map legend follows the scale rather than the reverse.',
          },
          {
            title: 'Aggregation up the tree',
            description:
              'Costs, application counts and risk counts roll up from level three to level one automatically.',
          },
          {
            title: 'Initiative overlay',
            description:
              'See which capabilities each initiative in the roadmap is meant to move, and which get no attention at all.',
            linkLabel: 'Strategy & roadmapping',
            href: '/platform/strategy-roadmapping',
          },
          {
            title: 'Published to the business',
            description:
              'The map goes to the web portal, where a business owner reads their own capability without a modelling licence.',
            linkLabel: 'Publishing & the web portal',
            href: '/platform/publishing',
          },
          {
            title: 'Gap reporting',
            description:
              'Capabilities with no owner, no supporting application or no assessment in the last year, listed as a work queue.',
          },
        ],
      },
      demoCta,
    ],
  },

  {
    title: 'Information Architecture',
    slug: 'platform/information-architecture',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Information Architecture — QualiWare Platform',
      metaDescription:
        'How QualiWare models information: governed information objects, a business glossary, data ownership, lineage across systems and links to processes and controls.',
    },
    authorship: {
      authorName: 'Søren Dalgaard',
      authorRole: 'Product Manager, Repository & Ontology, QualiWare',
      authorCredentials: 'MSc Computer Science · 12 years on metamodel design',
      lastReviewed: '2026-04-22',
      experienceNote:
        'Based on glossary and lineage work with 14 customers since 2022, including two GDPR records-of-processing builds where the information model was the source of the record.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'CAPABILITY',
        heading: 'The information the business runs on, named once',
        lead: 'This page explains how information objects, the glossary and lineage are modelled. Why you would do it — data governance, GDPR records, reporting trust — belongs under Solutions.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'HOW THE REPOSITORY WORKS', href: '/platform/repository', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'A business term and a system field are two different objects',
        lead: 'Information architecture in QualiWare separates the concept from its implementations. "Customer" is one governed information object with a definition and an owner; the six systems that store customer data are related to it, each with its own attributes. Keeping them distinct is what stops a glossary from becoming a second, contradictory data dictionary.',
        image: {
          placeholder:
            'SCREENSHOT — Information object "Customer": definition, steward, classification, and related systems and processes',
        },
        items: [
          {
            title: 'A glossary with an owner per term',
            text: 'Definitions are approved objects with review dates, not a wiki page that nobody has touched since the project ended.',
          },
          {
            title: 'Classification as a governed attribute',
            text: 'Personal, sensitive, confidential, public — set from a controlled list, so a report on personal data is reliable.',
          },
          {
            title: 'Lineage across systems',
            text: 'Where information is created, where it is read, and where it is mastered, modelled as typed relations rather than described in prose.',
          },
          {
            title: 'Connected to process and control',
            text: 'Each information object links to the processes that handle it and the controls that protect it, which is what an audit follows.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE MECHANICS',
        heading: 'What the information model gives you',
        features: [
          {
            title: 'Conceptual and logical layers',
            description:
              'Model the business concept and its logical structures separately, with relations between them, so both audiences find their own view.',
          },
          {
            title: 'Data steward roles',
            description:
              'Stewardship is an ownership relation with review obligations, handled by the same governance workflow as everything else.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'CRUD matrices',
            description:
              'Which process or application creates, reads, updates or deletes each information object, rendered as a matrix from the relations.',
          },
          {
            title: 'System-of-record designation',
            description:
              'Exactly one application can be marked as master for an information object, enforced by the ontology rather than by memory.',
          },
          {
            title: 'Retention and location attributes',
            description:
              'Retention period and storage location held on the object, which is what makes a records-of-processing report possible.',
          },
          {
            title: 'Impact of a schema change',
            description:
              'Traverse from an information object to every process, report and application that touches it before the change goes ahead.',
            linkLabel: 'Impact analysis & traceability',
            href: '/platform/impact-analysis',
          },
        ],
      },
      demoCta,
    ],
  },

  {
    title: 'Process modelling & publishing',
    slug: 'platform/process-modelling',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Process modelling & publishing — QualiWare Platform',
      metaDescription:
        'How process modelling works in QualiWare: BPMN and simpler notations, reusable roles and objects, validation, approval workflow and publication to a web portal.',
    },
    authorship: {
      authorName: 'Anne-Sofie Krogh',
      authorRole: 'Lead Solution Architect, Process & Publishing, QualiWare',
      authorCredentials: 'BPMN 2.0 practitioner · 11 years implementing management systems',
      lastReviewed: '2026-03-03',
      experienceNote:
        'Based on modelling-convention workshops with 30+ organisations since 2020. The recurring lesson: a five-symbol convention gets read; a full BPMN palette gets abandoned by month four.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'CAPABILITY',
        heading: 'Process diagrams that are also data',
        lead: 'This page explains how processes are modelled, validated and published — notation, reuse, and the route from draft to portal. What the management system is for is a Solutions question.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'PUBLISHING & THE WEB PORTAL', href: '/platform/publishing', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'A box on a diagram is a repository object',
        lead: 'When a modeller places a task and assigns a role, the role is an existing object in the repository — the same object used in ten other diagrams. Nothing is typed twice, and renaming the role once corrects every diagram. This is the difference between a modelling platform and a diagramming tool, and it is the whole reason the portal can be trusted.',
        image: {
          placeholder:
            'SCREENSHOT — Process diagram in the modeller with the object panel open on a selected task, showing role, application and control links',
        },
        items: [
          {
            title: 'Notation to suit the audience',
            text: 'BPMN 2.0 where engineers need it, a simplified five-symbol convention where the readers are nurses or case workers.',
          },
          {
            title: 'Validation before approval',
            text: 'Missing role, unconnected end event, no owner — checked automatically, so a reviewer spends their time on the content.',
          },
          {
            title: 'Decomposition without duplication',
            text: 'A task on a level-two diagram opens a level-three diagram. The link is a relation, so navigation and reporting both work.',
          },
          {
            title: 'Attachments stay governed',
            text: 'Templates, forms and work instructions attach to the process object and inherit its approval state.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE MECHANICS',
        heading: 'From a modeller’s draft to something an employee reads',
        features: [
          {
            title: 'Modelling conventions as configuration',
            description:
              'Which symbols are allowed, which attributes are mandatory, how objects must be named — set centrally and enforced on save.',
          },
          {
            title: 'Role and RACI views',
            description:
              'Because roles are objects, every process a role appears in is one query away, and a RACI matrix is generated rather than maintained.',
          },
          {
            title: 'Risk and control in the flow',
            description:
              'Attach controls to the exact task they govern, so a control library and a process map stop being separate projects.',
          },
          {
            title: 'Review and approval route',
            description:
              'Process owner, quality function and, where needed, a works council — each as a configured step with a recorded decision.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'Publication and version history',
            description:
              'The portal shows the approved version with its date; the previous versions remain readable for audit.',
          },
          {
            title: 'Reader feedback loop',
            description:
              'A comment from the shop floor becomes a task for the process owner, which is how the model stays current after the project ends.',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'We cut the palette to five symbols against the advice of our own architects, and readership tripled. The diagrams are less elegant and vastly more useful.',
        name: 'Process Architect',
        role: 'Named on request',
        org: 'European manufacturing group',
        portrait: { placeholder: 'PORTRAIT — Process architect on a factory floor, hearing protection in hand' },
      },
      demoCta,
    ],
  },

  {
    title: 'Strategy & roadmapping',
    slug: 'platform/strategy-roadmapping',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Strategy & roadmapping — QualiWare Platform',
      metaDescription:
        'How roadmapping works in QualiWare: objectives and initiatives as governed objects, target-state architectures, scenario comparison and dependency sequencing.',
    },
    authorship: {
      authorName: 'Mette Holm',
      authorRole: 'Principal Enterprise Architect, QualiWare',
      authorCredentials: 'TOGAF 9 certified · 14 years in EA',
      lastReviewed: '2026-05-06',
      experienceNote:
        'Based on nine multi-year transformation roadmaps built with customers since 2022, two of which were re-sequenced mid-programme using the platform’s scenario comparison.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'CAPABILITY',
        heading: 'Target states planned against the real landscape',
        lead: 'This page explains how objectives, initiatives and target-state architectures are modelled and sequenced. Which transformation you are running is a Solutions question.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'BUSINESS CAPABILITY MANAGEMENT', href: '/platform/business-capability-management', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'The roadmap sits on the same objects as the documentation',
        lead: 'An initiative is a repository object related to the capabilities it moves, the applications it changes and the objectives it serves. Because it is the same model that documents today, the roadmap cannot quietly disagree with the architecture — and when the architecture changes, the affected initiatives are a query away.',
        image: {
          placeholder:
            'SCREEN · ROADMAP — Gantt-style initiative bars across four quarters, with the capabilities each one moves listed beside it',
        },
        items: [
          {
            title: 'Objectives at the top of the chain',
            text: 'Strategic objectives are objects too, so every initiative can be traced to the objective that justifies it — or shown to have none.',
          },
          {
            title: 'Target states as dated architectures',
            text: 'Model the landscape as it should look at the end of 2027, then compare it against the current baseline to derive the work.',
          },
          {
            title: 'Sequencing against dependencies',
            text: 'If initiative B needs the platform initiative A delivers, the relation says so and the sequence stops being a negotiation.',
          },
          {
            title: 'Scenario comparison',
            text: 'Hold two candidate roadmaps side by side with their capability impact and cost profile before committing to one.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE MECHANICS',
        heading: 'What the roadmap can tell you that a slide cannot',
        features: [
          {
            title: 'Capability heat overlay',
            description:
              'Colour the capability map by how much roadmap investment each node receives, and the strategic blind spots surface immediately.',
            linkLabel: 'Business Capability Management',
            href: '/platform/business-capability-management',
          },
          {
            title: 'Application lifecycle alignment',
            description:
              'Initiatives plotted against support-end dates, so a migration is not scheduled for the year after the platform goes unsupported.',
            linkLabel: 'Application Portfolio Management',
            href: '/platform/application-portfolio-management',
          },
          {
            title: 'Benefit and cost attributes',
            description:
              'Expected benefit, run-cost change and investment held on the initiative object and aggregated across the portfolio.',
          },
          {
            title: 'Governed roadmap changes',
            description:
              'Re-sequencing goes through the same approval workflow as any other content, so the current plan has a version and a date.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'Baseline comparison',
            description:
              'Compare the roadmap as approved in January with the roadmap today, and see exactly what moved.',
          },
          {
            title: 'Published for the steering group',
            description:
              'The roadmap view publishes to the portal, so the steering committee reads the live plan rather than a deck from six weeks ago.',
          },
        ],
      },
      demoCta,
    ],
  },

  {
    title: 'QualiWare Go',
    slug: 'platform/qualiware-go',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'QualiWare Go',
      metaDescription:
        'How QualiWare Go works: published model content on a phone, offline reading of a downloaded set, search, approval tasks and feedback from the front line.',
    },
    authorship: {
      authorName: 'Nina Falk',
      authorRole: 'Product Manager, Portal & Mobile, QualiWare',
      authorCredentials: 'MSc Human–Computer Interaction · 9 years in enterprise product management',
      lastReviewed: '2026-04-15',
      experienceNote:
        'Based on field testing with six customers in 2025 — hospitals, a rail operator and two manufacturers — where the deciding requirement was reading a work instruction with no signal.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'CAPABILITY',
        heading: 'The management system where the work actually happens',
        lead: 'This page explains what QualiWare Go does and what it deliberately does not do. Which workforces need it is a Solutions question.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'PUBLISHING & THE WEB PORTAL', href: '/platform/publishing', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'A reading and responding client, not a modelling client',
        lead: 'QualiWare Go serves published, approved content from the same repository the web portal reads. Nobody models on a phone, and we have not pretended otherwise. What people do on a phone is look something up, confirm they have read it, approve a task and report that a document is wrong.',
        image: {
          placeholder:
            'SCREENSHOT — QualiWare Go on a phone: search results, a process page with its approval footer, and the offline-available indicator',
        },
        items: [
          {
            title: 'Offline by download',
            text: 'A reader marks a set of content as available offline before going into a building with no signal. Reads are queued and synced on reconnect.',
          },
          {
            title: 'The same access rules',
            text: 'Group permissions and SSO apply identically. There is no separate mobile permission model to drift out of alignment.',
          },
          {
            title: 'Approval tasks on the move',
            text: 'A process owner can approve or reject with a comment from the app, and the audit trail records it the same way.',
          },
          {
            title: 'Feedback with context',
            text: 'A report from the floor arrives attached to the exact published version the reader was looking at.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE MECHANICS',
        heading: 'What administrators need to know',
        features: [
          {
            title: 'Managed distribution',
            description:
              'Deployable through a mobile device management platform, with configuration pushed rather than typed by each user.',
          },
          {
            title: 'SSO on the device',
            description:
              'Authentication through your identity provider, including conditional access policies, with no local password store.',
            linkLabel: 'Access control & SSO',
            href: '/platform/access-control',
          },
          {
            title: 'Content scoping',
            description:
              'Publish a role-specific subset so a field technician’s app is not a search through the whole management system.',
          },
          {
            title: 'Read-confirmation records',
            description:
              'Where required, a named read confirmation is recorded per published version — the same evidence the portal produces.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'Cache control',
            description:
              'Administrators set how long offline content may be held before the app requires a refresh from the repository.',
          },
          {
            title: 'Works with every hosting option',
            description:
              'Cloud, sovereign and on-premise deployments all serve the app; on-premise requires a published endpoint you control.',
            linkLabel: 'Cloud, sovereign & on-premise',
            href: '/platform/hosting',
          },
        ],
      },
      demoCta,
    ],
  },

  /* ====================================================================== *
   * INTEGRATIONS & API
   * ====================================================================== */

  {
    title: 'Integration catalogue',
    slug: 'platform/integrations',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Integration catalogue — QualiWare Platform',
      metaDescription:
        'What each QualiWare integration syncs, in which direction and how often. Endpoints, authentication and webhooks are maintained in the developer documentation.',
    },
    authorship: {
      authorName: 'Rasmus Vestergaard',
      authorRole: 'Integration Architect, QualiWare',
      authorCredentials: 'Azure Solutions Architect Expert · 10 years on enterprise integration',
      lastReviewed: '2026-05-19',
      experienceNote:
        'Based on 40+ customer integrations delivered since 2021. The most common first build is still a nightly CMDB reconciliation into the application portfolio.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: '05 · INTEGRATIONS & API',
        heading: 'Connects to the systems you already run',
        lead: 'This page states what each integration syncs, in which direction and on what schedule. Endpoints, authentication and webhooks are maintained in Docs, where they are versioned alongside the release — not on a marketing page that would go stale.',
        ctas: [
          { label: 'DEVELOPER DOCUMENTATION', href: 'https://docs.qualiware.com/api-reference', style: 'neon' },
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'The repository is the governed side of every exchange',
        lead: 'An integration does not merge two systems of record. It maps fields from a source system onto attributes of governed QualiWare objects, and it says which side wins on conflict. That mapping is configuration you can read, and every synced change lands in the object’s version history like any other edit.',
        image: {
          placeholder:
            'SCREEN · INTEGRATION MAPPING — source fields on the left, QualiWare object attributes on the right, with direction and conflict rule per row',
        },
        items: [
          {
            title: 'Direction is declared per field',
            text: 'Inbound, outbound or bidirectional, set field by field. Nothing is silently overwritten because a nightly job ran.',
          },
          {
            title: 'Scheduled or event-driven',
            text: 'Run a reconciliation nightly, or subscribe to events so a change in the source system arrives within minutes.',
          },
          {
            title: 'Synced changes are auditable',
            text: 'A change made by an integration is attributed to that integration in the object history, distinct from a human edit.',
          },
          {
            title: 'Failures surface as tasks',
            text: 'Rejected records go to a reconciliation queue with the reason, rather than into a log file nobody reads.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE CATALOGUE',
        heading: 'What each integration syncs',
        features: [
          {
            title: 'ServiceNow',
            description:
              'CMDB configuration items reconciled against the application portfolio; incidents and changes linked to the affected application. Inbound nightly or event-driven.',
            linkLabel: 'Endpoints and authentication in Docs',
            href: 'https://docs.qualiware.com/api-reference',
          },
          {
            title: 'Microsoft Entra ID',
            description:
              'Single sign-on, plus user and group provisioning so portal audiences follow your directory groups instead of a second user list.',
            linkLabel: 'Access control & SSO',
            href: '/platform/access-control',
          },
          {
            title: 'SAP',
            description:
              'Application, supplier and organisational records imported as governed objects, with the SAP identifier retained as a key attribute.',
            linkLabel: 'Endpoints and authentication in Docs',
            href: 'https://docs.qualiware.com/api-reference',
          },
          {
            title: 'Jira',
            description:
              'Roadmap initiatives linked to delivery epics, so a change in delivery status is visible on the architecture side. Bidirectional on status.',
            linkLabel: 'Strategy & roadmapping',
            href: '/platform/strategy-roadmapping',
          },
          {
            title: 'Power BI',
            description:
              'Repository data exposed as a dataset so analysts build their own reporting on governed objects rather than on an exported spreadsheet.',
            linkLabel: 'Endpoints and authentication in Docs',
            href: 'https://docs.qualiware.com/api-reference',
          },
          {
            title: 'Microsoft 365 and SharePoint',
            description:
              'Documents referenced from governed objects, with the object holding the approval state and SharePoint holding the file.',
          },
          {
            title: 'REST API',
            description:
              'Read and write any object type, traverse relations, and drive the approval workflow. The reference documentation carries the full schema.',
            linkLabel: 'API reference in Docs',
            href: 'https://docs.qualiware.com/api-reference',
          },
          {
            title: 'Excel and CSV exchange',
            description:
              'Bulk load and bulk update against a defined template — how most portfolios are first populated, and still the fastest route for a one-off.',
          },
          {
            title: 'Partner-built extensions',
            description:
              'Connectors and accelerators built by implementation partners, listed with the partner that maintains them.',
            linkLabel: 'Partner integrations',
            href: 'https://partners.qualiware.com/integrations',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHERE TO LOOK FOR WHAT',
        heading: 'This site says what it syncs. Docs says how to authenticate.',
        features: [
          {
            title: 'On this page',
            description:
              'Which systems connect, what data moves, in which direction and on what schedule. Enough to plan an integration.',
          },
          {
            title: 'In the developer documentation',
            description:
              'Endpoints, authentication, scopes, rate limits, webhooks, payload schemas and release-versioned change notes.',
            linkLabel: 'docs.qualiware.com/api-reference',
            href: 'https://docs.qualiware.com/api-reference',
          },
          {
            title: 'Not here at all',
            description:
              'Version numbers and upgrade instructions. They belong with the release notes in Docs, where they are kept accurate.',
          },
        ],
      },
      demoCta,
    ],
  },

  /* ====================================================================== *
   * SECURITY & HOSTING
   * ====================================================================== */

  {
    title: 'Cloud, sovereign & on-premise',
    slug: 'platform/hosting',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Cloud, sovereign & on-premise hosting — QualiWare Platform',
      metaDescription:
        'Where the QualiWare model can live: EU-hosted cloud managed by QualiWare, in-country sovereign hosting for regulated sectors, or your own data centre.',
    },
    authorship: {
      authorName: 'Jonas Refsgaard',
      authorRole: 'Head of Cloud Operations, QualiWare',
      authorCredentials: 'CISSP · 15 years running regulated hosting environments',
      lastReviewed: '2026-06-02',
      experienceNote:
        'Based on operating the managed cloud service and supporting on-premise upgrades since 2019, including seven sovereign deployments for defence and public-sector customers.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: '04 · SECURITY & HOSTING',
        heading: 'Where the model lives is your choice',
        lead: 'This page explains the three deployment options and what changes between them operationally. Defence and public-sector buyers ask this first, so it has a place in the nav rather than a footnote in a datasheet.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'TRUST CENTRE', href: '/trust', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'Same platform, three operating models',
        lead: 'The product is identical across the three options. What differs is who holds the keys, who applies the upgrade and where the data physically sits. Choosing one does not lock you out of the others — customers move from on-premise to managed cloud and, less often, the other way.',
        image: {
          placeholder: 'PHOTO — Server room or operations centre, real environment, no stock imagery',
        },
        items: [
          {
            title: 'Cloud',
            text: 'EU-hosted and managed by QualiWare. We run the infrastructure, apply upgrades on an agreed window and hold the availability commitment.',
          },
          {
            title: 'Sovereign',
            text: 'In-country hosting for regulated sectors, with data residency and operator nationality requirements handled as part of the contract.',
          },
          {
            title: 'On-premise',
            text: 'Your data centre, your controls, your upgrade schedule. QualiWare supplies the release and the upgrade path; your team runs it.',
          },
          {
            title: 'Moving between them',
            text: 'The repository is portable. A migration is a planned data move plus a cutover, not a re-implementation.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'OPERATIONAL DETAIL',
        heading: 'The questions an infrastructure reviewer asks',
        features: [
          {
            title: 'Data residency',
            description:
              'Managed cloud runs in EU regions. Sovereign deployments are placed in the country the contract names, with the region stated in writing.',
          },
          {
            title: 'Backup and recovery',
            description:
              'Managed environments are backed up on a defined schedule with tested restore procedures; recovery objectives are set in the service agreement.',
          },
          {
            title: 'Encryption',
            description:
              'Data encrypted in transit and at rest. Key management arrangements differ by deployment model and are documented per environment.',
          },
          {
            title: 'Upgrade cadence',
            description:
              'Managed customers are upgraded on an agreed window with a test environment first. On-premise customers choose their own timing.',
          },
          {
            title: 'Availability and monitoring',
            description:
              'The managed service is monitored around the clock, with the availability commitment and the status channel named in the agreement.',
          },
          {
            title: 'Penetration testing',
            description:
              'The platform is tested by an independent third party on a recurring basis, and customers may test their own environment by arrangement.',
            linkLabel: 'ISO 27001 & certifications',
            href: '/platform/certifications',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'ALSO IN THIS SECTION',
        heading: 'Security, in the places buyers look for it',
        features: [
          {
            title: 'ISO 27001 & certifications',
            description:
              'The certification scope, what it covers and which documentation is available under NDA.',
            linkLabel: 'Certifications',
            href: '/platform/certifications',
          },
          {
            title: 'Access control & SSO',
            description:
              'Identity provider integration, group-based permissions and what an administrator can and cannot delegate.',
            linkLabel: 'Access control & SSO',
            href: '/platform/access-control',
          },
          {
            title: 'Trust centre',
            description:
              'Security, privacy, subprocessors and how to reach the team that answers a security questionnaire.',
            linkLabel: 'Trust centre',
            href: '/trust',
          },
        ],
      },
      demoCta,
    ],
  },

  {
    title: 'ISO 27001 & certifications',
    slug: 'platform/certifications',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'ISO 27001 & certifications — QualiWare Platform',
      metaDescription:
        'QualiWare’s certification position: an ISO/IEC 27001 certified information security management system, what the scope covers, and which evidence we share.',
    },
    authorship: {
      authorName: 'Lars Bek Jensen',
      authorRole: 'Head of Compliance Practice, QualiWare',
      authorCredentials: 'Lead Auditor ISO 27001 · 16 years in governance and internal control',
      reviewerName: 'Jonas Refsgaard',
      reviewerRole: 'Head of Cloud Operations, QualiWare',
      lastReviewed: '2026-06-17',
      experienceNote:
        'Maintained alongside QualiWare’s own ISMS, which has been through certification and surveillance audits since 2019 — and which is itself modelled in QualiWare.',
    },
    sources: [
      {
        label: 'ISO/IEC 27001:2022 — Information security, cybersecurity and privacy protection — Information security management systems — Requirements',
        publisher: 'International Organization for Standardization',
        date: 'October 2022',
      },
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'SECURITY & HOSTING',
        heading: 'Certified, and able to show the paperwork',
        lead: 'This page explains what our certifications cover, how the scope is defined and what evidence we can share. It is a statement of position, not a security marketing page.',
        ctas: [
          { label: 'TRUST CENTRE', href: '/trust', style: 'neon' },
          { label: 'CLOUD, SOVEREIGN & ON-PREMISE', href: '/platform/hosting', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'A management system, audited, with a scope you can read',
        lead: 'QualiWare operates an information security management system certified to ISO/IEC 27001. A certificate on its own says little; the scope statement is what matters, because it defines which activities, locations and services the audit covered. We will send both, and we will tell you plainly where the boundary sits.',
        image: {
          placeholder:
            'DOCUMENT — Certificate and scope statement shown as a document pair, redacted where appropriate',
        },
        items: [
          {
            title: 'Scope before certificate',
            text: 'Ask any vendor which services and locations the scope covers. Ours names the platform development, the managed hosting service and the Danish head office.',
          },
          {
            title: 'Surveillance audits, not a one-off',
            text: 'Certification is maintained through recurring external audit. A certificate without a current surveillance record is a historical document.',
          },
          {
            title: 'Controls mapped to the standard',
            text: 'The ISMS control set is mapped to the Annex A controls of the current edition of the standard, and the mapping is available on request.',
          },
          {
            title: 'Our own ISMS runs in QualiWare',
            text: 'Policies, controls, risks and review cycles are modelled in the platform. It is the least glamorous and most useful proof we have.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHAT WE CAN SHARE',
        heading: 'Evidence, and how to get it',
        features: [
          {
            title: 'Certificate and scope statement',
            description:
              'Available on request without an NDA. The scope statement is the document to read first.',
            linkLabel: 'Request it via the Trust centre',
            href: '/trust',
          },
          {
            title: 'Statement of Applicability summary',
            description:
              'Which Annex A controls apply, and the justification where one is excluded. Shared under NDA.',
          },
          {
            title: 'Penetration test summary',
            description:
              'An executive summary of the most recent independent test, with findings and remediation status. Shared under NDA.',
          },
          {
            title: 'Completed security questionnaires',
            description:
              'We keep current answers to the common industry questionnaires so your review does not start from a blank form.',
          },
          {
            title: 'Subprocessor list',
            description:
              'Who we use, for what, and where they process data. Published in the Trust centre and updated when it changes.',
            linkLabel: 'Trust centre',
            href: '/trust',
          },
          {
            title: 'Public-sector framework status',
            description:
              'QualiWare is a supplier under Danish public procurement frameworks; the current listings are confirmed on request.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'A NOTE ON CLAIMS',
        heading: 'What this page will not do',
        features: [
          {
            title: 'No unsourced certification claims',
            description:
              'Every certification named here has a certificate we can produce. Where a standard is referenced, the edition and date are cited below.',
          },
          {
            title: 'No comparison with other vendors',
            description:
              'A security claim about someone else’s product is not ours to make. Ask them for their scope statement as well.',
          },
          {
            title: 'No conflation of scopes',
            description:
              'Certification of our ISMS is not certification of your deployment. What you inherit depends on the hosting model you choose.',
            linkLabel: 'Cloud, sovereign & on-premise',
            href: '/platform/hosting',
          },
        ],
      },
      demoCta,
    ],
  },

  {
    title: 'Access control & SSO',
    slug: 'platform/access-control',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Access control & SSO — QualiWare Platform',
      metaDescription:
        'How access works in QualiWare: single sign-on through your identity provider, group-based permissions down to object level, and an audit trail of who saw what.',
    },
    authorship: {
      authorName: 'Jonas Refsgaard',
      authorRole: 'Head of Cloud Operations, QualiWare',
      authorCredentials: 'CISSP · 15 years running regulated hosting environments',
      lastReviewed: '2026-05-28',
      experienceNote:
        'Based on identity integrations for more than 50 customer environments since 2019, the majority on Microsoft Entra ID with conditional access enforced at the tenant.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'SECURITY & HOSTING',
        heading: 'Your directory decides who gets in',
        lead: 'This page explains the access model: how authentication is delegated, how permissions are structured and what is recorded. Which content you need to restrict is a question for your own governance.',
        ctas: [
          { label: 'BOOK A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'GOVERNANCE & WORKFLOW', href: '/platform/governance-workflow', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT WORKS',
        heading: 'Authentication is delegated, authorisation is modelled',
        lead: 'QualiWare does not want to be your identity provider. Authentication goes to your IdP over SAML 2.0 or OpenID Connect, so your MFA and conditional access policies apply unchanged. What QualiWare owns is authorisation: which directory groups may read, edit, approve or administer which parts of the repository.',
        image: {
          placeholder:
            'SCREEN · PERMISSIONS — a directory group mapped to read, edit and approve rights on a selected part of the repository tree',
        },
        items: [
          {
            title: 'SSO through your identity provider',
            text: 'SAML 2.0 and OpenID Connect. Microsoft Entra ID is the most common; the integration is configuration, not a project.',
          },
          {
            title: 'Provisioning from directory groups',
            text: 'Users and their group memberships sync from the directory, so a leaver loses access when HR closes the account.',
          },
          {
            title: 'Permissions down to object level',
            text: 'Grant read, edit, approve or administer by object type, by area of the repository, or on an individual object where needed.',
          },
          {
            title: 'Least privilege by default',
            text: 'A new user reads published content and nothing else. Every additional right is granted explicitly and is visible in a report.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE MECHANICS',
        heading: 'What an identity and access reviewer will ask',
        features: [
          {
            title: 'Role definitions',
            description:
              'Modeller, content owner, approver, reader and administrator, each a configurable permission set rather than a hard-coded licence tier.',
          },
          {
            title: 'Portal audience scoping',
            description:
              'Published content can be restricted to named groups, so sensitive material is published without becoming visible to everyone.',
            linkLabel: 'Publishing & the web portal',
            href: '/platform/publishing',
          },
          {
            title: 'Segregation of duties',
            description:
              'The platform can require that an approver is not the author, which is the control an internal auditor tests first.',
          },
          {
            title: 'Access review reporting',
            description:
              'Who holds which rights, and when it was last reviewed — reportable in the same way as any other repository data.',
          },
          {
            title: 'Administrator activity logging',
            description:
              'Permission changes, metamodel changes and user administration are logged with the acting account and a timestamp.',
          },
          {
            title: 'Consistent on mobile',
            description:
              'The app authenticates through the same IdP and honours the same permissions. There is no separate mobile access model.',
            linkLabel: 'QualiWare Go',
            href: '/platform/qualiware-go',
          },
        ],
      },
      demoCta,
    ],
  },

  /* ====================================================================== *
   * TOUR & TRUST
   * ====================================================================== */

  {
    title: 'See the repository in eight minutes',
    slug: 'platform/tour',
    pageType: 'standard',
    seo: {
      metaTitle: 'Platform tour — see the repository in eight minutes',
      metaDescription:
        'A recorded eight-minute walkthrough of the QualiWare repository, impact analysis, governance workflow and the published portal. No form, no sales call first.',
    },
    authorship: {
      authorName: 'Nina Falk',
      authorRole: 'Product Manager, Portal & Mobile, QualiWare',
      authorCredentials: 'MSc Human–Computer Interaction · 9 years in enterprise product management',
      lastReviewed: '2026-06-24',
      experienceNote:
        'Recorded in a live QualiWare 10.10 environment in May 2026, using an anonymised model of roughly 400 objects rather than a scripted demo dataset.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'PLATFORM TOUR',
        heading: 'See the repository in eight minutes',
        lead: 'A recorded walkthrough of the machinery: one object, its typed relations, an impact query, an approval and the published result. No form, no email address, no call before you are ready.',
        ctas: [
          { label: 'WATCH THE TOUR', href: '#tour', style: 'neon' },
          { label: 'BOOK A DEMO INSTEAD', href: '/pricing#demo', style: 'outline' },
        ],
        stats: [
          { value: '8 min', label: 'Total running time' },
          { value: '5', label: 'Chapters, each skippable' },
          { value: 'No form', label: 'Nothing gated' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT YOU WILL SEE',
        heading: 'A real environment, not a slide deck with a cursor',
        lead: 'The recording runs in a live QualiWare environment with an anonymised customer-shaped model. Every click is the product. Where something takes longer than a demo allows — a full metamodel extension, for instance — we say so rather than cutting it out.',
        image: {
          placeholder:
            'VIDEO STILL — Modeller open on a process diagram with the impact explorer panel expanded, play control overlaid',
        },
        items: [
          {
            title: '00:00 — One object, many views',
            text: 'The same application shown in a process diagram, a capability heat-map and a portfolio list, edited once.',
          },
          {
            title: '01:40 — An impact query',
            text: 'Select an application, follow relations three hops downstream, and read the affected processes, risks and controls.',
          },
          {
            title: '03:30 — Approval in flight',
            text: 'A draft change moves to review, gets a comment, is approved, and appears in the portal with its version and date.',
          },
          {
            title: '05:20 — The reader’s view',
            text: 'The web portal as an employee sees it, then the same content on a phone, including offline.',
          },
          {
            title: '07:00 — Where the data came from',
            text: 'The integration mapping behind the application record, and where the API reference for it lives.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'AFTER THE TOUR',
        heading: 'Where to go next, depending on your question',
        features: [
          {
            title: 'How does the model hold together?',
            description:
              'The ontology, typed relations, versioning and the mechanics of extension.',
            linkLabel: 'Ontology-driven repository',
            href: '/platform/repository',
          },
          {
            title: 'Can it answer what breaks if we change this?',
            description:
              'Traversal direction, depth, saved analyses and how the result is evidenced.',
            linkLabel: 'Impact analysis & traceability',
            href: '/platform/impact-analysis',
          },
          {
            title: 'Who keeps it current?',
            description:
              'Lifecycle states, ownership, recurring review dates and the audit trail.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'Will anyone actually read it?',
            description:
              'The web portal, generated documents, role-based landing pages and reader feedback.',
            linkLabel: 'Publishing & the web portal',
            href: '/platform/publishing',
          },
          {
            title: 'Where can it run?',
            description:
              'Managed EU cloud, in-country sovereign hosting, or your own data centre.',
            linkLabel: 'Cloud, sovereign & on-premise',
            href: '/platform/hosting',
          },
          {
            title: 'What does it connect to?',
            description:
              'What each integration syncs, in which direction, and where the API reference lives.',
            linkLabel: 'Integration catalogue',
            href: '/platform/integrations',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Now see it on your own architecture',
        text: '45 minutes with an architect, on your model and your question. The tour is generic by design; this part is not.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  },

  {
    title: 'Trust centre',
    slug: 'trust',
    pageType: 'standard',
    seo: {
      metaTitle: 'Trust centre — security, privacy and compliance at QualiWare',
      metaDescription:
        'Security, privacy and compliance in one place: certification scope, data protection, subprocessors, hosting regions and how to reach the security team.',
    },
    authorship: {
      authorName: 'Lars Bek Jensen',
      authorRole: 'Head of Compliance Practice, QualiWare',
      authorCredentials: 'Lead Auditor ISO 27001 · 16 years in governance and internal control',
      reviewerName: 'Jonas Refsgaard',
      reviewerRole: 'Head of Cloud Operations, QualiWare',
      lastReviewed: '2026-07-01',
      experienceNote:
        'Maintained against the security questionnaires we actually receive — 120+ in 2025, most of them from public-sector and financial-services procurement teams.',
    },
    sources: [
      {
        label: 'ISO/IEC 27001:2022 — Information security, cybersecurity and privacy protection — Information security management systems — Requirements',
        publisher: 'International Organization for Standardization',
        date: 'October 2022',
      },
      {
        label: 'Regulation (EU) 2016/679 (General Data Protection Regulation)',
        publisher: 'Official Journal of the European Union',
        date: '4 May 2016',
      },
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'TRUST CENTRE',
        heading: 'The answers your security review needs, in one place',
        lead: 'Certification scope, data protection, hosting regions, subprocessors and the route to a human who can answer a questionnaire. Written for the people who have to sign off, not for a brochure.',
        ctas: [
          { label: 'CONTACT THE SECURITY TEAM', href: '/company/contact', style: 'neon' },
          { label: 'ISO 27001 & CERTIFICATIONS', href: '/platform/certifications', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW WE HANDLE THIS',
        heading: 'Documents on request, positions in public',
        lead: 'Some material — the Statement of Applicability, penetration test summaries — is shared under NDA, because that is the responsible way to handle it. Everything that can be public is public: what we are certified for, where data can be hosted, who processes it on our behalf and how to reach us. If we cannot answer something, we say so instead of routing you to a sales call.',
        image: {
          placeholder:
            'PHOTO — Compliance and operations colleagues reviewing a control set on screen, real office, no stock imagery',
        },
        items: [
          {
            title: 'Information security',
            text: 'An ISO/IEC 27001 certified management system covering platform development and the managed hosting service. Scope statement available on request.',
          },
          {
            title: 'Data protection',
            text: 'QualiWare acts as data processor for customer content under the GDPR. The data processing agreement, including subprocessors, is part of the contract.',
          },
          {
            title: 'Hosting and residency',
            text: 'Managed cloud runs in EU regions. Sovereign and on-premise options exist where residency or operator requirements are stricter.',
          },
          {
            title: 'Incident handling',
            text: 'A documented incident response process with defined notification obligations. Customers are notified under the terms of their agreement.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHAT YOU CAN REQUEST',
        heading: 'The documentation pack',
        features: [
          {
            title: 'ISO 27001 certificate and scope',
            description: 'Available without an NDA. Read the scope statement first — it is the part that matters.',
            linkLabel: 'Certifications',
            href: '/platform/certifications',
          },
          {
            title: 'Data processing agreement',
            description:
              'Our standard DPA with the current subprocessor annex, including processing locations and purposes.',
          },
          {
            title: 'Statement of Applicability summary',
            description: 'Applicable Annex A controls and documented exclusions. Under NDA.',
          },
          {
            title: 'Penetration test summary',
            description:
              'Executive summary of the latest independent test with remediation status. Under NDA.',
          },
          {
            title: 'Completed questionnaires',
            description:
              'Current answers to the common industry security questionnaires, so your review starts from a filled form.',
          },
          {
            title: 'Business continuity summary',
            description:
              'Backup schedules, tested restore procedures and the recovery objectives that apply to the managed service.',
            linkLabel: 'Cloud, sovereign & on-premise',
            href: '/platform/hosting',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'REPORTING A CONCERN',
        heading: 'If you find something, tell us',
        features: [
          {
            title: 'Security vulnerabilities',
            description:
              'Report a suspected vulnerability to the security team. We acknowledge receipt, investigate, and tell you what we found.',
            linkLabel: 'Contact QualiWare',
            href: '/company/contact',
          },
          {
            title: 'Privacy requests',
            description:
              'Data subject requests concerning customer content are routed to the customer as controller; requests about our own processing come to us.',
          },
          {
            title: 'Service status',
            description:
              'Availability and incident notices for the managed service are published on the support property.',
            linkLabel: 'Service status',
            href: 'https://support.qualiware.com/service-status',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'tinted',
        heading: 'Need something that is not listed here?',
        text: 'Send the questionnaire. A named person answers it — we do not put a security review behind a sales process.',
        ctaLabel: 'CONTACT US',
        ctaHref: '/company/contact',
      },
    ],
  },
]
