import 'server-only'

import { headers } from 'next/headers'

/**
 * Rate limiting for unauthenticated public endpoints.
 *
 * The demo form, the partner application and the support case form all accept
 * anonymous POSTs. Without a limit they are a spam and abuse target, and the
 * support form in particular creates records in Zoho Desk.
 *
 * Deliberately in-memory. This deploys as a single instance in one LXC, so a
 * shared store would be complexity without benefit. Two consequences worth
 * knowing:
 *
 *   - counters reset on restart or redeploy
 *   - it does not coordinate across instances, so scaling out needs Redis or
 *     the equivalent at the edge
 *
 * OPNsense sits in front and is the right place for volumetric protection.
 * This guards against the ordinary case: one source hammering one form.
 */
type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** Stops the map growing without bound on a long-running process. */
const sweep = (now: number) => {
  if (buckets.size < 5_000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/**
 * The client address.
 *
 * Behind OPNsense/Caddy the socket address is the proxy, so the forwarded
 * headers are what identify the caller. They are only trustworthy because the
 * edge sets them — never trust these if the app is ever exposed directly.
 */
export const clientKey = async (): Promise<string> => {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return h.get('x-real-ip') ?? 'unknown'
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number }

/**
 * Consumes one token for `name` from the caller's bucket.
 *
 * @param limit  requests allowed per window
 * @param windowMs  window length in milliseconds
 */
export async function rateLimit(
  name: string,
  { limit = 5, windowMs = 10 * 60_000 }: { limit?: number; windowMs?: number } = {},
): Promise<RateLimitResult> {
  const now = Date.now()
  sweep(now)

  const key = `${name}:${await clientKey()}`
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { ok: true }
}
