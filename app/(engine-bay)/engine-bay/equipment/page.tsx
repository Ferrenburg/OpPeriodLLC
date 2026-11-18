import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/engine-bay/category-card";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { engineBay } from "@/lib/brand";
import { equipmentAreas, equipmentPath, quoteHref, toolCategories } from "@/lib/engine-bay";
import { getBrands, getProducts } from "@/lib/engine-bay-catalog";

export const metadata: Metadata = {
  title: "Equipment",
  description: `Loose equipment for fire departments from ${engineBay.name}: forcible entry and hand tools, fire hose, saws and rescue tools, wildland gear, and mounting.`,
  alternates: { canonical: equipmentPath },
};

export default function EquipmentPage() {
  const count = getProducts().length;
  const brands = getBrands().map((b) => b.name);

  return (
    <>
      <EbPageHero title="Equipment">
        <p>
          {count} items for the rig from {brands.slice(0, -1).join(", ")} and {brands.at(-1)}. Pick a category, find what
          you need, and hit Get Pricing. If it rides on the rig and you don&apos;t see it here,{" "}
          <Link href={quoteHref()} className="font-semibold text-white underline underline-offset-4">
            ask
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

      <div className="container-site">
        {equipmentAreas.map((area) => (
          <section key={area.slug} id={area.slug} aria-labelledby={`${area.slug}-heading`} className="scroll-mt-4 border-b border-line py-12 last:border-b-0 md:py-14">
            <h2 id={`${area.slug}-heading`} className="font-display text-3xl font-bold uppercase italic leading-none md:text-4xl">
              {area.name}
            </h2>
            <p className="mt-2 text-lg text-muted">{area.blurb}</p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {area.categories.map((slug) => {
                const category = toolCategories.find((c) => c.slug === slug)!;
                return (
                  <li key={slug}>
                    <CategoryCard category={category} />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
