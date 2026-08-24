# Security & deployment

Self-hosted on TAPPaaS: one LXC per site, Podman available inside, OPNsense at
the edge terminating TLS and holding public DNS records.

This document covers what the application does, what the platform must do, and
what is still outstanding.

---

## 1. Why this is a smaller target than WordPress

Worth stating plainly, because "we moved off WordPress" is not by itself a
security posture.

| | WordPress | This application |
| --- | --- | --- |
| Third-party code | Plugins with DB access, own update cadence, installable from the browser | npm packages, version-pinned, compiled at build, changed via a commit |
| Code execution | PHP interpreted per request from a web-writable directory | Compiled build artifact; no interpreter reading `uploads/` |
| Who can install code | Anyone with an admin login | Nobody. It is a deploy |
| Access rules | Plugin settings | Typed functions in version control |

**The difference that matters most:** in WordPress an admin-account compromise
can become remote code execution, because an admin can upload a plugin. Here an
admin-account compromise gets content vandalism. Both are bad; only one gives
away the host.

The Payload admin panel *does* exist in production, at `/admin`. It edits
content — there is no plugin installer, no theme editor, no file manager. It is
a React client talking to the same REST API under the same access control, so
it cannot do anything the API would not already permit that user to do.

---

## 2. What the application does

### Access control

Enforced in `src/access/` and per-field on collections, and verified against a
live signed-in session:

- **Documentation gating** — an article restricts itself by listing
  `audiences`. Anonymous readers get a 404 rather than a sign-in wall, because
  advertising that restricted material exists is itself a leak. The same rule
  applies to search results, sitemaps and the REST API.
- **Identity fields are staff-only.** An account holder may edit presentation
  facts about themselves and nothing that asserts organisational identity or
  entitlement: `email`, `zohoContactId`, `audiences`, `organisation`,
  `partner` and `supportTierHint` all reject self-edits.
- **Content writing is staff-only.** An end-user session cannot write to any
  content collection, and cannot reach `/admin`.

### Authentication

- Two separate auth collections: `users` (staff, `/admin`) and `accounts`
  (customers and partners, `/sign-in`).
- End users get their own `qw-session` cookie. Payload derives its cookie name
  from a *global* prefix, so both collections would otherwise share one and
  signing in as a customer would silently end an admin session.
- **Brute-force lockout**: five failed attempts, ten-minute lock (Payload
  default). Confirmed working.
- **Rate limiting**: ten sign-in attempts per address per ten minutes, on top
  of the per-account lockout. The lockout stops repeated attempts against one
  account; this stops one source spraying many.
- Failed sign-in always returns the same message, so the form cannot be used to
  discover which addresses exist.

### Public endpoints

The demo form, partner application and support case form accept anonymous
POSTs. All three are rate-limited (five per address per ten minutes).

`src/lib/rateLimit.ts` is **in-memory**, which is correct for a single instance
but has two consequences: counters reset on redeploy, and it does not
coordinate across instances. Volumetric protection belongs at OPNsense.

### Headers

Set in `next.config.mjs`: HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options`, `Permissions-Policy`, and a CSP.

The CSP is **scoped to the public site only**. The Payload admin needs looser
script and style rules, and a CSP tight enough to be worth having on the front
end would break it — so it is scoped by path rather than weakened to fit both.

`X-Powered-By` is disabled.

### Secrets

`src/lib/zohoClient.ts` and `src/lib/session.ts` are server-only. The Zoho
client secret and refresh token are never referenced from a client component,
so they cannot reach the browser bundle.

---

## 3. What the platform must provide

### Database — do this before launch

**SQLite must not go to production.** It locks the whole file for a write, so
one background process blocks every other writer. This has already been
observed during development as `database is locked`, twice. With three editors
and a running web server it will be constant.

The adapter is chosen by connection string, so the same build runs either way:

```
DATABASE_URI=postgres://qualiware:…@127.0.0.1:5432/qualiware
```

Anything starting `postgres` selects Postgres; anything else falls back to
SQLite. Follow the pattern the `wordpress` template uses for MariaDB: install
Postgres natively in the LXC and **bind it to loopback explicitly** rather than
relying on the package default.

### Process

Node runs as a service under an unprivileged user, restarts on failure, starts
on boot. It listens on loopback only — Caddy inside the LXC is what should be
reachable on the bridge.

### The four domains

This application serves **four** properties from one deployment:

```
qualiware.com          docs.qualiware.com
partners.qualiware.com support.qualiware.com
```

`src/proxy.ts` maps host to tenant, so all four must reach the same instance.
The hosting module's `proxyDomain` is a single field — either the template needs
to accept several, or the edge must route all four to this site's LXC.

Set `NEXT_PUBLIC_ROOT_DOMAIN=qualiware.com` so generated cross-property links
use the real hosts.

### Media

Uploads currently go to a local directory. It must be on persistent storage,
included in backups, served by Caddy rather than Node, and **never
executable**. That last point is the single most exploited property of a
WordPress uploads directory.

### Backups

Postgres dump plus the media directory, off-box, with a **tested restore**. An
untested backup is a guess.

### Patching

Node LTS and OS patching, plus `npm audit` in CI and automated dependency PRs.
The surface is smaller than WordPress's, not absent — this is the same
discipline, applied to fewer moving parts.

---

## 4. Restrict the admin panel

`/admin` is a public login form. Self-hosting makes this cheap to fix: restrict
it at Caddy to the office range or the VPN.

```caddy
@admin path /admin*
handle @admin {
  @notallowed not remote_ip 10.0.0.0/8 <office-range>
  respond @notallowed 403
  reverse_proxy 127.0.0.1:3000
}
```

Verify the ranges against your own network before applying. This removes the
brute-force surface entirely — the exact traffic the WordPress site is seeing
against `martin.tolle@qualiware.com`.

---

## 5. Environment

```bash
DATABASE_URI=postgres://…              # postgres in production
PAYLOAD_SECRET=…                       # rotate before launch; invalidates sessions
NEXT_PUBLIC_ROOT_DOMAIN=qualiware.com
SESSION_COOKIE_DOMAIN=.qualiware.com   # or sign-in will not span the properties
NEXT_PUBLIC_ALLOW_INDEXING=false       # on any non-production deployment
NEXT_PUBLIC_PROTOTYPE_MODE=false       # in production

SMTP_HOST=…                            # without this, password reset does nothing
SMTP_PORT=587
SMTP_USER=…
SMTP_PASSWORD=…
SMTP_FROM_ADDRESS=no-reply@qualiware.com

ZOHO_DESK_ORG_ID=…                     # EU data centre
ZOHO_DESK_CLIENT_ID=…
ZOHO_DESK_CLIENT_SECRET=…
ZOHO_DESK_REFRESH_TOKEN=…
```

File permissions restricted to the service user. Never committed.

---

## 6. Outstanding

**Before launch**

1. Postgres, not SQLite
2. Rotate `PAYLOAD_SECRET`
3. SMTP configured — password reset currently does nothing, which matters more
   now that this replaces Zoho's help-centre login
4. Delete the demo accounts (`customer@`, `partner@`, `both@example.com`, all
   `qualiware-dev`)
5. `/admin` restricted at Caddy
6. Backups running and a restore tested

**Soon after**

- 2FA or SSO on `/admin` — there is none today
- Upload type and size limits on the Media collection
- Log aggregation and alerting on failed sign-ins

---

## 7. Two things unrelated to this application

**The WordPress site reports sending outbound spam.** That indicates either a
compromise or a form being abused as a relay. It damages email deliverability
for the whole domain, including anything this site sends. It is not fixed by
this migration and should be investigated separately.

**Do not host this on that box**, and if any content is migrated across,
sanitise it. Inheriting injected markup from a compromised site into a clean
CMS is a common way to throw away the benefit of moving.
