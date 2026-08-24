# TODO

Open items, grouped so a session can pick up one area without reading the rest.

---

## Hosting module (TAPPaaS)

Context: `Community/src/AndreasJe/hosting`. One LXC per site, Podman inside,
OPNsense at the edge for TLS and public records, Caddy inside the LXC.
Templates live in `templates/<name>/` as `README.md` + `template.json` +
`install.sh` / `update.sh` / `test.sh`.

### 1. There is no template for this kind of site

Existing templates are `static`, `static-apex` and `wordpress`. This app is a
long-running Node process with a database — closest in shape to `wordpress`
(Podman + native DB + Caddy), but nothing matches it.

**Needs a new template**, roughly:

| | |
| --- | --- |
| Runtime | Node LTS running the built Next app, bound to loopback |
| Database | PostgreSQL, native, bound to loopback — mirror the pattern `wordpress/install.sh` uses for MariaDB |
| Proxy | Caddy in the LXC → `127.0.0.1:3000` |
| Build | `npm ci && npm run build`, then `npm run seed` on first install only |
| Service | systemd unit, non-root user, restart on failure, start on boot |
| Media | persistent path served by Caddy, **never executable** |
| Sizing | needs measuring — 2 cores / 2048MB is the WordPress default and is a starting guess, not a finding |

### 2. `proxyDomain` is singular — this app needs four

`requiredFields: ["proxyDomain"]`, one value. This deployment serves:

```
qualiware.com   docs.qualiware.com   partners.qualiware.com   support.qualiware.com
```

`src/proxy.ts` maps host → tenant, so **all four must reach the same LXC**.

Two ways, and this is the decision to make:

- **Template accepts a list** — e.g. `proxyDomains: []`, with the core module
  registering each at the edge. Cleaner, but touches shared module code.
- **Edge routes all four** to this site's LXC while `proxyDomain` names only
  the primary. Less invasive; the extra hostnames live in OPNsense config
  rather than the site's JSON, which is a discoverability cost.

Also confirm the certificate covers all four names — a wildcard for
`*.qualiware.com` plus the apex, or a SAN certificate listing each.

### 3. Secrets have nowhere to live

The app needs `PAYLOAD_SECRET`, `DATABASE_URI`, SMTP credentials and four Zoho
Desk values. See `.env.example`.

`<sitename>.json` is committed to the repo, so **secrets must not go in it**.
Needs a decision: a `.env` written by `install.sh` from a prompt, an
out-of-band file the template reads, or something the platform already offers
that I could not see from the public repo.

Whatever the mechanism, the file ends up owned by the service user with `600`.

### 4. First-install vs update

`update-module.sh` runs on the platform's hourly schedule. For this app an
update is: pull, `npm ci`, `npm run build`, restart the service.

**`npm run seed` must not run on the hourly update.** It is idempotent, but it
converges content back to the seeded set — it deletes authors outside the
canonical five and integrations outside the catalogue. Running it hourly would
silently revert editor changes to those collections. First install only.

### 5. Backups

Postgres dump plus the media directory, off-box, with a **tested** restore.
Check whether the platform already provides this per-LXC before building
anything.

### 6. Verify before relying on it

I read the hosting `README.md` and `templates/wordpress/install.sh` from the
public repo, but have not run any of it. Confirm:

- how `install.sh` receives configuration beyond `get_config_value` /
  `get_nested_config_value`
- whether nested Podman is the expected way to run a Node app here, or whether
  a native systemd service is more idiomatic for this platform
- the `vfs` storage-driver constraint noted in `wordpress/install.sh` — it
  applies to Podman on ZFS-backed LXC, so it matters only if this runs
  containerised

---

## Before launch

1. **Postgres, not SQLite.** `database is locked` has already been hit twice in
   development with a single user.
2. **Rotate `PAYLOAD_SECRET`** — invalidates sessions, so do it before launch.
3. **SMTP configured.** Password reset currently does nothing, which matters
   more now that this replaces Zoho's help-centre login.
4. **Delete the demo accounts** — `customer@`, `partner@`, `both@example.com`,
   all with the password `qualiware-dev`.
5. **Restrict `/admin` at Caddy** to the office range or VPN. There is no 2FA.
6. **`NEXT_PUBLIC_ALLOW_INDEXING=false`** on any review deployment.
7. **Replace the author personas** with real, consenting staff and genuine
   LinkedIn URLs. See `ACCOUNTS.md` §4.
8. **Legal review of the four regulation pages.** Claims to verify are listed
   in `README.md`.
9. **Reconcile the Gartner claims** with the live site — Leader vs Visionary on
   the EA Magic Quadrant is still unresolved.

---

## Content and product

- **Posts collection is built but not wired.** The collection exists; the
  detail route, the ResourceGrid query and seeding the ten previously-dead
  articles do not. Until then those resource links land on the prototype
  placeholder.
- **Integration catalogue is data-driven on the partner site only.**
  `/platform/integrations` on the main site is still hand-written blocks
  covering the same subject — one source will drift from the other. The
  collection now carries `builtBy` and `status`, so one dataset can serve both.
- **Tier table, docs orientation cards and the portal teaser are static
  components**, not CMS content. Changing their copy needs a deploy.
- **Every image is a placeholder** carrying its shot brief. 49 slots.
- **28 → 5 authors is done**, but page assignment is by topic rule, not chosen
  per page. Worth reviewing once real staff replace the personas.

---

## Audience gating — proof of concept

`accounts.audiences` (`customer` / `partner`) is modelled end to end. The
`audiences` field now exists on **Docs, Pages and Posts**, optional everywhere,
empty (public) by default. Mechanism and rationale in `ACCOUNTS.md` §3a; the
editor-facing version is `EDITORS.md` §7.

The governing principle, so it does not get lost: **gate on cost, not on value.**
Every gated page is invisible to search. Prefer gating the *action* over the
page — the support form is the worked example.

Wired and verified:

- **Submitting a support case requires a session.** Identity comes from the
  session; the form's `name` and `email` fields are gone.
- **Partner cases carry an entitlement block** — end customer, support level,
  who sold it, Zoho account, who raised it — and the subject is prefixed with
  the end customer's name.
- **Partners who sold no support agreement are refused**, in the selector
  labelling and again server-side.

Still open:

- **`Partners.supportedCustomers` duplicates the contract.** Zoho Desk is
  authoritative; this mirrors it so the form can refuse early. Nothing keeps
  them in sync, so it *will* drift. Either accept it as a staff-maintained
  convenience or derive it from Zoho at request time (needs the org token and a
  cache; the entitlement is not something to fetch on every keystroke).
- **`zohoContactId` is still not used when creating a case.** With it, a case
  could attribute to the real Zoho contact rather than an email address, and
  ticket history could be fetched server-side with the org token — no Zoho
  login for the end user at all. See `README.md` § *Linking accounts to Zoho
  Desk* for the four rules that constrain how that field may ever be set.
- **Partner portal** is a non-functional teaser with a disabled sign-in button.
- **Nothing tells a partner manager** when a partner tries to raise a case for a
  customer with no agreement. That is a sales signal currently thrown away.
- **Cross-subdomain sessions cannot be tested on `localhost`.** `.localhost` is
  a TLD, so browsers reject a `Domain=localhost` cookie and the session does not
  reach `support.localhost:3000`. Production is fine — `SESSION_COOKIE_DOMAIN`
  is set to `.qualiware.com`. To exercise a signed-in flow locally, use the path
  form (`localhost:3000/support`) instead of the subdomain.

## Known gaps

- **No 2FA** on either sign-in.
- **Search is `LIKE` matching**, not ranked or fuzzy. Fine at this corpus size.
- **Rate limiting is in-memory** — resets on redeploy, does not coordinate
  across instances. Correct for one LXC; revisit if it ever scales out.
- **Gated content 404s** rather than offering a sign-in wall. Safe and
  deliberate, but a friendlier interstitial would be better once gating is
  actually used.
- **`/directory` and `/integrations` are reserved paths** — guarded routes that
  404 outside the partners tenant, so the main site cannot use those slugs.

---

## Unrelated, but urgent

**The WordPress site reports sending outbound spam.** That is either a
compromise or a form being abused as a relay. It damages email deliverability
for the whole domain, including anything this site sends, and is not fixed by
this migration. Do not host this app on that box, and sanitise any content
migrated across.
