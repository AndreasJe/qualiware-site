'use server'

import { getPayload } from 'payload'
import { rateLimit } from '../../lib/rateLimit'
import configPromise from '@payload-config'
import { createTicket, isZohoConfigured, searchArticles, type HelpArticle } from '../../lib/zohoDesk'
import { getSession } from '../../lib/session'

/** How the entitlement reads in the case itself, for whoever picks it up. */
const SUPPORT_LEVEL_LABEL: Record<string, string> = {
  none: 'None — partner supports this customer directly',
  standard: 'Standard',
  enhanced: 'Enhanced',
  premium: 'Premium',
}

export type CaseState = {
  status: 'idle' | 'ok' | 'error'
  message?: string
  caseId?: string
  /** True when the case was stored locally because Zoho is not configured. */
  preview?: boolean
}

/**
 * Creates a support case in Zoho Desk.
 *
 * When Zoho is not configured — a review deployment, or before credentials
 * exist — the submission is stored in Payload instead, so the flow is
 * demonstrable end to end without inventing a fake success.
 */
export async function submitCase(_prev: CaseState, formData: FormData): Promise<CaseState> {
  const limit = await rateLimit('support-case')
  if (!limit.ok) {
    return {
      status: 'error',
      message: `Too many submissions from this address. Please try again shortly, or phone +45 45 470 700 for anything production-critical.`,
    }
  }

  /*
   * Submitting requires an account, though reading does not.
   *
   * The help centre, service status and response targets stay public — they
   * deflect cases and are worth ranking. But a case attaches to a contract and
   * an SLA, and a typed email address is a claim rather than proof.
   *
   * Checked here, server-side, not only in the form: never trust the UI to
   * enforce access.
   */
  const session = await getSession()
  if (!session) {
    return {
      status: 'error',
      message: 'Please sign in to submit a case — it attaches to your support contract.',
    }
  }

  const get = (key: string) => String(formData.get(key) ?? '').trim()

  const subject = get('subject')
  const description = get('description')

  if (!subject || !description) {
    return { status: 'error', message: 'A subject and a description are both required.' }
  }

  /*
   * Identity comes from the session, never from the form.
   *
   * The address a case is attributed to decides whose contract and whose
   * support history it joins. Taking it from a form field would let anyone
   * raise a case as anyone.
   */
  const email = session.email

  /*
   * Partners raise cases *on behalf of* an end customer, after failing to
   * resolve something themselves — so a partner case must name whose problem
   * it is, and whether QualiWare provides support for them at all.
   *
   * That depends on the support level the partner sold on. If they sold none,
   * we do not provide it, and the partner needs to know before writing the
   * case rather than after.
   */
  const isPartner = session.audiences.includes('partner')
  const onBehalfOf = get('onBehalfOf')
  let entitlementNote = ''

  if (isPartner && session.supportedCustomers.length > 0) {
    if (!onBehalfOf) {
      return {
        status: 'error',
        message: 'Choose which of your customers this case is for.',
      }
    }

    const customer = session.supportedCustomers.find((c) => c.customerName === onBehalfOf)

    if (!customer) {
      return {
        status: 'error',
        message: `${onBehalfOf} is not listed against your partner account. Contact your partner manager to have them added.`,
      }
    }

    if (customer.supportLevelSold === 'none') {
      return {
        status: 'error',
        message: `You did not sell a support agreement to ${onBehalfOf}, so QualiWare does not provide support for them — you support them directly. If they need a support agreement, talk to your partner manager.`,
      }
    }

    /*
     * The agent picking this up must not have to look the contract up.
     *
     * Whose problem it is, what they are entitled to and who sold it decide the
     * response target — so they go at the top of the case itself, rather than
     * living only in the partner's head.
     */
    entitlementNote = [
      `End customer: ${onBehalfOf}`,
      `Support level: ${SUPPORT_LEVEL_LABEL[customer.supportLevelSold] ?? customer.supportLevelSold}`,
      `Sold by: ${session.partnerName ?? 'partner'}`,
      customer.zohoAccountId ? `Zoho account: ${customer.zohoAccountId}` : null,
      `Raised by: ${session.fullName} <${session.email}>`,
    ]
      .filter(Boolean)
      .join('\n')
  }

  const draft = {
    subject: entitlementNote ? `[${onBehalfOf}] ${subject}` : subject,
    description: entitlementNote ? `${entitlementNote}\n\n---\n\n${description}` : description,
    email,
    name: session.fullName,
    phone: get('phone') || undefined,
    severity: get('severity') || undefined,
    product: get('product') || undefined,
  }

  if (isZohoConfigured()) {
    const result = await createTicket(draft)

    if (result.ok) {
      return {
        status: 'ok',
        caseId: result.data.id,
        message: `Case ${result.data.id} created. A confirmation is on its way to ${email}.`,
      }
    }

    // Do not lose the customer's report because an upstream call failed.
    await store(draft, `zoho-failed: ${result.message}`)
    return {
      status: 'error',
      message:
        'We could not reach the support desk just now, so your report has been saved and will be picked up. For anything production-critical, please phone +45 45 470 700.',
    }
  }

  await store(draft, 'zoho-unconfigured')

  return {
    status: 'ok',
    preview: true,
    message:
      'Saved. This environment is not connected to Zoho Desk, so no ticket was created — in production this becomes a real case.',
  }
}

async function store(draft: Record<string, unknown>, note: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'form-submissions',
      data: {
        formName: 'Support case',
        data: { ...draft, __note: note } as Record<string, unknown>,
      },
    })
  } catch {
    // Storing is best-effort; never mask the user-facing result behind it.
  }
}

export type SearchState = {
  status: 'idle' | 'ok' | 'unavailable'
  query?: string
  articles?: HelpArticle[]
  message?: string
}

/** Help-centre search against the Zoho Desk knowledge base. */
export async function searchHelpCentre(
  _prev: SearchState,
  formData: FormData,
): Promise<SearchState> {
  const query = String(formData.get('q') ?? '').trim()
  if (!query) return { status: 'idle' }

  const result = await searchArticles(query)

  if (result.ok) return { status: 'ok', query, articles: result.data }

  return {
    status: 'unavailable',
    query,
    message:
      result.reason === 'unconfigured'
        ? 'Help-centre search connects to Zoho Desk, which is not configured in this environment.'
        : 'The help centre is not responding right now.',
  }
}
