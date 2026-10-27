# Content TODO

Everything here is a placeholder or a missing fact the owner needs to provide. Nothing on this list should be guessed.

## Site wide

- [ ] Favicon / app icon. `app/icon.png` and `app/apple-icon.png` are placeholders cut from the logo's red-barred "O". Replace them with a proper icon when there is one (same file names).
- [ ] Light versions of the logos for dark backgrounds (`opperiod-logo-light.png`, `box-alarm-builders-logo-light.png`), or SVGs.
- [ ] The Sheridan, WY address shows on the privacy page as the company's address. If that's a registered agent address that doesn't forward regular mail, swap in a mailing address that does (`company.address` in `lib/brand.ts`).
- [ ] Confirm each project really sits under OpPeriod LLC. Project pages say "<name> is one of the projects under OpPeriod LLC." StationScore's own docs still list "which entity owns this" as open.

## Home (`app/(site)/page.tsx`)

- [ ] "How we operate": four values drafted from the plan's theme (Show up, Do the job right, Take care of people, Keep it straight). Rewrite in your own words or approve.
- [ ] Contact strip shows sales@opperiod.com publicly. Make sure that inbox exists and is watched.

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

- [ ] Logo is redrawn from the app icon image (`public/brand/stationscore-logo.png`), since the original file wasn't in the repo. Swap in the original PNG or SVG with the same name if anything looks off.
- [ ] Accent color is the red from the logo, `#C4262A`. It's close to the OpPeriod and Box Alarm reds on the project grid. Change `accentColor` if they should look more distinct.
- [ ] Review the page copy and the four highlights against what the product actually ships with.

## IAPassist (`content/projects/iapassist.mdx`)

- [ ] Logo is redrawn from the app icon image (`public/brand/iapassist-logo.png`), since the original file wasn't in the repo. Swap in the original PNG or SVG with the same name if anything looks off.
- [ ] Review the page copy. It only covers what's known so far: it helps emergency managers build Incident Action Plans with less typing.

## Engine Bay Supply Co. (`content/projects/engine-bay.mdx`)

- [ ] Review the summary and tagline. The tagline comes from the logo's own line ("Built to last").
- [ ] Product lines to list as `highlights` once the store is close. Nothing is listed until then.
- [ ] Store address. When it opens, switch `status` to `active` and add a `cta` to the store (see `docs/PLAN.md`, section 14).
- [ ] Accent color is the flame red from the logo, `#E2241B`. It's the fourth red on the project grid next to OpPeriod, Box Alarm, and StationScore.
- [ ] Optional: its own inbox. Add `contactEmailKey: ENGINE_BAY` and set `CONTACT_EMAIL_ENGINE_BAY` in Vercel.
