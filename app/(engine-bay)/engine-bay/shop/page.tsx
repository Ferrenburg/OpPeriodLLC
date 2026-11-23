import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { ProductCard } from "@/components/engine-bay/product-card";
import { ShippingTable } from "@/components/engine-bay/shipping-table";
import { engineBay } from "@/lib/brand";
import { equipmentAreas, quoteHref, shopPath, shopPolicyPages, toolCategories } from "@/lib/engine-bay";
import { getSellableProducts, shopEnabled, shopLeadTime } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Order online",
  description: `Buy fire department equipment online from ${engineBay.name}. It ships direct from the manufacturer.`,
  alternates: { canonical: shopPath },
};

// Everything that can be bought online, by area and category. Brand order
// (flagships first) comes from the catalog.
export default async function ShopPage() {
  if (!shopEnabled()) notFound();
  const products = await getSellableProducts();
  const brands = [...new Map(products.map((p) => [p.brand.slug, p.brand.name])).values()];

  return (
    <>
      <EbPageHero title="Order online">
        <p>
          Pay by card and the manufacturer ships it straight to you or your station. {products.length} items from{" "}
          {brands.length > 1 ? `${brands.slice(0, -1).join(", ")} and ${brands.at(-1)}` : brands[0]}.{" "}
          {shopLeadTime() ?? ""}
        </p>
        <p className="mt-3">
          Buying for a department with a purchase order or a long list?{" "}
          <Link href={quoteHref()} className="font-semibold text-accent underline underline-offset-4">
            Request a quote
          </Link>{" "}
          instead.
        </p>
      </EbPageHero>

      <div className="container-site">
        {equipmentAreas.map((area) => {
          const sections = area.categories
            .map((slug) => ({ category: toolCategories.find((c) => c.slug === slug)!, items: products.filter((p) => p.category === slug) }))
            .filter((section) => section.items.length > 0);
          if (sections.length === 0) return null;
          return (
            <section key={area.slug} aria-labelledby={`${area.slug}-heading`} className="border-b border-line py-12">
              <h2 id={`${area.slug}-heading`} className="font-display text-3xl font-bold uppercase md:text-4xl">
                {area.name}
              </h2>
              {sections.map(({ category, items }) => (
                <div key={category.slug} className="mt-8">
                  {sections.length > 1 && <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{category.name}</h3>}
                  <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((product) => (
                      <li key={product.slug}>
                        <ProductCard product={product} headingLevel="h4" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          );
        })}

        <section aria-labelledby="shipping-heading" className="max-w-3xl py-12">
          <h2 id="shipping-heading" className="font-display text-3xl font-bold uppercase">
            Shipping
          </h2>
          <p className="mt-2 text-muted">
            Flat rates. Each brand ships from its own warehouse, so each brand&apos;s items are charged and boxed separately.
          </p>
          <div className="mt-6">
            <ShippingTable />
          </div>
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
            {shopPolicyPages.map((page) => (
              <Link key={page.href} href={page.href} className="text-accent underline underline-offset-4">
                {page.label}
              </Link>
            ))}
          </p>
        </section>
      </div>
    </>
  );
}
