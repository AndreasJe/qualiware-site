import type { SeedPage } from './platform'

/**
 * Open API & webhooks — the marketing side of the API.
 *
 * The content-split rule applies strictly here: this page says what the API is
 * *for* and what you can build with it. It never documents an endpoint, a
 * parameter or an auth flow — those live in Docs, and duplicating them is how
 * marketing copy ends up contradicting the reference.
 */
export const platformApiPages: SeedPage[] = [
  {
    title: 'Open API & webhooks',
    slug: 'platform/api',
    pageType: 'platformCapability',
    seo: {
      metaTitle: 'Open API & webhooks — build on the repository',
      metaDescription:
        'Read and write the model programmatically, and have downstream systems react to changes instead of polling. Endpoints and authentication live in Docs.',
    },
    authorship: {
      authorName: 'Rasmus Vestergaard',
      authorRole: 'Integration Architect, QualiWare',
      authorCredentials: 'Azure Solutions Architect Expert · 10 years on enterprise integration',
      lastReviewed: '2026-06-23',
      experienceNote:
        'Written from integration work on QualiWare deployments where the repository had to stay in step with a CMDB, a service desk and an HR system at once.',
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'darkGreen',
        eyebrow: 'ACCESS & INTEROPERABILITY',
        heading: 'Build on the repository',
        lead:
          'This page explains what the API is for and what teams build with it. The endpoint reference, authentication and payload shapes live in the documentation — one source, not two that drift.',
        ctas: [
          { label: 'GET A DEMO', href: '/pricing#demo', style: 'neon' },
          { label: 'INTEGRATION CATALOGUE', href: '/platform/integrations', style: 'outline' },
        ],
      },
      {
        blockType: 'valueProps',
        layout: 'split',
        eyebrow: 'WHAT IT IS FOR',
        heading: 'The model is not a silo',
        lead:
          'A repository that can only be read through its own client becomes another island. The API exists so the model can be part of how other systems work.',
        image: {
          placeholder:
            'SCREENSHOT — API response showing an object with its typed relations, in a terminal or REST client',
        },
        items: [
          {
            title: 'Read the model programmatically',
            text:
              'Query objects and traverse typed relations, so a dependency question can be answered by a script rather than by a person opening a diagram.',
          },
          {
            title: 'Keep it current from source systems',
            text:
              'Push application, supplier or organisational changes in from the systems that already know about them, instead of re-typing them.',
          },
          {
            title: 'React to change with webhooks',
            text:
              'Subscribe to repository events so downstream systems act when the model changes — rather than polling and missing everything that changed and changed back.',
          },
          {
            title: 'Automate governance',
            text:
              'Trigger a review, open a ticket or notify an owner when something is published, without anyone remembering to.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHAT TEAMS BUILD',
        heading: 'Common things customers build first',
        features: [
          {
            title: 'CMDB reconciliation',
            description:
              'Compare the modelled application landscape with what the CMDB thinks exists, and report the difference.',
          },
          {
            title: 'Joiner and leaver updates',
            description:
              'Keep object ownership in step with the HR system, so the model does not fill with owners who left.',
          },
          {
            title: 'Compliance evidence export',
            description:
              'Pull controls, owners and approval dates on a schedule, for a GRC platform or an auditor.',
          },
          {
            title: 'Portal notifications',
            description:
              'Tell a team in chat when a process they own is republished, using the publish event.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'WHERE THINGS LIVE',
        heading: 'This page, and the documentation',
        features: [
          {
            title: 'On this page',
            description:
              'What the API is for, what it makes possible, and the shape of a first integration.',
          },
            {
            title: 'In the documentation',
            description:
              'Endpoints, authentication, rate limits, payload schemas, webhook signature verification and the full reference.',
            linkLabel: 'Open the API reference',
            href: 'https://docs.qualiware.com/api-reference',
          },
          {
            title: 'Not here at all',
            description:
              'Version numbers and release-specific behaviour. Those follow the release you are on, and belong in the release notes.',
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        background: 'darkGreen',
        heading: 'Bring the system you need it to talk to',
        text:
          'Forty-five minutes on your own integration scenario — CMDB, service desk, HR, whatever is causing the duplication.',
        ctaLabel: 'BOOK A DEMO',
        ctaHref: '/pricing#demo',
      },
    ],
  },
]
