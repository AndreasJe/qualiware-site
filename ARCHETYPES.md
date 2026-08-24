# Page archetypes & E-E-A-T

Every marketing page belongs to exactly one archetype. The archetype decides the
layout, so a reader can tell what kind of page they are on before reading a word.
Set it with `pageType` on the Pages collection.

`src/components/PageShell` renders the furniture; the body is always built from
the 13 blocks.

## The archetypes

| `pageType` | Strip colour | Answers | Block skeleton |
| --- | --- | --- | --- |
| `platformCapability` | Deep green | "How does it work?" | `hero`(darkGreen) → `valueProps`(split) → `featureGrid` → `caseStudyCards` → `ctaBanner` |
| `solutionDiscipline` | Ice blue | "What is it for?" | `hero`(iceBlue) → `valueProps`(split, problem→outcome) → `featureGrid` → `testimonial` → `caseStudyCards` → `ctaBanner` |
| `solutionIndustry` | Tint | "What is it for, in my sector?" | `hero`(iceBlue) → `valueProps` → `featureGrid` → `caseStudyCards` → `ctaBanner` |
| `solutionRegulation` | Navy | "How do I meet this deadline?" | facts + requirements table (automatic) → `hero`(navy) → `featureGrid` → `valueProps` → `ctaBanner` |
| `resourceHub` | Tint | "What can I read?" | `hero`(darkGreen, `showSearch`) → `resourceGrid`(`showFilters`) → `ctaBanner` |
| `company` | Tint | "Who are you?" | `hero`(iceBlue) → `valueProps`(split, photo-led) → `logoWall` → `ctaBanner` |
| `legal` | — (austere) | "What are the terms?" | Plain document. No marketing blocks, no CTA. |
| `caseStudy` | — | Proof | Existing case-study layout |
| `standard` | — | Anything else | Free-form |

### The governing rule

**Platform answers "how does it work". Solutions answers "what is it for".**
Every URL belongs to exactly one. A Solutions page states problem → outcome →
proof, then links *down* into Platform capability pages via
`relatedCapabilities` — never the other way round. The shell renders those links
automatically as "The platform capabilities behind this".

## E-E-A-T

Google's Experience, Expertise, Authoritativeness, Trustworthiness. Four fields
carry it, and the shell renders them as a byline strip plus a sources list.

### `authorship`

| Field | Signal | Example |
| --- | --- | --- |
| `authorName` | Expertise | `Mette Holm` |
| `authorRole` | Expertise | `Principal Enterprise Architect, QualiWare` |
| `authorCredentials` | Expertise | `TOGAF 9 certified · 14 years in EA` |
| `reviewerName` / `reviewerRole` | Authoritativeness | `Lars Bek Jensen`, `Head of Compliance Practice` |
| `lastReviewed` | Trustworthiness | a real date, shown on the page |
| `experienceNote` | Experience | `Based on 40+ NIS2 scoping engagements since 2023.` |

**Rules**

- Every `platformCapability`, `solutionDiscipline`, `solutionIndustry` and
  `solutionRegulation` page gets a full `authorship` block. No exceptions —
  an unsigned technical page is the thing E-E-A-T penalises.
- `solutionRegulation` pages additionally get a named **reviewer**, because the
  content carries legal consequence.
- `experienceNote` must describe first-hand experience, with a number and a date
  where possible. Never "we are experts in X".
- `lastReviewed` is a real date. Regulation pages should be reviewed most often.

### `sources`

Every external claim needs a citation with a date: `label`, `publisher`, `url`,
`date`.

**Rules**

- Regulation pages cite the **actual legal instrument** — e.g. "Directive (EU)
  2022/2555 (NIS2)", publisher "Official Journal of the European Union", with a
  date. Article references go in `regulation.requirements[].article`.
- Analyst claims cite the specific report and year.
- **Never cite a competitor claim.** Comparison content stays "To verify" until
  someone has sourced and dated it.
- Do not invent URLs. If the exact URL is not known, give `label`, `publisher`
  and `date` and leave `url` empty — a citation without a link is honest; a
  fabricated link is not.

### `regulation`

Only on `solutionRegulation`. Buyers arrive with a deadline, not a discipline, so
these facts render *above* any product framing: `instrument`, `inForceSince`,
`deadline`, `appliesTo`, `penalty`, and a `requirements` array of
`{ requirement, evidence, article }`.

The requirements render as a real table on desktop and one card per requirement
below 900px — never a squeezed table.

## Slugs

`slug` is the **full path without a leading slash**, matching `src/lib/nav.ts`:

```
platform/application-portfolio-management
solutions/nis2
resources/blog
company/story
legal/terms
```

`home` is the property root. The resolver matches the whole joined path, so a
page called `nis2` will not answer `/solutions/nis2`.

## Trustworthiness content rules

Carried over from the handoff, and non-negotiable:

- **No prices anywhere.** Pricing tiers are named, not priced.
- **Competitor cells read "To verify"** until sourced and dated.
- Analyst wording must match what Gartner attribution permits — the Gartner
  claims are still unreconciled with the live site, see README.
- Every image is a labelled placeholder carrying its shot brief. Invent no
  assets and no photography.
