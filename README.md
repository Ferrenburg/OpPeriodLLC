# Opperiod LLC website

Marketing site for Opperiod LLC and its projects. Built with Next.js, Tailwind CSS, and MDX, hosted on Vercel.

## Running it locally

```
npm install
npm run dev
```

Then open http://localhost:3000.

Before pushing, run `npm run check` (lint and type check) and `npm run build`.

## Branches and deploys

- `main` is the live site. Anything merged or pushed to `main` deploys to opperiod.com.
- Every other branch gets its own Vercel preview link, so changes can be checked before they go live. Previews are hidden from search engines automatically.
- A failed build never replaces the live site. If a deploy fails, the old version stays up until the fix is pushed.

## Where things live

- `lib/brand.ts`: company name, legal details, address, colors, logo paths, and nav links
- `content/projects/`: one file per project (see "How to add a new project")
- `app/globals.css`: theme colors for light and dark mode
- `public/brand/`: logo files
- `app/icon.png`, `app/apple-icon.png`: the browser tab and phone home screen icons
- `assets/fonts/`: fonts used to draw the link preview images
- `CONTENT-TODO.md`: everything still waiting on the owner
- `docs/PLAN.md`: the original build plan

## Placeholders (TODO boxes)

Copy the owner still needs to write shows as a dashed "TODO: owner to provide" box in local development and on Vercel previews. On the live site those boxes are hidden. `CONTENT-TODO.md` lists every one, so check it before calling the site finished.

## Search engines and link previews

All of this updates on its own when projects change:

- `/sitemap.xml` lists every page and every listed project. Retired projects are left out.
- `/robots.txt` points search engines at the sitemap.
- The home page describes Opperiod LLC to search engines (name, address, email, and its projects) using details from `lib/brand.ts`.
- Sharing a link (text, Facebook, LinkedIn, and so on) shows a preview image. Project pages get their own, built from the project's name, tagline, color, and logo.

After launch, add the site to Google Search Console (search.google.com/search-console), verify it through Porkbun DNS, and submit `https://opperiod.com/sitemap.xml`.

## Setting up the contact form

The form at /contact sends each message to email through Resend. Replies go straight to the person who wrote in, so you can answer from Gmail like any other email. The subject line starts with the project name, like `[Box Alarm Builders] New message from Jane`, so a Gmail filter on that text can label them.

### 1. Resend

1. Make a free account at resend.com.
2. Go to Domains, add `opperiod.com`, and leave the page open. It lists a few DNS records to add.
3. Go to API Keys and make a key with "Sending access". Copy it somewhere safe; it's only shown once.

### 2. DNS at Porkbun

Gmail already uses some records on opperiod.com. Resend's records go on their own names (`send` and `resend._domainkey`), so nothing conflicts as long as you only add, never change, what's there.

1. In Porkbun, open opperiod.com, then DNS.
2. Add each record exactly as Resend shows it. In Porkbun's "Host" box, type only the part before opperiod.com (for example `send` or `resend._domainkey`).
3. Don't touch the existing MX records or the existing `v=spf1` TXT record on the bare domain. Those are Gmail's.
4. Back in Resend, click Verify. It can take a few minutes, sometimes up to an hour.

### 3. Vercel settings

In Vercel, open the project, then Settings, then Environment Variables, and add these for Production (and Preview if you want previews to send email too):

| Name | Value |
| --- | --- |
| `RESEND_API_KEY` | the key from Resend |
| `CONTACT_FROM_EMAIL` | `Opperiod Website <website@opperiod.com>` |
| `CONTACT_EMAIL_DEFAULT` | `sales@opperiod.com` |

Then redeploy (Deployments, the three dots on the latest one, Redeploy). Settings only take effect on a new deploy.

`.env.example` lists every setting. For local development, copy it to `.env.local`. Without a Resend key, local dev prints messages in the terminal instead of sending them.

### 4. Spam protection (Turnstile)

The form already has a hidden trap field for bots and a limit of 5 messages per 10 minutes from one connection. The limit is per server instance, so it only slows down one noisy sender. For real bot protection, turn on Cloudflare Turnstile. It's free, and most people never see a challenge.

1. Make a free Cloudflare account, open Turnstile, and add a widget for `opperiod.com`.
2. Add `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel, then redeploy.

The privacy page mentions Cloudflare automatically once Turnstile is on.

### Testing it

After deploying, send yourself a message from the live site with each project picked. If one doesn't arrive, check Vercel, then Logs, for a line starting with `[contact]`, and Resend's Emails page.

## Logos on dark backgrounds

The current logos are black, so on dark backgrounds they sit on a white plate. To use a proper light version instead, save it next to the original with `-light` before the extension (for example `public/brand/opperiod-logo-light.png`). The site picks it up on the next deploy with no code changes.

## How to add a new project

You only touch the `content/projects/` folder (and `public/brand/` if there's a logo). The menus, the projects page, and the project's own page all update by themselves.

1. In `content/projects/`, make a copy of `_template.mdx`.
2. Rename the copy to the project's web address, lowercase with dashes, like `my-project.mdx`. The project will live at opperiod.com/projects/my-project, and opperiod.com/my-project will send people there too.
3. Open it and fill in the fields at the top. Every field has a note explaining it. Set `slug` to the same name as the file, and set `published: true` when it's ready to go live. Then write the page itself under the second `---` line, in plain text.
4. If there's a logo, put it in `public/brand/` and set `logo: /brand/the-file-name.png`. No logo is fine; the site shows a badge in the project's color instead.
5. Commit and push. Vercel builds and deploys it automatically.

If something in the file is wrong (a misspelled field, a tagline that's too long, a slug that doesn't match the file name), the deploy stops and the build log names the file and the field to fix. The live site stays as it was until the fix is pushed.

### Hiding a project

Set `published: false`. It disappears from everything, including its own page.

To retire a project but keep its page up for old links, set `status: retired` instead. It drops out of the menus and the projects page, and its page shows a notice that it's no longer active.

### Reordering projects

Change the `order` numbers. Lower numbers show first. Leaving gaps (10, 20, 30) makes it easy to slot one in later.

### Giving a project its own contact email

Right now every project's messages go to sales@opperiod.com. To send one project somewhere else:

1. Add `contactEmailKey: SOME_NAME` to the project's file (capital letters and underscores).
2. In Vercel, under Settings, then Environment Variables, add `CONTACT_EMAIL_SOME_NAME` with the email address.
3. Redeploy.
