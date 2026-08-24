import 'server-only'

import { deskFetch, isZohoConfigured, DEPARTMENT_ID } from './zohoClient'

export { isZohoConfigured }

/**
 * Zoho Desk client — QualiWare runs on the EU data centre.
 *
 * The support property is rendered with our own React components; Zoho Desk
 * stays the system of record. Agents keep working in Zoho, and nothing about
 * their workflow changes.
 *
 * Configure with:
 *
 *   ZOHO_DESK_ORG_ID=<org id>
 *   ZOHO_DESK_CLIENT_ID=<client id>
 *   ZOHO_DESK_CLIENT_SECRET=<client secret>
 *   ZOHO_DESK_REFRESH_TOKEN=<refresh token>
 *   ZOHO_DESK_DEPARTMENT_ID=<optional, routes new tickets>
 *
 * `server-only` above is load-bearing: the client secret and refresh token must
 * never reach the browser bundle, and this import makes that a build error
 * rather than a code-review question.
 *
 * BEFORE WIRING THIS UP, verify against Zoho's current documentation:
 *   - the exact endpoint paths and query parameters used below
 *   - the OAuth scopes needed (Desk.tickets.CREATE, Desk.articles.READ, …)
 *   - that `orgId` is still the required org header
 * The shapes here follow the documented v1 API, but I have not run them against
 * a live EU org.
 */

export type TicketDraft = {
  subject: string
  description: string
  email: string
  name?: string
  phone?: string
  severity?: string
  product?: string
}

export type ZohoResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: 'unconfigured' | 'error'; message: string }

/* ------------------------------------------------------------------ *
 * Access tokens
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * Knowledge base
 * ------------------------------------------------------------------ */

export type HelpArticle = {
  id: string
  title: string
  summary?: string
  url: string
  category?: string
}

/**
 * Help-centre search. Results are rendered by our own components, so the help
 * centre looks like the rest of the site rather than like Zoho.
 *
 * Cached for five minutes: the Desk API is rate-limited per org, and article
 * content barely changes.
 */
export async function searchArticles(
  query: string,
  limit = 10,
): Promise<ZohoResult<HelpArticle[]>> {
  if (!isZohoConfigured()) {
    return { ok: false, reason: 'unconfigured', message: 'Zoho Desk is not configured.' }
  }

  try {
    const params = new URLSearchParams({ searchStr: query, limit: String(limit) })
    const response = await deskFetch(`/articles/search?${params}`, {
      next: { revalidate: 300 },
    } as RequestInit)

    if (!response?.ok) {
      return { ok: false, reason: 'error', message: `Zoho Desk returned ${response?.status}.` }
    }

    const json = (await response.json()) as { data?: unknown[] }

    const articles = (json.data ?? []).map((raw) => {
      const item = raw as Record<string, unknown>
      return {
        id: String(item.id ?? ''),
        title: String(item.title ?? ''),
        summary: typeof item.summary === 'string' ? item.summary : undefined,
        url: typeof item.webUrl === 'string' ? item.webUrl : '#',
        category:
          typeof item.category === 'object' && item.category
            ? String((item.category as Record<string, unknown>).name ?? '')
            : undefined,
      }
    })

    return { ok: true, data: articles }
  } catch (error) {
    return {
      ok: false,
      reason: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/* ------------------------------------------------------------------ *
 * Tickets
 * ------------------------------------------------------------------ */

/** Creates a ticket in Zoho Desk from our own form. */
export async function createTicket(draft: TicketDraft): Promise<ZohoResult<{ id: string }>> {
  if (!isZohoConfigured()) {
    return { ok: false, reason: 'unconfigured', message: 'Zoho Desk is not configured.' }
  }

  try {
    const response = await deskFetch('/tickets', {
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify({
        subject: draft.subject,
        description: draft.description,
        email: draft.email,
        contact: { email: draft.email, lastName: draft.name || draft.email },
        ...(DEPARTMENT_ID ? { departmentId: DEPARTMENT_ID } : {}),
        ...(draft.phone ? { phone: draft.phone } : {}),
        ...(draft.severity ? { priority: draft.severity } : {}),
        ...(draft.product ? { productId: draft.product } : {}),
      }),
    })

    if (!response?.ok) {
      return { ok: false, reason: 'error', message: `Zoho Desk returned ${response?.status}.` }
    }

    const json = (await response.json()) as { id?: string | number }
    return { ok: true, data: { id: String(json.id ?? '') } }
  } catch (error) {
    return {
      ok: false,
      reason: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
