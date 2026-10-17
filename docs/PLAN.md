# Opperiod LLC Website Build Plan (v1)

Hand this whole file to Claude Code. Read it fully before writing any code. Work in the phases at the bottom and stop for my review at the end of each phase.

## 1. What we're building

A marketing site for **Opperiod LLC**, a small holdings company that owns and operates a growing set of ventures. The site has two jobs:

1. Present Opperiod as a credible, organized parent company.
2. Give each venture ("project") its own page, and make adding a new project later about as easy as creating one file.

Owner: Samuel Ferrenburg, a fire lieutenant based in Westlake, Louisiana (Lake Charles area). The fire service background is part of the identity of the company and should come through in tone, but this is not a fire department website.

Starting projects:

- **Box Alarm Builders**, a general contracting branch (logo provided)
- **StationScore**, a SaaS product that helps small fire departments prepare for insurance rating evaluations
- **IAPassist**, a software product (details to be provided, see Open Questions)

## 2. Hard rules for Claude Code

- Do not invent facts. No made up licenses, years in business, client names, testimonials, stats, addresses, phone numbers, or pricing. Where content is missing, use an obvious placeholder like `TODO: owner to provide` and list every placeholder in a `CONTENT-TODO.md` file at the repo root.
- Never use em dashes in any site copy. Use commas, periods, or parentheses instead.
- Copy should sound like a real person wrote it. Plain, direct, confident. No buzzword soup ("synergy", "leverage", "cutting-edge", "empower", "seamless").
- No horizontal rule elements used as decoration between sections. Use spacing and background changes instead.
- Adding a project must never require editing navigation, the home page, the sitemap, or any component. One content file, one optional logo, done.

## 3. Tech stack

- **Next.js** (current stable, App Router, TypeScript), fully static where possible
- **Tailwind CSS** for styling
- **MDX** for project page body content
- **gray-matter + zod** to read and validate project frontmatter at build time. A bad or missing field should fail the build with a clear error message, not silently ship a broken page.
- **Vercel** for hosting
- **Resend** (or similar) for the contact form email, called from a Next.js route handler. API key and recipient addresses in environment variables, never in code.
- No database, no CMS, no login. Keep it simple enough to maintain on a firefighter's shift schedule.

## 4. Brand and design direction

### Logos

Provided files (put them in `/public/brand/`):

- `opperiod-logo.png` (1774x887, transparent background, black wordmark with a deep red accent bar)
- `box-alarm-builders-logo.png` (1536x1024, transparent background, black script and block type in a hexagon badge with a red fire helmet)

Both logos are black on transparent, so they will vanish on dark backgrounds. For now, only place them on light backgrounds. Set up the code so a light/white variant can be dropped in later (`opperiod-logo-light.png`, etc.) and used automatically on dark sections. SVG versions will replace the PNGs later, so reference logos through a single config, not hardcoded paths scattered around.

### Colors (sampled from the logos)

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0E1010` | Primary text, dark sections |
| `opperiod-red` | `#8E0D0E` | Parent brand accent, buttons, links |
| `paper` | `#FFFFFF` | Main background |
| `smoke` | `#F3F3F1` | Alternate section background |
| `steel` | `#5B6166` | Secondary text |

Each project gets its own `accentColor` in its frontmatter (Box Alarm is `#C60014`). The parent site stays black, white, and deep red. A project's accent only shows up on that project's card and page, so the brands don't fight each other.

### Look and feel

- Industrial and disciplined, not flashy. Think apparatus floor, not tech startup.
- Typography: a bold condensed or italic-leaning sans for headings that echoes the forward slant of the Opperiod wordmark (something like Barlow Condensed or Saira Condensed, self-hosted through `next/font`), and a clean readable sans for body text.
- Generous whitespace, strong grid, square or slightly rounded corners, subtle slanted edges or angled accent bars as a nod to the red bar in the logo. Use that motif sparingly.
- Must look great on a phone first. Most visitors will be on mobile.
- Support both light and dark mode using CSS variables, with logos handled as described above.

## 5. Site map

```
/                     Home
/projects             All projects (portfolio grid)
/projects/[slug]      Individual project page (generated from content files)
/about                About Opperiod and the owner
/contact              Contact form with routing by project
/privacy              Privacy policy (basic, placeholder text flagged in CONTENT-TODO.md)
```

Navigation: Home, Projects (with a dropdown listing published projects, generated automatically), About, Contact.

## 6. The project content model (the most important part)

Every project lives in `content/projects/<slug>.mdx`. The site reads this folder at build time and generates everything from it: the project page, the card on the home page, the card on `/projects`, the nav dropdown, the contact form dropdown, the sitemap entry, and the Open Graph metadata.

### Frontmatter schema (validate with zod)

```yaml
---
name: Box Alarm Builders            # required
slug: box-alarm-builders           # required, must match filename
tagline: General contracting built on service   # required, one line, under 70 characters
summary: >                          # required, 1 to 2 sentences for cards and meta description
  TODO: owner to provide
category: Construction             # required, free text (Construction, Software, Services, etc.)
status: active                     # required: active | in-development | coming-soon | retired
order: 1                           # required, controls sort order on grids
published: true                    # required, false hides it everywhere
logo: /brand/box-alarm-builders-logo.png   # optional, falls back to a styled text badge
accentColor: "#C60014"             # optional, falls back to opperiod-red
externalUrl:                       # optional, if set, show a prominent "Visit site" button
contactEmailKey: BOX_ALARM         # optional, maps to an env var for form routing
serviceArea: TODO                  # optional
highlights:                        # optional, 3 to 6 short bullets shown as a feature grid
  - TODO
cta:                               # optional
  label: Request an estimate
  href: /contact?project=box-alarm-builders
---
```

Body content below the frontmatter is free MDX. Provide a small set of MDX components the body can use without imports: `<Section>`, `<FeatureGrid>`, `<Callout>`, `<ImageBlock>`, `<CTA>`.

### Status behavior

- `active`: normal card and page
- `in-development`: badge on card ("In development"), page still visible
- `coming-soon`: badge, card visible, page shows a short teaser and an optional "get notified" link to the contact form
- `retired`: hidden from grids and nav, page still reachable with a notice (so old links don't break)

### Template file

Include `content/projects/_template.mdx` with every field documented in comments. Files starting with an underscore are ignored by the loader.

## 7. Page specs

### Home `/`

1. Hero: Opperiod logo, one sentence on what Opperiod is, two buttons (View projects, Contact).
2. "What we run" section: grid of project cards pulled from content, sorted by `order`. Each card shows logo or text badge, name, tagline, status badge, and uses the project's accent color as a thin top border or angled corner.
3. Short "How we operate" section: three or four values, written in plain language. The theme is the fire service mindset applied to business (show up, do the job right, take care of people). Placeholder copy is fine, flagged in `CONTENT-TODO.md`.
4. Simple contact call to action strip.
5. Footer: logo, nav links, copyright with the current year generated automatically, "Opperiod LLC" legal name, Louisiana.

### Projects `/projects`

Grid of all published, non-retired projects. Optional filter chips by `category` that only appear once there are 2 or more categories.

### Project page `/projects/[slug]`

1. Header band using the project's accent color as an accent (not a full flood of color), logo, name, tagline, status badge, CTA button and/or "Visit site" button.
2. MDX body.
3. Highlights grid (if provided).
4. "Part of the Opperiod family" footer block linking back to `/projects`, plus 2 other project cards.
5. Per-page metadata and Open Graph image generated from name, tagline, and accent color (use Next.js OG image generation).

### About `/about`

Short story of why Opperiod exists and who runs it. Placeholder text only, flagged. Leave space for a photo.

### Contact `/contact`

- Fields: name, email, phone (optional), "What's this about?" dropdown, message.
- Dropdown options are generated from published projects plus "General / Opperiod".
- `?project=<slug>` in the URL preselects the dropdown.
- Submissions route to the email for that project via `contactEmailKey` (for example `CONTACT_EMAIL_BOX_ALARM`), falling back to `CONTACT_EMAIL_DEFAULT`.
- Spam protection: honeypot field plus basic rate limiting in the route handler. Leave a clean hook to add Cloudflare Turnstile later.
- Clear success and error states. Never lose what the user typed on an error.

## 8. Initial project content

Create these three files. Write real draft copy only where it can be done honestly from the descriptions below. Everything else gets a TODO.

**box-alarm-builders.mdx**
- Category: Construction. Status: `coming-soon` until I confirm otherwise.
- Tagline idea: use the logo's own line, "Built on Service".
- Logo provided, accent `#C60014`.
- Do NOT write "licensed", "insured", "bonded", or list specific services, service areas, or project types. All TODO.
- CTA: Request an estimate, routed through the contact form.

**stationscore.mdx**
- Category: Software. Status: `in-development`.
- Description you can write from: helps small and volunteer fire departments get organized and ready for their insurance rating evaluation.
- Do NOT name ISO or any rating organization as a partner, and do not claim score improvements. Keep it to what the product helps a department do.
- No logo yet, use the text badge fallback. Pick a placeholder accent color and flag it.

**iapassist.mdx**
- Category: Software. Status: `in-development`.
- Description: TODO, owner to provide. Do not guess what the product does.
- No logo yet, text badge fallback, placeholder accent flagged.

## 9. SEO, performance, accessibility

- Auto-generated `sitemap.xml` and `robots.txt` from the content folder.
- Unique title and meta description on every page.
- `Organization` JSON-LD on the home page for Opperiod LLC.
- Lighthouse 95+ on performance, accessibility, best practices, and SEO on mobile.
- All images through `next/image`. Logos need proper alt text.
- WCAG AA contrast, especially red on white and anything on the accent colors. If an accent color fails contrast for text, use it only for borders and shapes.
- Keyboard navigable nav dropdown and form.

## 10. Repo structure

```
/app
  /(site)/page.tsx
  /(site)/projects/page.tsx
  /(site)/projects/[slug]/page.tsx
  /(site)/about/page.tsx
  /(site)/contact/page.tsx
  /(site)/privacy/page.tsx
  /api/contact/route.ts
  sitemap.ts
  robots.ts
/components
/content/projects
  _template.mdx
  box-alarm-builders.mdx
  stationscore.mdx
  iapassist.mdx
/lib
  projects.ts        # loader + zod schema
  brand.ts           # logo paths, colors, company info in one place
/public/brand
CONTENT-TODO.md
README.md
.env.example
```

## 11. README requirements

The README must include a section called **"How to add a new project"** written for a non-developer. It should be about five steps: copy `_template.mdx`, rename it, fill in the fields, drop the logo in `/public/brand/`, commit and push (Vercel deploys automatically). Also document how to hide a project, how to reorder projects, and how to add a contact email for a new project.

## 12. Build phases

**Phase 1: Foundation.** Project setup, Tailwind config with brand tokens, fonts, layout, header, footer, light/dark handling. Stop for review.

**Phase 2: Content system.** Project loader, zod schema, template file, the three project files, `/projects` and `/projects/[slug]`. Prove it works by adding a fake fourth project, confirming it appears everywhere automatically, then deleting it. Stop for review.

**Phase 3: Pages.** Home, About, Privacy, all copy drafts, `CONTENT-TODO.md`. Stop for review.

**Phase 4: Contact.** Form, routing, spam protection, `.env.example`. Stop for review.

**Phase 5: Polish and ship.** SEO pieces, OG images, accessibility pass, Lighthouse run, README, deploy to Vercel preview.

## 13. Open questions (ask me, don't assume)

1. What is IAPassist, in one or two sentences, and does it have a logo or domain?
2. Is Box Alarm Builders taking work yet, and what services and area should be listed?
3. Do any projects already have their own domains (for `externalUrl`)?
4. What email addresses should each project's contact form route to?
5. Should the website services business I run under Opperiod also be listed as a project?
6. What domain is this site going on?
