# Accounts, roles and author personas

Everything here is created by `npm run seed` and is reproducible. Every password
is `qualiware-dev`.

> **All of these are test fixtures.** Delete the end-user accounts before
> launch, and replace the author personas with real, consenting staff — see
> §4. A seeded account with a known password is a live credential.

---

## 1. Two separate populations

The system has two auth collections, deliberately kept apart.

| | `users` | `accounts` |
| --- | --- | --- |
| Who | QualiWare staff | Customers and partners |
| Signs in at | `/admin` | `/sign-in` |
| Can edit content | Yes | **Never** |
| Can reach `/admin` | Yes | No — redirected |
| Session cookie | `payload-token` | `qw-session` |

They use different cookie names on purpose. Payload derives its cookie name
from a *global* prefix, so both collections would otherwise share one — and
signing in as a customer would silently end your admin session in the same
browser.

---

## 2. Staff

### `andreas.jensen@qualiware.com` — super-admin

Yours. Full access to every collection across all four properties.

| | |
| --- | --- |
| Role | `super-admin` |
| Properties | main, docs, partners, support |
| Can do | Everything, including the things editors must not |

**What only a super-admin can do:**

- **Delete a tenant.** The multi-tenant plugin cascades deletes of all
  tenant-owned content when a tenant record is removed. This is locked to
  super-admin so a content editor cannot trigger it by accident.
- Create, edit and delete `users` and `accounts`.
- Change another user's `roles`.

**The `editor` role exists but is unused.** Every collection currently grants
write access to any authenticated staff member. With three trusted people that
is a reasonable position; if the team grows, tighten it before it grows.

---

## 3. End-user test accounts

`audiences` is the entitlement primitive. It gates documentation, decides where
someone lands after signing in, and tells the support form how to attribute a
ticket. Someone can hold both — a partner who is also a licensed customer.

### `customer@example.com` — Anna Lindqvist

| | |
| --- | --- |
| Organisation | Nordic Utility A/S |
| Audiences | `customer` |
| Support tier hint | premium |
| Lands on | `/customers/onboarding` |

**Purpose:** proves customer-only documentation is readable, and that
partner-only material is not.

### `partner@example.com` — Jonas Berg

| | |
| --- | --- |
| Organisation | Devoteam |
| Audiences | `partner` |
| Support tier hint | standard |
| Partner record | Devoteam |
| Lands on | the partners property |

**Purpose:** proves the partner-only playbook opens, and that customer-only
material stays hidden. The mirror image of Anna.

Also carries the support entitlement fixture. Devoteam's
`supportedCustomers` are seeded as:

| End customer | Sold |
| --- | --- |
| Nordic Utility A/S | premium |
| Kommunernes Landsforening | standard |
| **Vestjysk Forsyning** | **none — the case form must refuse this one** |

### `both@example.com` — Sofia Rasmussen

| | |
| --- | --- |
| Organisation | CGI |
| Audiences | `customer` + `partner` |
| Support tier hint | enhanced |
| Partner record | CGI Canada |
| Lands on | the partners property |

**Purpose:** proves audiences are additive rather than exclusive. Sofia sees
everything the other two see combined. CGI Canada's `supportedCustomers` are
Province of Ontario — Digital Service (enhanced) and City of Calgary (none).

### What this actually produces

Verified against a live session:

| Signed in as | partner-only | customer + partner | customer-only |
| --- | --- | --- | --- |
| anonymous | 404 | 404 | 404 |
| Anna (customer) | 404 | 200 | 200 |
| Jonas (partner) | 200 | 200 | 404 |
| Sofia (both) | 200 | 200 | 200 |

Restricted articles return **404, not a sign-in wall** — advertising that
restricted material exists is itself a leak. The same rule applies to search
results, sitemaps and the REST API.

---

## 3a. How audience control works — and what it actually enforces

> **This is a proof of concept.** The model is deliberately broader than what is
> wired up. Read this section before assuming a given surface is protected.

### The principle: gate on cost, not on value

The single most important thing in this section, because it is the decision an
editor makes wrongly by instinct.

The temptation is to gate whatever feels valuable. That is backwards. Content
that is valuable to read is usually *more* valuable to us when it is open: it
ranks, it answers a question before it becomes a support case, and it lets a
buyer research us quietly, months before they will talk to sales. Locking it
away trades all of that for a list of email addresses.

**Every gated page is invisible to search.** That is the price, and it is worth
paying rarely.

So: restrict only where giving something away *costs* us something real.

**Open, always:**
documentation, the help centre, the blog, webinars, guides, service status,
response targets, the partner directory, the integration catalogue.

**Gate the action, not the page:**
the support case form is readable by anyone; *submitting* needs an account,
because a case attaches to a contract and an SLA. Same for deal registration.
This is the pattern to reach for first — it keeps the page indexable and still
protects the thing that actually matters.

**Gate the content — only where it genuinely costs us:**
partner margin and commercial terms, deal registration detail, scoping and
pricing guidance, the implementation playbook.

A worked example of getting this right: the production upgrade runbook was
originally gated. It is now open. A customer hitting an upgrade problem at 2am
should be able to find it, and a competitor learns nothing from it.

### Properties and audiences are different things

Easy to conflate, so stated plainly:

- **Property** = one of the four websites (main, docs, partners, support). It is
  about *where content lives*, and is decided by the hostname.
- **Audience** = what kind of person an account holder is. It is about *who is
  reading*, and lives on their account.

`customer` is **not** "the support site". A customer is someone at an
organisation that has licensed QualiWare. A partner is someone at a company that
implements or resells it. The two are independent — someone can hold both, as
CGI does: they implement QualiWare and also run it themselves.

### The mechanism, end to end

Four pieces, all in version control:

**1. The account carries the entitlement.**
`accounts.audiences` is a multi-select of `customer` / `partner`. It is a list,
never a single role, because holding both is legitimate. Field-level access
makes it staff-only — nobody grants themselves an audience.

**2. The content declares who it is for.**
The same field appears on **Docs, Pages and Posts** — one field defined once, in
`src/collections/fields/audiences.ts`, so there is a single thing for an editor
to learn and a single rule enforcing it. **Empty means public, and that is the
default** — content is open unless someone deliberately restricts it.

It is optional everywhere. A page or post with no audiences behaves exactly as
it always did; nothing about the existing site changed when this was extended
beyond Docs.

**3. The access rule turns that into a query.**
`audienceVisibility` in `src/access/index.ts` returns a `Where` constraint rather
than a boolean, so the restriction is applied by the database on every read.
(`docsVisibility` still exists as an alias, so the Docs collection reads
naturally — it is the same function.)

```
anonymous  ->  audiences does not exist          (unrestricted articles only)
signed in  ->  audiences does not exist  OR  audiences intersects mine
staff      ->  everything
```

Because it is a query constraint and not a page-level check, it applies
everywhere the collection is read: pages, search results, the sitemap and the
REST API. There is no surface where the rule can be forgotten.

**4. The session is passed into every query.**
Payload access control reads `req.user`. Server-side queries made outside a
request — which is all of ours — must pass the user explicitly, or they run as
anonymous. `accessUserFor()` in `src/lib/session.ts` supplies it, and
`resolve.ts` and the search page both use it.

> A subtle failure mode worth knowing: if `payload.auth()` rejects a token it
> returns `null` rather than throwing, so a signed-in reader silently degrades
> to anonymous and restricted articles 404 for people entitled to them. This
> happened once during development, caused by adding `serverURL` without an
> `Origin` header on the internal auth call. If entitled readers ever start
> seeing 404s, look there first.

### What is actually enforced today

| Surface | Audience-aware? |
| --- | --- |
| **Docs** — pages, search, sitemap, REST API | **Yes** |
| **Pages** — including search and sitemap | **Yes** |
| **Posts** — blog, webinars, guides, analyst research | **Yes** |
| Post-login routing | Yes |
| **Submitting a support case** | **Yes** — sign-in required |
| Support tier *shown* on the account page | Yes, display only |
| Reading the support property — help centre, status, response targets | No, and deliberately so |
| **Partner portal** | **No** — a non-functional teaser |

In practice almost nothing is gated, and that is the intended state. Of 39 docs
articles, 2 are restricted. No page or post is. The field exists so that the few
genuinely commercial pieces *can* be restricted — not as an invitation.

### Two different kinds of gate

Worth separating, because they solve different problems:

**Content gating** — `audiences` on a Doc, Page or Post. The document itself
becomes unreadable, and returns **404**, not a sign-in wall. Advertising that
restricted material exists is itself a leak.

**Action gating** — the page stays public and indexable; one *operation* on it
requires an account. The support case form works this way: everyone can read the
response targets, the common requests and the help centre, but `submitCase`
refuses without a session.

Prefer action gating. It costs nothing in reach.

### Support: who may raise a case, and for whom

Three rules, all enforced server-side in
`src/components/SupportHome/actions.ts` — never only in the form.

**1. Submitting requires an account.** A case attaches to a contract and its
response times, and a typed email address is a claim rather than proof. Reading
the page still requires nothing. Signed-out visitors get a short explanation and
a sign-in link, plus the phone number for anything production-critical.

**2. Identity comes from the session, never the form.** The old form had `name`
and `email` inputs; they are gone. The address a case is attributed to decides
whose contract and whose history it joins, so taking it from a form field would
let anyone raise a case as anyone.

**3. Partners raise cases on behalf of an end customer.** A partner works the
problem first and escalates to us when they cannot resolve it — so a partner's
case has to name whose problem it is. `Partners.supportedCustomers` lists the
end customers a partner may raise for, and what they sold each one:

| `supportLevelSold` | What happens |
| --- | --- |
| `none` | **Refused.** The partner did not sell a support agreement, so QualiWare does not support that customer — the partner supports them directly. |
| `standard` / `enhanced` / `premium` | Allowed. The level is written into the case. |

The refusal is visible before anything is typed: the selector labels that
customer "— no support agreement", and the note under it says so in words. If it
is submitted anyway, the action refuses with an explanation and a pointer to
their partner manager.

Every partner-raised case opens with an entitlement block, so whoever picks it
up does not have to look the contract up:

```
End customer: Nordic Utility A/S
Support level: Premium
Sold by: Devoteam
Zoho account: 4200000123456
Raised by: Jonas Berg <partner@example.com>
```

The subject is prefixed with the end customer's name. **Zoho Desk remains
authoritative for the actual contract** — `supportedCustomers` mirrors it so the
form can refuse early, and will drift if nobody maintains it. See `TODO.md`.

### Adding a restricted article, page or post

1. Open the document in **Docs**, **Pages** or **Posts**
2. **Audiences** in the sidebar — add `customer`, `partner`, or both. Leave
   empty for public
3. Save

Then read *Gate on cost, not on value* above again and ask whether you should
have. Usually the answer is no.

Verify by signing out: it should return **404**.

---

### What an account holder cannot edit about themselves

The rule: *an account holder may edit presentation facts about themselves, and
never anything that asserts organisational identity or entitlement.*

| Field | Self-editable |
| --- | --- |
| `fullName` | **yes** |
| `email` | no — login credential and the Zoho contact key |
| `zohoContactId` | no — grants access to a contact's ticket history |
| `audiences` | no — the entitlement itself |
| `organisation` | no — asserts who you work for |
| `partner` | no — claims a partner organisation |
| `supportTierHint` | no |

Each of these was confirmed by attempting the change over the API as a
signed-in partner.

---

## 4. Author personas

Five people, assigned by topic so the byline is credible. Managed in
**People → Authors**; editing a person updates every page they appear on.

| Person | Role | Signs |
| --- | --- | --- |
| Mette Holm | Compliance Manager | Regulation, GRC, legal, certifications |
| Rasmus Vestergaard | Solution Architect | Platform machinery, API, integrations |
| Anne Sofie Dahl | Enterprise Architect | Solutions — disciplines and industries |
| Line Toft Sørensen | Head of Marketing | Resources, company, partner pages |
| Peter Dahl | Chief Executive Officer | Company story; reviews regulation pages |

A page is never reviewed by the person who wrote it. Compliance is reviewed by
the CEO, architects review each other, marketing is reviewed by an architect
for accuracy.

### Worked example — replicating the structure

Take **Mette Holm**, and copy this shape exactly.

```
Name         Mette Holm
Slug         mette-holm
Role         Compliance Manager, QualiWare
Credentials  ISO 27001 Lead Auditor · 14 years in governance and risk
LinkedIn     https://www.linkedin.com/in/…
Photo        head-and-shoulders, real photo
Bio          Works with customers on NIS2, DORA and ISO 27001 programmes,
             mostly on the unglamorous part: what an auditor will actually
             accept as evidence.
```

**Why each field is shaped that way:**

**Name** — as it should read in a byline. No titles, no post-nominals; those
belong in Credentials.

**Slug** — lowercase, hyphenated, derived from the name. Unique, and stable:
changing it later would break any author profile URL built on it.

**Role** — job title *plus* the company. "Compliance Manager" alone is
ambiguous on a page that also cites external bodies; "Compliance Manager,
QualiWare" is not.

**Credentials** — one line, and every claim checkable. The pattern is
`<qualification> · <duration> in <field>`, separated by a middle dot. It is a
credibility signal, not a CV: two claims is right, four is padding. "ISO 27001
Lead Auditor" is a real certification someone can verify. "Passionate about
compliance" is not, and actively weakens the byline.

**LinkedIn** — required, and validated as a real LinkedIn URL. An author a
reader cannot verify is barely a signal at all. *The seeded personas all point
at the QualiWare company page, because inventing personal profile URLs would
mean fabricating links — replace each with the real profile.*

**Photo** — optional in the schema; the byline falls back to initials. Add one:
a face is a large part of why an author entity outperforms a name string.

**Bio** — two or three sentences on what the person actually does, in concrete
terms. Note that Mette's says what she works on and admits the unglamorous part
of it. Write the sentence a colleague would recognise, not the one a brochure
would print.

### Assigning a person to a page

On the page: **Authorship → Author**, and **Reviewer** where the content
carries consequence. Then:

- **Last reviewed** — a real date. Regulation pages need re-reviewing most
  often, because the underlying instruments change.
- **Experience note** — first-hand grounding, with a number and a date:
  *"Based on 40+ NIS2 scoping workshops with Nordic entities since January
  2023."* This belongs to the **page**, not the person — it describes the work
  behind that page. Never write "we are experts in X"; that is the opposite of
  an experience signal.

### Before launch

Every persona above is invented, and so is every figure in every experience
note. Replace them with real staff who have agreed to be named, give each a
genuine LinkedIn URL and photo, and check that the experience claims are true.

**A fabricated byline is worse than no byline** — it is precisely what E-E-A-T
is designed to detect.

---

## 5. Resetting

```bash
npm run seed
```

Idempotent — safe to run repeatedly. It converges on this exact set: authors
not in the canonical five are deleted, and integrations not in the catalogue
are removed.

If a test account locks itself out (five failed attempts, ten-minute lock),
either wait, or clear `login_attempts` and `lock_until` on that row.
