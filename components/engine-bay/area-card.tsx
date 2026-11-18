import Link from "next/link";
import { categoryPath, toolCategories, type EquipmentArea } from "@/lib/engine-bay";
import { categoryPhoto, getProductsIn, type Product } from "@/lib/engine-bay-catalog";
import { CategoryImage } from "./category-image";

type Entry = { label: string; href: string; count: number };

// What an area lists: its categories, or for an area with a single category,
// what's inside it (the catalog's groups, or else the brands) so the card
// still says something useful.
function entries(area: EquipmentArea): Entry[] {
  const categories = area.categories.map((slug) => toolCategories.find((c) => c.slug === slug)!);
  if (categories.length > 1) {
    return categories.map((c) => ({ label: c.name, href: categoryPath(c), count: getProductsIn(c.slug).length }));
  }
  const category = categories[0];
  const products = getProductsIn(category.slug);
  const tally = (key: (p: Product) => string | undefined, anchor: (p: Product) => string) => {
    const out = new Map<string, Entry>();
    for (const p of products) {
      const label = key(p);
      if (!label) return null;
      const entry = out.get(label) ?? { label, href: anchor(p), count: 0 };
      entry.count += 1;
      out.set(label, entry);
    }
    return [...out.values()].sort((a, b) => b.count - a.count);
  };
  const groups = tally((p) => p.group, () => categoryPath(category));
  if (groups && groups.length > 1) return groups;
  return tally((p) => p.brand.name, (p) => `${categoryPath(category)}#${p.brand.slug}`) ?? [];
}

// One area of loose equipment (like "Saws and rescue"): its first category's
// photo, a short line, and links into it with counts.
export function AreaCard({ area, wide = false, headingLevel = "h3" }: { area: EquipmentArea; wide?: boolean; headingLevel?: "h2" | "h3" }) {
  const first = toolCategories.find((c) => c.slug === area.categories[0])!;
  const list = entries(area);
  const total = area.categories.reduce((sum, slug) => sum + getProductsIn(slug).length, 0);
  const Heading = headingLevel;
  return (
    <div className="flex h-full flex-col border border-line bg-bg">
      <Link href={categoryPath(first)} tabIndex={-1} aria-hidden="true">
        <CategoryImage
          photo={categoryPhoto(first)}
          aspect={wide ? "aspect-[16/10] lg:aspect-[16/6]" : "aspect-[16/10]"}
          sizes={wide ? "(min-width: 1024px) 48rem, 100vw" : "(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"}
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <Heading className="font-display text-3xl font-bold uppercase italic leading-none">
          <Link href={categoryPath(first)} className="hover:text-accent">
            {area.name}
          </Link>
        </Heading>
        <p className="mt-2 text-muted">{area.blurb}</p>
        <ul className={`mt-4 flex-1 space-y-1 ${wide ? "sm:columns-2 sm:gap-8" : ""}`}>
          {list.map((entry) => (
            <li key={entry.label} className="break-inside-avoid">
              <Link href={entry.href} className="group inline-flex items-baseline gap-2 py-1 font-semibold hover:text-accent">
                <span className="underline decoration-line underline-offset-4 group-hover:decoration-current">{entry.label}</span>
                <span className="text-sm font-normal text-muted">{entry.count}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted">{total} items</p>
      </div>
    </div>
  );
}
