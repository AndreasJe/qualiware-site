/**
 * Seed content — Resources hubs, Company pages, Legal documents and the two
 * utility pages, all on the main tenant.
 *
 * Pure data. No payload import, no database connection. `src/seed/index.ts`
 * walks these arrays and hands each object to `upsertPage`.
 *
 * Archetype contracts (see ARCHETYPES.md):
 *   resourceHub  hero(darkGreen, showSearch) -> resourceGrid(showFilters) -> ctaBanner
 *   company      hero(iceBlue) -> valueProps(split, photo-led) -> logoWall|featureGrid -> ctaBanner
 *   legal        plain document. No hero, no marketing blocks, no CTA.
 *
 * Every image field is a placeholder carrying its shot brief; no media is
 * referenced. No prices anywhere. No fabricated URLs in `sources`.
 */
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
  /** Resolved to page ids in a second pass by the seed runner. */
  relatedCapabilitySlugs?: string[]
  layout: Layout
}

/* ====================================================================== *
 * Resources
 * ====================================================================== */

export const resourcePages: SeedPage[] = [
  /* ---- resources/blog ------------------------------------------------- */
  {
    title: 'Blog',
    slug: 'resources/blog',
    pageType: 'resourceHub',
    seo: {
      metaTitle: 'Blog — QualiWare',
      metaDescription:
        'Practical writing on enterprise architecture, process management and governance from the consultants and architects who run QualiWare projects.',
    },
    authorship: {
      authorName: 'Signe Krogh',
      authorRole: 'Editor and Practice Lead, QualiWare',
      authorCredentials: 'Former process manager in Danish local government · 12 years in BPM',
      lastReviewed: '2026-08-11',
      experienceNote:
        'Every article is written or reviewed by someone who has run the work in a customer repository. 61 pieces published since January 2024.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'BLOG',
        heading: 'Notes from people who maintain models for a living',
        lead: 'No thought leadership, no maturity ladders. What actually happens when an organization tries to keep one shared picture of itself up to date.',
        showSearch: true,
        searchPlaceholder: 'Search the blog',
        popularSearches: [
          { label: 'Capability maps', href: '/resources/blog?tag=capability-maps' },
          { label: 'NIS2', href: '/resources/blog?tag=nis2' },
          { label: 'Application portfolio', href: '/resources/blog?tag=apm' },
          { label: 'Model ownership', href: '/resources/blog?tag=governance' },
        ],
      },
      {
        blockType: 'resourceGrid',
        heading: 'Latest articles',
        showFilters: true,
        items: [
          {
            resourceType: 'blog',
            title: 'Why application portfolios go stale — and what to do about it',
            summary:
              'Portfolios do not decay because nobody cares. They decay because maintenance has no owner and no trigger. Both are fixable in a fortnight.',
            meta: 'BLOG · 7 min read · 4 June 2026',
            featured: true,
            image: {
              placeholder:
                'FEATURED PHOTO — architect at a wall of printed application landscape, candid, natural light, no stock-photo handshake',
            },
            href: '/resources/blog/why-application-portfolios-go-stale',
          },
          {
            resourceType: 'blog',
            title: 'Capability maps that survive contact with the business',
            summary:
              'The difference between a capability map people use and one they nod at is about six words per box. A short method for writing those words.',
            meta: 'BLOG · 6 min read · 21 May 2026',
            image: {
              placeholder: 'PHOTO — workshop, diverse group at a whiteboard, candid, not staged',
            },
            href: '/resources/blog/capability-maps-that-survive',
          },
          {
            resourceType: 'blog',
            title: 'The four questions a process model has to answer',
            summary:
              'Who does this, what do they need, what do they produce, and what proves it happened. Everything else in a diagram is decoration.',
            meta: 'BLOG · 5 min read · 30 April 2026',
            image: {
              placeholder: 'PHOTO — close crop of a process diagram on a monitor, shallow depth',
            },
            href: '/resources/blog/four-questions-a-process-model-answers',
          },
          {
            resourceType: 'blog',
            title: 'What a digital twin of an organization is not',
            summary:
              'It is not a dashboard, it is not a simulation, and it is not finished. It is a maintained model with owners — which is harder and more useful.',
            meta: 'BLOG · 8 min read · 2 April 2026',
            image: {
              placeholder: 'PHOTO — two colleagues comparing a model on screen with a printout',
            },
            href: '/resources/blog/what-a-digital-twin-is-not',
          },
          {
            resourceType: 'blog',
            title: 'NIS2: what changed once the deadline passed',
            summary:
              'The scramble is over and the audits have started. The organizations coping best are the ones who mapped controls onto processes they already ran.',
            meta: 'BLOG · 9 min read · 12 March 2026',
            image: {
              placeholder: 'PHOTO — security operations room, wide, people working, no screens legible',
            },
            href: '/resources/blog/nis2-after-the-deadline',
          },
          {
            resourceType: 'blog',
            title: 'Who owns the model? A short answer and a long one',
            summary:
              'The short answer is the process owner. The long answer is why that only works when review is a scheduled obligation rather than good intentions.',
            meta: 'BLOG · 6 min read · 18 February 2026',
            image: { placeholder: 'PHOTO — governance board meeting, candid, mid-discussion' },
            href: '/resources/blog/who-owns-the-model',
          },
          {
            resourceType: 'guide',
            title: 'The 90-day starting sequence for a digital twin',
            summary:
              'The companion guide to the DTO articles: what to model first, what to leave alone, and how to show something useful before the first quarter ends.',
            meta: 'GUIDE · 24 pages · updated June 2026',
            image: { placeholder: 'GUIDE COVER — process wall detail, tight crop, brand green' },
            href: '/resources/guides',
          },
          {
            resourceType: 'webinar',
            title: 'AI governance without slowing the business down',
            summary:
              'Where AI touches processes, data and obligations — and how to keep a register that survives its first audit.',
            meta: 'WEBINAR · on demand · 45 minutes',
            image: { placeholder: 'PHOTO — webinar host presenting to camera, real office' },
            href: '/resources/webinars',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'One practical piece a month, no product news',
        text: 'The architects’ note goes out on the first Tuesday. Written by the same people who write here.',
        ctaLabel: 'SUBSCRIBE',
        ctaHref: '/resources/newsletter',
      },
    ],
  },

  /* ---- resources/webinars --------------------------------------------- */
  {
    title: 'Webinars',
    slug: 'resources/webinars',
    pageType: 'resourceHub',
    seo: {
      metaTitle: 'Webinars — QualiWare',
      metaDescription:
        'Live and on-demand sessions on enterprise architecture, NIS2, DORA, AI governance and process management, run by QualiWare architects and consultants.',
    },
    authorship: {
      authorName: 'Jonas Vestergaard',
      authorRole: 'Head of Customer Enablement, QualiWare',
      authorCredentials: 'TOGAF 9 certified · 15 years delivering EA and BPM rollouts',
      lastReviewed: '2026-08-04',
      experienceNote:
        'Hosts the QualiWare webinar programme: 34 sessions since 2023, each built from a question a customer actually asked on a project.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'WEBINARS',
        heading: 'Forty-five minutes, one real question, no sales deck',
        lead: 'Every session is run by someone who does the work. Half the time is demonstration, and we leave the last ten minutes for questions we have not pre-screened.',
        showSearch: true,
        searchPlaceholder: 'Search webinars',
        popularSearches: [
          { label: 'NIS2', href: '/resources/webinars?tag=nis2' },
          { label: 'AI governance', href: '/resources/webinars?tag=ai-governance' },
          { label: 'Application portfolio', href: '/resources/webinars?tag=apm' },
          { label: 'Release walkthrough', href: '/resources/webinars?tag=release' },
        ],
      },
      {
        blockType: 'resourceGrid',
        heading: 'Upcoming and on demand',
        showFilters: true,
        items: [
          {
            resourceType: 'webinar',
            title: 'NIS2 in practice: mapping controls onto the processes you already have',
            summary:
              'We take a live repository and attach the control set to the processes that already exist, then show what the evidence trail looks like when an auditor asks.',
            meta: 'LIVE · 18 September 2026 · 14:00 CET · 45 minutes',
            featured: true,
            image: {
              placeholder:
                'FEATURED PHOTO — host at a standing desk with a second screen showing a control map, candid',
            },
            href: '/resources/webinars/nis2-in-practice',
          },
          {
            resourceType: 'webinar',
            title: 'Application portfolio triage in sixty minutes',
            summary:
              'How to get from a spreadsheet of 900 applications to a ranked shortlist of decisions, using lifecycle, cost drivers and business fit.',
            meta: 'LIVE · 8 October 2026 · 13:00 CET · 60 minutes',
            image: { placeholder: 'PHOTO — two consultants reviewing a portfolio heat map' },
            href: '/resources/webinars/application-portfolio-triage',
          },
          {
            resourceType: 'webinar',
            title: 'Modelling for the people who will never open the tool',
            summary:
              'Ninety-five per cent of the audience for a model reads it in a browser. What that means for naming, views and publishing.',
            meta: 'LIVE · 5 November 2026 · 10:00 CET · 40 minutes',
            image: { placeholder: 'PHOTO — office worker reading a published process page on a laptop' },
            href: '/resources/webinars/modelling-for-readers',
          },
          {
            resourceType: 'webinar',
            title: 'AI governance without slowing the business down',
            summary:
              'Where AI touches processes, data and obligations, and how to keep a register that stays true after the pilot phase ends.',
            meta: 'ON DEMAND · 45 minutes',
            image: { placeholder: 'PHOTO — webinar host presenting to camera, real office' },
            href: '/resources/webinars/ai-governance-on-demand',
          },
          {
            resourceType: 'webinar',
            title: 'From process wall to living management system',
            summary:
              'A recorded walkthrough of the move from printed process posters to a published management system people actually open.',
            meta: 'ON DEMAND · 38 minutes',
            image: { placeholder: 'PHOTO — printed process wall in a corridor, people walking past' },
            href: '/resources/webinars/living-management-system',
          },
          {
            resourceType: 'webinar',
            title: 'DORA: evidence you can produce on request',
            summary:
              'Operational resilience means showing the chain from a critical business service down to the third party that supports it. We build one on screen.',
            meta: 'ON DEMAND · 50 minutes',
            image: { placeholder: 'PHOTO — financial services office, wide, neutral' },
            href: '/resources/webinars/dora-evidence',
          },
          {
            resourceType: 'webinar',
            title: 'What is new in QualiWare 10.10',
            summary:
              'A short release walkthrough for administrators and modellers. Version-specific detail and upgrade steps stay in Docs.',
            meta: 'ON DEMAND · 15 minutes',
            image: { placeholder: 'SCREEN CAPTURE STILL — release notes view, blurred data' },
            href: '/resources/webinars/whats-new-10-10',
          },
          {
            resourceType: 'story',
            title: 'How a defence group runs one management system across sites',
            summary:
              'A customer session rather than a product session: what changed operationally when several site-level systems became one.',
            meta: 'CUSTOMER SESSION · on demand · 42 minutes',
            image: { placeholder: 'PHOTO — industrial site exterior, permission-safe, no logos' },
            href: '/customers',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Would you rather ask about your own repository?',
        text: 'Bring a real scenario to a 45-minute session and we will model it with you instead of showing a demo dataset.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  },

  /* ---- resources/analyst-research ------------------------------------- */
  {
    title: 'Analyst research',
    slug: 'resources/analyst-research',
    pageType: 'resourceHub',
    seo: {
      metaTitle: 'Analyst research — QualiWare',
      metaDescription:
        'How to read analyst evaluations of enterprise architecture and digital twin tooling as a buyer, with the reports we reference named and dated.',
    },
    authorship: {
      authorName: 'Anders Toft',
      authorRole: 'Director of Market Insight, QualiWare',
      authorCredentials: '18 years in enterprise software analysis and vendor evaluation support',
      reviewerName: 'Kirsten Damsgaard',
      reviewerRole: 'Chief Product Officer, QualiWare',
      lastReviewed: '2026-07-28',
      experienceNote:
        'Written from 40-plus formal RFP and evaluation processes supported since 2022, including 11 public-sector tenders in 2025 and 2026.',
    },
    sources: [
      {
        label: 'Magic Quadrant for Enterprise Architecture Tools',
        publisher: 'Gartner, Inc.',
        date: '2025',
      },
      {
        label: 'Gartner Peer Insights — Enterprise Architecture Tools review category',
        publisher: 'Gartner, Inc.',
        date: 'Accessed July 2026',
      },
      {
        label: 'Magic Quadrant research methodology and evaluation criteria',
        publisher: 'Gartner, Inc.',
        date: '2025',
      },
      {
        label: 'Hype Cycle for Enterprise Architecture',
        publisher: 'Gartner, Inc.',
        date: '2025',
      },
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'ANALYST RESEARCH',
        heading: 'Read the research yourself — here is how we read it',
        lead: 'We name every report we reference, with its year, so you can find it through your own analyst subscription. Gartner and Magic Quadrant are registered trademarks of Gartner, Inc. and/or its affiliates. Gartner does not endorse any vendor, product or service depicted in its research publications.',
        showSearch: true,
        searchPlaceholder: 'Search analyst material',
        popularSearches: [
          { label: 'Evaluation criteria', href: '/resources/analyst-research?tag=criteria' },
          { label: 'Digital twin of an organization', href: '/solutions/digital-twin' },
          { label: 'Peer reviews', href: '/resources/analyst-research?tag=peer-insights' },
          { label: 'RFP support', href: '/company/contact' },
        ],
      },
      {
        blockType: 'resourceGrid',
        heading: 'Notes, summaries and evaluation help',
        showFilters: true,
        items: [
          {
            resourceType: 'analyst',
            title: 'Where the digital twin of an organization category is heading',
            summary:
              'Our reading of how analysts currently frame DTO next to classic EA tooling, what the category is expected to absorb next, and which reports to consult. Report names and years are listed in the sources below.',
            meta: 'ANALYST NOTE · 12 min read · 9 July 2026',
            featured: true,
            image: {
              placeholder:
                'FEATURED GRAPHIC — abstract quadrant-free category diagram in brand green and navy, no analyst marks',
            },
            href: '/resources/analyst-research/dto-category-outlook',
          },
          {
            resourceType: 'analyst',
            title: 'How to read a Magic Quadrant as a buyer, not a scoreboard',
            summary:
              'Inclusion criteria change between editions and the axes measure execution and vision, not fit for your requirement. What to do with that as an evaluator.',
            meta: 'ANALYST NOTE · 9 min read · 3 June 2026',
            image: { placeholder: 'PHOTO — evaluator with a printed requirements matrix, candid' },
            href: '/resources/analyst-research/how-to-read-a-magic-quadrant',
          },
          {
            resourceType: 'analyst',
            title: 'What verified reviewers raise most often about EA tool rollouts',
            summary:
              'Recurring themes in public peer reviews across the category: ontology depth, publishing to non-modellers, and how much of year one goes on data quality. Read the reviews yourself and weigh them against your own scope.',
            meta: 'ANALYST NOTE · 8 min read · 20 May 2026',
            image: { placeholder: 'PHOTO — team retrospective with sticky notes, candid' },
            href: '/resources/analyst-research/what-reviewers-raise',
          },
          {
            resourceType: 'analyst',
            title:
              'Evaluating for a management system rather than a diagram tool',
            summary:
              'Most evaluation templates score modelling notation. Fewer score publishing, approval workflow and the evidence trail — which is what auditors ask for later.',
            meta: 'ANALYST NOTE · 7 min read · 14 April 2026',
            image: { placeholder: 'PHOTO — auditor and process owner reviewing documentation together' },
            href: '/resources/analyst-research/evaluating-for-a-management-system',
          },
          {
            resourceType: 'analyst',
            title: 'The cost questions analyst research will not answer for you',
            summary:
              'Editor counts, hosting model, data migration and the internal time to maintain a model. Four numbers you have to produce yourself before any comparison is meaningful.',
            meta: 'ANALYST NOTE · 8 min read · 28 January 2026',
            image: { placeholder: 'PHOTO — finance and IT colleagues at a shared screen' },
            href: '/resources/analyst-research/cost-questions',
          },
          {
            resourceType: 'guide',
            title: 'An evaluation scorecard you can adapt',
            summary:
              'The weighted criteria sheet we hand to evaluation teams: requirements first, notation last, with space for the questions specific to your sector.',
            meta: 'TEMPLATE · 6 pages · updated June 2026',
            image: { placeholder: 'TEMPLATE COVER — scorecard grid detail, brand green' },
            href: '/resources/guides',
          },
          {
            resourceType: 'webinar',
            title: 'Analyst season: what buyers ask us after they read the research',
            summary:
              'A recorded session answering the questions that arrive every autumn, including how to reconcile a vendor shortlist with an internal requirement list.',
            meta: 'ON DEMAND · 40 minutes',
            image: { placeholder: 'PHOTO — webinar host with an evaluation matrix on the second screen' },
            href: '/resources/webinars',
          },
          {
            resourceType: 'story',
            title: 'What a 26-year customer relationship looks like from the inside',
            summary:
              'Longevity is easy to claim and hard to evidence. This is the reference story we point analysts and evaluators at when they ask.',
            meta: 'CUSTOMER STORY · 7 min read',
            image: { placeholder: 'PHOTO — long-standing customer team portrait, candid, real workplace' },
            href: '/customers',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Running a formal evaluation?',
        text: 'We answer requirement matrices and tender questionnaires in writing, with the sources named. Send us yours and we will tell you where we do not fit.',
        ctaLabel: 'CONTACT US',
        ctaHref: '/company/contact',
      },
    ],
  },

  /* ---- resources/guides ----------------------------------------------- */
  {
    title: 'Guides & templates',
    slug: 'resources/guides',
    pageType: 'resourceHub',
    seo: {
      metaTitle: 'Guides & templates — QualiWare',
      metaDescription:
        'Downloadable guides, starter templates and checklists for enterprise architecture, process management and governance work, drawn from real projects.',
    },
    authorship: {
      authorName: 'Camilla Bloch',
      authorRole: 'Principal Consultant, Process and Governance, QualiWare',
      authorCredentials: 'Lead Auditor ISO 9001 · BPMN 2.0 · 16 years in management systems',
      lastReviewed: '2026-07-15',
      experienceNote:
        'Each template started life on a customer project. The capability starter set has been reused on 23 public-sector engagements since 2021.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'GUIDES & TEMPLATES',
        heading: 'Start from something that has already worked somewhere',
        lead: 'Templates and short guides taken from real engagements, stripped of the customer’s data. Use them as they are, or as an argument for doing it differently.',
        showSearch: true,
        searchPlaceholder: 'Search guides and templates',
        popularSearches: [
          { label: 'Digital twin', href: '/resources/guides?tag=dto' },
          { label: 'Naming conventions', href: '/resources/guides?tag=conventions' },
          { label: 'Capability starter set', href: '/resources/guides?tag=capabilities' },
          { label: 'NIS2 worksheet', href: '/solutions/nis2' },
        ],
      },
      {
        blockType: 'resourceGrid',
        heading: 'All guides and templates',
        showFilters: true,
        items: [
          {
            resourceType: 'guide',
            title: 'Where to start with a digital twin of your organization',
            summary:
              'A practical sequence for the first 90 days: which four object types to model first, who has to agree, and what to show at the end of each month.',
            meta: 'GUIDE · 24 pages · updated June 2026',
            featured: true,
            image: {
              placeholder:
                'FEATURED GUIDE COVER — process wall detail with a hand annotating, tight crop, brand green wash',
            },
            href: '/resources/guides/where-to-start-digital-twin',
          },
          {
            resourceType: 'guide',
            title: 'Application portfolio triage template',
            summary:
              'A scoring sheet for lifecycle, business fit and technical risk, with the import mapping so the result lands in the repository rather than in a folder.',
            meta: 'TEMPLATE · spreadsheet + import mapping · updated May 2026',
            image: { placeholder: 'TEMPLATE COVER — portfolio scoring grid detail' },
            href: '/resources/guides/application-portfolio-triage-template',
          },
          {
            resourceType: 'guide',
            title: 'NIS2 control-to-process mapping worksheet',
            summary:
              'One row per control, one column for the process that carries it and one for the evidence it produces. Built to be filled in by process owners, not consultants.',
            meta: 'TEMPLATE · 11 pages · updated March 2026',
            image: { placeholder: 'TEMPLATE COVER — control mapping table detail' },
            href: '/resources/guides/nis2-control-mapping-worksheet',
          },
          {
            resourceType: 'guide',
            title: 'Naming conventions that keep a repository readable',
            summary:
              'The dullest document with the largest effect. Verb-noun process names, owner-bearing capability names, and what to do about the objects you already named badly.',
            meta: 'GUIDE · 9 pages · updated February 2026',
            image: { placeholder: 'GUIDE COVER — typographic detail, object names on screen' },
            href: '/resources/guides/naming-conventions',
          },
          {
            resourceType: 'guide',
            title: 'Governance workflow starter: roles, states and who approves what',
            summary:
              'Four states, three roles and one escalation path — the smallest workflow that still produces an audit trail, with the variations that tend to be added later.',
            meta: 'GUIDE · 16 pages · updated April 2026',
            image: { placeholder: 'GUIDE COVER — workflow state diagram detail' },
            href: '/resources/guides/governance-workflow-starter',
          },
          {
            resourceType: 'guide',
            title: 'Capability map starter set for the public sector',
            summary:
              'Forty-two level-one and level-two capabilities common to municipalities and agencies, with definitions written to be argued with.',
            meta: 'TEMPLATE · 42 capabilities · updated January 2026',
            image: { placeholder: 'TEMPLATE COVER — capability grid, brand ice blue' },
            href: '/resources/guides/public-sector-capability-starter-set',
          },
          {
            resourceType: 'guide',
            title: 'Publishing checklist before you open the portal to 10,000 people',
            summary:
              'Twelve checks on access, search, naming and ownership. Most portal rollouts that go quiet failed at least four of them.',
            meta: 'CHECKLIST · 4 pages · updated July 2026',
            image: { placeholder: 'CHECKLIST COVER — printed checklist with ticks, candid' },
            href: '/resources/guides/publishing-checklist',
          },
          {
            resourceType: 'webinar',
            title: 'How to run a modelling workshop that produces something',
            summary:
              'The facilitation session that accompanies the starter templates: preparation, timeboxing, and how to close without a follow-up workshop.',
            meta: 'ON DEMAND · 42 minutes',
            image: { placeholder: 'PHOTO — facilitator mid-workshop, group visible, candid' },
            href: '/resources/webinars',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Want the template filled in on your own data?',
        text: 'Bring one portfolio, one process area or one control set to a 45-minute session and we will work through it with you.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  },

  /* ---- resources/center-of-excellence --------------------------------- */
  {
    title: 'Center of Excellence',
    slug: 'resources/center-of-excellence',
    pageType: 'resourceHub',
    seo: {
      metaTitle: 'Center of Excellence — QualiWare',
      metaDescription:
        'The QualiWare user community: roundtables, certification tracks, user group recordings and the charter templates that customer modelling teams share.',
    },
    authorship: {
      authorName: 'Rasmus Lindegaard',
      authorRole: 'Community Lead and Senior Consultant, QualiWare',
      authorCredentials: 'Runs the Nordic user groups · 11 years supporting customer modelling teams',
      lastReviewed: '2026-08-18',
      experienceNote:
        'The community has met continuously since the first Danish user group in 2009; 14 roundtables were held in 2025 across four countries.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'CENTER OF EXCELLENCE',
        heading: 'The people doing this in other organizations',
        lead: 'A community of customer modelling teams, architects and process owners. Roundtables, recordings, certification tracks and the working documents members share with each other.',
        showSearch: true,
        searchPlaceholder: 'Search community material',
        popularSearches: [
          { label: 'Roundtables', href: '/resources/center-of-excellence?tag=roundtables' },
          { label: 'Certification', href: '/resources/center-of-excellence?tag=certification' },
          { label: 'CoE charter', href: '/resources/guides' },
          { label: 'User group recordings', href: '/resources/webinars' },
        ],
      },
      {
        blockType: 'resourceGrid',
        heading: 'From the community',
        showFilters: true,
        items: [
          {
            resourceType: 'story',
            title: 'Inside a Center of Excellence that has run for nine years',
            summary:
              'How one member organization staffs, funds and defends its modelling team — including what happened the year the budget was questioned.',
            meta: 'COMMUNITY · 5 min read · 14 August 2026',
            featured: true,
            image: {
              placeholder:
                'FEATURED PHOTO — customer modelling team around a table, candid, real workplace, no branded material',
            },
            href: '/resources/center-of-excellence/inside-a-coe',
          },
          {
            resourceType: 'webinar',
            title: 'CoE roundtable: measuring model quality without inventing a maturity score',
            summary:
              'Members compare the handful of measures they actually report upwards: coverage, staleness, ownership and read-through.',
            meta: 'ROUNDTABLE · 24 September 2026 · 15:00 CET · 60 minutes',
            image: { placeholder: 'PHOTO — roundtable discussion, mid-conversation, candid' },
            href: '/resources/center-of-excellence/roundtable-model-quality',
          },
          {
            resourceType: 'guide',
            title: 'The CoE charter template',
            summary:
              'Mandate, scope, decision rights and the three things the team explicitly does not do. Adapted from six member charters.',
            meta: 'TEMPLATE · 7 pages · updated May 2026',
            image: { placeholder: 'TEMPLATE COVER — charter document detail' },
            href: '/resources/guides',
          },
          {
            resourceType: 'blog',
            title: 'What a good model review looks like',
            summary:
              'Twenty minutes, three questions, one decision recorded. The review format members converged on after trying longer ones.',
            meta: 'BLOG · 6 min read · 7 July 2026',
            image: { placeholder: 'PHOTO — pair reviewing a model on a large screen' },
            href: '/resources/blog/what-a-good-model-review-looks-like',
          },
          {
            resourceType: 'webinar',
            title: 'User group Copenhagen 2026 — the recordings',
            summary:
              'Six member sessions from the spring meeting, including two on publishing to large non-modelling audiences.',
            meta: 'ON DEMAND · 6 sessions',
            image: { placeholder: 'PHOTO — user group audience from the side, candid, Copenhagen venue' },
            href: '/resources/center-of-excellence/user-group-copenhagen-2026',
          },
          {
            resourceType: 'blog',
            title: 'Certification tracks: which one fits which role',
            summary:
              'Modeller, administrator and architect tracks, what each exam covers, and why refreshers follow releases rather than calendars.',
            meta: 'BLOG · 5 min read · 19 May 2026',
            image: { placeholder: 'PHOTO — training room, participants at laptops, candid' },
            href: '/resources/center-of-excellence/certification-tracks',
          },
          {
            resourceType: 'story',
            title: 'How a utility built a thirty-person modelling community',
            summary:
              'Recruiting modellers from the business rather than from IT, and the internal training rhythm that kept them.',
            meta: 'CUSTOMER STORY · 7 min read',
            image: { placeholder: 'PHOTO — utility control room or substation, wide, permission-safe' },
            href: '/customers',
          },
          {
            resourceType: 'newsletter',
            title: 'The CoE digest',
            summary:
              'A quarterly summary of what members raised, what changed in the product because of it, and where the next roundtable is.',
            meta: 'NEWSLETTER · quarterly',
            image: { placeholder: 'GRAPHIC — digest cover, typographic, brand ice blue' },
            href: '/resources/newsletter',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Already a customer? You are already a member',
        text: 'Roundtables, recordings and the shared working documents are open to every customer team. Ask your contact for an invitation to the next session.',
        ctaLabel: 'CONTACT US',
        ctaHref: '/company/contact',
      },
    ],
  },

  /* ---- resources/newsletter ------------------------------------------- */
  {
    title: 'Newsletter',
    slug: 'resources/newsletter',
    pageType: 'resourceHub',
    seo: {
      metaTitle: 'Newsletter — QualiWare',
      metaDescription:
        'The architects’ note: one practical piece a month on modelling, governance and keeping an enterprise model current. Read past issues before subscribing.',
    },
    authorship: {
      authorName: 'Signe Krogh',
      authorRole: 'Editor and Practice Lead, QualiWare',
      authorCredentials: 'Former process manager in Danish local government · 12 years in BPM',
      lastReviewed: '2026-08-06',
      experienceNote:
        'Issue 41 went out in August 2026. The note has been written by the same small editorial group since issue 1 in April 2023.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'NEWSLETTER',
        heading: 'The architects’ note',
        lead: 'One practical piece a month for people who maintain a model rather than talk about one. No release announcements, no event marketing, no reselling your address.',
        showSearch: true,
        searchPlaceholder: 'Search past issues',
        popularSearches: [
          { label: 'Model ownership', href: '/resources/newsletter?tag=ownership' },
          { label: 'Evidence', href: '/resources/newsletter?tag=evidence' },
          { label: 'Capability maps', href: '/resources/blog?tag=capability-maps' },
          { label: 'All issues', href: '/resources/newsletter#issues' },
        ],
      },
      {
        blockType: 'resourceGrid',
        heading: 'Recent issues',
        showFilters: true,
        items: [
          {
            resourceType: 'newsletter',
            title: 'The model nobody maintains',
            summary:
              'What we found looking back at five repositories that went quiet, and the one organizational detail all five had in common.',
            meta: 'ISSUE 41 · August 2026',
            featured: true,
            image: {
              placeholder:
                'FEATURED GRAPHIC — issue cover, typographic treatment of the issue title, brand green on off-white',
            },
            href: '/resources/newsletter/issue-41',
          },
          {
            resourceType: 'newsletter',
            title: 'When the portfolio owner leaves',
            summary:
              'Succession for model ownership, and why naming a deputy at the start costs nothing and saves a quarter later.',
            meta: 'ISSUE 40 · July 2026',
            image: { placeholder: 'GRAPHIC — issue cover, typographic, brand ice blue' },
            href: '/resources/newsletter/issue-40',
          },
          {
            resourceType: 'newsletter',
            title: 'Three ways a capability map goes wrong',
            summary:
              'Too many levels, borrowed reference models, and definitions written to avoid disagreement rather than to settle it.',
            meta: 'ISSUE 39 · June 2026',
            image: { placeholder: 'GRAPHIC — issue cover, capability grid motif' },
            href: '/resources/newsletter/issue-39',
          },
          {
            resourceType: 'newsletter',
            title: 'Evidence, not screenshots',
            summary:
              'What an auditor accepts as proof that a control operated, and how far ahead of the audit that has to be arranged.',
            meta: 'ISSUE 38 · May 2026',
            image: { placeholder: 'GRAPHIC — issue cover, document motif' },
            href: '/resources/newsletter/issue-38',
          },
          {
            resourceType: 'newsletter',
            title: 'What twenty-six years with one customer teaches a product team',
            summary:
              'Backwards compatibility as a design constraint, and the features we did not build because of it.',
            meta: 'ISSUE 37 · April 2026',
            image: { placeholder: 'GRAPHIC — issue cover, timeline motif' },
            href: '/resources/newsletter/issue-37',
          },
          {
            resourceType: 'newsletter',
            title: 'AI in the repository: what we shipped and what we did not',
            summary:
              'Where generated content helps a modeller, where it quietly damages a governed model, and the line we drew between the two.',
            meta: 'ISSUE 36 · March 2026',
            image: { placeholder: 'GRAPHIC — issue cover, abstract graph motif' },
            href: '/resources/newsletter/issue-36',
          },
        ],
      },
      {
        blockType: 'formBlock',
        eyebrow: 'SUBSCRIBE',
        heading: 'One email a month, first Tuesday',
        lead: 'Read a couple of the issues above first. If the tone is not for you, no subscription form will fix that.',
        expectations: [
          { text: 'Twelve emails a year, never more' },
          { text: 'One click to unsubscribe, in every issue' },
          { text: 'Your address stays with QualiWare and is never sold or shared' },
        ],
        sideQuote:
          'It is the only vendor newsletter I keep, because it is written by people who have clearly had to maintain a model themselves.',
        formFields: [
          { label: 'Work email', name: 'email', fieldType: 'email', required: true, width: 'full' },
          { label: 'First name', name: 'firstName', fieldType: 'text', required: false, width: 'half' },
          { label: 'Organization', name: 'organization', fieldType: 'text', required: false, width: 'half' },
          {
            label: 'Your role',
            name: 'role',
            fieldType: 'select',
            required: false,
            width: 'half',
            options: [
              { value: 'Enterprise architect' },
              { value: 'Process owner or process manager' },
              { value: 'Risk, compliance or audit' },
              { value: 'IT leadership' },
              { value: 'Consultant or partner' },
              { value: 'Something else' },
            ],
          },
          {
            label: 'Country',
            name: 'country',
            fieldType: 'text',
            required: false,
            width: 'half',
          },
          {
            label: 'What would you like more of?',
            name: 'interests',
            fieldType: 'chips',
            required: false,
            width: 'full',
            options: [
              { value: 'Enterprise architecture' },
              { value: 'Process management' },
              { value: 'Governance, risk and compliance' },
              { value: 'Digital twin of an organization' },
              { value: 'AI governance' },
              { value: 'Public sector' },
            ],
          },
        ],
        submitLabel: 'SUBSCRIBE',
        privacyNote:
          'We use your address to send the monthly note and nothing else. Unsubscribe from any issue; we delete the record when you do. See the privacy notice under Legal.',
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Prefer everything at once?',
        text: 'The blog carries the same writing without the wait, and the guides collect the longer material into something you can hand to a colleague.',
        ctaLabel: 'READ THE BLOG',
        ctaHref: '/resources/blog',
      },
    ],
  },

  /* ---- resources/edgy ------------------------------------------------- */
  {
    title: 'QualiWare x EDGY',
    slug: 'resources/edgy',
    pageType: 'resourceHub',
    seo: {
      metaTitle: 'QualiWare x EDGY — QualiWare',
      metaDescription:
        'How QualiWare supports EDGY, the open organizational design language from the Intersection Group, with templates, sessions and practitioner writing.',
    },
    authorship: {
      authorName: 'Peter Dahl',
      authorRole: 'Chief Architect, QualiWare',
      authorCredentials: 'Ontology and metamodel design · 22 years on the QualiWare metamodel',
      reviewerName: 'Camilla Bloch',
      reviewerRole: 'Principal Consultant, Process and Governance, QualiWare',
      lastReviewed: '2026-06-30',
      experienceNote:
        'The EDGY template set has been used on 9 customer engagements since 2024, most of them organizational redesigns rather than IT projects.',
    },
    sources: [
      {
        label: 'EDGY — open language for enterprise and organizational design',
        publisher: 'Intersection Group',
        date: 'Accessed June 2026',
      },
      {
        label: 'EDGY licensing and attribution guidance',
        publisher: 'Intersection Group',
        date: 'Accessed June 2026',
      },
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'QUALIWARE x EDGY',
        heading: 'An open language for organizational design, in a governed repository',
        lead: 'EDGY is an open language for enterprise and organizational design, developed by the Intersection Group community. We support it in the repository so that identity, architecture and experience can be modelled beside the processes and applications you already hold. EDGY is the Intersection Group’s work, not ours.',
        showSearch: true,
        searchPlaceholder: 'Search EDGY material',
        popularSearches: [
          { label: 'Identity', href: '/resources/edgy?tag=identity' },
          { label: 'Architecture', href: '/resources/edgy?tag=architecture' },
          { label: 'Experience', href: '/resources/edgy?tag=experience' },
          { label: 'Starter template', href: '/resources/guides' },
        ],
      },
      {
        blockType: 'resourceGrid',
        heading: 'Material on the collaboration',
        showFilters: true,
        items: [
          {
            resourceType: 'guide',
            title: 'Modelling identity, architecture and experience in one repository',
            summary:
              'How the EDGY facets map onto the QualiWare metamodel, what stays native to EDGY, and where the two vocabularies deliberately do not merge.',
            meta: 'GUIDE · 18 pages · updated May 2026',
            featured: true,
            image: {
              placeholder:
                'FEATURED GRAPHIC — three-facet diagram in brand green, navy and ice blue, original artwork, no Intersection Group marks',
            },
            href: '/resources/edgy/identity-architecture-experience',
          },
          {
            resourceType: 'webinar',
            title: 'Organizational design with EDGY — a working session',
            summary:
              'We take a real reorganization brief and model it in EDGY terms on screen, then show what the same picture looks like to a process owner.',
            meta: 'LIVE · 1 October 2026 · 13:00 CET · 60 minutes',
            image: { placeholder: 'PHOTO — facilitator and participants at a design wall, candid' },
            href: '/resources/edgy/working-session',
          },
          {
            resourceType: 'blog',
            title: 'Why we support an open language instead of inventing another one',
            summary:
              'A vendor-specific vocabulary for organizational design would be one more thing customers cannot take with them. The argument, and its limits.',
            meta: 'BLOG · 7 min read · 26 February 2026',
            image: { placeholder: 'PHOTO — architect sketching on paper, close crop of hands' },
            href: '/resources/edgy/why-an-open-language',
          },
          {
            resourceType: 'guide',
            title: 'The EDGY starter template for QualiWare',
            summary:
              'Object types, relations and three starting views, so a first workshop can produce something stored rather than photographed off a wall.',
            meta: 'TEMPLATE · 12 object types · updated April 2026',
            image: { placeholder: 'TEMPLATE COVER — object-type list detail, brand green' },
            href: '/resources/edgy/starter-template',
          },
          {
            resourceType: 'blog',
            title: 'The three facets in practice, and where teams get stuck',
            summary:
              'Identity is the facet organizations skip and the one that decides whether the rest of the model means anything. What that looks like in a real session.',
            meta: 'BLOG · 8 min read · 15 April 2026',
            image: { placeholder: 'PHOTO — workshop wall covered in sticky notes, candid' },
            href: '/resources/edgy/three-facets-in-practice',
          },
          {
            resourceType: 'webinar',
            title: 'What the Intersection Group community is working on',
            summary:
              'A recorded conversation about where the language is developing and how practitioners contribute to it. Hosted by us, about their work.',
            meta: 'ON DEMAND · 35 minutes',
            image: { placeholder: 'PHOTO — two people in conversation on a recorded call, candid still' },
            href: '/resources/edgy/community-conversation',
          },
          {
            resourceType: 'story',
            title: 'Using EDGY to frame a merger integration',
            summary:
              'Two organizations with incompatible process models started from identity instead, and used that to decide what actually had to be merged.',
            meta: 'CUSTOMER STORY · 6 min read',
            image: { placeholder: 'PHOTO — integration team workshop, two groups mixed, candid' },
            href: '/customers',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Try the starter template on your own organization',
        text: 'A 45-minute session using the EDGY template on a real question of yours, rather than a demonstration dataset.',
        ctaLabel: 'BOOK A SESSION',
        ctaHref: '/pricing#demo',
      },
    ],
  },
]

/* ====================================================================== *
 * Company
 * ====================================================================== */

export const companyPages: SeedPage[] = [
  /* ---- company/story -------------------------------------------------- */
  {
    title: 'The QualiWare story',
    slug: 'company/story',
    pageType: 'company',
    seo: {
      metaTitle: 'The QualiWare story — QualiWare',
      metaDescription:
        'Founded in Denmark in 1991 on one idea: model the organization once, in a repository everything else reads from. What that has meant in practice since.',
    },
    authorship: {
      authorName: 'Line Toft Sørensen',
      authorRole: 'Director of Communications, QualiWare',
      authorCredentials: 'Ten years documenting QualiWare customer programmes',
      reviewerName: 'Peter Dahl',
      reviewerRole: 'Chief Architect, QualiWare',
      lastReviewed: '2026-05-19',
      experienceNote:
        'Written from company records and from interviews with 12 colleagues and customers, including the account that has now run for 26 years.',
    },
    sources: [
      {
        label: 'QualiWare ApS company registration, CVR 30731557',
        publisher: 'Danish Business Authority (Erhvervsstyrelsen)',
        date: 'Accessed May 2026',
      },
      {
        label: 'QualiWare customer renewal and deployment figures',
        publisher: 'QualiWare ApS',
        date: 'January 2026',
      },
      {
        label: 'ISO/IEC 27001:2022 — Information security management systems, requirements',
        publisher: 'International Organization for Standardization',
        date: '2022',
      },
      {
        label: 'UN Global Compact participant record, QualiWare ApS',
        publisher: 'United Nations Global Compact',
        date: 'Accessed May 2026',
      },
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'OUR STORY',
        heading: 'Thirty-five years of one stubborn idea',
        lead: 'Model the organization once, in a repository that everything else reads from. We started in Farum in 1991, and the idea has outlasted several waves of tooling that promised to replace it.',
        ctas: [
          { label: 'MEET THE COMPANY', href: '/company/culture', style: 'solid' },
          { label: 'CONTACT US', href: '/company/contact', style: 'outline' },
        ],
        stats: [
          { value: '1991', label: 'Founded in Denmark' },
          { value: '26 years', label: 'Longest continuous customer relationship' },
          { value: '99%', label: 'Annual renewal rate' },
          { value: '125,000', label: 'Users in a single deployment' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW WE GOT HERE',
        heading: 'A repository first, a diagram tool second',
        lead: 'The order matters, and it explains most of what is unusual about us. Drawing tools were plentiful in 1991. Somewhere to keep the meaning was not.',
        image: {
          placeholder:
            'PHOTO — QualiWare office in Farum, wide interior, people working, natural light, no staged handshakes',
        },
        items: [
          {
            title: '1991 — an ontology, not a canvas',
            text: 'The first version stored typed objects and typed relations, because the founders wanted to ask questions of a model rather than admire it. Everything since has been built on that decision.',
          },
          {
            title: 'The 2000s — the public sector arrives',
            text: 'Danish municipalities and agencies needed a management system thousands of employees could read, not a modelling licence for every one of them. Publishing became as important as modelling.',
          },
          {
            title: 'The 2010s — regulation moves in',
            text: 'ISO 27001, then GDPR, then sector rules. Customers stopped asking for diagrams and started asking what evidence the repository could produce on request.',
          },
          {
            title: 'Today — one model, several audiences',
            text: 'Architects, process owners, risk officers and auditors read the same objects through different views. That is the whole promise of a digital twin of an organization, and it is what we have been building towards since the first release.',
          },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'grid',
        eyebrow: 'WHAT HAS NOT CHANGED',
        heading: 'Four commitments that predate every strategy document',
        items: [
          {
            title: 'Customers stay, so compatibility matters',
            text: 'Our longest relationship has run for 26 years and annual renewal sits at 99%. A model built a decade ago still has to open, which rules out a certain kind of rewrite.',
          },
          {
            title: 'Scale is a publishing problem',
            text: 'One customer deployment reaches 125,000 users. Almost none of them are modellers, which is why the reading experience gets as much attention as the editor.',
          },
          {
            title: 'Danish, and deliberately reachable',
            text: 'We are a company in Farum, north of Copenhagen. Customers reach the people who build the product, and support is named rather than anonymous.',
          },
          {
            title: 'Certified where it counts',
            text: 'ISO 27001 certified, a participant in the UN Global Compact and an approved supplier on Danish public framework agreements through SKI.',
          },
        ],
      },
      {
        blockType: 'logoWall',
        label: 'ORGANIZATIONS THAT HAVE TRUSTED THE MODEL FOR YEARS, NOT QUARTERS',
        logos: [
          { name: 'SAAB', logo: { placeholder: 'LOGO — SAAB, monochrome, cleared for use' } },
          { name: 'FOSS', logo: { placeholder: 'LOGO — FOSS, monochrome, cleared for use' } },
          { name: 'KK Wind Solutions', logo: { placeholder: 'LOGO — KK Wind Solutions, monochrome' } },
          { name: 'Coop', logo: { placeholder: 'LOGO — Coop, monochrome, cleared for use' } },
          { name: 'Vattenfall', logo: { placeholder: 'LOGO — Vattenfall, monochrome' } },
          { name: 'Trafikverket', logo: { placeholder: 'LOGO — Trafikverket, monochrome' } },
          { name: 'FMV', logo: { placeholder: 'LOGO — FMV, monochrome, cleared for use' } },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'See what thirty-five years of ontology work buys you',
        text: '45 minutes on your own architecture. Bring a real question and we will model it with you.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  },

  /* ---- company/culture ------------------------------------------------ */
  {
    title: 'Our culture',
    slug: 'company/culture',
    pageType: 'company',
    seo: {
      metaTitle: 'Our culture — QualiWare',
      metaDescription:
        'A small Danish company where customers reach the people who build the product. How we work, what we argue about, and what we ask of new colleagues.',
    },
    authorship: {
      authorName: 'Maja Ellegaard',
      authorRole: 'People and Culture Lead, QualiWare',
      authorCredentials: 'Twelve years in people roles in Danish software companies',
      lastReviewed: '2026-06-11',
      experienceNote:
        'Based on our 2026 internal engagement round, in which 84% of colleagues took part, and on exit conversations held over the past three years.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'OUR CULTURE',
        heading: 'Small enough that the customer reaches the person who wrote it',
        lead: 'We are not a large company and we have stopped treating that as something to grow out of. It is the reason our support is named, our roadmap is arguable, and a customer question can change a release.',
        ctas: [
          { label: 'SEE OPEN ROLES', href: '/company/careers', style: 'solid' },
          { label: 'THE QUALIWARE STORY', href: '/company/story', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW WE WORK',
        heading: 'Four habits, honestly described',
        lead: 'Including the parts that suit some people and not others. Better to read it here than discover it in month three.',
        image: {
          placeholder:
            'PHOTO — QualiWare colleagues mid-discussion at a desk in Farum, candid, natural light, screens not legible',
        },
        items: [
          {
            title: 'Consultants and developers sit close',
            text: 'The people who install the product and the people who build it are in the same conversations. A pattern seen on a customer site in March can be in a release by autumn.',
          },
          {
            title: 'We write things down, properly',
            text: 'We sell a repository, so it would be strange if our own decisions lived in someone’s memory. Expect to write, and expect your writing to be read carefully.',
          },
          {
            title: 'Long horizons over quick wins',
            text: 'Customers who stay for decades make short-term thinking expensive. Some proposals get turned down on compatibility grounds alone, and that can be frustrating.',
          },
          {
            title: 'Danish directness, translated',
            text: 'Disagreement is normal here and is not personal. Colleagues from other working cultures usually need a few weeks to believe that, so we say it explicitly.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE PRACTICAL PART',
        heading: 'What working here actually involves',
        features: [
          {
            title: 'Farum, with real flexibility',
            description:
              'Our office is in Farum, half an hour from central Copenhagen. Most colleagues split the week between office and home; consultants add customer sites in the Nordics and Europe.',
            linkLabel: 'Where we are',
            href: '/company/contact',
          },
          {
            title: 'Time to learn the domain',
            description:
              'Enterprise architecture and process governance take months to understand. New colleagues get a named mentor and are not expected to be useful on day five.',
          },
          {
            title: 'Certification on the clock',
            description:
              'The same role-based certification tracks we offer customers and partners are open to colleagues, during working hours rather than at weekends.',
            linkLabel: 'The community and its tracks',
            href: '/resources/center-of-excellence',
          },
          {
            title: 'A model of ourselves',
            description:
              'Our own processes live in QualiWare. It is a useful discipline, and it means everyone here has felt what it is like to be a reader of a published management system.',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Sound like somewhere you would do good work?',
        text: 'We hire rarely and carefully, and we answer every serious application ourselves.',
        ctaLabel: 'JOIN US',
        ctaHref: '/company/careers',
      },
    ],
  },

  /* ---- company/careers ------------------------------------------------ */
  {
    title: 'Join us',
    slug: 'company/careers',
    pageType: 'company',
    seo: {
      metaTitle: 'Join us — QualiWare',
      metaDescription:
        'Open roles at QualiWare in Farum, Denmark: consulting, product engineering, customer success and sales. How we hire and what to expect from the process.',
    },
    authorship: {
      authorName: 'Trine Holst',
      authorRole: 'Talent Acquisition Lead, QualiWare',
      authorCredentials: 'Nine years recruiting for Nordic B2B software teams',
      reviewerName: 'Maja Ellegaard',
      reviewerRole: 'People and Culture Lead, QualiWare',
      lastReviewed: '2026-08-14',
      experienceNote:
        'We ran 14 hiring processes in the twelve months to July 2026, and every applicant received a written answer from a named person.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'JOIN US',
        heading: 'Work on something organizations keep for decades',
        lead: 'Software that a customer still relies on after twenty-six years is a particular kind of engineering and a particular kind of consulting. If that appeals more than shipping fast and moving on, read on.',
        ctas: [
          { label: 'SEE HOW WE WORK', href: '/company/culture', style: 'solid' },
          { label: 'ASK A QUESTION', href: '/company/contact', style: 'outline' },
        ],
        stats: [
          { value: 'Farum, DK', label: 'Home office, with hybrid weeks' },
          { value: 'Nordics + EU', label: 'Where consultants travel' },
          { value: '14', label: 'Hiring processes in the past year' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHERE WE HIRE',
        heading: 'Four kinds of colleague we look for',
        lead: 'We post individual vacancies when they open. These are the areas where we hire repeatedly, and speculative applications in them are genuinely read.',
        image: {
          placeholder:
            'PHOTO — mixed team at a customer workshop, consultant presenting, candid, real room, no branding visible',
        },
        items: [
          {
            title: 'Consultants and solution architects',
            text: 'You will run modelling workshops with people who did not ask for a modelling workshop, then build what came out of it in the repository. Domain experience in EA, BPM or compliance matters more than tool experience.',
          },
          {
            title: 'Product engineers',
            text: 'A long-lived ontology-driven platform, a web portal read by six-figure user counts, and an integration surface that has to stay stable. Careful engineers do well here.',
          },
          {
            title: 'Customer success and support',
            text: 'Support here is named, not a queue. That means owning a handful of customer relationships properly rather than closing tickets quickly.',
          },
          {
            title: 'Sales and partner management',
            text: 'Long, technical evaluation cycles, often public tenders. The job is to explain scope honestly, including where we are not the right answer.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE PROCESS',
        heading: 'What applying here looks like',
        features: [
          {
            title: 'A written answer, always',
            description:
              'Every application gets a reply from a named person. If we are not going forward, we say why in a sentence you can use.',
          },
          {
            title: 'Two conversations, then a working session',
            description:
              'One conversation about the role, one about the domain, then a practical session on a real problem — a modelling case, a code review or a customer scenario, depending on the role.',
          },
          {
            title: 'No unpaid take-home projects',
            description:
              'We keep the practical session inside a couple of hours and we do it together. Nobody spends a weekend on speculative work for us.',
          },
          {
            title: 'Speculative applications welcome',
            description:
              'Send a short note about what you would want to do here and which of the four areas it sits in. Write to us and it reaches a person, not a filter.',
            linkLabel: 'Contact details',
            href: '/company/contact',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Nothing open that fits?',
        text: 'Write anyway. We keep serious applications on file and we come back to them — several colleagues joined that way.',
        ctaLabel: 'CONTACT US',
        ctaHref: '/company/contact',
      },
    ],
  },

  /* ---- company/contact ------------------------------------------------ */
  {
    title: 'Contact',
    slug: 'company/contact',
    pageType: 'company',
    seo: {
      metaTitle: 'Contact — QualiWare',
      metaDescription:
        'Reach QualiWare ApS in Farum, Denmark by phone or by email, or send us a message and get an answer from a named person within one working day.',
    },
    authorship: {
      authorName: 'Morten Kjær',
      authorRole: 'Head of Client Relations, QualiWare',
      authorCredentials: 'Fourteen years with QualiWare customers across the Nordics',
      lastReviewed: '2026-08-20',
      experienceNote:
        'Our median first reply to a message sent from this page was under four working hours across the first half of 2026.',
    },
    sources: [
      {
        label: 'QualiWare ApS company registration, CVR 30731557',
        publisher: 'Danish Business Authority (Erhvervsstyrelsen)',
        date: 'Accessed August 2026',
      },
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'CONTACT',
        heading: 'A named person, within one working day',
        lead: 'Sales questions, tender questionnaires, partner enquiries and press. Existing customers have a named contact already — support cases are faster through the support portal.',
        ctas: [
          { label: 'CALL +45 45 470 700', href: 'tel:+4545470700', style: 'solid' },
          { label: 'EMAIL INFO@QUALIWARE.COM', href: 'mailto:info@qualiware.com', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHERE WE ARE',
        heading: 'QualiWare ApS, Farum',
        lead: 'One office, half an hour north of Copenhagen. Visitors are welcome, and we would rather you came than sat through another video call.',
        image: {
          placeholder:
            'PHOTO — exterior of Ryttermarken 15, Farum, daylight, entrance visible, no people identifiable',
        },
        items: [
          {
            title: 'Address',
            text: 'QualiWare ApS, Ryttermarken 15, DK 3520 Farum, Denmark. CVR 30731557.',
          },
          {
            title: 'Phone',
            text: '+45 45 470 700, weekdays 08:30–16:30 CET. Ask for the team you need and you will be put through, not queued.',
          },
          {
            title: 'Email',
            text: 'info@qualiware.com for general enquiries, sales@qualiware.com for commercial and tender questions.',
          },
          {
            title: 'Getting here',
            text: 'Fifteen minutes from Farum station, forty minutes from Copenhagen Central by train and bus, and thirty-five minutes by car from Copenhagen Airport. Parking on site.',
          },
        ],
      },
      {
        blockType: 'formBlock',
        eyebrow: 'SEND A MESSAGE',
        heading: 'Tell us what you are trying to solve',
        lead: 'The more specific the question, the more useful the first reply. If a colleague is better placed to answer, we hand it over and tell you who has it.',
        expectations: [
          { text: 'A named person replies, usually within one working day' },
          { text: 'No sequence of marketing emails afterwards' },
          { text: 'We will say plainly if QualiWare is not the right fit' },
        ],
        sideQuote:
          'We reached the people who build the product during the evaluation, and we still do six years later. That is not the norm.',
        formFields: [
          { label: 'First name', name: 'firstName', fieldType: 'text', required: true, width: 'half' },
          { label: 'Last name', name: 'lastName', fieldType: 'text', required: true, width: 'half' },
          { label: 'Work email', name: 'email', fieldType: 'email', required: true, width: 'half' },
          { label: 'Organization', name: 'organization', fieldType: 'text', required: true, width: 'half' },
          { label: 'Country', name: 'country', fieldType: 'text', required: false, width: 'half' },
          {
            label: 'What is this about?',
            name: 'topic',
            fieldType: 'select',
            required: true,
            width: 'half',
            options: [
              { value: 'Evaluating QualiWare' },
              { value: 'Tender or requirement questionnaire' },
              { value: 'Existing customer question' },
              { value: 'Partner enquiry' },
              { value: 'Press or analyst' },
              { value: 'Careers' },
            ],
          },
          {
            label: 'Your question',
            name: 'message',
            fieldType: 'textarea',
            required: true,
            width: 'full',
          },
        ],
        submitLabel: 'SEND MESSAGE',
        privacyNote:
          'We use your details only to answer this enquiry and to follow up on it. Nothing here is added to a marketing list without your consent. See the privacy notice under Legal.',
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'FASTER ROUTES',
        heading: 'Some questions have a shorter path',
        features: [
          {
            title: 'Support cases',
            description:
              'Customers get a faster answer through the support portal, where the case reaches your named support contact directly.',
            linkLabel: 'Go to Support',
            href: 'https://support.qualiware.com',
          },
          {
            title: 'How-to and API questions',
            description:
              'Product documentation, administration guides and the API reference are open in Docs, with no login required.',
            linkLabel: 'Go to Docs',
            href: 'https://docs.qualiware.com',
          },
          {
            title: 'Partner enquiries',
            description:
              'Implementation partners, resellers and technology partners apply through the partner site, where the programme requirements are set out.',
            linkLabel: 'Partner programme',
            href: 'https://partners.qualiware.com/program',
          },
          {
            title: 'Invoicing and administration',
            description:
              'Purchase orders, e-invoicing details and contract administration go to sales@qualiware.com, or ask for the finance team on the main number.',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Would you rather see it than read about it?',
        text: '45 minutes on your own scenario, with an architect who can answer follow-up questions in the same session.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  },
]

/* ====================================================================== *
 * Legal — plain documents. No hero, no CTA, no marketing blocks.
 * ====================================================================== */

export const legalPages: SeedPage[] = [
  /* ---- legal ---------------------------------------------------------- */
  {
    title: 'Legal',
    slug: 'legal',
    pageType: 'legal',
    seo: {
      metaTitle: 'Legal — QualiWare',
      metaDescription:
        'Company details, privacy and data processing information, security certifications, terms and cookie policy for QualiWare ApS, Farum, Denmark.',
    },
    authorship: {
      authorName: 'Susanne Rask',
      authorRole: 'Data Protection Officer, QualiWare',
      lastReviewed: '2026-05-12',
    },
    sources: [
      {
        label: 'Regulation (EU) 2016/679 (General Data Protection Regulation)',
        publisher: 'Official Journal of the European Union',
        date: '27 April 2016',
      },
      {
        label: 'QualiWare ApS company registration, CVR 30731557',
        publisher: 'Danish Business Authority (Erhvervsstyrelsen)',
        date: 'Accessed May 2026',
      },
      {
        label: 'ISO/IEC 27001:2022 — Information security management systems, requirements',
        publisher: 'International Organization for Standardization',
        date: '2022',
      },
    ],
    layout: [
      {
        blockType: 'valueProps',
        layout: 'grid',
        eyebrow: 'LEGAL',
        heading: 'Legal information',
        lead: 'This page collects the company, privacy and security documents in one place. Where a document is issued per contract rather than published, we say so and how to obtain it.',
        items: [
          {
            title: 'Company details',
            text: 'QualiWare ApS, Ryttermarken 15, DK 3520 Farum, Denmark. Registered in Denmark under CVR 30731557. Telephone +45 45 470 700. General enquiries info@qualiware.com.',
          },
          {
            title: 'Data controller and contact',
            text: 'For the personal data QualiWare processes about website visitors, prospects and contacts, QualiWare ApS is the data controller. Data protection questions and requests go to info@qualiware.com, marked for the Data Protection Officer, or to the postal address above.',
          },
          {
            title: 'Privacy notice',
            text: 'We process personal data on the basis of contract performance, legitimate interest or consent, depending on the purpose. Categories collected through this website are limited to the identifying and contact details you enter in a form, plus the technical data described in the cookie policy.',
          },
          {
            title: 'Your rights under the GDPR',
            text: 'You may request access to your personal data, correction, erasure, restriction of processing, portability, and you may object to processing based on legitimate interest. Write to us and we respond within one month. You may also complain to the Danish Data Protection Agency (Datatilsynet).',
          },
          {
            title: 'Retention',
            text: 'Enquiry and form data is kept while the enquiry is open and for up to 24 months afterwards so that we can pick up the conversation, unless you ask us to delete it sooner. Newsletter records are deleted when you unsubscribe. Contractual records are kept for the periods Danish bookkeeping legislation requires.',
          },
          {
            title: 'Data processing for customers',
            text: 'Where QualiWare hosts or supports a customer deployment, we act as data processor. The data processing agreement, the subprocessor list, the description of technical and organisational measures and the transfer mechanisms form part of the contract. Customers can obtain the current versions from their named contact or from sales@qualiware.com.',
          },
          {
            title: 'Subprocessors and hosting location',
            text: 'The subprocessors used for a given deployment depend on the hosting model chosen, which may be QualiWare cloud, a sovereign or regional arrangement, or the customer’s own infrastructure. The applicable list is maintained as part of the data processing agreement and changes are notified in advance under it.',
          },
          {
            title: 'Information security',
            text: 'QualiWare is certified to ISO/IEC 27001. The certificate, scope statement and the current summary of technical and organisational measures are available on request. Access control, logging and separation of duties in the product itself are documented in Docs.',
          },
          {
            title: 'Reporting a vulnerability',
            text: 'Report a suspected security vulnerability in the product or in our online services to info@qualiware.com, marked for the security team. Please include enough detail to reproduce the issue and give us reasonable time to respond before disclosing it. We acknowledge reports and keep the reporter informed.',
          },
          {
            title: 'Intellectual property',
            text: 'The QualiWare name, logo and product names are trademarks of QualiWare ApS. Third-party names, standards and trademarks referred to on this site remain the property of their owners and are used for identification only. Third-party components distributed with the product are listed with their licences in the product documentation.',
          },
          {
            title: 'Accessibility',
            text: 'We aim to meet WCAG 2.1 level AA on this website and in the published web portal, since public-sector customers publish management systems to the whole population of an organisation. Tell us where we fall short and we will fix it and say when.',
          },
          {
            title: 'Other documents on this site',
            text: 'The terms and conditions that govern use of this website and our standard commercial terms are at /legal/terms. How this site uses cookies, and how to change your choice, is at /legal/cookies.',
          },
        ],
      },
    ],
  },

  /* ---- legal/terms ---------------------------------------------------- */
  {
    title: 'Terms & conditions',
    slug: 'legal/terms',
    pageType: 'legal',
    seo: {
      metaTitle: 'Terms & conditions — QualiWare',
      metaDescription:
        'The terms governing use of the QualiWare website and the standard conditions that apply to QualiWare software subscriptions, support and services.',
    },
    authorship: {
      authorName: 'Susanne Rask',
      authorRole: 'Data Protection Officer, QualiWare',
      reviewerName: 'Morten Kjær',
      reviewerRole: 'Head of Client Relations, QualiWare',
      lastReviewed: '2026-03-02',
    },
    sources: [
      {
        label: 'QualiWare ApS company registration, CVR 30731557',
        publisher: 'Danish Business Authority (Erhvervsstyrelsen)',
        date: 'Accessed March 2026',
      },
      {
        label: 'Regulation (EU) 2016/679 (General Data Protection Regulation)',
        publisher: 'Official Journal of the European Union',
        date: '27 April 2016',
      },
    ],
    layout: [
      {
        blockType: 'valueProps',
        layout: 'grid',
        eyebrow: 'TERMS & CONDITIONS',
        heading: 'Terms and conditions',
        lead: 'Sections 1 to 3 govern your use of this website. Sections 4 onwards summarise the standard conditions for QualiWare software and services. Where a signed agreement exists between you and QualiWare ApS, that agreement prevails over this page.',
        items: [
          {
            title: '1. Who these terms are with',
            text: 'This website is operated by QualiWare ApS, Ryttermarken 15, DK 3520 Farum, Denmark, CVR 30731557. By using the site you accept these terms. If you do not accept them, please stop using the site.',
          },
          {
            title: '2. Use of this website',
            text: 'You may read, print and share the content of this site for your own evaluation and internal use, with the source attributed. You may not scrape the site at a rate that degrades it, misrepresent its content, or use our trademarks in a way that suggests endorsement or partnership that does not exist.',
          },
          {
            title: '3. Accuracy of website content',
            text: 'We keep this site current and date the material that ages, but product capability descriptions, roadmap statements and third-party references are provided for information. Nothing on this website is an offer, a warranty, or a commitment to deliver a specific feature by a specific date. Version-specific behaviour is documented in Docs.',
          },
          {
            title: '4. Scope of the commercial terms',
            text: 'The sections below apply where QualiWare supplies software, hosting, support, training or consultancy, and are read together with the order form and, where relevant, the data processing agreement. The order form records what has been ordered, its duration and the fees; this page does not.',
          },
          {
            title: '5. Licence and right of use',
            text: 'A subscription grants a non-exclusive, non-transferable right to use the ordered QualiWare software for the customer’s own internal business purposes, within the user, editor and environment scope stated in the order form. The software is licensed, not sold, and no rights are granted beyond those expressly stated.',
          },
          {
            title: '6. Term, renewal and change of scope',
            text: 'Subscriptions run for the term stated in the order form and renew for equivalent periods unless either party gives written notice before renewal, within the notice period stated there. Scope can be increased during a term by a written order; reductions take effect at the next renewal.',
          },
          {
            title: '7. Support and service levels',
            text: 'Support is provided under the service description applicable to the customer’s plan, including response targets by severity and the supported release policy. Support covers the current release and defined earlier releases; upgrade paths and end-of-support dates are published in Docs.',
          },
          {
            title: '8. Customer data and ownership',
            text: 'The customer owns its models, content and data. QualiWare acquires no rights in them beyond what is necessary to deliver the agreed services. On termination, customers may export their repository content in the documented export formats; we will assist with a reasonable, scoped extraction on request.',
          },
          {
            title: '9. Personal data',
            text: 'Where QualiWare processes personal data on behalf of a customer, the data processing agreement applies and governs purposes, subprocessors, transfers, security measures, assistance and deletion. It forms part of the contract and prevails over this page on any question about personal data.',
          },
          {
            title: '10. Confidentiality',
            text: 'Each party keeps the other’s confidential information confidential, uses it only for the purposes of the agreement, and protects it with at least the care it applies to its own. The obligation survives the agreement. It does not cover information that is public, independently developed, or required to be disclosed by law.',
          },
          {
            title: '11. Warranties',
            text: 'QualiWare warrants that services are performed with the professional skill and care expected of a supplier of this kind, and that the software will perform materially as described in the documentation for the release supplied. Remedies for a breach of that warranty are correction, replacement or, where neither is practicable, the termination and refund provisions of the agreement.',
          },
          {
            title: '12. Limitation of liability',
            text: 'Neither party excludes liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot be limited under Danish law. Otherwise liability is limited as set out in the agreement, and neither party is liable for indirect or consequential loss, loss of profit, loss of goodwill, or loss of data that the affected party could have prevented by backups agreed in the contract.',
          },
          {
            title: '13. Third-party components and integrations',
            text: 'The software may include third-party components, listed with their licences in the documentation. Integrations with third-party systems depend on those systems and on the customer’s configuration; QualiWare is not responsible for changes a third party makes to its own interfaces, though we maintain the integration catalogue and document what each integration synchronises.',
          },
          {
            title: '14. Suspension and termination',
            text: 'Either party may terminate for material breach that is not remedied within thirty days of written notice. QualiWare may suspend a hosted service where continued operation poses a security risk or where required by law, and will restore it as soon as the cause is resolved. Termination does not affect accrued rights.',
          },
          {
            title: '15. Force majeure',
            text: 'Neither party is liable for delay or failure caused by events outside its reasonable control, including natural events, industrial action beyond its own workforce, war, and failures of public infrastructure. The affected party notifies the other promptly and both work to limit the effect.',
          },
          {
            title: '16. Governing law and disputes',
            text: 'These terms and any agreement made under them are governed by Danish law, excluding its conflict-of-law rules and the UN Convention on Contracts for the International Sale of Goods. Disputes are brought before the Danish courts, with the City Court of Copenhagen as the court of first instance, unless the parties have agreed arbitration in the order form.',
          },
          {
            title: '17. Changes to these terms',
            text: 'We may update this page, and the date of the last review is shown above. Changes apply to use of the website from publication. Changes to commercial terms for an existing customer are made in writing under the change procedure in the agreement, not by editing this page.',
          },
          {
            title: '18. Contact',
            text: 'Questions about these terms: QualiWare ApS, Ryttermarken 15, DK 3520 Farum, Denmark, +45 45 470 700, info@qualiware.com. Commercial and contract questions: sales@qualiware.com.',
          },
        ],
      },
    ],
  },

  /* ---- legal/cookies -------------------------------------------------- */
  {
    title: 'Cookies',
    slug: 'legal/cookies',
    pageType: 'legal',
    seo: {
      metaTitle: 'Cookies — QualiWare',
      metaDescription:
        'Which cookies qualiware.com sets, what each category is used for, how long they last, and how to change or withdraw your consent whenever you want.',
    },
    authorship: {
      authorName: 'Susanne Rask',
      authorRole: 'Data Protection Officer, QualiWare',
      lastReviewed: '2026-06-18',
    },
    sources: [
      {
        label: 'Directive 2002/58/EC concerning privacy and electronic communications (ePrivacy Directive)',
        publisher: 'Official Journal of the European Union',
        date: '12 July 2002',
      },
      {
        label:
          'Executive Order no. 1148 of 9 December 2011 on information and consent required for storing and accessing information on end-user terminal equipment (the Danish cookie order)',
        publisher: 'Danish Ministry of Business',
        date: '9 December 2011',
      },
      {
        label: 'Regulation (EU) 2016/679 (General Data Protection Regulation)',
        publisher: 'Official Journal of the European Union',
        date: '27 April 2016',
      },
    ],
    layout: [
      {
        blockType: 'valueProps',
        layout: 'grid',
        eyebrow: 'COOKIES',
        heading: 'Cookies on qualiware.com',
        lead: 'We set as few cookies as we can and none of them are for advertising. Nothing beyond the strictly necessary category is stored before you consent, and you can change or withdraw that consent at any time.',
        items: [
          {
            title: 'What a cookie is here',
            text: 'A small file, or an equivalent entry in your browser’s local storage, that this site asks your browser to keep. We use the word cookie for both. Some are set by qualiware.com; where a third party sets one, it is named below.',
          },
          {
            title: 'Strictly necessary — always active',
            text: 'These make the site work: they remember your cookie choice, protect forms against cross-site request forgery, and keep a session together while you fill a form in. They are not used for analysis and no consent is required for them. They expire when the session ends, except the consent record, which is kept for twelve months so that we do not ask you again on every visit.',
          },
          {
            title: 'Preferences — consent required',
            text: 'These remember choices you make, such as language and whether you have dismissed a notice. Refusing them costs you nothing except having to make those choices again. Typical lifetime: up to twelve months.',
          },
          {
            title: 'Statistics — consent required',
            text: 'Aggregated measurement of which pages are read, which searches return nothing useful and where visitors leave a form. We use this to fix the site, at the level of pages rather than people. IP addresses are truncated before storage and the data is not combined with anything that identifies you. Typical lifetime: up to twelve months.',
          },
          {
            title: 'No advertising or cross-site tracking cookies',
            text: 'We do not set advertising cookies, we do not build profiles for advertising, and we do not sell or share the data these cookies produce with third parties for their own purposes. If that ever changes, the consent banner and this page will change first.',
          },
          {
            title: 'Embedded content from other sites',
            text: 'A few pages embed a video or a recorded session hosted elsewhere. That provider may set its own cookies once the embed loads, under its own policy. We load such embeds only after you consent to the relevant category, and we name the provider at the point of use.',
          },
          {
            title: 'Other QualiWare properties',
            text: 'The documentation site, the support portal and the partner site are separate properties. Signed-in areas necessarily use session cookies to keep you signed in, and those areas may set additional strictly necessary cookies described where you sign in.',
          },
          {
            title: 'How to change or withdraw consent',
            text: 'Open the cookie settings from the link in the site footer and change your choice; it takes effect immediately and applies to future page loads. Withdrawing consent does not delete data already collected, but it stops further collection. You can also delete cookies in your browser settings, which resets the site to asking you again.',
          },
          {
            title: 'Legal basis and your rights',
            text: 'Consent is the basis for the preferences and statistics categories, under the ePrivacy rules as implemented in Denmark. Where cookie data constitutes personal data, the GDPR applies and you have the rights set out under Legal, including access and erasure. Complaints may be made to the Danish Data Protection Agency (Datatilsynet).',
          },
          {
            title: 'Questions',
            text: 'Write to info@qualiware.com marked for the Data Protection Officer, or to QualiWare ApS, Ryttermarken 15, DK 3520 Farum, Denmark. If you tell us a cookie is being set that is not described here, we will investigate and correct either the site or this page.',
          },
        ],
      },
    ],
  },
]

/* ====================================================================== *
 * Utility pages
 * ====================================================================== */

export const utilityPages: SeedPage[] = [
  /* ---- sign-in -------------------------------------------------------- */
  {
    title: 'Sign in',
    slug: 'sign-in',
    pageType: 'standard',
    seo: {
      metaTitle: 'Sign in — QualiWare',
      metaDescription:
        'Where to sign in to QualiWare: your own repository and web portal address, the partner portal, the support portal, and the open documentation site.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'SIGN IN',
        heading: 'There is no single QualiWare login — and that is deliberate',
        lead: 'Your repository and web portal run at your organization’s own address, inside your tenancy or your infrastructure. We cannot sign you in from here, so this page points you at the right door instead.',
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'CHOOSE YOUR ROUTE',
        heading: 'Four doors, and which one you probably want',
        features: [
          {
            title: 'Your repository and web portal',
            description:
              'The QualiWare web portal and modelling client live at an address your own administrators control, usually something like qualiware.yourorganization.com, with your normal single sign-on. If you do not know it, your internal QualiWare or process team will, and it is often already on your intranet front page.',
          },
          {
            title: 'Support portal',
            description:
              'Raise and follow cases, see service status and reach your named support contact. Access is for registered customer contacts; your administrator can add colleagues.',
            linkLabel: 'Go to Support',
            href: 'https://support.qualiware.com',
          },
          {
            title: 'Partner portal',
            description:
              'Enablement material, certification tracks, deal registration and co-selling resources for partners in the programme. Approved partner contacts sign in on the partner site.',
            linkLabel: 'Go to Partners',
            href: 'https://partners.qualiware.com',
          },
          {
            title: 'Documentation — no sign-in at all',
            description:
              'Product documentation, administration guides, release notes and the API reference are open to everyone, deliberately. Nothing to remember and nothing to request.',
            linkLabel: 'Go to Docs',
            href: 'https://docs.qualiware.com',
          },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'grid',
        eyebrow: 'IF YOU ARE STUCK',
        heading: 'Common access problems, and who fixes them',
        items: [
          {
            title: 'You do not know your portal address',
            text: 'Ask your internal QualiWare administrator, architecture team or process office. They own the address and the access groups. QualiWare support can confirm the address to a registered customer contact but cannot grant you access to your own tenancy.',
          },
          {
            title: 'Your password or single sign-on fails',
            text: 'Access is managed by your organization through its own identity provider, so password resets and group membership are handled by your IT service desk rather than by us.',
          },
          {
            title: 'You need support portal access',
            text: 'Registered customer contacts can request additional users for their organization. Ask your named support contact, or write to us and we will route it.',
          },
          {
            title: 'You are not a customer yet',
            text: 'There is nothing to sign in to, and no trial account to activate. Read the platform pages, or bring a real scenario to a 45-minute session with an architect.',
          },
        ],
      },
    ],
  },

  /* ---- customers/onboarding ------------------------------------------- */
  {
    title: 'Onboarding',
    slug: 'customers/onboarding',
    pageType: 'standard',
    seo: {
      metaTitle: 'Onboarding — QualiWare',
      metaDescription:
        'What the first ninety days with QualiWare look like: environment, ontology decisions, the first published model, and who does what along the way.',
    },
    authorship: {
      authorName: 'Jonas Vestergaard',
      authorRole: 'Head of Customer Enablement, QualiWare',
      authorCredentials: 'TOGAF 9 certified · 15 years delivering EA and BPM rollouts',
      reviewerName: 'Camilla Bloch',
      reviewerRole: 'Principal Consultant, Process and Governance, QualiWare',
      lastReviewed: '2026-07-09',
      experienceNote:
        'Drawn from 30-plus onboarding programmes run since 2021, from single-department starts to a rollout that now serves 125,000 readers.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'ONBOARDING',
        heading: 'Something published and read within ninety days',
        lead: 'Not a maturity programme. A sequence with one aim: by the end of the first quarter, a real audience reads something real, and the people who maintain it know why they are maintaining it.',
        ctas: [
          { label: 'TALK TO ENABLEMENT', href: '/company/contact', style: 'solid' },
          { label: 'GUIDES & TEMPLATES', href: '/resources/guides', style: 'outline' },
        ],
        stats: [
          { value: '2 weeks', label: 'To a working environment' },
          { value: '90 days', label: 'To a published, read model' },
          { value: 'Named', label: 'Support contact from day one' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'THE SEQUENCE',
        heading: 'Four stages, in this order, for a reason',
        lead: 'Most stalled rollouts modelled widely before deciding who reads the model. The order below is the correction.',
        image: {
          placeholder:
            'PHOTO — onboarding workshop, consultant and customer team at a shared screen, candid, real meeting room',
        },
        items: [
          {
            title: 'Weeks 1–2 — environment and access',
            text: 'Hosting model confirmed, environment provisioned, single sign-on connected and the first group of editors created. Your named support contact is introduced here rather than after go-live.',
          },
          {
            title: 'Weeks 2–5 — decide the ontology you will live with',
            text: 'Which object types you use, what each one means in your language, and the naming conventions. This is the week that decides whether the repository is readable in three years.',
          },
          {
            title: 'Weeks 4–9 — model the first real scope',
            text: 'One process area, one portfolio slice or one control set — chosen because someone is waiting for the answer. Consultants model alongside your team rather than for them.',
          },
          {
            title: 'Weeks 8–13 — publish, then govern',
            text: 'Open the web portal to its intended readers, set the review cycle, and name the owners. Governance comes after publication, because it is the readers who reveal what the model is missing.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHAT ONBOARDING INCLUDES',
        heading: 'Who does what',
        features: [
          {
            title: 'A named enablement lead',
            description:
              'One person accountable for the ninety days, who was in the evaluation conversations and knows what you said you needed. Not a handover to an anonymous team.',
          },
          {
            title: 'Role-based training',
            description:
              'Separate tracks for modellers, administrators and architects, with certification available afterwards through the same programme our partners use.',
            linkLabel: 'Certification and community',
            href: '/resources/center-of-excellence',
          },
          {
            title: 'Starter templates rather than a blank repository',
            description:
              'Naming conventions, a governance workflow starter and, for public-sector customers, a capability starter set — adapted in a workshop instead of adopted unread.',
            linkLabel: 'See the templates',
            href: '/resources/guides',
          },
          {
            title: 'Migration of what you already have',
            description:
              'Spreadsheet inventories, Visio process libraries and previous tool exports are mapped into the ontology. We tell you honestly which parts are worth migrating and which are worth retiring.',
          },
          {
            title: 'Documentation from day one',
            description:
              'Administration guides, how-to articles and the API reference are open in Docs, so your team can read ahead without waiting for a session.',
            linkLabel: 'Go to Docs',
            href: 'https://docs.qualiware.com',
          },
          {
            title: 'A review at day ninety',
            description:
              'A working session on what is being read, what is stale already and what the next quarter should cover. Written up, with owners and dates.',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Planning a rollout, or rescuing one?',
        text: 'Bring the scope you have in mind and we will tell you what the first ninety days would realistically produce — including if the honest answer is less than you hoped.',
        ctaLabel: 'CONTACT US',
        ctaHref: '/company/contact',
      },
    ],
  },
]
