import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CategoryImage } from "@/components/engine-bay/category-image";
import { Logo } from "@/components/logo";
import { company, engineBay } from "@/lib/brand";
import { orderingSteps, quoteHref, toolCategories } from "@/lib/engine-bay";
import { brandPath, categoryPhoto, getBrandProducts, getBrands, getProductsIn } from "@/lib/engine-bay-catalog";
import { readPublicImage } from "@/lib/images";

export const metadata: Metadata = {
  title: { absolute: `${engineBay.name} | Fire Service Hand Tools` },
  alternates: { canonical: engineBay.path },
};

const redButton =
  "inline-flex min-h-12 items-center justify-center rounded-sm bg-eb-red px-7 font-display text-lg font-semibold uppercase italic tracking-wide text-white hover:bg-eb-red-dark";
const heading = "font-display text-4xl font-bold uppercase italic leading-none md:text-5xl";

export default function EngineBayHome() {
  const lockup = readPublicImage("/brand/engine-bay-lockup.webp");
  const brands = getBrands();

  return (
    <>
      <section className="diamond-plate relative overflow-hidden text-white">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 -skew-x-12 translate-x-24 bg-eb-red/90 lg:block" aria-hidden="true" />
        <div className="container-site relative grid items-center gap-10 py-16 md:py-24 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="font-semibold uppercase tracking-[0.3em] text-white/70">Fire service hand tools</p>
            <h1 className="mt-4 font-display text-6xl font-bold uppercase italic leading-[0.9] sm:text-7xl md:text-8xl">
              Halligans
              <br />
              to hooks.
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-white/85">
              Forcible entry, overhaul, and wildland tools for fire departments. Send us your list and we&apos;ll quote it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={quoteHref()} className={redButton}>
                Request a Quote
              </Link>
              <Link
                href={`${engineBay.path}/tools`}
                className="inline-flex min-h-12 items-center justify-center rounded-sm border-2 border-white px-7 font-display text-lg font-semibold uppercase italic tracking-wide text-white hover:bg-white hover:text-eb-ink"
              >
                See the Tools
              </Link>
            </div>
          </div>
          <div className="hidden justify-center lg:flex">
            <Logo logo={engineBay.logo} onDark className="h-56 drop-shadow-2xl xl:h-64" sizes="420px" priority />
          </div>
        </div>
      </section>

      <section aria-labelledby="categories" className="py-14 md:py-20">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="categories" className={heading}>
              Shop by category
            </h2>
            <Link href={`${engineBay.path}/tools`} className="font-semibold text-accent underline underline-offset-4">
              All tools
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {toolCategories.filter((category) => !category.minor).map((category) => {
              const count = getProductsIn(category.slug).length;
              const href = count > 0 ? `${engineBay.path}/tools#${category.slug}` : quoteHref(category.name);
              return (
                <li key={category.slug} className="group relative flex flex-col border border-line bg-bg transition-shadow hover:shadow-lg">
                  <CategoryImage photo={categoryPhoto(category)} sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw" />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-3xl font-bold uppercase italic leading-none">
                      <Link href={href} className="after:absolute after:inset-0 group-hover:text-accent">
                        {category.name}
                      </Link>
                    </h3>
                    <p className="mt-2 flex-1 text-muted">{category.blurb}</p>
                    <p className="mt-5 font-display text-lg font-semibold uppercase italic tracking-wide text-accent">
                      {count > 0 ? `Shop ${count} ${count === 1 ? "item" : "items"}` : "Get pricing"} <span aria-hidden="true">&rarr;</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          {toolCategories
            .filter((category) => category.minor && getProductsIn(category.slug).length > 0)
            .map((category) => (
              <p key={category.slug} className="mt-6 text-lg">
                {category.blurb}{" "}
                <Link href={`${engineBay.path}/tools#${category.slug}`} className="font-semibold text-accent underline underline-offset-4">
                  Shop {category.name.toLowerCase()}
                </Link>
              </p>
            ))}
        </div>
      </section>

      <section id="ordering" aria-labelledby="ordering-heading" className="scroll-mt-4 bg-eb-paper py-14 md:py-20">
        <div className="container-site">
          <h2 id="ordering-heading" className={heading}>
            How ordering works
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {orderingSteps.map((step, index) => (
              <li key={step.title} className="border-t-4 border-eb-red pt-5">
                <span className="font-display text-5xl font-bold italic text-accent">0{index + 1}</span>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase italic">{step.title}</h3>
                <p className="mt-2 text-lg text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="about" aria-labelledby="about-heading" className="scroll-mt-4 py-14 md:py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 id="about-heading" className={heading}>
              By firefighters, for firefighters
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed">
              {engineBay.name} is a division of {company.legalName}, run by people who work in the fire service. When
              you ask about a tool, you&apos;re talking to someone who has swung one.
            </p>
            <Link href={quoteHref()} className={`${redButton} mt-8`}>
              Request a Quote
            </Link>
          </div>
          {lockup && (
            <Image
              src={lockup.src}
              width={lockup.width}
              height={lockup.height}
              alt={`${engineBay.name} logo: hand tools, fire service, built to last`}
              sizes="(min-width: 1024px) 36rem, 100vw"
              className="h-auto w-full rounded-sm"
            />
          )}
        </div>
      </section>

      {brands.length > 0 && (
        <section aria-labelledby="brands" className="border-t border-line py-14 md:py-20">
          <div className="container-site">
            <h2 id="brands" className={heading}>
              Brands we carry
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link href={brandPath(brand)} className="group block h-full border-2 border-line p-6 hover:border-eb-red">
                    <p className="font-display text-3xl font-bold uppercase italic group-hover:text-accent">{brand.name}</p>
                    {brand.about[0] && <p className="mt-2 text-muted">{brand.about[0]}</p>}
                    <p className="mt-4 font-semibold text-accent">
                      {getBrandProducts(brand.slug).length} tools and parts <span aria-hidden="true">&rarr;</span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-eb-red py-12 text-white md:py-16">
        <div className="container-site flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-4xl font-bold uppercase italic leading-none md:text-5xl">Got a list?</h2>
            <p className="mt-3 text-lg text-white">
              Send it over and we&apos;ll price it out. Or call{" "}
              <a href={engineBay.phone.href} className="font-semibold underline underline-offset-4">
                {engineBay.phone.display}
              </a>{" "}
              or email{" "}
              <a href={`mailto:${engineBay.email}`} className="font-semibold underline underline-offset-4">
                {engineBay.email}
              </a>
              .
            </p>
          </div>
          <Link
            href={quoteHref()}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-sm bg-eb-ink px-7 font-display text-lg font-semibold uppercase italic tracking-wide text-white hover:bg-black"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
