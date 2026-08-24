/**
 * Seed content — the two remaining pages on the **partners** tenant
 * (partners.qualiware.com): the programme page and the application page.
 *
 * The partners home page and the directory/integrations stubs live in
 * `src/seed/index.ts`; these two are the pages the partner sub-bar links to
 * that the runner picks up from this module.
 *
 * Pure data. No payload import, no database connection. Tier cards carry no
 * prices — the pricingTable block names tiers and states requirements only.
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

export const partnerTenantPages: SeedPage[] = [
  /* ---- program -------------------------------------------------------- */
  {
    title: 'Partner program',
    slug: 'program',
    pageType: 'standard',
    seo: {
      metaTitle: 'Partner program — QualiWare Partners',
      metaDescription:
        'The QualiWare partner programme: Silver, Gold and Platinum tiers, certification tracks, deal registration, and what each tier requires and returns.',
    },
    authorship: {
      authorName: 'Henrik Aalborg',
      authorRole: 'Head of Partners, QualiWare',
      authorCredentials: 'Twelve years building Nordic and European channel programmes',
      reviewerName: 'Morten Kjær',
      reviewerRole: 'Head of Client Relations, QualiWare',
      lastReviewed: '2026-07-21',
      experienceNote:
        'Written from the programme as it actually ran through 2025 and the first half of 2026, across implementation, consulting, reseller and technology partners in nine countries.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'navy',
        eyebrow: 'PARTNER PROGRAM',
        heading: 'Build a practice on a platform customers keep for fifteen years',
        lead: 'Implementation partners, consultancies, resellers and technology partners — with certification that means something, deal support from a small team, and customers whose programmes expand rather than end at go-live.',
        ctas: [
          { label: 'BECOME A PARTNER', href: '/become-a-partner', style: 'neon' },
          { label: 'BROWSE THE DIRECTORY', href: '/directory', style: 'outline' },
        ],
        stats: [
          { value: '1991', label: 'QualiWare founded in Denmark' },
          { value: '26 years', label: 'Longest continuous customer relationship' },
          { value: '99%', label: 'Annual renewal rate' },
          { value: '3', label: 'Programme tiers' },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHY PARTNER WITH US',
        heading: 'What the programme is actually worth',
        features: [
          {
            title: 'Certification that means something',
            description:
              'Role-based tracks for architects, process consultants and administrators, with exams and refreshers tied to releases rather than to the calendar. Certified consultants are named on your directory profile.',
            linkLabel: 'Certification tracks',
            href: 'https://www.qualiware.com/resources/center-of-excellence',
          },
          {
            title: 'Long engagements, not one-off projects',
            description:
              'Customers expand from one discipline to the next — architecture, then process, then compliance — so advisory work compounds instead of ending at go-live. Renewal across the base runs at 99% a year.',
          },
          {
            title: 'Co-selling with a small team',
            description:
              'Direct access to the people who build the product, not a tiered queue. On registered opportunities you get an architect in the room for the technical conversation.',
          },
          {
            title: 'A platform your clients grow into',
            description:
              'One ontology-driven repository covering EA, process, GRC and the digital twin of an organization means fewer re-platforming conversations and more expansion scope for you.',
          },
          {
            title: 'Public-sector routes already open',
            description:
              'QualiWare is an approved supplier on Danish public framework agreements through SKI, and is ISO 27001 certified — two questions you would otherwise answer in every tender.',
          },
          {
            title: 'Extensions you can publish',
            description:
              'Technology partners build against a documented integration surface and list their extensions in the marketplace, where customers actually look for them.',
            linkLabel: 'Integrations marketplace',
            href: '/integrations',
          },
        ],
      },
      {
        blockType: 'pricingTable',
        heading: 'Programme tiers',
        lead: 'Three tiers, distinguished by certified capacity and commitment rather than by revenue targets alone. You can enter at Silver and move up at any annual review.',
        note: 'No participation fee at Silver. Movement from Silver to Gold is agreed at the annual review, and Platinum is by invitation once the certification and joint-planning requirements are met. Commercial terms, margins and any development funds are set in the partner agreement and the individual order forms, not on this page.',
        tiers: [
          {
            name: 'Silver',
            description:
              'The entry tier. For firms starting a QualiWare practice, or delivering alongside an existing partner on their first engagements.',
            emphasized: false,
            features: [
              { text: 'Two certified consultants required' },
              { text: 'Standard listing in the partner directory' },
              { text: 'Self-service enablement and training sandbox' },
              { text: 'Access to the partner portal and release material' },
              { text: 'Deal registration not included' },
            ],
            ctaLabel: 'APPLY FOR SILVER',
            ctaHref: '/become-a-partner',
          },
          {
            name: 'Gold',
            description:
              'For partners delivering QualiWare engagements independently, with a named practice lead and repeat customers.',
            emphasized: true,
            tabLabel: 'MOST PARTNERS',
            features: [
              { text: 'Five certified consultants required, across at least two roles' },
              { text: 'Featured listing in the partner directory' },
              { text: 'Deal registration and co-selling' },
              { text: 'Guided enablement with a named partner manager' },
              { text: 'Marketing development support on request' },
              { text: 'Early access to release candidates' },
            ],
            ctaLabel: 'APPLY FOR GOLD',
            ctaHref: '/become-a-partner',
          },
          {
            name: 'Platinum',
            description:
              'By invitation. For partners running large programmes, often multi-country or public-sector, with their own methodology built on the platform.',
            emphasized: false,
            features: [
              { text: 'Ten certified consultants required, including a certified administrator' },
              { text: 'Featured listing plus a full partner profile page' },
              { text: 'Deal registration and co-selling with a named account executive' },
              { text: 'Joint business plan reviewed twice a year' },
              { text: 'Annual marketing development allocation' },
              { text: 'Roadmap sessions with the product team' },
              { text: 'Named escalation path into support' },
            ],
            ctaLabel: 'TALK TO US',
            ctaHref: '/become-a-partner',
          },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'grid',
        eyebrow: 'WHAT WE ASK OF YOU',
        heading: 'Requirements, stated plainly',
        lead: 'The programme is small and we would rather be clear about the obligations before you apply than discover a mismatch at the first annual review.',
        items: [
          {
            title: 'Certified people, not certified logos',
            text: 'Certification is held by named individuals and must be maintained through release refreshers. If certified staff leave, you have a two-quarter grace period to recertify before the tier is reviewed.',
          },
          {
            title: 'A reference engagement per year',
            text: 'From Gold upwards we ask for at least one delivered engagement a year that the customer is willing to be referenced on, even anonymously. Long relationships are the claim we make; partners have to help evidence it.',
          },
          {
            title: 'Honest scoping',
            text: 'Say no when QualiWare is not the right answer. We do it and we expect partners to do it. Overscoped first projects are the single most common cause of a stalled rollout.',
          },
          {
            title: 'Register opportunities early',
            text: 'Deal registration protects your work, and it only functions if it happens before the customer conversation is well advanced. Registration is confirmed or declined in writing within five working days.',
          },
          {
            title: 'Keep the directory profile true',
            text: 'Industries, regions, languages and certified headcount are what customers filter on. Profiles are checked at the annual review, and we correct anything that has drifted.',
          },
          {
            title: 'Security and data handling',
            text: 'Partners working in customer environments follow the customer’s own security requirements and our data handling guidance. Where we act as processor and you as sub-processor, the terms are set in writing before any access is granted.',
          },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'HOW IT RUNS',
        heading: 'The programme year',
        lead: 'Four fixed points, so nobody is guessing when a tier or a plan gets revisited.',
        image: {
          placeholder:
            'PHOTO — partner consultants and a QualiWare architect at a joint planning session, candid, real meeting room, no legible screens',
        },
        items: [
          {
            title: 'Onboarding — first six weeks',
            text: 'Partner agreement signed, portal access granted, training sandbox provisioned, and the first two consultants booked onto certification tracks.',
          },
          {
            title: 'Enablement — continuous',
            text: 'Release briefings for certified consultants, refresher exams, and an open channel to the product team for questions no manual answers.',
          },
          {
            title: 'Joint planning — twice a year at Gold and above',
            text: 'Which sectors and accounts you are working, what enablement you need next, and where we should be in the room with you.',
          },
          {
            title: 'Annual review — one meeting, written up',
            text: 'Certified capacity, delivered engagements, directory accuracy and tier. Movement up or down is decided here and confirmed in writing.',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Ready to start, or want to talk it through first?',
        text: 'The application takes about ten minutes and reaches a person, not a scoring engine. We reply within five working days either way.',
        ctaLabel: 'BECOME A PARTNER',
        ctaHref: '/become-a-partner',
      },
    ],
  },

  /* ---- become-a-partner ----------------------------------------------- */
  {
    title: 'Become a partner',
    slug: 'become-a-partner',
    pageType: 'standard',
    seo: {
      metaTitle: 'Become a partner — QualiWare Partners',
      metaDescription:
        'Apply to the QualiWare partner programme. Tell us where you work and what you build, and a named partner manager replies within five working days.',
    },
    authorship: {
      authorName: 'Henrik Aalborg',
      authorRole: 'Head of Partners, QualiWare',
      authorCredentials: 'Twelve years building Nordic and European channel programmes',
      lastReviewed: '2026-08-07',
      experienceNote:
        'Every application from the past two years has been answered by a named person, with a median first reply of three working days in the first half of 2026.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'navy',
        eyebrow: 'BECOME A PARTNER',
        heading: 'Tell us what you would build with QualiWare',
        lead: 'We keep the programme small enough that a real person reads every application and answers it. Ten minutes of specifics is worth more here than a polished capability deck.',
        ctas: [
          { label: 'READ THE PROGRAMME FIRST', href: '/program', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'grid',
        eyebrow: 'WHAT HAPPENS NEXT',
        heading: 'From application to first engagement',
        lead: 'Four steps, with the timings we hold ourselves to.',
        items: [
          {
            title: '1. We read it and reply — five working days',
            text: 'A named partner manager reads the application and replies whether or not we take it forward. If we decline, you get the reason in a sentence you can act on.',
          },
          {
            title: '2. A conversation — about an hour',
            text: 'Where you work, which sectors, what you already deliver, and where QualiWare fits or does not. An architect joins if the technical fit is the open question.',
          },
          {
            title: '3. Agreement and access — one to two weeks',
            text: 'Partner agreement signed, partner portal access granted and a training sandbox provisioned so your consultants can start on real material rather than slides.',
          },
          {
            title: '4. Certification, then your first engagement',
            text: 'Two certified consultants is the Silver requirement, and the tracks are booked as part of onboarding. Most new partners deliver alongside us on the first engagement before running one alone.',
          },
        ],
      },
      {
        blockType: 'formBlock',
        eyebrow: 'APPLICATION',
        heading: 'Apply to the partner programme',
        lead: 'Tell us where you work and what you build. Everything here goes to the partner team and nowhere else.',
        expectations: [
          { text: 'No participation fee at Silver tier' },
          { text: 'Training sandbox from day one' },
          { text: 'A named partner manager, not a shared inbox' },
          { text: 'A written answer within five working days, either way' },
        ],
        sideQuote:
          'We were talking to the people who build the product in the second week. That has not changed in the four years since, and it is why our consultants stay certified.',
        formFields: [
          { label: 'First name', name: 'firstName', fieldType: 'text', required: true, width: 'half' },
          { label: 'Last name', name: 'lastName', fieldType: 'text', required: true, width: 'half' },
          { label: 'Company', name: 'company', fieldType: 'text', required: true, width: 'half' },
          { label: 'Work email', name: 'email', fieldType: 'email', required: true, width: 'half' },
          { label: 'Company website', name: 'website', fieldType: 'text', required: false, width: 'half' },
          { label: 'Your role', name: 'jobTitle', fieldType: 'text', required: false, width: 'half' },
          {
            label: 'Partner type',
            name: 'partnerType',
            fieldType: 'select',
            required: true,
            width: 'half',
            options: [
              { value: 'Implementation partner' },
              { value: 'Consultancy or advisory' },
              { value: 'Reseller or distributor' },
              { value: 'Technology or integration partner' },
              { value: 'Training partner' },
            ],
          },
          {
            label: 'Primary region',
            name: 'region',
            fieldType: 'select',
            required: true,
            width: 'half',
            options: [
              { value: 'Nordics' },
              { value: 'UK & Ireland' },
              { value: 'DACH' },
              { value: 'Benelux' },
              { value: 'Southern Europe' },
              { value: 'Central & Eastern Europe' },
              { value: 'North America' },
              { value: 'Middle East & Africa' },
              { value: 'Asia-Pacific' },
            ],
          },
          {
            label: 'Consultants you could certify in the first year',
            name: 'certifiableConsultants',
            fieldType: 'select',
            required: true,
            width: 'half',
            options: [
              { value: '1–2' },
              { value: '3–5' },
              { value: '6–10' },
              { value: 'More than 10' },
            ],
          },
          {
            label: 'Tier you are applying for',
            name: 'tier',
            fieldType: 'select',
            required: false,
            width: 'half',
            options: [
              { value: 'Silver' },
              { value: 'Gold' },
              { value: 'Not sure yet — advise us' },
            ],
          },
          {
            label: 'Where do you already work?',
            name: 'disciplines',
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
              { value: 'Finance' },
              { value: 'Defence' },
              { value: 'Energy and utilities' },
              { value: 'Manufacturing' },
              { value: 'Life sciences' },
            ],
          },
          {
            label: 'What would you build with QualiWare, and for whom?',
            name: 'message',
            fieldType: 'textarea',
            required: true,
            width: 'full',
          },
        ],
        submitLabel: 'SUBMIT APPLICATION',
        privacyNote:
          'We use these details only to assess the application and to reply to it. Nothing here is added to a marketing list without your consent, and we delete unsuccessful applications after twelve months. See the privacy notice under Legal.',
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'BEFORE YOU APPLY',
        heading: 'Three things worth reading first',
        features: [
          {
            title: 'The tiers and their requirements',
            description:
              'Certified headcount, directory listing, deal registration and joint planning differ by tier. Knowing which one you are aiming at makes the first conversation shorter.',
            linkLabel: 'Programme tiers',
            href: '/program',
          },
          {
            title: 'Who is already in the directory',
            description:
              'Check who covers your region and industry. Overlap is not a barrier — several markets need more capacity than they have — but it is worth knowing.',
            linkLabel: 'Partner directory',
            href: '/directory',
          },
          {
            title: 'What the platform actually does',
            description:
              'The capability pages on the main site explain the repository, impact analysis, governance workflow and publishing. Endpoints and authentication are documented openly in Docs.',
            linkLabel: 'Platform documentation',
            href: 'https://docs.qualiware.com/api-reference',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'iceBlue',
        heading: 'Rather ask a question before applying?',
        text: 'Write to the partner team and a named partner manager will answer. No form, no qualification sequence.',
        ctaLabel: 'CONTACT THE PARTNER TEAM',
        ctaHref: 'mailto:partners@qualiware.com',
      },
    ],
  },
]
