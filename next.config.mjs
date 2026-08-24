import { withPayload } from '@payloadcms/next/withPayload'

/*
 * Tenant routing lives in `src/proxy.ts`, not here. There used to be a
 * `rewrites()` block doing host-to-tenant mapping as well; it was dead by the
 * time support was added (support routing works, and those rules never
 * mentioned it), so it has been removed rather than left to confuse the next
 * person. One mechanism, one place.
 */

/**
 * Security headers.
 *
 * TLS terminates at OPNsense, so HSTS is sent from here for completeness but
 * the edge is what enforces it.
 *
 * CSP is applied to the public site only. The Payload admin is a React
 * application that needs looser script and style rules, and a CSP tight enough
 * to be worth having on the front end would break it — so it is scoped by path
 * rather than weakened to fit both.
 */
const baseHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const publicCsp = [
  "default-src 'self'",
  // Next injects inline bootstrap scripts; 'unsafe-inline' is required until
  // nonce-based CSP is wired through the app.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not advertise the framework version to scanners.
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Everything except the admin panel and Payload's API.
        source: '/((?!admin|api).*)',
        headers: [...baseHeaders, { key: 'Content-Security-Policy', value: publicCsp }],
      },
      {
        source: '/admin/:path*',
        headers: baseHeaders,
      },
    ]
  },
}

export default withPayload(nextConfig)
