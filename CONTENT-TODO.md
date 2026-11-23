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

## Engine Bay Supply Co. (`app/(engine-bay)/engine-bay/`, `lib/engine-bay.ts`, `content/engine-bay/products/`)

- [ ] Online shop launch (it's built and off). In order:
  1. Council Tool: done (48 Council products in Stripe got `sku` and `vendor` metadata; 39 of the 40 Council items on the site now sell online). Still open: the FE8-32 axe is `80FMS32C` on the site and `80FMS32DG` in Stripe. Say which is right. Also, Stripe calls the three fiberglass axes (C60F36, C60P36, C60FMS36) 34 in. and the site says 36 in.
  2. Stripe Tax: add registrations for every state you must collect in (Louisiana at least; ask your CPA). Until then checkout collects $0 tax.
  3. Resale certificates: give Council, Snap-tite, and Fire Hooks Unlimited your resale certificate for each state they ship to, or they'll charge Engine Bay sales tax on drop shipped orders.
  4. Shipping rates: estimates are in (shopShippingRates in lib/engine-bay.ts: standard $19 + $8, long $59 + $39, hose $24 + $14, LDH $95 + $75, saw $45 + $25). Compare them with real vendor freight after the first 20 orders.
  5. Attorney review of /shipping, /returns, and /terms (drafts are on the pages; everything in [brackets] still needs an answer), then remove the draft note in components/engine-bay/policy-page.tsx and set the "Last updated" dates. Also the lead time line (SHOP_LEAD_TIME).
  6. Confirm FHU and Husqvarna allow online sales at your prices. Husqvarna often limits online sales of powered equipment; to keep a brand quote only, add it to shopExcludedBrands in lib/engine-bay.ts.
  7. In Stripe, Developers, Webhooks: add an endpoint at https://www.enginebaysupply.com/api/stripe/webhook (match your primary domain) with checkout.session.completed, checkout.session.async_payment_succeeded, price.created, price.updated, price.deleted, product.updated, product.deleted. Put its signing secret in STRIPE_WEBHOOK_SECRET.
  8. Make a new restricted key for the site (the one shared in chat should be deleted after launch) and set STRIPE_SECRET_KEY, SHOP_ORDER_EMAIL, and SHOP_ENABLED=true in Vercel, then redeploy.
  9. Place one real order on your own card, check the order email, then refund it in Stripe.
- [ ] Holik: 10 gloves are on the site and for sale, with Holik America's descriptions, photos, and leaflets. Get Holik's okay in writing for their photos and copy, and confirm online sales at MAP are allowed under your dealer terms.
- [ ] Holik sizes marked "special order" (some NFPA sizes) may take longer; say so in the ship time wording, or ask Holik for lead times.
- [ ] The 6 Snap-tite add-ons in Stripe (non-standard color, stripe, UL label, special threads, stencil kit, laser etching) and FireQuip hose aren't sold online because they have no site page.

- [ ] Moving Engine Bay to enginebaysupply.com. Do these in order once this branch merges:
  1. In Vercel, open the OpPeriod project, Settings, Domains, and add `enginebaysupply.com` and `www.enginebaysupply.com` (set www to redirect to the bare domain). Point the domain's DNS at Vercel the way Vercel shows.
  2. Cloudflare Turnstile: add `enginebaysupply.com` to the widget's hostnames, or the quote form's spam check fails on the new domain.
  3. Google Search Console: add enginebaysupply.com, submit https://enginebaysupply.com/sitemap.xml, and request indexing of the new home page. (No Change of Address: opperiod.com stays live as its own site.)
  4. Optional: an @enginebaysupply.com email for quotes. Set it as Engine Bay's `email` in `lib/brand.ts` and as `CONTACT_EMAIL_ENGINE_BAY` in Vercel, and verify the domain in Resend if quotes should come from it.
  5. Update printed and shared links (business cards, catalogs, vendor listings) to enginebaysupply.com. Old opperiod.com/engine-bay links keep working through the redirect.

- [ ] Council Tool: confirm their go-ahead covers using their product photos and descriptions word for word, not just selling the tools. Get it in writing (an email is fine) before this goes live.
- [ ] Council Tool: confirm the 41 products are all ones Engine Bay can actually get. The list is everything in Council's Firefighting category as of October 2026, including wildland tools and replacement parts.
- [ ] Decide whether to say "authorized Council Tool dealer" anywhere. The site doesn't say it now. Only add it if Council says Engine Bay can use that wording.
- [ ] The Engine Bay logo lockup (and the 2026 catalog covers) still read "Hand tools / Fire service / Built to last". Now that Engine Bay covers hose, saws, and other loose equipment, consider new artwork, like "Loose equipment / Fire service / Built to last". Drop it in `public/brand/engine-bay-lockup.webp` and `app/(engine-bay)/engine-bay/opengraph-image.png`.
- [ ] Review the copy: the hero ("Stock the rig."), "By firefighters, for firefighters ... someone who has used it on a call," and the three ordering steps.
- [ ] Optional: its own inbox for quote requests. Add `contactEmailKey: ENGINE_BAY` to `content/projects/engine-bay.mdx` and set `CONTACT_EMAIL_ENGINE_BAY` in Vercel.
- [ ] The two PDF catalogs (`public/downloads/`) show prices good through 12/31/26. Replace them before then with the 2027 files, using the same file names, or update `printCatalogs` in `lib/engine-bay.ts` if names or page counts change.
- [ ] The Council Tool catalog says "Authorized Distributor of Council Tool" and uses Council's 1886 badge. Make sure Council has okayed both, in writing.
- [ ] Fire Hooks Unlimited: 297 products are on the site, built from the Engine Bay FHU catalog PDF (names, part numbers, descriptions, and the photos inside it). Some photos carry an FHU watermark. Make sure FHU is fine with their photos on the site, in writing, like Council.
- [ ] 106 FHU products and 15 Husqvarna products have no photo, because the catalog has none for them. They show a placeholder. Add photos to `public/catalog/` and list them under `images` in the product's JSON file.
- [ ] Husqvarna saws, batteries, and chargers from the FHU catalog are listed under their own brand, Husqvarna (`content/engine-bay/products/husqvarna.json`). Saw blades stayed under Fire Hooks Unlimited because the catalog doesn't say who makes each one. Check both.
- [ ] Brand blurbs for Fire Hooks Unlimited and Husqvarna are taken from the catalog cover and section titles. Swap in better ones if you have them.
- [ ] A few part numbers show up on two different items in the FHU catalog: HSYSTEM (The Hook System and its D-handle), CH-312 (Can Harness and Can Harness Deluxe), SPBP (brush pump and its repair kit), and K12FD (the saw and the saw with blades). Check them against FHU's price list.
- [ ] Snap-tite Hose: 16 fire hose lines (attack, supply LDH, forestry, and 5P) are on the site, with Snap-tite's descriptions, features, warranty terms, color photos, and a link to each data sheet, taken from snaptitehose.com. Get Snap-tite's okay in writing for their photos and copy, like Council.
- [ ] Snap-tite's site also lists booster hose, forestry hose (Flash Point, Ultra Forestry), 7" LDH, and a few industrial hoses that are made by Firequip and link to firequip.com. They're left off. Tell us if Engine Bay sells Firequip too.
- [ ] Rawhide Fire Hose: 27 hose products are on the site (attack, supply LDH, booster, and forestry), with Rawhide's descriptions and photos from rawhidefirehose.com. Get Rawhide's okay in writing for their photos and copy.
- [ ] Rawhide sources from several manufacturers, so the hose specs on the site are Rawhide's, not the original maker's. If you know who makes a line, say so and we can credit them.
- [ ] Rawhide uses the same photo for several hose sizes and pressure ratings. Check the photos match what ships.
- [ ] Hose has no part numbers on the site (it shows "Sized to order"). Departments quote it by line, size, length, couplings, and color. If you have Snap-tite part numbers you want listed, send them.
- [ ] Hooks sold in any length (Colorado, Georgia, Tristate, Denver, Eagle, Downtown, Bicoastal, Hooks Nest) show their part number as `COLORADO-[size]`, the way the catalog prints `COLORADO-`.
