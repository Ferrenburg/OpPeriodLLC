import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/engine-bay/product-card";
import { engineBay, siteUrl } from "@/lib/brand";
import { quoteHref, toolCategories } from "@/lib/engine-bay";
import { brandPath, getProduct, getProducts, getProductsIn, quoteLabel } from "@/lib/engine-bay-catalog";
import { readPublicImage } from "@/lib/images";

// Only products in the catalog files exist. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/engine-bay/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: `${product.brand.name} ${product.name}`,
    description: `${product.summary} Model ${product.sku}. Request a quote from ${engineBay.name}.`,
    alternates: { canonical: product.href },
    openGraph: { images: [{ url: product.images[0], alt: product.name }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/engine-bay/products/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = toolCategories.find((c) => c.slug === product.category)!;
  const [main, ...more] = product.images.map((src) => readPublicImage(src)!);
  const related = getProductsIn(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);
  const base = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    mpn: product.sku,
    brand: { "@type": "Brand", name: product.brand.name },
    description: product.summary,
    image: product.images.map((src) => new URL(src, base).toString()),
    url: new URL(product.href, base).toString(),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="container-site py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap gap-x-2">
            <li>
              <Link href={`${engineBay.path}/tools`} className="hover:text-fg hover:underline">
                Tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`${engineBay.path}/tools#${category.slug}`} className="hover:text-fg hover:underline">
                {category.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">
              {product.sku}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <div className="relative aspect-square border border-line bg-white">
              <Image
                src={main.src}
                width={main.width}
                height={main.height}
                alt={product.name}
                sizes="(min-width: 1024px) 36rem, 100vw"
                priority
                className="absolute inset-0 size-full object-contain p-6"
              />
            </div>
            {more.length > 0 && (
              <ul className="mt-4 grid grid-cols-3 gap-4">
                {more.map((image, index) => (
                  <li key={image.src} className="relative aspect-square border border-line bg-white">
                    <Image
                      src={image.src}
                      width={image.width}
                      height={image.height}
                      alt={`${product.name}, photo ${index + 2}`}
                      sizes="(min-width: 1024px) 12rem, 33vw"
                      className="absolute inset-0 size-full object-contain p-2"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <Link href={brandPath(product.brand)} className="text-sm font-semibold uppercase tracking-wider text-accent hover:underline">
              {product.brand.name}
            </Link>
            <h1 className="mt-2 font-display text-4xl font-bold uppercase italic leading-none md:text-5xl">{product.name}</h1>
            <p className="mt-4 inline-block border-2 border-line px-3 py-1 text-sm">
              Model <span className="font-semibold">{product.sku}</span>
            </p>
            <p className="mt-5 text-lg leading-relaxed">{product.summary}</p>

            <div className="mt-8 border-t-4 border-eb-red bg-eb-paper p-5">
              <p className="font-display text-2xl font-bold uppercase italic">Get pricing for your department</p>
              <p className="mt-1 text-muted">Tell us how many you need and we&apos;ll send an itemized quote.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={quoteHref(quoteLabel(product))}
                  className="inline-flex min-h-12 items-center justify-center rounded-sm bg-eb-red px-7 font-display text-lg font-semibold uppercase italic tracking-wide text-white hover:bg-eb-red-dark"
                >
                  Get Pricing
                </Link>
                <a
                  href={engineBay.phone.href}
                  className="inline-flex min-h-12 items-center justify-center rounded-sm border-2 border-fg px-6 font-display text-lg font-semibold uppercase italic tracking-wide hover:bg-fg hover:text-bg"
                >
                  Call {engineBay.phone.display}
                </a>
              </div>
            </div>

            {product.features.length > 0 && (
              <section aria-labelledby="features" className="mt-10">
                <h2 id="features" className="font-display text-2xl font-bold uppercase italic">
                  Features
                </h2>
                <ul className="mt-4 space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2.5 h-1 w-3 shrink-0 -skew-x-12 bg-eb-red" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {product.details.length > 0 && (
          <section aria-labelledby="details" className="mt-12 max-w-3xl">
            <h2 id="details" className="font-display text-2xl font-bold uppercase italic">
              Details
            </h2>
            <div className="mt-4 space-y-4 text-lg leading-relaxed">
              {product.details.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {product.prop65 && (
          <p className="mt-10 max-w-3xl border-l-4 border-line pl-4 text-sm text-muted">
            <span className="font-semibold text-fg">California residents:</span> {product.prop65.replace(/^Prop 65 Warning:\s*/, "Prop 65 warning. ")}
          </p>
        )}
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-eb-paper py-12 md:py-16">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related" className="font-display text-3xl font-bold uppercase italic md:text-4xl">
                More {category.name.toLowerCase()}
              </h2>
              <Link href={`${engineBay.path}/tools#${category.slug}`} className="font-semibold text-accent underline underline-offset-4">
                See all
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.slug}>
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
