import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/button";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { engineBay } from "@/lib/brand";
import { catalogPath, printCatalogs } from "@/lib/engine-bay";
import { readPublicImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Catalogs",
  description: `${engineBay.name} 2026 catalogs and price guides for Council Tool and Fire Hooks Unlimited, as PDFs.`,
  alternates: { canonical: `${engineBay.path}/catalogs` },
};

export default function CatalogsPage() {
  return (
    <>
      <EbPageHero title="Catalogs">
        <p>Our 2026 catalogs and price guides. Read them here, print them, or pass them around the station.</p>
      </EbPageHero>

      <section className="container-site py-12 md:py-16">
        <ul className="grid gap-10 md:grid-cols-2">
          {printCatalogs.map((catalog) => {
            const cover = readPublicImage(catalog.cover);
            return (
              <li key={catalog.slug} className="grid gap-6 sm:grid-cols-[12rem_1fr]">
                <Link href={catalogPath(catalog)} className="block self-start border border-line shadow-sm transition-shadow hover:shadow-lg">
                  {cover && (
                    <Image
                      src={cover.src}
                      width={cover.width}
                      height={cover.height}
                      alt={`Cover of the ${catalog.title}`}
                      sizes="(min-width: 640px) 12rem, 100vw"
                      className="h-auto w-full"
                    />
                  )}
                </Link>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted">{catalog.brand}</p>
                  <h2 className="mt-1 font-display text-3xl font-bold uppercase leading-none">
                    <Link href={catalogPath(catalog)} className="hover:text-accent">
                      {catalog.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-lg">{catalog.blurb}</p>
                  <p className="mt-2 text-sm text-muted">
                    {catalog.pages} pages. {catalog.note}
                  </p>
                  <div className="mt-5">
                    <Link
                      href={catalogPath(catalog)}
                      className={buttonClass("primary", "mb-3")}
                    >
                      View catalog
                    </Link>
                    <p>
                      <a href={catalog.file} download className="font-semibold text-accent underline underline-offset-4">
                        Download PDF
                      </a>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
