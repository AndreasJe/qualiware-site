import { propertyHref, propertyHost, hostOf, tenantPath, SUPPORT_URL } from './links'

export type NavLink = { label: string; href: string; description?: string; crossProperty?: boolean }
export type NavGroup = {
  title: string
  links: NavLink[]
  /** A cross-property hand-off shown under the column, not as a menu item. */
  note?: { text: string; href: string }
}
export type Promo = {
  eyebrow: string
  heading: string
  text: string
  linkLabel: string
  href: string
  background: 'tint' | 'ice'
}

export type MegaMenu = {
  key: 'PLATFORM' | 'SOLUTIONS' | 'RESOURCES'
  groups: NavGroup[]
  promo?: Promo
}

/**
 * Governing rule: Platform answers "how does it work", Solutions answers
 * "what is it for". Every URL belongs to exactly one.
 */
export const megaMenus: MegaMenu[] = [
  {
    key: 'PLATFORM',
    groups: [
      {
        // The repository itself: what the machinery is.
        title: 'HOW IT WORKS',
        links: [
          { label: 'The QualiWare Platform', href: '/platform' },
          { label: 'Ontology-driven repository', href: '/platform/repository' },
          { label: 'Impact analysis & traceability', href: '/platform/impact-analysis' },
          { label: 'Governance & workflow', href: '/platform/governance-workflow' },
        ],
      },
      {
        title: 'CAPABILITIES',
        links: [
          { label: 'Application Portfolio Management', href: '/platform/application-portfolio-management' },
          { label: 'Business Capability Management', href: '/platform/business-capability-management' },
          { label: 'Information Architecture', href: '/platform/information-architecture' },
          { label: 'Process modelling & publishing', href: '/platform/process-modelling' },
          { label: 'Strategy & roadmapping', href: '/platform/strategy-roadmapping' },
        ],
      },
      {
        /*
         * Answers one buyer question: how does this reach my people and my
         * systems?
         *
         * Publishing and QualiWare Go do the same job — getting the model in
         * front of people who do not model — so they belong together, and Go is
         * an access channel rather than a capability.
         *
         * "Developer documentation" is deliberately not a link here. Docs is
         * already in the utility row, and spending a menu slot pointing at it
         * left this column with one real item. The hand-off is the note under
         * the column instead.
         */
        title: 'ACCESS & INTEROPERABILITY',
        links: [
          { label: 'Publishing & the web portal', href: '/platform/publishing' },
          { label: 'QualiWare Go', href: '/platform/qualiware-go' },
          // "Partner-built extensions" used to sit here. It belongs on the
          // partner site, not in the Platform menu: the catalogue already
          // covers what integrates, and who built a given connector is a
          // detail of the entry rather than a separate destination.
          { label: 'Integration catalogue', href: '/platform/integrations' },
          { label: 'Open API & webhooks', href: '/platform/api' },
        ],
        note: {
          text: 'API reference and authentication live in Docs',
          href: propertyHref('docs', '/api-reference'),
        },
      },
      {
        title: 'SECURITY & HOSTING',
        links: [
          { label: 'Cloud, sovereign & on-premise', href: '/platform/hosting' },
          { label: 'ISO 27001 & certifications', href: '/platform/certifications' },
          { label: 'Access control & SSO', href: '/platform/access-control' },
          { label: 'Trust centre', href: '/trust' },
        ],
      },
    ],
    promo: {
      eyebrow: 'PLATFORM TOUR',
      heading: 'See the repository in eight minutes',
      text: 'A recorded walkthrough — no form.',
      linkLabel: 'Watch the tour',
      href: '/platform/tour',
      background: 'tint',
    },
  },
  {
    key: 'SOLUTIONS',
    groups: [
      {
        title: 'BY DISCIPLINE',
        links: [
          { label: 'Enterprise Architecture', href: '/solutions/enterprise-architecture', description: 'Align IT with strategy' },
          { label: 'Governance, Risk & Compliance', href: '/solutions/grc', description: 'Controls where the work happens' },
          { label: 'Process Management', href: '/solutions/process-management', description: 'A management system people read' },
          { label: 'Digital Twin of an Organization', href: '/solutions/digital-twin', description: 'One model of how you work' },
          { label: 'AI Governance', href: '/solutions/ai-governance', description: 'Know where AI touches the business' },
          { label: 'Business Transformation', href: '/solutions/business-transformation', description: 'Plan and sequence change' },
        ],
      },
      {
        title: 'BY INDUSTRY',
        links: [
          { label: 'Public Sector', href: '/solutions/public-sector' },
          { label: 'Finance', href: '/solutions/finance' },
          { label: 'Defence', href: '/solutions/defence' },
          { label: 'Energy & Utilities', href: '/solutions/energy-utilities' },
          { label: 'Manufacturing', href: '/solutions/manufacturing' },
          { label: 'Life sciences', href: '/solutions/life-sciences' },
        ],
      },
      {
        title: 'BY REGULATION',
        links: [
          { label: 'NIS2', href: '/solutions/nis2' },
          { label: 'DORA', href: '/solutions/dora' },
          { label: 'CSRD', href: '/solutions/csrd' },
          { label: 'ISO 27001', href: '/solutions/iso-27001' },
        ],
      },
    ],
    promo: {
      eyebrow: 'START HERE',
      heading: 'Not sure where to start?',
      text: 'Answer four questions and we’ll point you at the discipline with the fastest payback.',
      linkLabel: 'Find your starting point',
      href: '/solutions/find-your-starting-point',
      background: 'ice',
    },
  },
  {
    key: 'RESOURCES',
    groups: [
      {
        title: 'LEARN & DECIDE',
        links: [
          { label: 'Blog', href: '/resources/blog' },
          { label: 'Webinars', href: '/resources/webinars' },
          { label: 'Analyst research', href: '/resources/analyst-research' },
          { label: 'Guides & templates', href: '/resources/guides' },
        ],
      },
      {
        title: 'COMMUNITY',
        links: [
          { label: 'Center of Excellence', href: '/resources/center-of-excellence' },
          { label: 'Newsletter', href: '/resources/newsletter' },
          { label: 'QualiWare x EDGY', href: '/resources/edgy' },
        ],
      },
    ],
    promo: {
      eyebrow: 'ALREADY A CUSTOMER?',
      heading: 'Product documentation lives in Docs',
      text: 'How-to articles, admin guides and the API reference.',
      linkLabel: 'Go to Docs',
      href: propertyHref('docs'),
      background: 'tint',
    },
  },
]

export const primaryNav = [
  { label: 'PLATFORM', href: '/platform', menu: 'PLATFORM' as const },
  { label: 'SOLUTIONS', href: '/solutions', menu: 'SOLUTIONS' as const },
  { label: 'CUSTOMERS', href: '/customers', menu: null },
  { label: 'PRICING', href: '/pricing', menu: null },
  { label: 'RESOURCES', href: '/resources', menu: 'RESOURCES' as const },
]

export const utilityNav = [
  { label: 'PARTNERS', href: propertyHref('partners') },
  { label: 'DOCS', href: propertyHref('docs') },
  { label: 'SUPPORT', href: propertyHref('support') },
  { label: 'SIGN IN', href: '/sign-in' },
]

/** Mobile accordion covers every primary item, including those without a desktop mega-menu. */
export const mobileNavGroups: Record<string, NavGroup[]> = {
  PLATFORM: megaMenus[0].groups,
  SOLUTIONS: megaMenus[1].groups,
  CUSTOMERS: [
    {
      title: 'CUSTOMERS',
      links: [
        { label: 'Customer stories', href: '/customers' },
        { label: 'Onboarding', href: '/customers/onboarding' },
        { label: 'Community', href: '/resources/center-of-excellence' },
      ],
    },
  ],
  PRICING: [
    {
      title: 'PRICING',
      links: [
        { label: 'Plans & licensing', href: '/pricing' },
        { label: 'Book a demo', href: '/pricing#demo' },
      ],
    },
  ],
  RESOURCES: megaMenus[2].groups,
}

/** Full-width 52px band under the primary bar, one per property. */
export const subBars = {
  docs: {
    label: 'DOCS & WIKI',
    background: 'var(--qw-green)',
    domain: propertyHost('docs'),
    links: [
      { label: 'Getting started', href: tenantPath('docs', '/getting-started') },
      { label: 'Modelling', href: tenantPath('docs', '/modelling') },
      { label: 'Administration', href: tenantPath('docs', '/administration') },
      { label: 'Integrations & API', href: tenantPath('docs', '/api-reference') },
      { label: 'Release notes', href: tenantPath('docs', '/release-notes') },
    ],
  },
  support: {
    label: 'SUPPORT',
    background: 'var(--qw-green)',
    domain: propertyHost('support'),
    links: [
      { label: 'Help centre', href: tenantPath('support', '/#help-centre') },
      { label: 'Submit a case', href: tenantPath('support', '/#submit-a-case') },
      { label: 'Service status', href: tenantPath('support', '/#service-status') },
      { label: 'Onboarding', href: propertyHref('main', '/customers/onboarding') },
      { label: 'Training', href: propertyHref('main', '/resources/center-of-excellence') },
    ],
  },
  partners: {
    label: 'PARTNERS',
    background: 'var(--qw-navy)',
    domain: propertyHost('partners'),
    links: [
      { label: 'Program', href: tenantPath('partners', '/program') },
      { label: 'Directory', href: tenantPath('partners', '/directory') },
      { label: 'Integrations', href: tenantPath('partners', '/integrations') },
      { label: 'Become a partner', href: tenantPath('partners', '/become-a-partner') },
    ],
  },
} as const

export type SubBarKey = keyof typeof subBars

export const footerColumns: NavGroup[] = [
  {
    title: 'PLATFORM',
    links: [
      { label: 'How it works', href: '/platform' },
      { label: 'Capabilities', href: '/platform#capabilities' },
      { label: 'Integrations & API', href: '/platform/integrations' },
      { label: 'Security & hosting', href: '/platform/hosting' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'SOLUTIONS',
    links: [
      { label: 'Enterprise Architecture', href: '/solutions/enterprise-architecture' },
      { label: 'Governance, Risk & Compliance', href: '/solutions/grc' },
      { label: 'Process Management', href: '/solutions/process-management' },
      { label: 'Digital Twin of an Organization', href: '/solutions/digital-twin' },
      { label: 'AI Governance', href: '/solutions/ai-governance' },
      { label: 'By industry & regulation', href: '/solutions' },
    ],
  },
  {
    title: 'RESOURCES',
    links: [
      { label: 'Blog', href: '/resources/blog' },
      { label: 'Webinars', href: '/resources/webinars' },
      { label: 'Analyst research', href: '/resources/analyst-research' },
      { label: 'Guides & templates', href: '/resources/guides' },
      { label: 'Customer stories', href: '/customers' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'The QualiWare story', href: '/company/story' },
      { label: 'Our culture', href: '/company/culture' },
      { label: 'Certifications', href: '/platform/certifications' },
      { label: 'Join us', href: '/company/careers' },
      { label: 'Contact', href: '/company/contact' },
    ],
  },
]

export const companyDetails = {
  name: 'QualiWare ApS',
  address: ['Ryttermarken 15', 'DK 3520 Farum, Denmark'],
  phone: '+45 45 470 700',
  emails: ['info@qualiware.com', 'sales@qualiware.com'],
  legal: 'ISO 27001 certified  //  UN Global Compact participant  //  SKI supplier  //  CVR 30731557',
  legalLinks: [
    { label: 'Terms & conditions', href: '/legal/terms' },
    { label: 'Legal', href: '/legal' },
    { label: 'Cookies', href: '/legal/cookies' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/qualiware' },
  ],
}
