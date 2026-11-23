import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/button";
import { Logo } from "@/components/logo";
import { company, engineBay } from "@/lib/brand";
import { catalogPath, equipmentPath, orderingSteps, printCatalogs, quoteHref, shopPath, toolCategories } from "@/lib/engine-bay";
import { brandPath, getBrandProducts, getBrands, getProduct, getProducts } from "@/lib/engine-bay-catalog";
import { shopEnabled } from "@/lib/shop";
import { readPublicImage } from "@/lib/images";
import { AreaGrid } from "./area-grid";
import { ProductCard } from "./product-card";

// The sections the Engine Bay home page is built from, in the style of a
// fire equipment dealer: dark hero over stats, a brand strip, a statement,
// the equipment areas, a product row, ordering steps, catalogs, and a dark
// call to action. The OpPeriod home page reuses most of them.

export function SectionHeading({
  eyebrow,
  title,
  lede,
  center = false,
  action,
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  center?: boolean;
  action?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-6 ${center ? "flex-col items-center text-center" : ""}`}>
      <div className={center ? "flex flex-col items-center" : ""}>
        <p className={`eyebrow ${center ? "eyebrow-center" : ""}`}>{eyebrow}</p>
        <h2 id={id} className="mt-4 font-display text-[clamp(2.4rem,5vw,3.6rem)] font-bold uppercase leading-[0.95]">
          {title}
        </h2>
        {lede && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{lede}</p>}
      </div>
      {action}
    </div>
  );
}

// Four corner ticks, like a viewfinder, on dark heroes and bands.
function Corners() {
  const tick = "pointer-events-none absolute size-5 border-white/40";
  return (
    <>
      <span aria-hidden="true" className={`${tick} left-4 top-4 border-l border-t`} />
      <span aria-hidden="true" className={`${tick} right-4 top-4 border-r border-t`} />
      <span aria-hidden="true" className={`${tick} bottom-4 left-4 border-b border-l`} />
      <span aria-hidden="true" className={`${tick} bottom-4 right-4 border-b border-r`} />
    </>
  );
}

export function EbHero({ srPrefix }: { srPrefix?: string }) {
  const brands = getBrands();
  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-eb-ink text-white">
      <div aria-hidden="true" className="diamond-plate absolute inset-0 -z-20" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(900px_640px_at_82%_18%,rgb(226_36_27/0.34),transparent_62%),linear-gradient(180deg,rgb(14_16_16/0.1)_0%,rgb(14_16_16/0.72)_100%)]"
      />
      <Corners />
      <div className="container-site grid w-full items-center gap-10 pb-16 pt-24 md:pb-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div>
          <p className="eyebrow text-white/85 before:bg-white/70">
            Fire department loose equipment · {brands.length} brands
          </p>
          <h1 className="mt-6 max-w-[14ch] font-display text-[clamp(3.4rem,8vw,6.5rem)] font-bold uppercase leading-[0.9] [text-shadow:0_2px_22px_rgb(0_0_0/0.45)]">
            {srPrefix && <span className="sr-only">{srPrefix} </span>}
            Stock the rig.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-white/90 md:text-xl">
            Forcible entry and hand tools, fire hose, saws, rescue and wildland gear, and the mounts to carry it all, from{" "}
            {brands
              .map((b) => b.name)
              .slice(0, -1)
              .join(", ")}{" "}
            and {brands.at(-1)?.name}. Send us your list and we&apos;ll quote it.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={equipmentPath} className={buttonClass("primary")}>
              Shop equipment
            </Link>
            <Link href={quoteHref()} className={buttonClass("onDark")}>
              Request a quote
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="hidden justify-center lg:flex">
          <Logo logo={engineBay.logo} onDark className="h-64 drop-shadow-2xl xl:h-80" sizes="(min-width: 1280px) 520px, 420px" priority />
        </div>
      </div>
    </section>
  );
}

export function StatsStrip() {
  const stats = [
    { value: getProducts().length, label: "Items listed" },
    { value: getBrands().length, label: "Brands carried" },
    { value: toolCategories.length, label: "Equipment categories" },
    { value: printCatalogs.length, label: "Price guides to download" },
  ];
  return (
    <section aria-label="Engine Bay at a glance" className="border-b border-line bg-card">
      <dl className="container-site grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.label} className={`flex flex-col py-7 pl-6 ${index % 2 === 1 ? "border-l border-line" : ""} md:border-l md:border-line ${index >= 2 ? "border-t border-line md:border-t-0" : ""}`}>
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">{stat.label}</dt>
            <dd className="order-first font-display text-[2.7rem] font-bold leading-none">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function BrandStrip() {
  const brands = getBrands();
  const row = (hidden: boolean) =>
    brands.map((brand) => (
      <li key={`${brand.slug}-${hidden}`}>
        <Link
          href={brandPath(brand)}
          tabIndex={hidden ? -1 : undefined}
          className="block whitespace-nowrap px-10 font-display text-3xl font-bold uppercase text-fg/55 transition-colors hover:text-accent md:text-4xl"
        >
          {brand.name}
        </Link>
      </li>
    ));
  return (
    <section aria-labelledby="brand-strip" className="border-b border-line py-10">
      <h2 id="brand-strip" className="eyebrow eyebrow-center flex justify-center">
        The brands we carry
      </h2>
      <div className="mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
        <div className="marquee-track">
          <ul className="flex">{row(false)}</ul>
          <ul className="flex" aria-hidden="true">
            {row(true)}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Statement() {
  return (
    <section id="about" aria-labelledby="statement" className="scroll-mt-28 py-[clamp(72px,11vw,140px)] text-center">
      <div className="container-site flex flex-col items-center">
        <h2 id="statement" className="eyebrow eyebrow-center">
          Who we are
        </h2>
        <p className="mx-auto mt-5 max-w-4xl text-[clamp(1.75rem,3.4vw,2.85rem)] font-semibold leading-[1.16] tracking-tight [text-wrap:balance]">
          {engineBay.name} is run by people who work in <span className="text-accent">the fire service</span>.
        </p>
        <p className="mx-auto mt-6 max-w-[660px] text-lg leading-relaxed text-muted">
          When you ask about a piece of equipment, you&apos;re talking to someone who has used it on a call. {engineBay.name} is a
          division of {company.legalName}.
        </p>
      </div>
    </section>
  );
}

export function AreasSection() {
  return (
    <section id="what-we-supply" aria-labelledby="areas-heading" className="scroll-mt-28 py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          id="areas-heading"
          eyebrow="What we supply"
          title="What are you stocking?"
          lede="Pick an area and go straight to the gear. Every item can be quoted for your department."
          action={
            <Link href={equipmentPath} className={buttonClass("secondary")}>
              All equipment
            </Link>
          }
        />
        <div className="mt-12">
          <AreaGrid />
        </div>
      </div>
    </section>
  );
}

export function FeaturedRow() {
  const featured = toolCategories
    .map((category) => getProduct(category.featured))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  return (
    <section aria-labelledby="featured-heading" className="border-y border-line bg-surface/70 py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          id="featured-heading"
          eyebrow="From the catalog"
          title="One from every category."
          lede="A look across the line. Every item has photos, specs, and a Get Pricing button."
        />
      </div>
      <div className="container-site mt-10">
        <ul className="-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-6 [scrollbar-width:thin]">
          {featured.map((product) => (
            <li key={product.slug} className="w-64 shrink-0 snap-start">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function OrderingSection() {
  return (
    <section id="ordering" aria-labelledby="ordering-heading" className="scroll-mt-28 py-16 md:py-24">
      <div className="container-site">
        <SectionHeading id="ordering-heading" eyebrow="How ordering works" title="From your list to the rig." />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {orderingSteps.map((step, index) => (
            <li key={step.title} className="card relative overflow-hidden p-7">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-accent-fill to-accent-fill-hover" />
              <span className="font-display text-5xl font-bold leading-none text-accent">0{index + 1}</span>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase">{step.title}</h3>
              <p className="mt-2 text-lg leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        {shopEnabled() && (
          <p className="mt-8 text-lg">
            Rather pay by card?{" "}
            <Link href={shopPath} className="font-semibold text-accent underline underline-offset-4">
              Order online
            </Link>{" "}
            and the manufacturer ships it straight to you.
          </p>
        )}
      </div>
    </section>
  );
}

export function TextBand() {
  const words = ["Stock the rig", "Forcible entry", "Fire hose", "Saws and rescue", "Wildland", "Mounting and parts", "Built to last"];
  const row = words.flatMap((word) => [
    <span key={word} className="px-6">
      {word}
    </span>,
    <span key={`${word}-dot`} className="text-eb-red">
      ·
    </span>,
  ]);
  return (
    <div aria-hidden="true" className="grid-dark overflow-hidden bg-eb-ink py-5 text-white">
      <div className="marquee-track font-display text-2xl font-bold uppercase tracking-wide md:text-3xl">
        <div className="flex items-center">{row}</div>
        <div className="flex items-center">{row}</div>
      </div>
    </div>
  );
}

export function CatalogsSection() {
  return (
    <section aria-labelledby="catalogs-heading" className="py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          id="catalogs-heading"
          eyebrow="Catalogs"
          title="Take the price guides with you."
          lede="Our 2026 catalogs and price guides. Share them with your crew, your chief, or whoever signs off on purchases."
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {printCatalogs.map((catalog) => {
            const cover = readPublicImage(catalog.cover);
            return (
              <li key={catalog.slug} className="card card-hover relative flex gap-5 p-5">
                {cover && (
                  <Image
                    src={cover.src}
                    width={cover.width}
                    height={cover.height}
                    alt=""
                    sizes="7rem"
                    className="h-auto w-24 shrink-0 self-start rounded-md border border-line md:w-28"
                  />
                )}
                <div className="flex flex-col">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
                    2026 · PDF · {catalog.pages} pages
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold uppercase leading-tight">
                    <Link href={catalogPath(catalog)} className="after:absolute after:inset-0 hover:text-accent">
                      {catalog.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-muted">{catalog.blurb}</p>
                  <a href={catalog.file} download className="relative z-10 mt-auto pt-3 font-semibold text-accent underline underline-offset-4">
                    Download PDF
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function CtaBand({ title = "Tell us what your department needs." }: { title?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-eb-ink text-white">
      <div aria-hidden="true" className="grid-dark absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(700px_420px_at_85%_120%,rgb(226_36_27/0.35),transparent_65%)]" />
      <Corners />
      <div className="container-site flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-bold uppercase leading-[0.95]">{title}</h2>
          <p className="mt-4 text-lg text-white/80">Send your list or give us a call. We&apos;ll get back to you with itemized pricing.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href={quoteHref()} className={buttonClass("primary")}>
            Request a quote
          </Link>
          <a href={engineBay.phone.href} className={buttonClass("onDark")}>
            Call {engineBay.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}

// Brand cards with counts and catalog links, for the OpPeriod home page.
export function BrandCards() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {getBrands().map((brand) => {
        const catalog = printCatalogs.find((c) => c.brandSlug === brand.slug);
        return (
          <li key={brand.slug} className="card card-hover relative flex flex-col p-6">
            <h3 className="font-display text-2xl font-bold uppercase leading-tight">
              <Link href={brandPath(brand)} className="after:absolute after:inset-0 hover:text-accent">
                {brand.name}
              </Link>
            </h3>
            {brand.about[0] && <p className="mt-2 flex-1 text-muted">{brand.about[0]}</p>}
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
              <span className="text-accent">{getBrandProducts(brand.slug).length} items</span>
              {catalog && (
                <Link href={catalogPath(catalog)} className="relative z-10 text-accent underline underline-offset-4">
                  2026 catalog
                </Link>
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
