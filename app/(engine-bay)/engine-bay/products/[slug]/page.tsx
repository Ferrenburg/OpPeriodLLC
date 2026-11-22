import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/button";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/engine-bay/product-card";
import { engineBay, siteUrl } from "@/lib/brand";
import { ProductPhoto } from "@/components/engine-bay/product-photo";
import { cartPath, categoryPath, equipmentPath, quoteHref, shopPolicyPages, toolCategories } from "@/lib/engine-bay";
import { brandPath, getProduct, getProducts, getProductsIn, partNumbers, quoteLabel } from "@/lib/engine-bay-catalog";
import { AddToCart } from "@/components/engine-bay/add-to-cart";
import { HosePicker } from "@/components/engine-bay/hose-picker";
import { offersFor, shopLeadTime } from "@/lib/shop";
import { formatMoney } from "@/lib/shop-core";
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
    description: `${product.summary}${partNumbers(product) ? ` ${product.sku ? "Model" : "Part numbers"} ${partNumbers(product)}.` : ""} Request a quote from ${engineBay.name}`,
    alternates: { canonical: product.href },
    openGraph: product.images[0] ? { images: [{ url: product.images[0], alt: product.name }] } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/engine-bay/products/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = toolCategories.find((c) => c.slug === product.category)!;
  // Stripe prices for this product, if it's sold online. Empty when the shop
  // is off or Stripe has no price for it, and the page stays quote only.
  const offers = await offersFor(product);
  const offerBySku = new Map(offers.map((offer) => [offer.sku, offer]));
  const single = product.sku ? offerBySku.get(product.sku) : undefined;
  const hoseBuilds = offers.filter((offer) => offer.hose);
  const fromPrice = offers.length ? Math.min(...offers.map((o) => o.unitAmount)) : undefined;
  const leadTime = shopLeadTime();
  const more = product.images.slice(1).map((src) => readPublicImage(src)!);
  const related = getProductsIn(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);
  const base = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.sku ? { sku: product.sku, mpn: product.sku } : {}),
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
              <Link href={equipmentPath} className="hover:text-fg hover:underline">
                Equipment
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={categoryPath(category)} className="hover:text-fg hover:underline">
                {category.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">
              {product.sku ?? product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <div className="relative aspect-square border border-line bg-white">
              <ProductPhoto src={product.images[0]} name={product.name} alt={product.name} sizes="(min-width: 1024px) 36rem, 100vw" priority padding="p-6" />
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
            <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-none md:text-5xl">{product.name}</h1>
            {partNumbers(product) && (
              <p className="mt-4 inline-block rounded-lg border border-line-2 bg-card px-3 py-1 text-sm">
                {product.sku ? "Model" : `${product.variants.length} options:`} <span className="font-semibold">{partNumbers(product)}</span>
              </p>
            )}
            <p className="mt-5 text-lg leading-relaxed">{product.summary}</p>

            {offers.length > 0 && (
              <div className="card relative mt-8 overflow-hidden p-6">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-accent-fill to-accent-fill-hover" />
                <p className="font-display text-2xl font-bold uppercase">Order online</p>
                {single ? (
                  <>
                    <p className="mt-2 font-display text-4xl font-bold">{formatMoney(single.unitAmount)}</p>
                    <div className="mt-4">
                      <AddToCart sku={single.sku} cartHref={cartPath} />
                    </div>
                  </>
                ) : hoseBuilds.length > 0 ? (
                  <div className="mt-4">
                    <HosePicker
                      builds={hoseBuilds.map((offer) => ({
                        sku: offer.sku,
                        unitAmount: offer.unitAmount,
                        diameter: offer.hose!.diameter,
                        lengthFt: offer.hose!.lengthFt,
                        color: offer.hose!.color,
                        coupling: offer.hose!.coupling,
                      }))}
                      cartHref={cartPath}
                      quoteBase={quoteHref(quoteLabel(product))}
                    />
                  </div>
                ) : (
                  <p className="mt-2 text-lg">
                    From <span className="font-display text-3xl font-bold">{formatMoney(fromPrice!)}</span>. Pick a size below.
                  </p>
                )}
                <p className="mt-4 text-sm text-muted">
                  {leadTime ?? "Ships direct from the manufacturer."} Tax is added at checkout.{" "}
                  <Link href={shopPolicyPages[0].href} className="underline underline-offset-4 hover:text-accent">
                    Shipping rates
                  </Link>
                </p>
              </div>
            )}

            <div className={`card relative overflow-hidden p-6 ${offers.length > 0 ? "mt-5" : "mt-8"}`}>
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-accent-fill to-accent-fill-hover" />
              <p className="font-display text-2xl font-bold uppercase">{offers.length > 0 ? "Need a department quote?" : "Get pricing for your department"}</p>
              <p className="mt-1 text-muted">
                {partNumbers(product)
                  ? "Tell us how many you need and we'll send an itemized quote."
                  : "Tell us the size, lengths, couplings, and color you need and we'll send an itemized quote."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={quoteHref(quoteLabel(product))}
                  className={buttonClass(offers.length > 0 ? "secondary" : "primary")}
                >
                  Get Pricing
                </Link>
                <a
                  href={engineBay.phone.href}
                  className={buttonClass("secondary")}
                >
                  Call {engineBay.phone.display}
                </a>
              </div>
            </div>

            {product.datasheet && (
              <p className="mt-5">
                <a href={product.datasheet} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline underline-offset-4">
                  {product.brand.name} data sheet (PDF)
                </a>{" "}
                <span className="text-muted">for sizes, pressures, and weights.</span>
              </p>
            )}

            {product.variants.length > 0 && (
              <section aria-labelledby="options" className="mt-10">
                <h2 id="options" className="font-display text-2xl font-bold uppercase">
                  Sizes and options
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[22rem] border-collapse text-left">
                    <thead>
                      <tr className="bg-eb-ink text-sm uppercase tracking-wider text-white">
                        <th scope="col" className="px-3 py-2 font-semibold">Part #</th>
                        <th scope="col" className="px-3 py-2 font-semibold">Size or option</th>
                        {offers.length > 0 && (
                          <th scope="col" className="px-3 py-2 text-right font-semibold">
                            Price
                          </th>
                        )}
                        <th scope="col" className="px-3 py-2">
                          <span className="sr-only">Order or get pricing</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((variant) => (
                        <tr key={variant.sku} className="border-b border-line align-top">
                          <th scope="row" className="whitespace-nowrap px-3 py-3 font-semibold text-accent">
                            {variant.sku}
                          </th>
                          <td className="px-3 py-3">{variant.option}</td>
{offers.length > 0 && (
                            <td className="whitespace-nowrap px-3 py-3 text-right font-semibold">
                              {offerBySku.get(variant.sku) ? formatMoney(offerBySku.get(variant.sku)!.unitAmount) : ""}
                            </td>
                          )}
                          <td className="whitespace-nowrap px-3 py-3 text-right">
                            {offerBySku.get(variant.sku) ? (
                              <AddToCart sku={variant.sku} cartHref={cartPath} compact />
                            ) : (
                              <Link href={quoteHref(quoteLabel(product, variant))} className="font-semibold text-accent underline underline-offset-4">
                                Get pricing<span className="sr-only"> for {variant.sku}</span>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {product.features.length > 0 && (
              <section aria-labelledby="features" className="mt-10">
                <h2 id="features" className="font-display text-2xl font-bold uppercase">
                  Features
                </h2>
                <ul className="mt-4 space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2.5 h-[3px] w-3 shrink-0 rounded-full bg-accent-fill" aria-hidden="true" />
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
            <h2 id="details" className="font-display text-2xl font-bold uppercase">
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
          <p className="mt-10 max-w-3xl border-l-2 border-line-2 pl-4 text-sm text-muted">
            <span className="font-semibold text-fg">California residents:</span> {product.prop65.replace(/^Prop 65 Warning:\s*/, "Prop 65 warning. ")}
          </p>
        )}
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="border-t border-line bg-surface/70 py-14 md:py-20">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related" className="font-display text-3xl font-bold uppercase md:text-4xl">
                More {category.name.toLowerCase()}
              </h2>
              <Link href={categoryPath(category)} className="font-semibold text-accent underline underline-offset-4">
                See all
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
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
