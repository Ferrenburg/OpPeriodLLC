# Content TODO

Everything here is a placeholder or a missing fact the owner needs to provide. Nothing on this list should be guessed.

## Site wide

- [ ] Favicon / app icon. None provided yet.
- [ ] Light versions of the logos for dark backgrounds (`opperiod-logo-light.png`, `box-alarm-builders-logo-light.png`), or SVGs.
- [ ] Confirm the one line company description in `lib/brand.ts`: "Opperiod LLC owns and operates a growing group of businesses, run out of Westlake, Louisiana." It shows in the home hero, the footer, and search results.
- [ ] The Sheridan, WY address shows on the privacy page as the company's address. If that's a registered agent address that doesn't forward regular mail, swap in a mailing address that does (`company.address` in `lib/brand.ts`).
- [ ] Confirm each project really sits under Opperiod LLC. Project pages say "<name> is one of the projects under Opperiod LLC." StationScore's own docs still list "which entity owns this" as open.

## Home (`app/(site)/page.tsx`)

- [ ] "How we operate": four values drafted from the plan's theme (Show up, Do the job right, Take care of people, Keep it straight). Rewrite in your own words or approve.
- [ ] Contact strip shows sales@opperiod.com publicly. Make sure that inbox exists and is watched.

## About (`app/(site)/about/page.tsx`)

- [ ] The story of why Opperiod exists, what got it started, and where the name comes from (shown as a TODO box on the page).
- [ ] Approve the two draft paragraphs, which mention Westlake and that you serve as a fire lieutenant.
- [ ] Owner photo. Put it in `public/brand/` and set `owner.photo` in `lib/brand.ts`.

## Privacy (`app/(site)/privacy/page.tsx`)

- [ ] Effective date.
- [ ] Review before launch. It's written from how the site works today (contact form through Resend, hosting on Vercel, no analytics, no cookies). Turnstile is handled automatically; analytics or anything else new needs an update.

## Contact form setup (see README, "Setting up the contact form")

- [ ] Resend account, opperiod.com verified with the DNS records added at Porkbun.
- [ ] Vercel settings: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_EMAIL_DEFAULT`.
- [ ] Turnstile keys (recommended before launch).
- [ ] Send a test message for each project from the live site.

## Box Alarm Builders (`content/projects/box-alarm-builders.mdx`)

- [ ] Service area (the `serviceArea` field, currently left out).
- [ ] Services to list, if any (the `highlights` field, currently left out). Taking any kind of work for now, so nothing specific is listed.
- [ ] Anything about licensing, insurance, or bonding. Don't add these until they're confirmed.

## StationScore (`content/projects/stationscore.mdx`)

- [ ] Logo. Until then it uses a letter badge.
- [ ] Accent color `#2B6CB0` is a placeholder. StationScore's own site uses red `#C8102E`, which would clash with Opperiod and Box Alarm on the grid.
- [ ] Review the page copy and the four highlights against what the product actually ships with.

## IAPassist (`content/projects/iapassist.mdx`)

- [ ] Logo. Until then it uses a letter badge.
- [ ] Accent color `#B45309` is a placeholder.
- [ ] Review the page copy. It only covers what's known so far: it helps emergency managers build Incident Action Plans with less typing.
