@AGENTS.md

# Opperiod site conventions

- Read `docs/PLAN.md` before building anything. It holds the content model, page specs, and build phases.
- Never invent facts (licenses, years, clients, stats, prices, contact info). Use `TODO: owner to provide` and list it in `CONTENT-TODO.md`.
- No em dashes anywhere in site copy. No decorative `<hr>` between sections; use spacing and background changes.
- Company facts, colors, logos, and nav links live in `lib/brand.ts`. Pages never hard code them.
- Render logos with `components/logo.tsx`, which handles dark backgrounds and picks up `-light` variants automatically.
- Theme colors are CSS variables in `app/globals.css`. Use the semantic utilities (`bg-bg`, `text-fg`, `text-muted`, `text-accent`, `bg-accent-fill`, `bg-band`) so dark mode keeps working.
- Opperiod red fails contrast as text on dark backgrounds. Use `text-accent` (which lightens in dark mode) for text, never `text-opperiod-red`.
- Adding a project must only take a file in `content/projects/` and an optional logo. Never make it require editing nav, pages, or components.
- Project content is validated by the zod schema in `lib/project-loader.ts`. A content problem should fail the build with a message a non-developer can act on.
- Read projects through `lib/projects.ts` (`getListedProjects` for anything public facing, which leaves out retired ones).
- The contact form posts JSON to `app/api/contact/route.ts`; validation, routing, spam checks, and sending live in `lib/contact.ts`. Inputs are uncontrolled and never reset on an error, so nothing typed is lost.
- Secrets and recipient addresses come from environment variables (see `.env.example`), never code.
- Run `npm run check` and `npm run build` before pushing.
