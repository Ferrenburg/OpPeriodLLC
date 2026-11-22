@AGENTS.md

# OpPeriod site conventions

- Read `docs/PLAN.md` before building anything. It holds the content model, page specs, and build phases.
- Never invent facts (licenses, years, clients, stats, prices, contact info). Use `TODO: owner to provide` and list it in `CONTENT-TODO.md`.
- No em dashes anywhere in site copy. No decorative `<hr>` between sections; use spacing and background changes.
- Company facts, colors, logos, and nav links live in `lib/brand.ts`. Pages never hard code them.
- Render logos with `components/logo.tsx`. Pass `onDark` on dark bands; it picks up `-light` variants automatically.
- The site is light mode only (no dark theme, no toggle) so the black logos always sit on a light background. Don't add `dark:` classes or a theme switch.
- Theme colors are CSS variables in `app/globals.css`. Use the semantic utilities (`bg-bg`, `text-fg`, `text-muted`, `text-accent`, `bg-accent-fill`, `bg-band`).
- OpPeriod red fails contrast as text on dark bands. Use `text-band-accent` there, never `text-opperiod-red`.
- Adding a project must only take a file in `content/projects/` and an optional logo. Never make it require editing nav, pages, or components.
- Engine Bay Supply Co. lives on its own domain, enginebaysupply.com. Its pages are built under `app/(engine-bay)/engine-bay/`, and `proxy.ts` serves them at the root of that domain in production; opperiod.com/engine-bay/... redirects there (`next.config.ts`). Previews keep it under /engine-bay. Never hard code `/engine-bay` in a link: inside Engine Bay use `engineBay.path` / `engineBay.home` (or the path helpers in `lib/engine-bay.ts` and `lib/engine-bay-catalog.ts`); from an OpPeriod page use `engineBayLink()`; links from Engine Bay back to OpPeriod use `company.url`. Nav highlighting must use `useClientPathname` (server and browser paths differ on the Engine Bay domain).
- Engine Bay Supply Co. is the one exception to the project rule: it has its own section in `app/(engine-bay)/engine-bay/` with its own header and footer (`components/engine-bay/`), its categories in `lib/engine-bay.ts`, its products in `content/engine-bay/products/<brand>.json` (loaded and checked by `lib/engine-bay-catalog.ts`, photos in `public/catalog/`), and `sitePath: /engine-bay` in its project file. Adding a brand only takes a JSON file and photos. Products can list `variants` (one row per size, each with its own part number), a `group` heading, and a `datasheet` link; a product sized to order (fire hose) can have no part number at all; categories each have a page at `/engine-bay/equipment/<category>` and belong to exactly one of `equipmentAreas` (the five areas the home pages show). Product facts come from the manufacturer only; never show prices on the pages themselves. The only prices on the site are inside the owner's PDF catalogs in `public/downloads/` (listed in `printCatalogs` in `lib/engine-bay.ts`). Engine Bay is a fire department loose equipment supplier (hand tools, hose, saws, rescue, wildland, mounting), not just tools: its copy should read like a supply house, short and specific, no filler. Never say it sells by PO only. Council Tool and Snap-tite Hose are the flagship brands: wherever brands are listed or mixed, they come first (`flagshipBrands` in `lib/engine-bay.ts`, applied by the catalog loader). Don't sort brands or mixed-brand products any other way.
- Project content is validated by the zod schema in `lib/project-loader.ts`. A content problem should fail the build with a message a non-developer can act on.
- Read projects through `lib/projects.ts` (`getListedProjects` for anything public facing, which leaves out retired ones).
- The contact form posts JSON to `app/api/contact/route.ts`; validation, routing, spam checks, and sending live in `lib/contact.ts`. Inputs are uncontrolled and never reset on an error, so nothing typed is lost.
- Secrets and recipient addresses come from environment variables (see `.env.example`), never code.
- Wrap copy the owner still has to provide in `<Todo>` (components/todo.tsx) and list it in `CONTENT-TODO.md`. Todo boxes are hidden on production builds (`VERCEL_ENV=production`).
- `main` is production. Work on a branch and let Vercel make a preview.
- Keep the site at 95+ in every Lighthouse category on mobile. Fonts are limited to four files (Barlow 400 and 600, Barlow Condensed 600 and 700, upright); adding a weight costs load time.
- Run `npm run check` and `npm run build` before pushing.
