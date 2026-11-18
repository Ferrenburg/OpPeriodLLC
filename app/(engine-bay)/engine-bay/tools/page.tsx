import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/engine-bay/category-card";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { engineBay } from "@/lib/brand";
import { quoteHref, toolCategories } from "@/lib/engine-bay";
import { getBrands, getProducts } from "@/lib/engine-bay-catalog";

export const metadata: Metadata = {
  title: "Tools",
  description: `Halligans, axes, hooks and pike poles, fire hose, irons, forcible entry, straps and mounts, rescue, wildland, and saws from ${engineBay.name}.`,
  alternates: { canonical: `${engineBay.path}/tools` },
};

export default function ToolsPage() {
  const count = getProducts().length;
  const brands = getBrands().map((b) => b.name);

  return (
    <>
      <EbPageHero title="Tools">
        <p>
          {count} tools and parts from {brands.slice(0, -1).join(", ")} and {brands.at(-1)}. Pick a category, find what you
          need, and hit Get Pricing. Don&apos;t see something?{" "}
          <Link href={quoteHref()} className="font-semibold text-white underline underline-offset-4">
            Ask
          </Link>{" "}
          and we&apos;ll track it down.
        </p>
        <p className="mt-3">
          Want the full price guides?{" "}
          <Link href={`${engineBay.path}/catalogs`} className="font-semibold text-white underline underline-offset-4">
            See the catalogs
          </Link>
          .
        </p>
      </EbPageHero>

      <section aria-label="Categories" className="container-site py-12 md:py-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {toolCategories.map((category) => (
            <li key={category.slug}>
              <CategoryCard category={category} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
