'use server'

import { redirect } from 'next/navigation'
import { signIn, signOut, landingFor } from '../../../../lib/session'
import { propertyHref } from '../../../../lib/links'
import { rateLimit } from '../../../../lib/rateLimit'

export type SignInState = { status: 'idle' | 'error'; message?: string }

/**
 * One sign-in for both audiences.
 *
 * The form never asks whether you are a customer or a partner — that would make
 * the visitor learn our data model, and some people are both. Authenticate
 * first, read `audiences` from the account, then route.
 */
export async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  /*
   * Complements Payload's per-account lockout. That stops repeated attempts
   * against ONE account; this stops one source spraying many accounts, which
   * is what the credential-stuffing traffic in the Wordfence report was doing.
   */
  const limit = await rateLimit('sign-in', { limit: 10, windowMs: 10 * 60_000 })
  if (!limit.ok) {
    return {
      status: 'error',
      message: 'Too many sign-in attempts from this address. Please try again shortly.',
    }
  }

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { status: 'error', message: 'Enter your email address and password.' }
  }

  const result = await signIn(email, password)
  if (!result.ok) return { status: 'error', message: result.message }

  const destination = landingFor(result.session)
  redirect(propertyHref(destination.tenant, destination.path))
}

export async function signOutAction(): Promise<void> {
  await signOut()
  redirect(propertyHref('main', '/'))
}
