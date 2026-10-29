import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { ProductCard } from "@/components/engine-bay/product-card";
import { engineBay } from "@/lib/brand";
import { quoteHref, toolCategories } from "@/lib/engine-bay";
import { brandPath, getBrand, getBrandProducts, getBrands } from "@/lib/engine-bay-catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBrands().map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: PageProps<"/engine-bay/brands/[slug]">): Promise<Metadata> {
  const brand = getBrand((await params).slug);
  if (!brand) return {};
  return {
    title: brand.name,
    description: `${brand.name} fire service tools from ${engineBay.name}. ${brand.about[0] ?? ""}`.trim(),
    alternates: { canonical: brandPath(brand) },
  };
}

export default async function BrandPage({ params }: PageProps<"/engine-bay/brands/[slug]">) {
  const brand = getBrand((await params).slug);
  if (!brand) notFound();
  const products = getBrandProducts(brand.slug);

  return (
    <>
      <EbPageHero title={brand.name}>
        {brand.about.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </EbPageHero>

      <div className="container-site">
        {toolCategories.map((category) => {
          const items = products.filter((p) => p.category === category.slug);
          if (items.length === 0) return null;
          return (
            <section key={category.slug} aria-labelledby={`${category.slug}-heading`} className="border-b border-line py-12 last:border-b-0">
              <h2 id={`${category.slug}-heading`} className="font-display text-3xl font-bold uppercase italic">
                {category.name}
              </h2>
              <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((product) => (
                  <li key={product.slug}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        <p className="pb-14 text-lg">
          Need a {brand.name} tool that isn&apos;t listed?{" "}
          <Link href={quoteHref(brand.name)} className="font-semibold text-accent underline underline-offset-4">
            Ask us
          </Link>
          .
        </p>
      </div>
    </>
  );
}
