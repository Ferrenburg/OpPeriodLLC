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
- Engine Bay Supply Co. is the one exception: it has its own section in `app/(engine-bay)/engine-bay/` with its own header and footer (`components/engine-bay/`), its catalog in `lib/engine-bay.ts`, and `sitePath: /engine-bay` in its project file. Its copy should read like a tool supplier: short and specific, no filler. Never say it sells by PO only.
- Project content is validated by the zod schema in `lib/project-loader.ts`. A content problem should fail the build with a message a non-developer can act on.
- Read projects through `lib/projects.ts` (`getListedProjects` for anything public facing, which leaves out retired ones).
- The contact form posts JSON to `app/api/contact/route.ts`; validation, routing, spam checks, and sending live in `lib/contact.ts`. Inputs are uncontrolled and never reset on an error, so nothing typed is lost.
- Secrets and recipient addresses come from environment variables (see `.env.example`), never code.
- Wrap copy the owner still has to provide in `<Todo>` (components/todo.tsx) and list it in `CONTENT-TODO.md`. Todo boxes are hidden on production builds (`VERCEL_ENV=production`).
- `main` is production. Work on a branch and let Vercel make a preview.
- Keep the site at 95+ in every Lighthouse category on mobile. Fonts are limited to four files (Barlow 400 and 600, Barlow Condensed 600 and 700 italic); adding a weight costs load time.
- Run `npm run check` and `npm run build` before pushing.
