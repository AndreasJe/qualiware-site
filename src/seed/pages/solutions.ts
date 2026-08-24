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
  /** Slugs of platform capability pages this solution links down into. */
  relatedCapabilitySlugs?: string[]
  layout: Layout
}

/**
 * Solutions answer "what is it for". Every page states problem -> outcome ->
 * proof and links *down* into the Platform pages that deliver it. The machinery
 * itself is never explained here — that is Platform's job.
 */

const demoCta = (heading: string, text: string): Layout[number] => ({
  blockType: 'ctaBanner',
  background: 'iceBlue',
  heading,
  text,
  ctaLabel: 'BOOK A DEMO',
  ctaHref: '/pricing#demo',
})

/* ------------------------------------------------------------------ *
 * By discipline
 * ------------------------------------------------------------------ */

const disciplines: SeedPage[] = [
  {
    title: 'Enterprise Architecture',
    slug: 'solutions/enterprise-architecture',
    pageType: 'solutionDiscipline',
    seo: {
      metaTitle: 'Enterprise Architecture — align IT with strategy',
      metaDescription:
        'Connect strategy, capabilities, applications and technology in one model, so architecture decisions are made with evidence instead of opinion.',
    },
    authorship: {
      authorName: 'Mette Holm',
      authorRole: 'Principal Enterprise Architect, QualiWare',
      authorCredentials: 'TOGAF 9 certified · 16 years in enterprise architecture',
      lastReviewed: '2026-04-14',
      experienceNote:
        'Written from roughly 60 architecture-practice reviews carried out with QualiWare customers since 2016, most of them organisations running an established EA function that had stopped being trusted by the business.',
    },
    relatedCapabilitySlugs: [
      'platform/repository',
      'platform/business-capability-management',
      'platform/application-portfolio-management',
      'platform/impact-analysis',
      'platform/strategy-roadmapping',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY DISCIPLINE',
        heading: 'Align IT with strategy',
        lead:
          'Most architecture practices can describe the estate. Far fewer can answer what happens if we retire this, or which capabilities a strategic goal actually depends on. This page is about the second kind.',
        ctas: [
          { label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' },
          { label: 'SEE HOW IT WORKS', href: '/platform', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'THE PROBLEM',
        heading: 'Architecture that nobody consults is just documentation',
        lead:
          'Diagrams age the moment they are exported. When the model lives apart from the decisions it should inform, the business routes around it — and the practice loses its mandate.',
        image: {
          placeholder:
            'PHOTO — Architects and business stakeholders around a screen, mid-discussion, real office, diverse, candid',
        },
        items: [
          {
            title: 'One model, not forty diagrams',
            text:
              'Applications, capabilities, processes, information and technology are objects with typed relations, so the same application appears once and is viewed many ways.',
          },
          {
            title: 'Answers before decisions',
            text:
              'Trace a proposed change through the capabilities, processes and risks it touches before it reaches a steering committee.',
          },
          {
            title: 'Kept current by the people who own it',
            text:
              'Ownership and review cycles sit on the objects themselves, so the model is maintained as part of the work rather than in an annual clean-up.',
          },
          {
            title: 'Read by more than architects',
            text:
              'Published views go to the web portal, so a process owner sees what concerns them without opening a modelling tool.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE OUTCOME',
        heading: 'What an EA practice can answer once the model is connected',
        features: [
          {
            title: 'What does this goal depend on?',
            description:
              'Trace a strategic objective down to the capabilities, applications and teams that have to change for it to land.',
          },
          {
            title: 'What breaks if we retire this?',
            description:
              'Impact analysis across typed relations, so a decommissioning decision states its consequences up front.',
          },
          {
            title: 'Where is the duplication?',
            description:
              'Capability-to-application mapping surfaces the four systems doing one job, with the cost and the owner attached.',
          },
          {
            title: 'Is the roadmap coherent?',
            description:
              'Sequence initiatives against the landscape you already documented, rather than against a separate slide deck.',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'Saab relies on QualiWare to stay compliant with the many regulations and standards it has to follow — and to keep one management system that people actually use.',
        name: 'Kristin Lilja',
        role: 'Process Architect, Global Management System',
        org: 'Saab AB',
        portrait: { placeholder: 'PORTRAIT — Kristin Lilja, candid, real office' },
        videoStill: {
          placeholder: 'VIDEO STILL — Customer interview thumbnail with play control',
        },
      },
      demoCta(
        'See it on your own architecture',
        'Bring a real question — a system you are retiring, a capability you cannot staff — and we will model it with you.',
      ),
    ],
  },

  {
    title: 'Governance, Risk & Compliance',
    slug: 'solutions/grc',
    pageType: 'solutionDiscipline',
    seo: {
      metaTitle: 'Governance, Risk & Compliance — controls where the work happens',
      metaDescription:
        'Attach controls, risks and evidence to the processes and systems they govern, so compliance is a property of the model rather than a separate audit exercise.',
    },
    authorship: {
      authorName: 'Lars Bek Jensen',
      authorRole: 'Head of Compliance Practice, QualiWare',
      authorCredentials: 'ISO 27001 Lead Auditor · 18 years in governance and risk',
      reviewerName: 'Mette Holm',
      reviewerRole: 'Principal Enterprise Architect, QualiWare',
      lastReviewed: '2026-05-06',
      experienceNote:
        'Based on more than 70 control-framework implementations with QualiWare customers since 2018, across public sector, finance, defence and utilities.',
    },
    relatedCapabilitySlugs: [
      'platform/governance-workflow',
      'platform/repository',
      'platform/impact-analysis',
      'platform/publishing',
      'platform/certifications',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY DISCIPLINE',
        heading: 'Controls where the work happens',
        lead:
          'A control register in a spreadsheet describes an intention. A control attached to the process it governs, with a named owner and a review date, is something you can evidence.',
        ctas: [
          { label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' },
          { label: 'SEE HOW IT WORKS', href: '/platform/governance-workflow', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'THE PROBLEM',
        heading: 'Most organisations prove compliance twice',
        lead:
          'Once in the operational systems where work actually happens, and again in a parallel set of documents assembled for the auditor. The second version is the one that goes stale.',
        image: {
          placeholder:
            'PHOTO — Compliance officer and process owner reviewing a control together at a desk, real office, diverse, candid',
        },
        items: [
          {
            title: 'One object, many obligations',
            text:
              'A single process can carry an ISO 27001 control, a NIS2 measure and an internal policy at once, without being documented three times.',
          },
          {
            title: 'Evidence with a date and an owner',
            text:
              'Reviews, approvals and sign-offs are recorded against the object, so the audit trail is a by-product of governance rather than a reconstruction.',
          },
          {
            title: 'Change that shows its consequences',
            text:
              'When a process changes, the controls and risks attached to it are flagged for re-review instead of silently drifting.',
          },
          {
            title: 'Overlap made visible',
            text:
              'Framework mappings show where one control satisfies several regimes, so you evidence once and report many times.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE OUTCOME',
        heading: 'What changes for the people doing the work',
        features: [
          {
            title: 'Auditors get answers, not archaeology',
            description:
              'Requested evidence is retrieved from the model with its approval history intact.',
          },
          {
            title: 'Owners know what they own',
            description:
              'Controls, risks and processes carry named accountability and a review cycle, visible in the published portal.',
          },
          {
            title: 'One control, several regimes',
            description:
              'Map a single measure to ISO 27001, NIS2 and DORA obligations rather than maintaining separate registers.',
          },
          {
            title: 'Risk in context',
            description:
              'Risks attach to the capability, process or application they threaten, so exposure is traceable to something real.',
          },
        ],
      },
      demoCta(
        'Bring your hardest audit finding',
        'We will model the control, its evidence and its owner in the session, and you can judge whether it holds up.',
      ),
    ],
  },

  {
    title: 'Process Management',
    slug: 'solutions/process-management',
    pageType: 'solutionDiscipline',
    seo: {
      metaTitle: 'Process Management — a management system people read',
      metaDescription:
        'Publish a process and management system that colleagues actually consult, on web and mobile, kept current by the people who own the work.',
    },
    authorship: {
      authorName: 'Anne Sofie Dahl',
      authorRole: 'Lead Process Consultant, QualiWare',
      authorCredentials: 'BPMN 2.0 · 12 years in process architecture and quality management',
      lastReviewed: '2026-03-30',
      experienceNote:
        'Drawn from around 45 management-system publishing projects since 2017, including several replacing document libraries that had grown past 3,000 controlled documents.',
    },
    relatedCapabilitySlugs: [
      'platform/process-modelling',
      'platform/publishing',
      'platform/governance-workflow',
      'platform/qualiware-go',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY DISCIPLINE',
        heading: 'A management system people read',
        lead:
          'The test of a management system is not whether it is complete. It is whether a colleague looking for how we do this finds the answer in under a minute, and trusts it.',
        ctas: [
          { label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' },
          { label: 'SEE HOW IT WORKS', href: '/platform/process-modelling', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'THE PROBLEM',
        heading: 'A certified management system nobody opens is a liability',
        lead:
          'Document libraries grow until finding the current version is harder than asking a colleague. At that point the system passes audits and fails the organisation.',
        image: {
          placeholder:
            'PHOTO — Two colleagues reviewing a process wall together in a real office — diverse, candid, not staged',
        },
        items: [
          {
            title: 'Written once, read everywhere',
            text:
              'One model publishes to the web portal and to mobile, so the shop floor and head office see the same current version.',
          },
          {
            title: 'Roles before documents',
            text:
              'People arrive asking what do I do — the portal answers by role, not by document number.',
          },
          {
            title: 'Approval built in',
            text:
              'Review and approval cycles run inside the system, so what is published is what was approved, with a date.',
          },
          {
            title: 'Connected to the estate',
            text:
              'Processes link to the applications, information and controls they depend on, so a system change surfaces the affected procedures.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE OUTCOME',
        heading: 'Signals that the system is actually being used',
        features: [
          {
            title: 'Search that lands',
            description:
              'Colleagues find the current procedure by role or by question, not by knowing its document code.',
          },
          {
            title: 'One version, visibly current',
            description:
              'Published views show approval status and date, which removes the is-this-the-latest question entirely.',
          },
          {
            title: 'Mobile for people away from a desk',
            description:
              'QualiWare Go puts the same management system in front of field and production staff.',
          },
          {
            title: 'Audit as a by-product',
            description:
              'Because approvals are recorded as the work happens, certification evidence does not need assembling.',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'Saab relies on QualiWare to stay compliant with the many regulations and standards it has to follow — and to keep one management system that people actually use.',
        name: 'Kristin Lilja',
        role: 'Process Architect, Global Management System',
        org: 'Saab AB',
        portrait: { placeholder: 'PORTRAIT — Kristin Lilja, candid, real office' },
        videoStill: {
          placeholder: 'VIDEO STILL — Customer interview thumbnail with play control',
        },
      },
      demoCta(
        'Bring a procedure nobody can find',
        'We will publish it in the session and you can judge whether a colleague would land on it.',
      ),
    ],
  },

  {
    title: 'Digital Twin of an Organization',
    slug: 'solutions/digital-twin',
    pageType: 'solutionDiscipline',
    seo: {
      metaTitle: 'Digital Twin of an Organization — one model of how you work',
      metaDescription:
        'A continuously maintained model of how the organisation actually operates, connecting strategy, capabilities, processes, systems, data and risk.',
    },
    authorship: {
      authorName: 'Mette Holm',
      authorRole: 'Principal Enterprise Architect, QualiWare',
      authorCredentials: 'TOGAF 9 certified · 16 years in enterprise architecture',
      lastReviewed: '2026-05-19',
      experienceNote:
        'Based on QualiWare deployments running continuously for over a decade, including one organisation modelling 125,000 users in a single deployment.',
    },
    sources: [
      {
        label:
          'Magic Quadrant for Digital Twin of an Organization Platforms — inaugural edition',
        publisher: 'Gartner',
        date: '2026',
      },
    ],
    relatedCapabilitySlugs: [
      'platform/repository',
      'platform/impact-analysis',
      'platform/business-capability-management',
      'platform/information-architecture',
      'platform/publishing',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY DISCIPLINE',
        heading: 'One model of how you work',
        lead:
          'A digital twin of an organisation is not a bigger diagram. It is one connected model — strategy, capabilities, processes, applications, information, risk — maintained well enough that you can ask it questions and act on the answer.',
        ctas: [
          { label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' },
          { label: 'SEE THE REPOSITORY', href: '/platform/repository', style: 'outline' },
        ],
        stats: [
          { value: '99%', label: 'annual renewal rate' },
          { value: '26 years', label: 'longest customer relationship' },
          { value: '125,000', label: 'users in a single deployment' },
          { value: 'ISO 27001', label: 'certified' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'THE PROBLEM',
        heading: 'Five tools, five truths',
        lead:
          'Architecture in one tool, processes in another, applications in a spreadsheet, risks in a GRC system, strategy in slides. Each is defensible alone. Together they cannot answer a single cross-cutting question.',
        image: {
          placeholder:
            'PHOTO — Cross-functional team at a whiteboard mapping dependencies, real office, diverse, candid',
        },
        items: [
          {
            title: 'Maintained once',
            text:
              'An application, a capability or a process is one object. Change it in one place and every view that uses it is current.',
          },
          {
            title: 'Typed relations, not arrows',
            text:
              'Relationships carry meaning, which is what makes traversal and impact analysis reliable rather than suggestive.',
          },
          {
            title: 'Versioned over years',
            text:
              'The model records how the organisation changed, so you can compare intent with what actually happened.',
          },
          {
            title: 'Continuously current',
            text:
              'Ownership and review cycles keep the twin alive between transformation programmes, not just during them.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE OUTCOME',
        heading: 'Questions a twin can answer that separate tools cannot',
        features: [
          {
            title: 'Where does this regulation touch us?',
            description:
              'Trace an obligation to the processes, systems and data that have to evidence it.',
          },
          {
            title: 'What does this vendor actually run?',
            description:
              'See every capability and process dependent on one supplier before renewal negotiations.',
          },
          {
            title: 'Where is AI in our operations?',
            description:
              'Locate the models and automations already embedded in real processes, with their owners.',
          },
          {
            title: 'Is the transformation coherent?',
            description:
              'Compare the target state against the estate as documented, and sequence accordingly.',
          },
        ],
      },
      demoCta(
        'Ask the model a question you cannot answer today',
        'Forty-five minutes, on your own scenario. Bring the cross-cutting question that currently takes three teams a week.',
      ),
    ],
  },

  {
    title: 'AI Governance',
    slug: 'solutions/ai-governance',
    pageType: 'solutionDiscipline',
    seo: {
      metaTitle: 'AI Governance — know where AI touches the business',
      metaDescription:
        'Inventory the AI systems already embedded in your processes, classify them, assign owners and evidence oversight against emerging obligations.',
    },
    authorship: {
      authorName: 'Lars Bek Jensen',
      authorRole: 'Head of Compliance Practice, QualiWare',
      authorCredentials: 'ISO 27001 Lead Auditor · 18 years in governance and risk',
      reviewerName: 'Mette Holm',
      reviewerRole: 'Principal Enterprise Architect, QualiWare',
      lastReviewed: '2026-06-02',
      experienceNote:
        'Drawn from AI inventory workshops run with QualiWare customers since 2023. In most, the first finding was that nobody held a complete list of the AI already in production.',
    },
    sources: [
      {
        label: 'Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence',
        publisher: 'Official Journal of the European Union',
        date: '2024',
      },
      {
        label: 'ISO/IEC 42001:2023 — Artificial intelligence management system',
        publisher: 'International Organization for Standardization',
        date: '2023',
      },
    ],
    relatedCapabilitySlugs: [
      'platform/repository',
      'platform/governance-workflow',
      'platform/information-architecture',
      'platform/impact-analysis',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY DISCIPLINE',
        heading: 'Know where AI touches the business',
        lead:
          'Before any AI policy can mean anything, you need the inventory: which systems, in which processes, on whose data, owned by whom. Most organisations discover they do not have it.',
        ctas: [
          { label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' },
          { label: 'SEE HOW IT WORKS', href: '/platform/repository', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'THE PROBLEM',
        heading: 'AI arrived without an asset register',
        lead:
          'Models were embedded in tools your teams already licensed. There was no procurement gate, so there is no list — and an obligation you cannot scope is one you cannot evidence.',
        image: {
          placeholder:
            'PHOTO — Risk and data colleagues reviewing a system inventory on screen, real office, diverse, candid',
        },
        items: [
          {
            title: 'AI as a modelled object',
            text:
              'An AI system is an object with relations to the processes it runs in, the data it consumes and the decisions it affects.',
          },
          {
            title: 'Classification you can defend',
            text:
              'Record intended purpose, risk classification and human-oversight arrangements against each system, with a review date.',
          },
          {
            title: 'Data lineage attached',
            text:
              'Because information objects are already modelled, you can show what a system was trained on and what it touches.',
          },
          {
            title: 'Oversight with a name on it',
            text:
              'Accountability is recorded on the object, so oversight is assigned rather than assumed.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE OUTCOME',
        heading: 'What becomes possible once the inventory exists',
        features: [
          {
            title: 'Scope an obligation',
            description:
              'Determine which of your systems a new requirement actually applies to, instead of assuming all or none.',
          },
          {
            title: 'Evidence human oversight',
            description:
              'Show the process step where a person reviews an automated decision, and who owns it.',
          },
          {
            title: 'See the blast radius',
            description:
              'If a model is withdrawn or found faulty, trace every process and decision that depended on it.',
          },
          {
            title: 'Report without a fire drill',
            description:
              'Governance reporting reads from the model rather than from a survey sent to department heads.',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Start with the inventory, not the policy',
        text:
          'QualiWare helps you evidence AI governance. It is not legal advice — scope and classification decisions remain yours.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  },

  {
    title: 'Business Transformation',
    slug: 'solutions/business-transformation',
    pageType: 'solutionDiscipline',
    seo: {
      metaTitle: 'Business Transformation — plan and sequence change',
      metaDescription:
        'Plan target states and sequence initiatives against the landscape you have already documented, so dependencies surface before commitments are made.',
    },
    authorship: {
      authorName: 'Henrik Vestergaard',
      authorRole: 'Transformation Practice Lead, QualiWare',
      authorCredentials: 'Former programme director · 20 years in change delivery',
      lastReviewed: '2026-04-27',
      experienceNote:
        'Based on roughly 35 transformation programmes supported since 2015, where the recurring failure was sequencing decided before dependencies were known.',
    },
    relatedCapabilitySlugs: [
      'platform/strategy-roadmapping',
      'platform/impact-analysis',
      'platform/business-capability-management',
      'platform/application-portfolio-management',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY DISCIPLINE',
        heading: 'Plan and sequence change',
        lead:
          'Transformation rarely fails on ambition. It fails on sequence — two initiatives that needed the same platform, in the same quarter, discovered in month seven.',
        ctas: [
          { label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' },
          { label: 'SEE HOW IT WORKS', href: '/platform/strategy-roadmapping', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'THE PROBLEM',
        heading: 'The roadmap and the estate are different documents',
        lead:
          'Plans are built in slides, against an understanding of the landscape that lives in someone’s head. The dependencies are real whether or not the plan knows about them.',
        image: {
          placeholder:
            'PHOTO — Programme team reviewing a roadmap on a large screen, real office, diverse, candid',
        },
        items: [
          {
            title: 'Roadmap on top of the model',
            text:
              'Initiatives attach to the capabilities and applications they change, so the plan inherits the real dependency graph.',
          },
          {
            title: 'Target states you can compare',
            text:
              'Model the intended state beside the current one and see precisely what has to move.',
          },
          {
            title: 'Contention made visible',
            text:
              'When two initiatives need the same capability in the same window, the conflict surfaces at planning time.',
          },
          {
            title: 'Benefits traced to capabilities',
            text:
              'Link expected outcomes to the capabilities that deliver them, so benefit claims survive scrutiny.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE OUTCOME',
        heading: 'Decisions that get easier',
        features: [
          {
            title: 'What has to go first?',
            description:
              'Sequence from actual dependencies rather than from which sponsor asked most recently.',
          },
          {
            title: 'What is this initiative really touching?',
            description:
              'See the processes, systems and controls in scope before the business case is signed.',
          },
          {
            title: 'Can we absorb this much change?',
            description:
              'Look at change load per capability and per team across the portfolio, not per project.',
          },
          {
            title: 'Did we get what we planned?',
            description:
              'Because the model is versioned, compare the target state with what was actually delivered.',
          },
        ],
      },
      demoCta(
        'Bring a roadmap with a sequencing problem',
        'We will overlay it on a model of your estate and look for the contention together.',
      ),
    ],
  },
]

/* ------------------------------------------------------------------ *
 * By industry
 * ------------------------------------------------------------------ */

const industries: SeedPage[] = [
  {
    title: 'Public Sector',
    slug: 'solutions/public-sector',
    pageType: 'solutionIndustry',
    seo: {
      metaTitle: 'Enterprise architecture for the public sector',
      metaDescription:
        'Shared models, records obligations and NIS2 scope across agencies — with the transparency and procurement trail public bodies are held to.',
    },
    authorship: {
      authorName: 'Birgitte Lund',
      authorRole: 'Public Sector Lead, QualiWare',
      authorCredentials: '15 years advising government agencies on architecture and records',
      lastReviewed: '2026-04-08',
      experienceNote:
        'Drawn from work with Nordic government agencies and municipalities since 2011, including shared-model programmes spanning multiple authorities.',
    },
    relatedCapabilitySlugs: [
      'platform/publishing',
      'platform/information-architecture',
      'platform/governance-workflow',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY INDUSTRY',
        heading: 'Architecture that survives a change of administration',
        lead:
          'Public bodies model for longer horizons than the political cycle, under records obligations, procurement scrutiny and a duty to be legible to citizens. The model has to outlast the programme that funded it.',
        ctas: [{ label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' }],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT IS DIFFERENT HERE',
        heading: 'Shared models, separate mandates',
        lead:
          'Agencies must align on common reference models while retaining their own authority and their own systems. That is a modelling problem before it is a governance one.',
        image: {
          placeholder:
            'PHOTO — Public sector staff collaborating in a government office setting, diverse, candid, not staged',
        },
        items: [
          {
            title: 'Common reference, local autonomy',
            text:
              'Adopt a shared capability model while each authority keeps its own applications and processes underneath it.',
          },
          {
            title: 'Records and retention modelled',
            text:
              'Information objects carry classification and retention, so obligations are visible where the data lives.',
          },
          {
            title: 'NIS2 scope for essential services',
            text:
              'Many public bodies fall in scope as essential entities — the model shows which services and suppliers that covers.',
          },
          {
            title: 'Transparency by default',
            text:
              'Published views give citizens and oversight bodies a legible account without exposing the working repository.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'PROOF',
        heading: 'What Nordic public bodies use it for',
        features: [
          {
            title: 'Sovereign and on-premise hosting',
            description:
              'Deployment options that satisfy national data-residency requirements, including fully on-premise.',
            linkLabel: 'Hosting options',
            href: '/platform/hosting',
          },
          {
            title: 'Long-lived deployments',
            description:
              'Our longest customer relationship runs to 26 years — relevant when the model must outlive the programme.',
          },
          {
            title: 'Procurement-ready',
            description:
              'ISO 27001 certified and available through established public frameworks.',
            linkLabel: 'Certifications',
            href: '/platform/certifications',
          },
          {
            title: 'Cross-agency publishing',
            description:
              'One repository publishing role-based views to several authorities and their citizens.',
            linkLabel: 'Publishing',
            href: '/platform/publishing',
          },
        ],
      },
      demoCta(
        'Bring your reference model',
        'We will show how a shared model coexists with each authority keeping its own estate underneath.',
      ),
    ],
  },

  {
    title: 'Finance',
    slug: 'solutions/finance',
    pageType: 'solutionIndustry',
    seo: {
      metaTitle: 'Enterprise architecture for financial services',
      metaDescription:
        'Operational resilience, ICT third-party risk and the register of information — evidenced from one model rather than assembled per submission.',
    },
    authorship: {
      authorName: 'Lars Bek Jensen',
      authorRole: 'Head of Compliance Practice, QualiWare',
      authorCredentials: 'ISO 27001 Lead Auditor · 18 years in governance and risk',
      lastReviewed: '2026-05-26',
      experienceNote:
        'Based on DORA readiness work with banks, insurers and payment institutions since 2023, where mapping critical functions to ICT providers was consistently the longest task.',
    },
    sources: [
      {
        label:
          'Regulation (EU) 2022/2554 on digital operational resilience for the financial sector (DORA)',
        publisher: 'Official Journal of the European Union',
        date: '2022',
      },
    ],
    relatedCapabilitySlugs: [
      'platform/application-portfolio-management',
      'platform/impact-analysis',
      'platform/governance-workflow',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY INDUSTRY',
        heading: 'Resilience you can evidence, not assert',
        lead:
          'Financial supervisors no longer accept a policy document as proof. They ask which critical functions depend on which providers, and what happens when one fails.',
        ctas: [
          { label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' },
          { label: 'DORA IN DETAIL', href: '/solutions/dora', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT IS DIFFERENT HERE',
        heading: 'The register of information is a modelling exercise',
        lead:
          'Mapping critical or important functions to the ICT third parties supporting them is not a form-filling task. It requires a maintained model of functions, systems and suppliers.',
        image: {
          placeholder:
            'PHOTO — Risk and resilience team reviewing dependencies on screen in a financial institution, diverse, candid',
        },
        items: [
          {
            title: 'Critical functions mapped to providers',
            text:
              'Functions, applications and suppliers are related objects, so the dependency chain is queryable rather than compiled.',
          },
          {
            title: 'Concentration risk visible',
            text:
              'See where several critical functions rest on one provider before a supervisor points it out.',
          },
          {
            title: 'Scenario testing against the model',
            text:
              'Model the loss of a provider or a data centre and trace the affected functions and processes.',
          },
          {
            title: 'Reported from one source',
            text:
              'Because the register reads from the model, resubmission is a refresh rather than a project.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'PROOF',
        heading: 'Where it earns its place',
        features: [
          {
            title: 'ICT third-party risk',
            description:
              'Supplier objects carry the functions they support, contract status and exit considerations.',
          },
          {
            title: 'Incident traceability',
            description:
              'When an incident occurs, identify affected functions and reporting obligations from the model.',
          },
          {
            title: 'One control, several regimes',
            description:
              'Map a measure once and report it against DORA, NIS2 and ISO 27001 obligations.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'Board-level accountability',
            description:
              'Oversight and sign-off are recorded on the objects, which is what management-body obligations require.',
          },
        ],
      },
      demoCta(
        'Bring one critical function',
        'We will map it to its providers and dependencies in the session, and you can judge the effort to do the rest.',
      ),
    ],
  },

  {
    title: 'Defence',
    slug: 'solutions/defence',
    pageType: 'solutionIndustry',
    seo: {
      metaTitle: 'Enterprise architecture for defence and aerospace',
      metaDescription:
        'Classified environments, long programme lifecycles and supply-chain assurance — modelled in a repository that can run fully on-premise.',
    },
    authorship: {
      authorName: 'Birgitte Lund',
      authorRole: 'Public Sector Lead, QualiWare',
      authorCredentials: '15 years advising government and defence organisations',
      lastReviewed: '2026-03-24',
      experienceNote:
        'Informed by work with Nordic defence organisations and their suppliers, including deployments operating without external network connectivity.',
    },
    relatedCapabilitySlugs: [
      'platform/hosting',
      'platform/access-control',
      'platform/publishing',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY INDUSTRY',
        heading: 'Programmes measured in decades, not quarters',
        lead:
          'Defence organisations model systems that will be in service long after the people who specified them have moved on — often in environments with no route to the public internet.',
        ctas: [{ label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' }],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT IS DIFFERENT HERE',
        heading: 'Classification is a modelling constraint',
        lead:
          'Who may see which part of the model is not an afterthought. It determines how the repository is deployed and how views are published.',
        image: {
          placeholder:
            'PHOTO · Defence manufacturing floor — real environment, diverse, candid, not staged',
        },
        items: [
          {
            title: 'Fully on-premise deployment',
            text:
              'The platform runs in air-gapped and sovereign environments, with no dependency on external services.',
          },
          {
            title: 'Access control down to the object',
            text:
              'Role and clearance-based access governs which parts of the model a user can see or publish.',
          },
          {
            title: 'Configuration over the lifecycle',
            text:
              'Versioning records how a system was configured at each point, which matters when support runs for decades.',
          },
          {
            title: 'Supply chain in the model',
            text:
              'Suppliers and their components are objects, so assurance questions traverse the same relations as everything else.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'PROOF',
        heading: 'Used by defence organisations and their suppliers',
        features: [
          {
            title: 'One global management system',
            description:
              'Saab maintains a single management system across a global defence group in QualiWare.',
          },
          {
            title: 'Sovereign hosting',
            description:
              'Cloud, sovereign and on-premise options, chosen per deployment.',
            linkLabel: 'Hosting options',
            href: '/platform/hosting',
          },
          {
            title: 'ISO 27001 certified',
            description:
              'Information security management certified to the current edition of the standard.',
            linkLabel: 'Certifications',
            href: '/platform/certifications',
          },
          {
            title: 'Long-term supportability',
            description:
              'A 26-year longest customer relationship, which is the relevant timescale for defence programmes.',
          },
        ],
      },
      demoCta(
        'Discuss a constrained deployment',
        'We will walk through on-premise and sovereign options against your security requirements.',
      ),
    ],
  },

  {
    title: 'Energy & Utilities',
    slug: 'solutions/energy-utilities',
    pageType: 'solutionIndustry',
    seo: {
      metaTitle: 'Enterprise architecture for energy and utilities',
      metaDescription:
        'Critical infrastructure in NIS2 scope, OT and IT convergence, and asset-heavy operations — modelled so dependencies and obligations are traceable.',
    },
    authorship: {
      authorName: 'Henrik Vestergaard',
      authorRole: 'Transformation Practice Lead, QualiWare',
      authorCredentials: 'Former programme director · 20 years in change delivery',
      lastReviewed: '2026-05-11',
      experienceNote:
        'Based on work with Nordic utilities and grid operators, where the recurring difficulty was relating operational technology to the IT estate in one model.',
    },
    sources: [
      {
        label:
          'Directive (EU) 2022/2555 on measures for a high common level of cybersecurity (NIS2)',
        publisher: 'Official Journal of the European Union',
        date: '2022',
      },
    ],
    relatedCapabilitySlugs: [
      'platform/repository',
      'platform/impact-analysis',
      'platform/governance-workflow',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY INDUSTRY',
        heading: 'Critical infrastructure has to be able to show its dependencies',
        lead:
          'Energy and utility operators sit squarely in NIS2 scope, run operational technology alongside IT, and answer to regulators who ask what fails if this fails.',
        ctas: [
          { label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' },
          { label: 'NIS2 IN DETAIL', href: '/solutions/nis2', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT IS DIFFERENT HERE',
        heading: 'OT and IT in the same model, or neither is complete',
        lead:
          'Grid and plant systems are usually documented separately from corporate IT. The dependencies between them are exactly where the risk sits.',
        image: {
          placeholder:
            'PHOTO — Utility control room operators at work, real environment, diverse, candid, not staged',
        },
        items: [
          {
            title: 'One estate, both worlds',
            text:
              'Operational and information technology modelled as related objects, so cross-domain dependencies are visible.',
          },
          {
            title: 'Essential services identified',
            text:
              'Model which services bring you into scope, and which suppliers and systems support them.',
          },
          {
            title: 'Incident obligations traceable',
            text:
              'When something fails, trace the affected essential services and the resulting reporting duties.',
          },
          {
            title: 'Assets with long lives',
            text:
              'Versioning suits infrastructure that stays in service for decades and changes incrementally.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'PROOF',
        heading: 'What operators use it for',
        features: [
          {
            title: 'NIS2 scoping and evidence',
            description:
              'Determine scope, attach the required measures to real processes, and evidence oversight.',
            linkLabel: 'NIS2',
            href: '/solutions/nis2',
          },
          {
            title: 'Supplier dependency mapping',
            description:
              'See which essential services rest on which suppliers, and where concentration sits.',
          },
          {
            title: 'Change impact on operations',
            description:
              'Assess a proposed change against the operational processes and controls it touches.',
            linkLabel: 'Impact analysis',
            href: '/platform/impact-analysis',
          },
          {
            title: 'Published to the people on shift',
            description:
              'Role-based views reach control-room and field staff, not just head office.',
            linkLabel: 'Publishing',
            href: '/platform/publishing',
          },
        ],
      },
      demoCta(
        'Bring one essential service',
        'We will model it end to end — systems, suppliers, controls — and you can see the shape of the work.',
      ),
    ],
  },

  {
    title: 'Manufacturing',
    slug: 'solutions/manufacturing',
    pageType: 'solutionIndustry',
    seo: {
      metaTitle: 'Enterprise architecture for manufacturing',
      metaDescription:
        'Quality management, multi-site operations and supply-chain dependency — one management system published to the shop floor as well as the office.',
    },
    authorship: {
      authorName: 'Anne Sofie Dahl',
      authorRole: 'Lead Process Consultant, QualiWare',
      authorCredentials: 'BPMN 2.0 · 12 years in process architecture and quality management',
      lastReviewed: '2026-04-21',
      experienceNote:
        'Based on management-system work with Nordic manufacturers, including multi-site groups standardising processes without flattening local practice.',
    },
    relatedCapabilitySlugs: [
      'platform/process-modelling',
      'platform/publishing',
      'platform/qualiware-go',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY INDUSTRY',
        heading: 'A management system the shop floor can actually use',
        lead:
          'Manufacturing quality systems fail in a specific way: they satisfy the auditor and never reach the person at the machine. Multi-site groups fail twice, once per site.',
        ctas: [{ label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' }],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT IS DIFFERENT HERE',
        heading: 'Standardise without pretending every site is identical',
        lead:
          'Group processes have to be common enough to certify and local enough to follow. Modelling that properly beats mandating one procedure everywhere.',
        image: {
          placeholder:
            'PHOTO — Production staff consulting a work instruction on a tablet on the factory floor, diverse, candid',
        },
        items: [
          {
            title: 'Group process, local variant',
            text:
              'Model a common process with site-specific variants, rather than maintaining separate systems per plant.',
          },
          {
            title: 'Reaches people without desks',
            text:
              'QualiWare Go puts current work instructions in front of production staff on mobile.',
          },
          {
            title: 'Quality obligations attached',
            text:
              'ISO 9001 and customer-specific requirements sit on the processes that satisfy them.',
          },
          {
            title: 'Supply chain modelled',
            text:
              'Suppliers and components relate to the processes and products depending on them.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'PROOF',
        heading: 'Manufacturers in the customer base',
        features: [
          {
            title: 'FOSS, KK Wind and others',
            description:
              'Nordic manufacturers running their management systems in QualiWare.',
          },
          {
            title: 'Mobile access as standard',
            description:
              'The same published system on the floor and in the office.',
            linkLabel: 'QualiWare Go',
            href: '/platform/qualiware-go',
          },
          {
            title: 'Audit evidence without the scramble',
            description:
              'Approvals recorded as work happens, so certification is a retrieval task.',
          },
          {
            title: 'Change that reaches production',
            description:
              'A revised procedure republishes to every site that uses it, with its approval date visible.',
          },
        ],
      },
      demoCta(
        'Bring a work instruction',
        'We will publish it and show what a production operator would see on a phone.',
      ),
    ],
  },

  {
    title: 'Life sciences',
    slug: 'solutions/life-sciences',
    pageType: 'solutionIndustry',
    seo: {
      metaTitle: 'Enterprise architecture for life sciences',
      metaDescription:
        'Regulated processes, validated systems and inspection readiness — modelled so the quality system and the IT estate tell the same story.',
    },
    authorship: {
      authorName: 'Anne Sofie Dahl',
      authorRole: 'Lead Process Consultant, QualiWare',
      authorCredentials: 'BPMN 2.0 · 12 years in process architecture and quality management',
      reviewerName: 'Lars Bek Jensen',
      reviewerRole: 'Head of Compliance Practice, QualiWare',
      lastReviewed: '2026-06-09',
      experienceNote:
        'Drawn from quality-system engagements with life sciences organisations where the binding constraint was demonstrating control of change, not documenting the process.',
    },
    relatedCapabilitySlugs: [
      'platform/governance-workflow',
      'platform/process-modelling',
      'platform/information-architecture',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'iceBlue',
        eyebrow: 'BY INDUSTRY',
        heading: 'Inspection readiness as a standing state',
        lead:
          'In regulated life sciences the question is rarely whether a process is documented. It is whether you can demonstrate control of change over it, on the day an inspector asks.',
        ctas: [{ label: 'GET A DEMO', href: '/pricing#demo', style: 'solid' }],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT IS DIFFERENT HERE',
        heading: 'Controlled change is the whole game',
        lead:
          'Validated systems and regulated processes need an auditable history of who changed what, when, and who approved it — not a current-state diagram.',
        image: {
          placeholder:
            'PHOTO — Laboratory and quality staff reviewing a procedure together, real environment, diverse, candid',
        },
        items: [
          {
            title: 'Approval history preserved',
            text:
              'Every published version carries its reviewer, approver and date, retained as the model evolves.',
          },
          {
            title: 'Validated systems modelled',
            text:
              'Applications carry validation status and the processes relying on them, so revalidation scope is traceable.',
          },
          {
            title: 'Data integrity in scope',
            text:
              'Information objects record classification and handling, connecting records obligations to real systems.',
          },
          {
            title: 'One system, several regimes',
            text:
              'Quality, information security and privacy obligations attach to the same processes without duplicate documentation.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'PROOF',
        heading: 'Where it holds up',
        features: [
          {
            title: 'Change control with teeth',
            description:
              'Governance workflow enforces review and approval before publication.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'Traceable revalidation scope',
            description:
              'When a system changes, identify the processes and records that require reassessment.',
          },
          {
            title: 'ISO 27001 certified vendor',
            description:
              'Relevant to supplier assessment during qualification.',
            linkLabel: 'Certifications',
            href: '/platform/certifications',
          },
          {
            title: 'Hosting to suit validation',
            description:
              'Cloud, sovereign or on-premise, chosen to fit your validation strategy.',
            linkLabel: 'Hosting options',
            href: '/platform/hosting',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Bring a change-control scenario',
        text:
          'QualiWare helps you evidence control of change. Validation and regulatory decisions remain yours — this is not regulatory advice.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  },
]

/* ------------------------------------------------------------------ *
 * The four-question router teased in the SOLUTIONS promo panel
 * ------------------------------------------------------------------ */

const router: SeedPage = {
  title: 'Find your starting point',
  slug: 'solutions/find-your-starting-point',
  pageType: 'standard',
  seo: {
    metaTitle: 'Find your starting point',
    metaDescription:
      'Four questions to work out which discipline pays back fastest for your organisation — and what a realistic first phase looks like.',
  },
  authorship: {
    authorName: 'Mette Holm',
    authorRole: 'Principal Enterprise Architect, QualiWare',
    authorCredentials: 'TOGAF 9 certified · 16 years in enterprise architecture',
    lastReviewed: '2026-06-16',
    experienceNote:
      'The questions below are the four we actually ask in a first conversation, refined across several hundred scoping calls.',
  },
  layout: [
    {
      blockType: 'hero',
      variant: 'iceBlue',
      eyebrow: 'START HERE',
      heading: 'Not sure where to start?',
      lead:
        'Four questions. No score, no gated report — just a recommendation from someone who does this for a living, and an honest answer if the timing is wrong.',
    },
    {
      blockType: 'formBlock',
      eyebrow: 'FOUR QUESTIONS',
      heading: 'Tell us what is forcing the conversation',
      lead:
        'Most organisations arrive with a deadline, an audit finding or a transformation that has stalled. Which is it?',
      expectations: [
        { text: 'A recommendation on which discipline to start with, and why' },
        { text: 'A realistic first phase, in weeks rather than quarters' },
        { text: 'An honest answer if you would be better off waiting' },
      ],
      sideQuote:
        'QualiWare’s average lifetime customer contract duration is 15 years — the longest in the EA tools market.',
      formFields: [
        {
          label: 'What is driving this?',
          name: 'driver',
          fieldType: 'chips',
          width: 'full',
          required: true,
          options: [
            { value: 'A regulatory deadline' },
            { value: 'An audit or inspection finding' },
            { value: 'A transformation programme' },
            { value: 'Replacing a tool we have outgrown' },
          ],
        },
        {
          label: 'Where does it hurt most today?',
          name: 'painPoint',
          fieldType: 'select',
          width: 'full',
          required: true,
          options: [
            { value: 'Nobody trusts our documentation' },
            { value: 'We cannot answer impact questions' },
            { value: 'Compliance evidence is assembled by hand' },
            { value: 'Our management system is not read' },
            { value: 'We do not know what we run' },
          ],
        },
        {
          label: 'How many people would maintain the model?',
          name: 'teamSize',
          fieldType: 'select',
          width: 'half',
          required: true,
          options: [
            { value: 'One or two' },
            { value: 'A small team (3–10)' },
            { value: 'A distributed community (10+)' },
            { value: 'We have not decided' },
          ],
        },
        {
          label: 'When does something have to be in place?',
          name: 'timeline',
          fieldType: 'select',
          width: 'half',
          required: true,
          options: [
            { value: 'Within three months' },
            { value: 'This year' },
            { value: 'Next budget cycle' },
            { value: 'Exploring only' },
          ],
        },
        { label: 'Work email', name: 'email', fieldType: 'email', width: 'half', required: true },
        { label: 'Organisation', name: 'company', fieldType: 'text', width: 'half', required: true },
        {
          label: 'Anything else we should know?',
          name: 'message',
          fieldType: 'textarea',
          width: 'full',
        },
      ],
      submitLabel: 'SHOW MY STARTING POINT',
      privacyNote:
        'We use this to prepare the conversation and nothing else. No newsletter signup, no reselling, and we will not call you if you ask us not to.',
    },
  ],
}

export const solutionPages: SeedPage[] = [...disciplines, ...industries, router]
