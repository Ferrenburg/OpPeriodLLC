// The dark title band at the top of the inner Engine Bay pages.
export function EbPageHero({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="diamond-plate text-white">
      <div className="container-site py-12 md:py-16">
        <h1 className="font-display text-5xl font-bold uppercase italic leading-none md:text-7xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{children}</div>}
      </div>
    </section>
  );
}
