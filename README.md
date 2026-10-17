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

Coming in phase 2.
