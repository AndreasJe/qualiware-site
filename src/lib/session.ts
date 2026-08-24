import 'server-only'

import { cookies } from 'next/headers'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Account } from '../payload-types'

/**
 * End-user sessions — customers and partners.
 *
 * Payload derives its auth cookie name from the *global* `cookiePrefix`, so
 * `users` (CMS staff) and `accounts` (end users) would otherwise share one
 * cookie: signing in as a customer would silently end your admin session in the
 * same browser.
 *
 * So end users get their own cookie name. Verification is still Payload's —
 * the stored token is handed back to `payload.auth()` under the name it expects
 * — which keeps JWT handling out of application code.
 */
const SESSION_COOKIE = 'qw-session'

/**
 * Payload's own cookie name, which `payload.auth()` reads.
 *
 * Read from the running config rather than a separate environment variable —
 * two places that must agree, with nothing linking them, is a silent failure
 * waiting to happen: a changed prefix would break every end-user session with
 * no error.
 */
const payloadCookieName = (payload: { config: { cookiePrefix?: string } }) =>
  `${payload.config.cookiePrefix ?? 'payload'}-token`

export type Audience = 'customer' | 'partner'

/**
 * An end customer a partner may raise a case for.
 *
 * `supportLevelSold` decides whether QualiWare provides support at all — see
 * `Partners.supportedCustomers`. Mirrored from the contract, not authoritative.
 */
export type SupportedCustomer = {
  customerName: string
  supportLevelSold: 'none' | 'standard' | 'enhanced' | 'premium'
  zohoAccountId?: string | null
}

export type Session = {
  id: number
  email: string
  fullName: string
  audiences: Audience[]
  organisation?: string | null
  partnerSlug?: string | null
  partnerName?: string | null
  /** Populated for partners only. Empty for a customer account. */
  supportedCustomers: SupportedCustomer[]
  supportTierHint?: string | null
  zohoContactId?: string | null
}

const toSession = (account: Account): Session => {
  const partner =
    account.partner && typeof account.partner === 'object' ? account.partner : null

  return {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    audiences: (account.audiences ?? []) as Audience[],
    organisation: account.organisation,
    partnerSlug: partner?.slug ?? null,
    partnerName: partner?.name ?? null,
    supportedCustomers: (partner?.supportedCustomers ?? []).map((entry) => ({
      customerName: entry.customerName,
      supportLevelSold: (entry.supportLevelSold ?? 'none') as SupportedCustomer['supportLevelSold'],
      zohoAccountId: entry.zohoAccountId,
    })),
    supportTierHint: account.supportTierHint,
    zohoContactId: account.zohoContactId,
  }
}

/**
 * The signed-in end user, or null. Cached per request, so the several places
 * that need it — nav, docs access, the case form — cost one lookup.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null

  try {
    const payload = await getPayload({ config: configPromise })

    /*
     * Hand the token back under the name Payload's own verification expects.
     *
     * The origin header is load-bearing. Once `serverURL` is set in the config,
     * Payload checks the request origin against it, and a forged header object
     * carrying only a cookie is rejected — `auth()` returns null with no error,
     * so every signed-in reader silently becomes anonymous and restricted docs
     * 404 for people entitled to them.
     */
    const { user } = await payload.auth({
      headers: new Headers({
        cookie: `${payloadCookieName(payload)}=${token}`,
        origin: payload.config.serverURL ?? '',
      }),
    })

    if (!user || user.collection !== 'accounts') return null

    // Re-read with depth so the partner relationship is populated.
    const account = await payload.findByID({
      collection: 'accounts',
      id: user.id,
      depth: 1,
      overrideAccess: true,
    })

    return account ? toSession(account) : null
  } catch {
    return null
  }
})

/** The audiences to filter content by. Anonymous readers get none. */
export const sessionAudiences = async (): Promise<Audience[]> =>
  (await getSession())?.audiences ?? []

/**
 * Payload access control reads `req.user`. Server-side queries made outside a
 * request — which is all of ours — must pass the user explicitly, or every
 * query runs as anonymous and restricted docs vanish for signed-in readers.
 */
export const accessUserFor = async () => {
  const session = await getSession()
  if (!session) return undefined

  return {
    id: session.id,
    collection: 'accounts' as const,
    email: session.email,
    audiences: session.audiences,
  }
}

export type LoginResult =
  | { ok: true; session: Session }
  | { ok: false; message: string }

/** Verifies credentials with Payload, then stores the token under our own cookie. */
export async function signIn(email: string, password: string): Promise<LoginResult> {
  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.login({
      collection: 'accounts',
      data: { email, password },
      depth: 1,
    })

    if (!result?.token || !result.user) {
      return { ok: false, message: 'Those details did not match an account.' }
    }

    const store = await cookies()
    store.set(SESSION_COOKIE, result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      domain: process.env.SESSION_COOKIE_DOMAIN || undefined,
      maxAge: 60 * 60 * 8,
    })

    return { ok: true, session: toSession(result.user as Account) }
  } catch {
    // Deliberately vague: never reveal whether the address exists.
    return { ok: false, message: 'Those details did not match an account.' }
  }
}

export async function signOut(): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, '', {
    httpOnly: true,
    path: '/',
    domain: process.env.SESSION_COOKIE_DOMAIN || undefined,
    maxAge: 0,
  })
}

/** Where a person lands after signing in, based on what they hold. */
export const landingFor = (session: Session): { tenant: 'main' | 'partners'; path: string } => {
  if (session.audiences.includes('partner')) {
    return { tenant: 'partners', path: '/' }
  }
  return { tenant: 'main', path: '/customers/onboarding' }
}
