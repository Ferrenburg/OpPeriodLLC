import type { Metadata } from "next";
import Link from "next/link";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { ProductCard } from "@/components/engine-bay/product-card";
import { engineBay } from "@/lib/brand";
import { quoteHref, toolCategories } from "@/lib/engine-bay";
import { getProducts, getProductsIn } from "@/lib/engine-bay-catalog";

export const metadata: Metadata = {
  title: "Tools",
  description: `Halligan bars, fire axes, roof hooks, irons, forcible entry, and wildland tools from ${engineBay.name}.`,
  alternates: { canonical: `${engineBay.path}/tools` },
};

export default function ToolsPage() {
  const count = getProducts().length;

  return (
    <>
      <EbPageHero title="Tools">
        <p>
          {count} tools and parts. Pick what you need and hit Get Pricing, or send us a list. Don&apos;t see something?{" "}
          <Link href={quoteHref()} className="font-semibold text-white underline underline-offset-4">
            Ask
          </Link>{" "}
          and we&apos;ll track it down.
        </p>
      </EbPageHero>

      <div className="container-site">
        {toolCategories.map((category) => {
          const products = getProductsIn(category.slug);
          if (products.length === 0) return null;
          return (
            <section
              key={category.slug}
              id={category.slug}
              aria-labelledby={`${category.slug}-heading`}
              className="scroll-mt-4 border-b border-line py-12 last:border-b-0 md:py-14"
            >
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                <div>
                  <h2 id={`${category.slug}-heading`} className="font-display text-3xl font-bold uppercase italic md:text-4xl">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-lg text-muted">{category.blurb}</p>
                </div>
                <p className="text-sm font-semibold uppercase tracking-wider text-muted">
                  {products.length} {products.length === 1 ? "item" : "items"}
                </p>
              </div>
              <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <li key={product.slug}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
