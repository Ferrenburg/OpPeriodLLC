import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogActions } from "@/components/engine-bay/catalog-actions";
import { engineBay } from "@/lib/brand";
import { catalogPath, printCatalogs, quoteHref } from "@/lib/engine-bay";
import { readPublicImage } from "@/lib/images";

export const dynamicParams = false;

export function generateStaticParams() {
  return printCatalogs.map((catalog) => ({ slug: catalog.slug }));
}

export async function generateMetadata({ params }: PageProps<"/engine-bay/catalogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const catalog = printCatalogs.find((c) => c.slug === slug);
  if (!catalog) return {};
  return {
    title: catalog.title,
    description: `${catalog.blurb} ${catalog.note}`,
    alternates: { canonical: catalogPath(catalog) },
    openGraph: { images: [{ url: catalog.cover, alt: `Cover of the ${catalog.title}` }] },
  };
}

export default async function CatalogPage({ params }: PageProps<"/engine-bay/catalogs/[slug]">) {
  const { slug } = await params;
  const catalog = printCatalogs.find((c) => c.slug === slug);
  if (!catalog) notFound();
  const cover = readPublicImage(catalog.cover);
  const coverImage = cover && (
    <Image
      src={cover.src}
      width={cover.width}
      height={cover.height}
      alt={`Cover of the ${catalog.title}`}
      sizes="(min-width: 768px) 20rem, 80vw"
      priority
      className="h-auto w-full border border-line shadow-sm"
    />
  );

  return (
    <div className="container-site py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-x-2">
          <li>
            <Link href={`${engineBay.path}/catalogs`} className="hover:text-fg hover:underline">
              Catalogs
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            {catalog.brand}
          </li>
        </ol>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase leading-none md:text-5xl">{catalog.title}</h1>
          <p className="mt-3 text-lg text-muted">
            {catalog.pages} pages. {catalog.note}
          </p>
        </div>
        <div className="hidden md:block">
          <CatalogActions catalog={catalog} />
        </div>
      </div>

      {/* Phones: most mobile browsers won't show an embedded PDF, so show the
          cover and let them open or download the file instead. */}
      <div className="mt-8 md:hidden">
        <div className="mx-auto max-w-xs">{coverImage}</div>
        <div className="mt-6">
          <CatalogActions catalog={catalog} primary="open" />
        </div>
      </div>

      <div className="mt-8 hidden md:block">
        <object
          data={`${catalog.file}#view=FitH`}
          type="application/pdf"
          aria-label={catalog.title}
          className="h-[85vh] min-h-[40rem] w-full border border-line bg-surface"
        >
          <div className="grid items-center gap-8 p-8 sm:grid-cols-[16rem_1fr]">
            {coverImage}
            <div>
              <p className="text-lg">This browser can&apos;t show the catalog here. Open it or download it instead.</p>
              <div className="mt-5">
                <CatalogActions catalog={catalog} primary="open" />
              </div>
            </div>
          </div>
        </object>
      </div>

      <p className="mt-8 text-lg">
        Found what you need?{" "}
        <Link href={quoteHref(catalog.brand)} className="font-semibold text-accent underline underline-offset-4">
          Send us your list
        </Link>{" "}
        with the part numbers from the catalog, or call{" "}
        <a href={engineBay.phone.href} className="font-semibold text-accent underline underline-offset-4">
          {engineBay.phone.display}
        </a>
        .
      </p>
    </div>
  );
}
