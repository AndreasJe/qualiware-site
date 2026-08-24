import type { Access, Where } from 'payload'

/**
 * Typed structurally rather than against the generated `User`: `req.user`
 * carries Payload's own session shape, which is not assignable to the generated
 * interface.
 */
type MaybeUser =
  | {
      collection?: string
      roles?: (string | null)[] | null
      audiences?: (string | null)[] | null
    }
  | null
  | undefined

export const isSuperAdmin = (user: MaybeUser): boolean =>
  Boolean(user?.roles?.includes('super-admin'))

/** CMS staff, as opposed to a customer or partner account. */
export const isStaff = (user: MaybeUser): boolean => user?.collection === 'users'

export const superAdminOnly: Access = ({ req }) => isSuperAdmin(req.user as MaybeUser)

export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Content editing is staff-only — an end-user session must never grant it. */
export const staffOnly: Access = ({ req }) => isStaff(req.user as MaybeUser)

export const anyone: Access = () => true

/**
 * Audience visibility — the single gating mechanism across Docs, Pages and
 * Posts.
 *
 * Content is open by default — a deliberate reversal of the old gated knowledge
 * base. An article restricts itself by listing `audiences`; an empty list means
 * everyone. A reader sees an article when it is unrestricted, or when their own
 * audiences intersect its audiences.
 *
 * This replaces the earlier `gated` boolean, which could only express "logged in
 * or not". That is not enough once there are two distinct populations: a
 * partner would have been able to read customer-only material and vice versa.
 *
 * Staff see everything, because they maintain it.
 */
export const audienceVisibility: Access = ({ req }) => {
  const user = req.user as MaybeUser

  if (isStaff(user)) return true

  const audiences = (user?.audiences ?? []).filter(
    (audience): audience is string => typeof audience === 'string',
  )

  // Anonymous: unrestricted articles only.
  const unrestricted: Where = { audiences: { exists: false } }
  if (!audiences.length) return unrestricted

  const entitled: Where = { or: [unrestricted, { audiences: { in: audiences } }] }
  return entitled
}

/**
 * Kept as an alias so existing imports keep reading naturally on Docs, where
 * gating is used most.
 */
export const docsVisibility = audienceVisibility
