import { ButtonLink } from "@/components/button";
import { Logo } from "@/components/logo";
import { colors, company, logos } from "@/lib/brand";

// Phase 1 home: the real hero, plus a temporary style check so the
// foundation can be reviewed. Phase 3 replaces everything below the hero.
export default function HomePage() {
  return (
    <>
      <section className="container-site py-14 md:py-24">
        <Logo logo={logos.opperiod} className="h-14 sm:h-20 md:h-24" priority />
        <p className="mt-8 max-w-2xl text-xl leading-relaxed md:text-2xl">{company.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/projects">View projects</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact
          </ButtonLink>
        </div>
      </section>

      <StyleCheck />
    </>
  );
}

// TODO(phase 3): delete this section.
function StyleCheck() {
  const swatches = [
    { name: "ink", hex: colors.ink },
    { name: "opperiod-red", hex: colors.opperiodRed },
    { name: "paper", hex: colors.paper },
    { name: "smoke", hex: colors.smoke },
    { name: "steel", hex: colors.steel },
  ];

  return (
    <>
      <section className="bg-surface py-14 md:py-20">
        <div className="container-site">
          <span className="slant-bar" aria-hidden="true" />
          <h2 className="mt-3 font-display text-4xl font-bold uppercase italic md:text-5xl">
            Phase 1 style check
          </h2>
          <p className="mt-3 max-w-prose text-muted">
            Temporary section for reviewing type, color, and components. It goes away in phase 3.
          </p>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <p className="font-display text-6xl font-bold uppercase italic leading-none">Heading 1</p>
              <p className="font-display text-4xl font-bold uppercase italic">Heading 2</p>
              <p className="font-display text-2xl font-semibold">Heading 3, not slanted</p>
              <p className="text-lg">
                Body text in Barlow. Plain, direct, and easy to read on a phone at the end of a long
                shift. <a href="#main" className="font-semibold text-accent underline underline-offset-4">This is a link.</a>
              </p>
              <p className="text-muted">Secondary text uses the steel color.</p>
            </div>

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {swatches.map((swatch) => (
                <li key={swatch.name} className="border border-line bg-bg p-3">
                  <span className="block h-12 border border-line" style={{ background: swatch.hex }} />
                  <span className="mt-2 block text-sm font-semibold">{swatch.name}</span>
                  <span className="block text-sm text-muted">{swatch.hex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Accent card", accent: "#C60014", note: "Box Alarm red as a top border" },
              { name: "Default card", accent: colors.opperiodRed, note: "Falls back to Opperiod red" },
            ].map((card) => (
              <div
                key={card.name}
                className="relative border border-line border-t-4 bg-bg p-6"
                style={{ borderTopColor: card.accent }}
              >
                <p className="font-display text-2xl font-bold uppercase italic">{card.name}</p>
                <p className="mt-1 text-muted">{card.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-band py-14 text-band-fg md:py-20">
        <div className="container-site">
          <span className="slant-bar" aria-hidden="true" />
          <h2 className="mt-3 font-display text-4xl font-bold uppercase italic">Dark band</h2>
          <p className="mt-3 max-w-prose text-band-muted">
            Always dark in both themes. Logos here use the light version when one exists, otherwise
            they sit on a white plate:
          </p>
          <div className="mt-6">
            <Logo logo={logos.opperiod} className="h-10" onDark />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Primary</ButtonLink>
            <ButtonLink href="/contact" variant="onDark">
              Secondary
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
