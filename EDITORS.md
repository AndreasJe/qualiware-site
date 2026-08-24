# Editing the QualiWare site

A guide for the people who maintain content. No code required.

**Admin panel:** <http://localhost:3000/admin>

> The `:3000` matters. Without it your browser hits a different server on your
> machine and you get an unrelated .NET error page.

---

## 1. The four properties

One admin panel runs four public websites:

| Property | Address | What lives there |
| --- | --- | --- |
| **Main** | qualiware.com | Marketing: Platform, Solutions, Pricing, Resources, Company, Legal |
| **Docs** | docs.qualiware.com | Product documentation and the wiki |
| **Partners** | partners.qualiware.com | Partner programme, directory, integrations marketplace |
| **Support** | support.qualiware.com | Support hub |

**The property selector is at the top of the admin.** Whichever property is
selected, everything below filters to it — page lists, search, and every
relationship picker.

> **Check the selector before you create anything.** A page created while
> "Partners" is selected belongs to the partner site, and will not appear on
> qualiware.com. Moving it later means editing the record, not dragging it.

---

## 2. What each collection is for

### Content

- **Pages** — every page on *every* property. Not just the homepage. The
  property selector decides which site a page belongs to.
- **Media** — images. Upload once, use anywhere.

### Documentation

- **Docs** — documentation articles. One record per article.
- **Categories** — the navigation tree down the left of the docs site. Also
  decides article URLs.

### Partners

- **Partners** — one record per partner company. Powers the directory.
- **Integrations** — the integrations catalogue.

### People

- **Authors** — the people whose names appear on page bylines.
- **Accounts** — customer and partner logins. Usually left alone.

### Settings

Users, Tenants and Form submissions. Leave these to an administrator.

---

## 3. Finding a page among thousands

Four ways, in the order you will actually use them:

1. **Search.** Type part of the title or the URL. Fastest by a distance.
2. **The Section column.** Every page shows its section — Platform, Solutions,
   Resources, Company, Legal, and so on. Set automatically from the URL, so it
   can never be wrong.
3. **Folders.** Group pages however you like, without changing any URL.
4. **Filters.** Narrow by section or page type when the list is still long.

---

## 4. Step by step

### Change something on the homepage

1. Property selector → **Main**
2. **Content → Pages**
3. Search `home`, open it
4. Scroll to **Layout** — each block is one band of the page, in order
5. Open a block, edit the text, **Save**

### Replace the hero image

1. Open the page, find the **Hero** block in Layout
2. Expand its **Image** group
3. **Media** → upload or choose an existing image
4. Leave the **Placeholder** text alone — it is the brief describing the shot
   that belongs there, and it only shows while no image is uploaded
5. **Save**

### Add a new page

1. Property selector → the right property
2. **Content → Pages → Create New**
3. **Choose the Page Type first.** This builds the page for you: the right
   blocks, in the right order, already styled
4. Fill in **Title**
5. Fill in **Slug** — this *is* the URL. `solutions/nis2` becomes
   `qualiware.com/solutions/nis2`. No leading slash
6. Replace the placeholder text. Anything in `[square brackets]` is a prompt
   telling you what belongs there
7. Set **SEO → Meta title** and **Meta description** (140–160 characters)
8. Set **Authorship → Author**, and **Last reviewed**
9. **Save**

> Styling options such as colour and layout are hidden on most page types. That
> is deliberate — the page type owns how the page looks, so pages of the same
> kind stay consistent. On a "Standard" page the options reappear.

### Add a documentation article

1. Property selector → **Docs**
2. **Documentation → Docs → Create New**
3. **Category** decides both where it appears in the tree and its URL
4. **Order** sets its position among its siblings — lower numbers first
5. Write the **Body**
6. Leave **Audiences** empty for public. Set it only to restrict an article to
   customers or partners
7. **Save**

### Add a documentation category

1. **Documentation → Categories → Create New**
2. **Parent** — leave empty for a top-level section
3. **Order** — position among siblings. Use 10, 20, 30 so you can insert later
4. **Save**

> Renaming or moving a category rewrites the URL of every article beneath it,
> automatically. That is intended — but it does change live URLs.

### Add an author

1. **People → Authors → Create New**
2. Name, Role, Credentials and LinkedIn are all required. An incomplete byline
   is worse than none
3. Keep **Credentials** to one line: `ISO 27001 Lead Auditor · 14 years in
   governance and risk`
4. Add a **Photo** — until you do, the byline shows initials
5. **Save**

Editing an author updates every page they appear on. That is the point.

---

## 5. Rules worth knowing

**The slug is the URL.** Changing it changes the live address and breaks any
existing link to it.

**Never invent a source.** If a page cites a report or a regulation, the
citation needs a publisher and a date. If you do not have the exact link, leave
the URL empty — a citation without a link is honest; a made-up link is not.

**Never write a claim about a competitor** unless it is sourced and dated. The
comparison page reads "To verify" for exactly this reason.

**No prices anywhere.** Pricing pages name the tiers only.

**Leave Audiences empty.** This is the sidebar field on Docs, Pages and Posts.
Empty means public, and public is right for almost everything — see section 7.

**Every image is a placeholder** until someone uploads a real one. The
placeholder text describes the shot required.

---

## 6. If something looks wrong

**"Doesn't exist in this prototype"** — a real page, not an error. That link
points somewhere not built yet. Click the green button to go back.

**A page won't save** — a required field is empty. The admin marks it in red;
check the sidebar fields too, not just the main column.

**Changes don't appear on the site** — confirm you saved, and that you were on
the right property.

**A docs article is missing from the site** — check **Audiences**. If it lists
an audience, it is hidden from anyone not signed in with it.

**A page or post is missing from the site** — same field, same reason. It now
exists on Pages and Posts too.

---

## 7. Audiences — when to lock something, and when not to

There is a sidebar field called **Audiences** on Docs, Pages and Posts. It has
two options, `Customers` and `Partners`.

**Empty means public. Leave it empty.** That is not a placeholder instruction —
it is the right answer for almost everything you will ever write.

### Why "lock it" is usually the wrong instinct

The temptation is to gate whatever feels valuable. That is backwards. Content
that is valuable to read is usually worth *more* to us when it is open:

- Google cannot index a locked page. **It will not rank. Ever.**
- A locked page cannot answer a question before it becomes a support ticket
- Most buyers research quietly for months before they will talk to sales. A
  form in the way sends them to a competitor who did not put one there

You trade all of that for a list of email addresses, most of which are fake.

### The rule: lock on cost, not on value

Ask: *does giving this away cost us something real?* Not "is it good" — good is
the reason to publish it.

**Leave open** — documentation, help articles, blog posts, webinars, guides,
service status, response targets, the partner directory, integrations, anything
that helps somebody use or evaluate the product.

**Lock** — partner margin and commercial terms, deal registration detail,
scoping and pricing guidance, the implementation playbook. Roughly: things a
competitor could use against us, or that only make sense to someone who has
already signed something.

If you are unsure, leave it open and ask. Opening a locked page later loses
nothing; a page that was locked for six months lost six months of ranking that
does not come back.

> A worked example: the production upgrade runbook used to be locked. It is now
> open. Someone hitting an upgrade problem at 2am should be able to find it, and
> a competitor learns nothing from reading it.

### There is a better option than locking a page

Often what you actually want to protect is one *action*, not the whole page.

The support page works this way. Anyone can read the response times, the common
requests and the help centre. Only **submitting a case** requires signing in —
because a case attaches to a real support contract, and a typed email address
proves nothing.

The page stays public and keeps ranking. Ask a developer before locking a page;
this may be what you meant.

### What locking actually does

A locked document returns **"page not found"** to anyone not entitled to it —
not a sign-in prompt. That is on purpose: telling the world that a
"Partner margin structure" page exists is itself a leak.

It applies everywhere at once — the page, site search, the sitemap and the API.
There is no way to lock it in one place and forget another.
