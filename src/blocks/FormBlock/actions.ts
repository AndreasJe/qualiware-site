'use server'

import { getPayload } from 'payload'
import { rateLimit } from '../../lib/rateLimit'
import configPromise from '@payload-config'

export type SubmitState = { status: 'idle' | 'ok' | 'error'; message?: string }

/**
 * Stores the submission and nothing else — no email, no CRM push in v1.
 * The collection allows public create; read stays behind auth.
 */
export async function submitForm(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const limit = await rateLimit('form')
  if (!limit.ok) {
    return {
      status: 'error',
      message: `Too many submissions from this address. Please try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes, or email sales@qualiware.com.`,
    }
  }

  const formName = String(formData.get('__formName') ?? 'Untitled form')

  const data: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    // Skip our own control fields (`__formName`) and React's server-action
    // bookkeeping, which arrives as `$ACTION_REF_*` / `$ACTION_KEY` entries.
    if (key.startsWith('__') || key.startsWith('$')) continue
    if (typeof value === 'string') data[key] = value
  }

  if (!Object.values(data).some((v) => v.trim() !== '')) {
    return { status: 'error', message: 'Please fill in the form before submitting.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'form-submissions',
      data: { formName, data },
    })
    return { status: 'ok', message: 'Thank you — we’ll be in touch shortly.' }
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong sending that. Please try again or email sales@qualiware.com.',
    }
  }
}
