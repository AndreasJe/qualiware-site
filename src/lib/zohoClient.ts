/**
 * Low-level Zoho Desk HTTP client — QualiWare is on the EU data centre.
 *
 * Deliberately does NOT import `server-only`, unlike the modules above it.
 * `server-only` throws outside a React Server Components bundle by design, and
 * this module has to be reachable from CLI scripts (`npm run zoho:link`) as well
 * as from server components. The runtime guard below covers the same ground for
 * the case that actually matters — this code reaching a browser.
 *
 * BEFORE WIRING THIS UP, verify against Zoho's current documentation:
 *   - the endpoint paths and query parameters used by callers
 *   - the OAuth scopes needed (Desk.tickets.CREATE, Desk.articles.READ, …)
 *   - that `orgId` is still the required org header
 * The shapes follow the documented v1 API but have not been run against a live
 * EU org.
 */

if (typeof window !== 'undefined') {
  throw new Error(
    'zohoClient must never run in the browser — it holds the Zoho Desk client secret.',
  )
}

const ACCOUNTS_BASE = 'https://accounts.zoho.eu'
const DESK_BASE = 'https://desk.zoho.eu/api/v1'

const ORG_ID = process.env.ZOHO_DESK_ORG_ID
const CLIENT_ID = process.env.ZOHO_DESK_CLIENT_ID
const CLIENT_SECRET = process.env.ZOHO_DESK_CLIENT_SECRET
const REFRESH_TOKEN = process.env.ZOHO_DESK_REFRESH_TOKEN

export const DEPARTMENT_ID = process.env.ZOHO_DESK_DEPARTMENT_ID

/** True when every credential is present. Everything degrades gracefully when not. */
export const isZohoConfigured = (): boolean =>
  Boolean(ORG_ID && CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN)

let cachedToken: { value: string; expiresAt: number } | null = null

/**
 * Refresh tokens are long-lived; access tokens last about an hour. Cached in
 * module scope and renewed a minute early, so a burst of requests triggers one
 * refresh rather than one per request.
 */
async function accessToken(): Promise<string | null> {
  if (!isZohoConfigured()) return null
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value

  const params = new URLSearchParams({
    refresh_token: REFRESH_TOKEN as string,
    client_id: CLIENT_ID as string,
    client_secret: CLIENT_SECRET as string,
    grant_type: 'refresh_token',
  })

  const response = await fetch(`${ACCOUNTS_BASE}/oauth/v2/token?${params}`, {
    method: 'POST',
    cache: 'no-store',
  })

  if (!response.ok) return null

  const json = (await response.json()) as { access_token?: string; expires_in?: number }
  if (!json.access_token) return null

  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000 - 60_000,
  }

  return cachedToken.value
}

export async function deskFetch(path: string, init: RequestInit = {}): Promise<Response | null> {
  const token = await accessToken()
  if (!token) return null

  return fetch(`${DESK_BASE}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Zoho-oauthtoken ${token}`,
      orgId: ORG_ID as string,
      'Content-Type': 'application/json',
    },
  })
}
