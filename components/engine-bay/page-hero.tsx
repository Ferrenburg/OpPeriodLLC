// The title band at the top of the inner Engine Bay pages: an eyebrow, a big
// condensed headline, and a line or two under it, on the light surface.
export function EbPageHero({
  title,
  eyebrow = "Engine Bay Supply Co.",
  children,
}: {
  title: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line bg-surface/80">
      <div className="container-site py-14 md:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-[18ch] font-display text-[clamp(2.9rem,6vw,4.8rem)] font-bold uppercase leading-[0.92]">{title}</h1>
        {children && <div className="mt-5 max-w-[62ch] space-y-3 text-lg leading-relaxed text-muted">{children}</div>}
      </div>
    </section>
  );
}
