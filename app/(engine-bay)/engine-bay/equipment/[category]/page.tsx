import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { ProductCard } from "@/components/engine-bay/product-card";
import { engineBay } from "@/lib/brand";
import { quoteHref, toolCategories } from "@/lib/engine-bay";
import { brandPath, categoryPath, getBrands, getProductsIn, type Product } from "@/lib/engine-bay-catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return toolCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/engine-bay/equipment/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = toolCategories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: category.name.charAt(0).toUpperCase() + category.name.slice(1),
    description: `${category.blurb} From ${engineBay.name}.`,
    alternates: { canonical: categoryPath(category) },
  };
}

// Products in the order their file lists them, split by the group heading
// they carry (or none).
function byGroup(products: Product[]): [string | undefined, Product[]][] {
  const groups = new Map<string | undefined, Product[]>();
  for (const product of products) {
    groups.set(product.group, [...(groups.get(product.group) ?? []), product]);
  }
  return [...groups.entries()];
}

export default async function CategoryPage({ params }: PageProps<"/engine-bay/equipment/[category]">) {
  const { category: slug } = await params;
  const category = toolCategories.find((c) => c.slug === slug);
  if (!category) notFound();
  const products = getProductsIn(category.slug);
  const brands = getBrands().filter((brand) => products.some((p) => p.brand.slug === brand.slug));

  return (
    <>
      <EbPageHero title={category.name}>
        <p>
          {category.blurb} {products.length} {products.length === 1 ? "item" : "items"}.
        </p>
        {brands.length > 1 && (
          <nav aria-label="Brands in this category" className="mt-4 flex flex-wrap gap-2">
            {brands.map((brand) => (
              <a
                key={brand.slug}
                href={`#${brand.slug}`}
                className="rounded-sm border border-white/40 px-3 py-1 text-sm font-semibold text-white hover:bg-white hover:text-eb-ink"
              >
                {brand.name}
              </a>
            ))}
          </nav>
        )}
      </EbPageHero>

      <div className="container-site">
        {products.length === 0 && (
          <p className="py-12 text-lg">
            Nothing listed here yet.{" "}
            <Link href={quoteHref(category.name)} className="font-semibold text-accent underline underline-offset-4">
              Ask us
            </Link>{" "}
            and we&apos;ll find what you need.
          </p>
        )}
        {brands.map((brand) => (
          <section key={brand.slug} id={brand.slug} aria-labelledby={`${brand.slug}-heading`} className="scroll-mt-4 border-b border-line py-12 last:border-b-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id={`${brand.slug}-heading`} className="font-display text-3xl font-bold uppercase italic md:text-4xl">
                {brand.name}
              </h2>
              <Link href={brandPath(brand)} className="font-semibold text-accent underline underline-offset-4">
                All {brand.name}
              </Link>
            </div>
            {byGroup(products.filter((p) => p.brand.slug === brand.slug)).map(([group, items]) => (
              <div key={group ?? "all"} className="mt-8">
                {group && <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{group}</h3>}
                <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((product) => (
                    <li key={product.slug}>
                      <ProductCard product={product} headingLevel={group ? "h4" : "h3"} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
