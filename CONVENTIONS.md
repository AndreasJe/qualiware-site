# Build conventions — read before writing components

## Stack

Payload CMS 3.88 installed into Next.js 16 (App Router, React 19). One app, one
database, three tenants (`main`, `docs`, `partners`).

## File layout

- Block components: `src/blocks/<BlockName>/index.tsx` + `<BlockName>.module.css`
- Shared components: `src/components/<Name>.tsx` + `<Name>.module.css`
- Payload block field definitions already exist in `src/blocks/index.ts` — **do not edit them**
- Generated types: `src/payload-types.ts` — import block prop types from here

## Types

Every block has a named generated interface. Import it, do not redeclare it:

```tsx
import type { HeroBlock } from '../../payload-types'

export const Hero = (props: HeroBlock) => { ... }
```

Payload fields are nullable (`string | null | undefined`), so guard before use.
Arrays may be `null`. Relationship fields are `number | Doc` — check
`typeof x === 'object'` before reading properties.

## Styling

**CSS Modules only.** No inline styles except for genuinely dynamic values
(a computed width, a colour coming from CMS data). The prototype's inline styles
are a runtime artefact — do not carry them over.

All colours and type sizes come from the tokens in `src/styles/globals.css`.
Never hardcode a hex value that has a token:

| Token | Value | Use |
| --- | --- | --- |
| `--qw-green` | `#2b675b` | Headings, primary buttons, dark sections, footer |
| `--qw-green-pressed` | `#1d4a41` | Hover on primary buttons |
| `--qw-green-deep` | `#12332c` | Text on neon, code blocks |
| `--qw-ice` | `#d2e9e3` | Secondary sections, quote panels, stat bands |
| `--qw-navy` | `#2e4163` | Analyst/Gartner panels, partner sub-bar |
| `--qw-neon` | `#00ff00` | **Accent only, under 5% of any screen** |
| `--qw-heading` | `#26332f` | Body headings |
| `--qw-article` | `#334a44` | Article body text |
| `--qw-on-ice` | `#37544c` | Copy on ice blue |
| `--qw-body` | `#46564f` | Body copy |
| `--qw-meta` | `#7d8f8a` | Captions and meta |
| `--qw-border` | `#e4ece9` | 1px borders |
| `--qw-divider` | `#eaf0ee` | Inner dividers |
| `--qw-tint` | `#f4f8f6` | Tinted sections |
| `--qw-ground` | `#f7faf9` | UI-mock / sidebar ground |

Type tokens: `--qw-h1-hero`, `--qw-h1`, `--qw-h2`, `--qw-h3`, `--qw-eyebrow`,
`--qw-lead`, `--qw-body-size`, `--qw-small`. Utility classes `.qw-h1-hero`,
`.qw-h1`, `.qw-h2`, `.qw-h3`, `.qw-eyebrow`, `.qw-lead`, `.qw-small` are global.

Layout tokens: `--qw-gutter` (18px mobile / 44px desktop), `--qw-section`
(30px / 68px vertical rhythm), `--qw-max` (1440px).

Global helpers you should reuse rather than reinvent: `.qw-section`,
`.qw-shell`, `.qw-btn` + `.qw-btn--neon|--solid|--outline|--outline-green|--full`,
`.qw-card`, `.qw-card--feature`, `.qw-arrow-list`, `.qw-slot`, `.qw-sr`.

Animation helpers: `.qw-anim-drift`, `.qw-anim-trace`, `.qw-anim-sweep`,
`.qw-anim-bar`, `.qw-anim-bob`. A global `prefers-reduced-motion` block already
neutralises all of them — do not add your own media query for that.

## Hard design rules

1. **Mobile-first.** Write the mobile rule, then `@media (min-width: 900px)` for
   desktop. 900px is the only breakpoint in the system.
2. **Corners are square.** `border-radius: 0` everywhere. The only exceptions:
   2px on buttons (already in `.qw-btn`) and 50% on status dots.
3. **Card hover changes border colour only** — no lift, no shadow, no transform.
4. **Shadow appears exactly once in the system**, on the mega-menu panel. Never
   add another.
5. **Neon `#00ff00` is accent only, under 5% of any screen.** Arrows, one CTA
   fill per screen, active underlines. Never a large fill or background.
6. **Mobile hit targets minimum 44px.**
7. `text-wrap: pretty` on long headings and lead paragraphs (the `.qw-h*` and
   `.qw-lead` classes already do this).

## Shared components — use these, don't duplicate

```tsx
import { Arrow, ScrollCue, Chevron } from '../../components/Arrow'
import { ImageSlot } from '../../components/ImageSlot'
```

- `<Arrow width={26} stroke="var(--qw-neon)" strokeWidth={1.8} />` — the signature
  motif. Neon on dark and on white buttons, `var(--qw-green)` on ice blue.
  Used inside every CTA button, every "read more" link, and value-block bullets.
- `<ScrollCue />` — the bobbing down-arrow at the bottom of a hero.
- `<Chevron open={bool} />` — nav triggers and tree disclosure.
- `<ImageSlot slot={data.image} />` — renders the uploaded image, or the labelled
  dashed placeholder carrying the shot brief. Every image in the design is a
  placeholder; never render a bare `<img>` for CMS media.

## Server vs client components

Default to server components. Add `'use client'` **only** when the component owns
interactive state. Per the handoff, that is: the header menus, the docs tree, the
partner directory filters, the comparison-table mobile vendor selector, resource
filter chips, and forms. Everything else is static markup.

## Accessibility

- Disclosure triggers are `<button aria-expanded>`, never a `<div onClick>`.
- Escape closes any open overlay; focus returns to the trigger.
- Decorative SVG gets `aria-hidden="true"`; the `Arrow` component already does.
- Every input has a real `<label>` (use `.qw-sr` when the design hides it).
- Tables use `<th scope>`; the mobile fallback is a separate card list, not a
  squeezed table.

## Design reference

`../../QualiWare marketing site mockup/design_handoff_qualiware_site/`

- `README.md` — tokens, IA, per-artboard descriptions, interaction spec
- `QualiWare Website.dc.html` — the 15 artboards. Artboard line numbers:
  1a 334 · 1b 594 · 1c 773 · 1d 787 · 1e 872 · 1f 999 · 1g 1117 · 1h 1184 ·
  1i 1261 · 1j 1428 · 1k 1575 · 1l 1656 · 1m 1735 · 1n 1841 · 1o 1950
- `SiteHeaderV2.dc.html`, `SiteFooter.dc.html` — already implemented

Read the relevant artboard range for exact copy, spacing and colour. Copy the
**content** faithfully (it is final), translate the **styling** into CSS modules
with tokens.
