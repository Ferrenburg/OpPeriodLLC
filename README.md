# Opperiod LLC website

Marketing site for Opperiod LLC and its projects. Built with Next.js, Tailwind CSS, and MDX, hosted on Vercel.

## Running it locally

```
npm install
npm run dev
```

Then open http://localhost:3000.

Before pushing, run `npm run check` (lint and type check) and `npm run build`.

## Where things live

- `lib/brand.ts`: company name, colors, logo paths, and nav links
- `app/globals.css`: theme colors for light and dark mode
- `public/brand/`: logo files
- `docs/PLAN.md`: the full build plan

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
