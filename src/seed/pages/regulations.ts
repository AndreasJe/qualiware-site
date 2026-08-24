/**
 * Seed content — regulation pages (`pageType: 'solutionRegulation'`).
 *
 * Buyers arrive with a deadline, not a discipline, so the `regulation` group is
 * the reason these pages exist: instrument, dates, scope, penalty and a
 * requirements table with a real article reference and an evidence line per row.
 * `src/components/PageShell/RegulationFacts.tsx` renders all of that *above* the
 * blocks below, so no block repeats it.
 *
 * Citation discipline (see ARCHETYPES.md, "E-E-A-T"):
 *   - Every page cites the actual legal instrument.
 *   - No `url` is invented. Where the exact link is not known the citation
 *     carries `label`, `publisher` and `date` only.
 *   - Dates, thresholds and penalty ceilings that vary by member state or by
 *     entity classification are described as varying, never as a single number.
 *   - Every page states plainly that QualiWare evidences compliance rather than
 *     conferring it, and that nothing here is legal advice.
 *
 * Pure data. No payload import, no database connection, no executable script.
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
  regulation?: Page['regulation']
  relatedCapabilitySlugs?: string[]
  layout: Layout
}

/** The same standing reviewer signs off the three EU-instrument pages. */
const euReviewer = {
  reviewerName: 'Lars Bek Jensen',
  reviewerRole: 'Head of Compliance Practice, QualiWare',
}

/** Repeated verbatim on every regulation page — a Trustworthiness signal. */
const NOT_LEGAL_ADVICE =
  'QualiWare is a modelling and repository platform. It helps you evidence compliance — it does not make you compliant, and nothing on this page is legal advice. Scope, dates and sanctions must be confirmed against the instrument in force for your organisation, with your own counsel or supervisor.'

export const regulationPages: SeedPage[] = [
  /* ================================================================== *
   * NIS2 — Directive (EU) 2022/2555
   * ================================================================== */
  {
    title: 'NIS2 — evidence the measures, not just the intent',
    slug: 'solutions/nis2',
    pageType: 'solutionRegulation',
    seo: {
      metaTitle: 'NIS2 compliance evidence | QualiWare',
      metaDescription:
        'NIS2 (Directive (EU) 2022/2555) has applied through national law since the 17 October 2024 transposition deadline. What it requires, and how to evidence it.',
    },
    authorship: {
      authorName: 'Mette Holm',
      authorRole: 'Principal Compliance Architect, QualiWare',
      authorCredentials: 'CISA · TOGAF 9 certified · 14 years in enterprise architecture and GRC',
      ...euReviewer,
      lastReviewed: '2026-06-15',
      experienceNote:
        'Based on 40+ NIS2 scoping workshops with Nordic energy, health, water and public-sector entities since January 2023.',
    },
    sources: [
      {
        label:
          'Directive (EU) 2022/2555 (NIS2) — measures for a high common level of cybersecurity across the Union',
        publisher: 'Official Journal of the European Union',
        date: 'December 2022',
      },
      {
        label: 'Directive (EU) 2016/1148 (the original NIS Directive), repealed by NIS2',
        publisher: 'Official Journal of the European Union',
        date: 'July 2016',
      },
      {
        label:
          'ISO/IEC 27001:2022 — the control framework most of the NIS2 programmes we see are built on',
        publisher: 'International Organization for Standardization',
        date: 'October 2022',
      },
    ],
    regulation: {
      instrument: 'Directive (EU) 2022/2555 (NIS2), repealing Directive (EU) 2016/1148',
      inForceSince: '16 January 2023',
      deadline:
        '17 October 2024 — the member-state transposition deadline. NIS2 binds entities through national law, so the applicable dates, scope thresholds and registration duties differ by country.',
      appliesTo:
        'Medium-sized and large entities operating in the sectors listed in Annexes I and II — among them energy, transport, banking, financial market infrastructure, health, drinking and waste water, digital infrastructure, ICT service management, public administration and space, plus postal and courier services, waste management, chemicals, food, certain manufacturing, digital providers and research. Whether an entity is "essential" or "important" follows size criteria and national designation, and some entities are in scope regardless of size.',
      penalty:
        'Administrative fines are set in national transposing law, with different ceilings for essential and important entities, and NIS2 additionally provides for accountability of the management body. There is no single EU figure — check the ceilings in your own transposition.',
      requirements: [
        {
          requirement: 'Cybersecurity risk-management measures, appropriate and proportionate to risk',
          evidence:
            'An approved risk-management framework that names the network and information systems in scope, the services they support, and an owner for each. An auditor will trace a measure back to the risk that justifies it.',
          article: 'Art. 21(1)',
        },
        {
          requirement: 'Policies on risk analysis and information system security',
          evidence:
            'A current policy set with approval date, version history and a named owner per policy, plus traceability from each policy to the processes and assets it actually governs.',
          article: 'Art. 21(2)(a)',
        },
        {
          requirement: 'Incident handling',
          evidence:
            'A documented incident-handling procedure with roles assigned, and records of real incidents showing detection, classification and the decisions taken.',
          article: 'Art. 21(2)(b)',
        },
        {
          requirement: 'Business continuity, backup management, disaster recovery and crisis management',
          evidence:
            'Continuity and recovery plans linked to the specific critical services they protect, with dated test records and the remediation that followed each test.',
          article: 'Art. 21(2)(c)',
        },
        {
          requirement: 'Supply-chain security, including security-related aspects of supplier relationships',
          evidence:
            'A register of suppliers and service providers mapped to the services they support, the security requirements imposed on each, and the assessment behind the relationship.',
          article: 'Art. 21(2)(d)',
        },
        {
          requirement:
            'Incident notification — early warning within 24 hours, incident notification within 72 hours',
          evidence:
            'A notification workflow with timestamps that demonstrate the 24-hour and 72-hour steps were met, and copies of what was submitted to the CSIRT or competent authority.',
          article: 'Art. 23(4)',
        },
        {
          requirement: 'Management-body approval, oversight and training',
          evidence:
            'Minutes showing the management body approved the risk-management measures and reviewed their adequacy, plus dated training records for its members.',
          article: 'Art. 20',
        },
      ],
    },
    relatedCapabilitySlugs: [
      'platform/repository',
      'platform/impact-analysis',
      'platform/governance-workflow',
      'platform/application-portfolio-management',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'navy',
        eyebrow: 'BY REGULATION · NIS2',
        heading: 'You do not have a NIS2 problem. You have an evidence problem.',
        lead:
          'Most organisations already run the measures Article 21 asks for. What they cannot do on demand is show which system, which supplier and which process each measure covers — and who approved it. That gap is what a competent authority finds.',
        ctas: [
          { label: 'SEE A NIS2 EVIDENCE MODEL', href: '/pricing#demo', style: 'neon' },
          { label: 'GOVERNANCE, RISK & COMPLIANCE', href: '/solutions/grc', style: 'outline' },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'FROM OBLIGATION TO ARTEFACT',
        heading: 'What each Article 21 measure looks like when it is modelled',
        features: [
          {
            title: 'Scope you can defend',
            description:
              'The entities, services, systems and locations in scope held as objects rather than a spreadsheet, so a change of scope is a change to the model — not a re-write.',
            linkLabel: 'Ontology-driven repository',
            href: '/platform/repository',
          },
          {
            title: 'Measures linked to the risk that justifies them',
            description:
              'Each control attached to the risk, the asset and the process it addresses. The question "why this control here" has an answer in the model.',
            linkLabel: 'Impact analysis & traceability',
            href: '/platform/impact-analysis',
          },
          {
            title: 'Supplier relationships as first-class objects',
            description:
              'Suppliers linked to the services and systems they touch, so Article 21(2)(d) is answered from the same model as the rest of the programme.',
            linkLabel: 'Application Portfolio Management',
            href: '/platform/application-portfolio-management',
          },
          {
            title: 'Approvals with dates and names',
            description:
              'Review and approval handled as workflow, which is what makes Article 20 management-body accountability demonstrable rather than asserted.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'A reporting clock you can prove you met',
            description:
              'Incident workflow with timestamped states, so the 24-hour early warning and 72-hour notification leave a record rather than an inbox thread.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'Continuity plans tied to the services they protect',
            description:
              'Recovery plans, test dates and findings held against the critical service, so an examiner can walk from service to plan to last test.',
            linkLabel: 'Ontology-driven repository',
            href: '/platform/repository',
          },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT CHANGES',
        heading: 'Before the model, and after it',
        lead:
          'NIS2 is transposed differently in every member state, so the one thing worth building is the thing every transposition asks for: a traceable link from obligation to control to owner to evidence.',
        image: {
          placeholder:
            'PHOTO · Utility or hospital operations room, screens showing real dashboards — candid, diverse, not staged',
        },
        items: [
          {
            title: 'From annual questionnaire to a standing model',
            text:
              'The scoping exercise stops being an annual project and becomes the current state of the repository, queried whenever an authority, an insurer or a customer asks.',
          },
          {
            title: 'From "we have a policy" to "here is what it governs"',
            text:
              'A policy document proves intent. A policy linked to the processes and systems it applies to proves coverage — and shows the gaps honestly.',
          },
          {
            title: 'From duplicated control libraries to one set of controls',
            text:
              'Entities in scope of NIS2 are usually also running ISO 27001, and sometimes DORA. Mapped once in a shared model, one control answers several frameworks.',
          },
          {
            title: 'What this page is not',
            text: NOT_LEGAL_ADVICE,
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Bring your own Article 21 gap list',
        text:
          '45 minutes with a compliance architect, on your own scope. We model two of your measures end to end — obligation, control, owner, evidence — and you keep the model.',
        ctaLabel: 'BOOK A SESSION',
        ctaHref: '/pricing#demo',
      },
    ],
  },

  /* ================================================================== *
   * DORA — Regulation (EU) 2022/2554
   * ================================================================== */
  {
    title: 'DORA — operational resilience you can show, not assert',
    slug: 'solutions/dora',
    pageType: 'solutionRegulation',
    seo: {
      metaTitle: 'DORA compliance evidence | QualiWare',
      metaDescription:
        'DORA (Regulation (EU) 2022/2554) has applied to EU financial entities since 17 January 2025. What each chapter requires, and the evidence supervisors expect.',
    },
    authorship: {
      authorName: 'Søren Dahl-Nielsen',
      authorRole: 'Lead Consultant, Financial Services Practice, QualiWare',
      authorCredentials: 'CISM · 11 years in ICT risk and outsourcing governance in banking and insurance',
      ...euReviewer,
      lastReviewed: '2026-07-06',
      experienceNote:
        'Based on 18 DORA readiness assessments with banks, insurers and payment institutions since March 2024, including six register-of-information builds.',
    },
    sources: [
      {
        label:
          'Regulation (EU) 2022/2554 (DORA) — digital operational resilience for the financial sector',
        publisher: 'Official Journal of the European Union',
        date: 'December 2022',
      },
      {
        label: 'Directive (EU) 2022/2556 — the accompanying directive amending related financial services directives',
        publisher: 'Official Journal of the European Union',
        date: 'December 2022',
      },
      {
        label:
          'Regulatory and implementing technical standards developed under DORA, including those on the register of information and on major incident reporting',
        publisher: 'European Banking Authority, EIOPA and ESMA (the ESAs)',
        date: 'Accessed August 2026',
      },
    ],
    regulation: {
      instrument: 'Regulation (EU) 2022/2554 (DORA)',
      inForceSince: '16 January 2023',
      deadline:
        '17 January 2025 — the date from which the Regulation applies. As a regulation it applies directly, without transposition, though technical standards and national supervisory expectations continue to develop.',
      appliesTo:
        'Financial entities as defined in the Regulation — among them credit institutions, payment and electronic money institutions, investment firms, crypto-asset service providers, insurance and reinsurance undertakings and intermediaries, pension institutions, credit rating agencies and various market infrastructures — together with the ICT third-party service providers that serve them. Proportionality applies: some smaller entities follow a simplified ICT risk-management framework, and ICT providers designated critical fall under a separate EU oversight framework.',
      penalty:
        'Supervisory powers, administrative penalties and remedial measures sit with national competent authorities and differ by entity type and member state; designated critical ICT third-party providers may face periodic penalty payments under the EU oversight framework. Confirm the applicable regime with your own supervisor rather than working from a single figure.',
      requirements: [
        {
          requirement: 'An internal governance and ICT risk-management framework, reviewed periodically',
          evidence:
            'The documented framework, the management-body approval record, and evidence of at least annual review — including what the review changed.',
          article: 'Ch. II, Art. 5–6',
        },
        {
          requirement:
            'Identification of ICT-supported business functions, information assets and their dependencies',
          evidence:
            'A maintained inventory linking business functions to the information and ICT assets that support them, with criticality assessed and dependencies — internal and third-party — mapped.',
          article: 'Art. 8',
        },
        {
          requirement: 'ICT-related incident management, classification and reporting of major incidents',
          evidence:
            'The incident process with its classification criteria, records showing how individual incidents were classified, and the initial, intermediate and final reports submitted to the competent authority.',
          article: 'Ch. III, Art. 17–19',
        },
        {
          requirement: 'A digital operational resilience testing programme, risk-based and proportionate',
          evidence:
            'The test plan and its risk basis, dated results, findings, remediation and closure. Entities identified for advanced testing must additionally evidence threat-led penetration testing.',
          article: 'Ch. IV, Art. 24–26',
        },
        {
          requirement: 'A register of information on all contractual arrangements with ICT third-party providers',
          evidence:
            'The maintained register, kept at entity and — where relevant — sub-consolidated and consolidated level, distinguishing arrangements that support critical or important functions, and reportable to the competent authority on request.',
          article: 'Ch. V, Art. 28(3)',
        },
        {
          requirement:
            'Contractual provisions for ICT services supporting critical or important functions, with exit strategies',
          evidence:
            'A clause-coverage matrix per contract, the pre-contractual assessment including concentration risk, and a documented, tested exit plan per critical arrangement.',
          article: 'Art. 28(8) and Art. 30',
        },
        {
          requirement: 'Management-body responsibility for ICT risk',
          evidence:
            'Board minutes recording approval and periodic review of the framework, defined roles and reporting lines, and dated records of the ICT risk training the management body received.',
          article: 'Art. 5(2)',
        },
      ],
    },
    relatedCapabilitySlugs: [
      'platform/application-portfolio-management',
      'platform/impact-analysis',
      'platform/repository',
      'platform/governance-workflow',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'navy',
        eyebrow: 'BY REGULATION · DORA',
        heading: 'The register of information is a modelling problem wearing a reporting deadline',
        lead:
          'Chapter V asks which contractual arrangements support which critical or important functions. Answering that once is a spreadsheet exercise. Answering it every time it changes, consistently, at consolidated level, is a repository.',
        ctas: [
          { label: 'SEE THE REGISTER MODELLED', href: '/pricing#demo', style: 'neon' },
          { label: 'SOLUTIONS FOR FINANCE', href: '/solutions/finance', style: 'outline' },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'CHAPTER BY CHAPTER',
        heading: 'Where each DORA obligation lands in the model',
        features: [
          {
            title: 'Ch. II — the ICT risk framework, connected to reality',
            description:
              'The framework held against the assets, functions and providers it governs, so a periodic review can be evidenced as a change to the model rather than a re-issued PDF.',
            linkLabel: 'Ontology-driven repository',
            href: '/platform/repository',
          },
          {
            title: 'Art. 8 — functions, assets and dependencies in one place',
            description:
              'Business functions linked to applications, data and infrastructure, with criticality carried as a property. This is the layer everything else in DORA reads from.',
            linkLabel: 'Application Portfolio Management',
            href: '/platform/application-portfolio-management',
          },
          {
            title: 'Ch. III — classification decisions that survive review',
            description:
              'Incident records tied to the affected function and provider, so severity classification can be re-derived and defended months later.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'Ch. IV — testing scoped from criticality, not from habit',
            description:
              'Test coverage assessed against the critical or important functions in the model, which turns "is our testing programme risk-based" into a query.',
            linkLabel: 'Impact analysis & traceability',
            href: '/platform/impact-analysis',
          },
          {
            title: 'Ch. V — the register generated, not maintained by hand',
            description:
              'Contracts, providers, subcontracting chains and the functions they support as related objects, reported at entity or consolidated level from a single source.',
            linkLabel: 'Impact analysis & traceability',
            href: '/platform/impact-analysis',
          },
          {
            title: 'Concentration and exit questions answered by traversal',
            description:
              'Because dependencies are modelled rather than described, "what breaks if this provider fails" and "what does the exit plan cover" are the same walk through the graph.',
            linkLabel: 'Impact analysis & traceability',
            href: '/platform/impact-analysis',
          },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT CHANGES',
        heading: 'Resilience that reads the same in every submission',
        lead:
          'DORA has applied since January 2025, so the question is no longer readiness but repeatability: can you produce the same answer, from the same source, every reporting cycle and to every supervisor.',
        image: {
          placeholder:
            'PHOTO · Bank or insurer operations floor, two colleagues at a shared screen — candid, diverse, not staged',
        },
        items: [
          {
            title: 'One dependency map, several obligations',
            text:
              'The function-to-asset-to-provider map feeds the register, incident classification, testing scope and continuity planning. Built once, it stops four teams disagreeing.',
          },
          {
            title: 'Consolidated reporting without consolidation projects',
            text:
              'Group, sub-consolidated and entity views derived from the same repository, rather than reconciled from separate submissions each cycle.',
          },
          {
            title: 'Third-party risk that keeps up with subcontracting',
            text:
              'Provider chains modelled as relationships, so a change of subcontractor is visible in the functions it affects instead of surfacing at the next audit.',
          },
          {
            title: 'What this page is not',
            text: NOT_LEGAL_ADVICE,
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Bring one critical function and its providers',
        text:
          '45 minutes with a financial-services consultant. We model one critical or important function, its ICT dependencies and its third-party arrangements, and show what the register entry looks like when it is derived.',
        ctaLabel: 'BOOK A SESSION',
        ctaHref: '/pricing#demo',
      },
    ],
  },

  /* ================================================================== *
   * CSRD — Directive (EU) 2022/2464 + ESRS
   * ================================================================== */
  {
    title: 'CSRD — a reporting trail an assurance provider can walk',
    slug: 'solutions/csrd',
    pageType: 'solutionRegulation',
    seo: {
      metaTitle: 'CSRD & ESRS reporting evidence | QualiWare',
      metaDescription:
        'CSRD (Directive (EU) 2022/2464) requires sustainability reporting under the ESRS, but scope and timing have been amended. What it requires, and how to evidence it.',
    },
    authorship: {
      authorName: 'Anne Kirkegaard',
      authorRole: 'Lead Consultant, Sustainability & Reporting, QualiWare',
      authorCredentials: 'MSc Environmental Management · 9 years in non-financial and integrated reporting',
      ...euReviewer,
      lastReviewed: '2026-05-18',
      experienceNote:
        'Based on 22 CSRD data-lineage workshops with reporting, finance and IT teams since September 2023, and four dry-run assurance walkthroughs.',
    },
    sources: [
      {
        label: 'Directive (EU) 2022/2464 (CSRD) — corporate sustainability reporting',
        publisher: 'Official Journal of the European Union',
        date: 'December 2022',
      },
      {
        label:
          'Commission Delegated Regulation (EU) 2023/2772 — the first set of European Sustainability Reporting Standards (ESRS)',
        publisher: 'Official Journal of the European Union',
        date: 'December 2023',
      },
      {
        label:
          'The 2025 "stop-the-clock" amending directive deferring certain CSRD reporting waves and transposition dates, and the continuing Omnibus simplification proposals',
        publisher: 'Official Journal of the European Union / European Commission',
        date: '2025',
      },
      {
        label: 'Directive 2013/34/EU (the Accounting Directive), as amended by CSRD',
        publisher: 'Official Journal of the European Union',
        date: 'June 2013',
      },
    ],
    regulation: {
      instrument:
        'Directive (EU) 2022/2464 (CSRD), amending the Accounting, Transparency and Audit directives; reporting content set by the ESRS in Commission Delegated Regulation (EU) 2023/2772',
      inForceSince:
        'January 2023, twenty days after publication in the Official Journal; applied through national transposing law',
      deadline:
        'Phased, and amended since adoption. The first wave reported on financial year 2024, but the scope and timing of later waves were deferred by the 2025 "stop-the-clock" amendment and remain subject to the Omnibus simplification process. Confirm your own first reporting year against the law currently in force in your member state — do not plan from the original 2022 sequence.',
      appliesTo:
        'Large undertakings and listed companies in the EU, with certain non-EU parent undertakings brought in through their significant EU activity. Both the size thresholds and the order of the reporting waves have been amended since adoption, so in-scope status and first reporting year must be confirmed against the current national transposition rather than the original directive text.',
      penalty:
        'Enforcement is national. Sanctions for failure to report, and the consequences of a qualified or adverse assurance conclusion, are set by each member state in its transposing law; there is no single EU penalty figure.',
      requirements: [
        {
          requirement: 'Report sustainability information in accordance with the ESRS',
          evidence:
            'Each ESRS disclosure requirement mapped to its datapoints, and each datapoint mapped to a source system, a preparer and an approver. Gaps documented as gaps.',
          article: 'Delegated Reg. (EU) 2023/2772',
        },
        {
          requirement: 'Double materiality assessment — impact materiality and financial materiality',
          evidence:
            'The documented process, the stakeholders consulted, the impacts, risks and opportunities identified, and the reasoning for every inclusion and exclusion. Assurance providers test the reasoning, not just the conclusion.',
          article: 'ESRS 1 · ESRS 2 IRO-1',
        },
        {
          requirement: 'Governance, strategy and business-model disclosures',
          evidence:
            'Descriptions of the administrative, management and supervisory bodies’ role in sustainability matters that reconcile to the actual governance structure, committee terms of reference and decision records.',
          article: 'ESRS 2 (GOV, SBM)',
        },
        {
          requirement: 'Value-chain information, upstream and downstream',
          evidence:
            'A mapped value chain, the boundary applied, and documentation of every estimate or proxy used where primary data was unavailable — including its limitations.',
          article: 'ESRS 1, §5',
        },
        {
          requirement: 'Sustainability statement presented in the management report',
          evidence:
            'The consolidated management report showing the sustainability statement in the required section, with the sign-off record of the responsible body.',
          article: 'Art. 19a / Art. 29a',
        },
        {
          requirement: 'Digital tagging of the sustainability statement',
          evidence:
            'The report in the single electronic reporting format, plus the mapping from each tagged datapoint back to the source it was derived from.',
          article: 'Art. 29d',
        },
        {
          requirement: 'Assurance over the sustainability statement',
          evidence:
            'A per-datapoint audit trail — source, transformation, control, approval, version — that an assurance provider can walk without a guided tour from the reporting team.',
          article: 'Art. 34 (as amended)',
        },
      ],
    },
    relatedCapabilitySlugs: [
      'platform/information-architecture',
      'platform/governance-workflow',
      'platform/publishing',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'navy',
        eyebrow: 'BY REGULATION · CSRD',
        heading: 'The hard part of CSRD is not the disclosure. It is the lineage.',
        lead:
          'An ESRS datapoint arrives from a system, gets transformed, gets approved, and lands in the management report. Assurance follows that chain backwards. If the chain lives in email and spreadsheets, the assurance conversation becomes an archaeology project.',
        ctas: [
          { label: 'SEE ESRS LINEAGE MODELLED', href: '/pricing#demo', style: 'neon' },
          { label: 'INFORMATION ARCHITECTURE', href: '/platform/information-architecture', style: 'outline' },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'FROM DISCLOSURE TO DATAPOINT',
        heading: 'What a reporting model has to hold',
        features: [
          {
            title: 'Datapoints with an owner and a source of record',
            description:
              'Every ESRS datapoint modelled as an information object: where it comes from, who prepares it, who approves it, and which disclosure requirement it answers.',
            linkLabel: 'Information Architecture',
            href: '/platform/information-architecture',
          },
          {
            title: 'The materiality assessment as a durable artefact',
            description:
              'Impacts, risks and opportunities held against the processes, sites and value-chain segments they arise in, so next year’s assessment starts from this year’s reasoning.',
            linkLabel: 'Ontology-driven repository',
            href: '/platform/repository',
          },
          {
            title: 'Value chain mapped, not described',
            description:
              'Upstream and downstream relationships as model objects, which makes the reporting boundary explicit and estimates traceable to the gap that forced them.',
            linkLabel: 'Impact analysis & traceability',
            href: '/platform/impact-analysis',
          },
          {
            title: 'Approval that leaves a record',
            description:
              'Preparer, reviewer and approver as workflow states with dates, so the control environment around a datapoint is evidence rather than recollection.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'Governance disclosures that reconcile',
            description:
              'Committee structures, mandates and responsibilities held in the same model as the processes they oversee — so ESRS 2 governance text matches how the organisation actually decides.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'One published view for everyone who asks',
            description:
              'Reporting definitions and methodology published to a read-only portal, so preparers across sites work from the same definition of the same metric.',
            linkLabel: 'Publishing & the web portal',
            href: '/platform/publishing',
          },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT CHANGES',
        heading: 'Built to survive an amendment',
        lead:
          'CSRD scope and timing have already been changed once, and further simplification is in progress. A reporting model organised around datapoints and their lineage absorbs that; a model organised around this year’s report template does not.',
        image: {
          placeholder:
            'PHOTO · Sustainability and finance colleagues reviewing data on a laptop in an office — candid, diverse, not staged',
        },
        items: [
          {
            title: 'From report-cycle scramble to a standing data model',
            text:
              'The mapping from disclosure requirement to datapoint to source system persists between cycles, so a deferred wave becomes extra time rather than a re-start.',
          },
          {
            title: 'From two versions of the truth to one',
            text:
              'Sustainability, finance and IT working from the same definitions and the same lineage removes the reconciliation that eats the last four weeks before filing.',
          },
          {
            title: 'From assurance interviews to an audit trail',
            text:
              'Assurance providers test controls and provenance. Modelled lineage lets them sample without a workshop for every question.',
          },
          {
            title: 'What this page is not',
            text: NOT_LEGAL_ADVICE,
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Bring three ESRS datapoints you cannot yet trace',
        text:
          '45 minutes with a sustainability reporting consultant. We model the lineage for three of your own datapoints — source, transformation, control, approval — and you keep the model.',
        ctaLabel: 'BOOK A SESSION',
        ctaHref: '/pricing#demo',
      },
    ],
  },

  /* ================================================================== *
   * ISO/IEC 27001:2022
   * ================================================================== */
  {
    title: 'ISO/IEC 27001:2022 — an ISMS your auditor can navigate',
    slug: 'solutions/iso-27001',
    pageType: 'solutionRegulation',
    seo: {
      metaTitle: 'ISO/IEC 27001:2022 ISMS evidence | QualiWare',
      metaDescription:
        'ISO/IEC 27001:2022 restructured Annex A into four themes, and the 2013 transition has closed. The clause requirements, and the evidence auditors expect.',
    },
    authorship: {
      authorName: 'Tomas Halvorsen',
      authorRole: 'Principal Consultant, Information Security, QualiWare',
      authorCredentials: 'ISO/IEC 27001 Lead Auditor · CISSP · 13 years implementing management systems',
      reviewerName: 'Ingrid Solberg',
      reviewerRole: 'Head of Information Security & Certifications, QualiWare',
      lastReviewed: '2026-04-27',
      experienceNote:
        'Based on 30+ ISMS scoping and internal-audit engagements since October 2022, including QualiWare’s own move to the 2022 edition of the standard.',
    },
    sources: [
      {
        label:
          'ISO/IEC 27001:2022 — Information security, cybersecurity and privacy protection — Information security management systems — Requirements',
        publisher: 'International Organization for Standardization',
        date: 'October 2022',
      },
      {
        label: 'ISO/IEC 27002:2022 — Information security, cybersecurity and privacy protection — Information security controls',
        publisher: 'International Organization for Standardization',
        date: '2022',
      },
      {
        label:
          'IAF mandatory document on the transition arrangements for ISO/IEC 27001:2022 (transition period from publication of the standard)',
        publisher: 'International Accreditation Forum',
        date: '2022',
      },
    ],
    regulation: {
      instrument:
        'ISO/IEC 27001:2022 — Information security management systems — Requirements, with controls elaborated in ISO/IEC 27002:2022',
      inForceSince: 'Published October 2022, superseding ISO/IEC 27001:2013',
      deadline:
        'Certified organisations had a transition period of three years from publication of the 2022 edition, which closed during 2025. Certificates are now issued and maintained against the 2022 edition — confirm your own audit programme dates with your certification body.',
      appliesTo:
        'Any organisation, of any size or sector, that chooses to operate a certified information security management system. Unlike NIS2 or DORA this is a voluntary standard rather than law — but it is routinely a tender and contractual requirement, and it is widely used as the control framework beneath statutory obligations.',
      penalty:
        'None in law — ISO/IEC 27001 is voluntary. The consequences of non-conformity are certification consequences: minor or major nonconformities raised by the certification body, corrective action within set timeframes, and in the worst case suspension or withdrawal of the certificate.',
      requirements: [
        {
          requirement: 'Determine the scope and boundaries of the ISMS',
          evidence:
            'A scope statement naming the organisational units, locations, processes, services and systems included, with interfaces and dependencies identified and any exclusion justified.',
          article: 'Clause 4.3',
        },
        {
          requirement: 'Leadership commitment and an information security policy',
          evidence:
            'An approved policy with date, version and owner, plus evidence that top management assigns roles, responsibilities and resources — and reviews whether they are sufficient.',
          article: 'Clauses 5.1–5.3',
        },
        {
          requirement: 'Information security risk assessment and risk treatment',
          evidence:
            'A documented method with criteria, a risk register with named owners, and treatment decisions traceable to the assets, processes and services at risk. Repeatability is what auditors probe.',
          article: 'Clauses 6.1.2–6.1.3',
        },
        {
          requirement: 'A Statement of Applicability covering the Annex A controls',
          evidence:
            'An SoA listing every Annex A control with the applicability decision, the justification for inclusion or exclusion, and the current implementation status.',
          article: 'Clause 6.1.3 d)',
        },
        {
          requirement: 'Documented information created, updated and controlled',
          evidence:
            'One controlled source for policies, procedures and records, with version history, approval, distribution and retention — not several copies on several drives.',
          article: 'Clause 7.5',
        },
        {
          requirement: 'Inventory and classification of information and other associated assets',
          evidence:
            'An asset inventory with named owners, and classification applied consistently and visible on the assets themselves rather than only in a policy.',
          article: 'Annex A 5.9 · A 5.12',
        },
        {
          requirement: 'Internal audit, management review and continual improvement',
          evidence:
            'An audit programme with results, nonconformities with corrective actions and closure, and dated management review records showing the required inputs and the decisions taken.',
          article: 'Clauses 9.2–9.3 · 10',
        },
      ],
    },
    relatedCapabilitySlugs: [
      'platform/certifications',
      'platform/governance-workflow',
      'platform/publishing',
      'platform/access-control',
    ],
    layout: [
      {
        blockType: 'hero',
        variant: 'navy',
        eyebrow: 'BY REGULATION · ISO/IEC 27001:2022',
        heading: 'Certification is a reading exercise for someone who has never seen your ISMS',
        lead:
          'An auditor arrives with the standard and a sampling plan. What determines the audit is not how good your controls are but how quickly you can show scope, risk, treatment, control and record as one connected chain.',
        ctas: [
          { label: 'SEE AN ISMS MODELLED', href: '/pricing#demo', style: 'neon' },
          { label: 'OUR OWN CERTIFICATIONS', href: '/platform/certifications', style: 'outline' },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'THE 2022 EDITION IN PRACTICE',
        heading: 'What the restructure actually asks of you',
        features: [
          {
            title: 'Annex A in four themes, not fourteen clauses',
            description:
              'The 2022 edition regroups the controls into organisational, people, physical and technological themes. Mapped in a model, re-grouping is a view change rather than a re-write.',
            linkLabel: 'Ontology-driven repository',
            href: '/platform/repository',
          },
          {
            title: 'A Statement of Applicability that stays current',
            description:
              'The SoA derived from the controls in the repository and their implementation status, so it reflects the ISMS on the day of the audit rather than the day it was written.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'Scope you can show at the boundary',
            description:
              'Clause 4.3 scope expressed as the actual units, processes and systems included, with interfaces visible — which is where scoping arguments with auditors normally happen.',
            linkLabel: 'Ontology-driven repository',
            href: '/platform/repository',
          },
          {
            title: 'Risk treatment linked to the asset at risk',
            description:
              'Risks, owners, treatments and controls as connected objects, so clause 6.1 is demonstrated by traversal rather than by cross-referencing three documents.',
            linkLabel: 'Impact analysis & traceability',
            href: '/platform/impact-analysis',
          },
          {
            title: 'Documented information under actual control',
            description:
              'Version, approval, owner and review date on every document, which is the cheapest way to close clause 7.5 findings for good.',
            linkLabel: 'Governance & workflow',
            href: '/platform/governance-workflow',
          },
          {
            title: 'A management system people can read',
            description:
              'Policies and procedures published to a portal with role-based access, so the standard’s awareness and communication requirements are met by people using the system, not by a training slide.',
            linkLabel: 'Publishing & the web portal',
            href: '/platform/publishing',
          },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT CHANGES',
        heading: 'One control set, several audits',
        lead:
          'Most organisations certifying to ISO/IEC 27001 are also answering NIS2, DORA, customer security questionnaires or a sector scheme. The controls overlap heavily; the evidence requests do not have to be answered separately.',
        image: {
          placeholder:
            'PHOTO · Internal auditor and process owner walking through documentation on screen — candid, diverse, not staged',
        },
        items: [
          {
            title: 'From certification project to operating management system',
            text:
              'The ISMS lives where the processes are documented, so surveillance audits sample the live model instead of a binder rebuilt each year.',
          },
          {
            title: 'From control silos to one mapped control library',
            text:
              'A single control mapped to Annex A, to NIS2 Article 21 measures and to customer questionnaire items — implemented once, evidenced many times.',
          },
          {
            title: 'From "who owns this" to a named owner on every object',
            text:
              'Ownership as a property of the asset, risk and control rather than a line in a spreadsheet is what makes internal audit finishable.',
          },
          {
            title: 'What this page is not',
            text: NOT_LEGAL_ADVICE,
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Bring your last audit findings',
        text:
          '45 minutes with a lead auditor. We take two open nonconformities, model the clause, the control and the evidence behind them, and show what closure looks like in a repository.',
        ctaLabel: 'BOOK A SESSION',
        ctaHref: '/pricing#demo',
      },
    ],
  },
]
