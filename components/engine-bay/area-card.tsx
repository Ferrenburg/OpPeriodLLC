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

// One area of loose equipment (like "Saws and rescue") as a tile: its first
// category's photo, a number tag, an arrow that turns red on hover, and links
// into it with counts. The heading link covers the tile; the inner links sit
// above it.
export function AreaCard({
  area,
  index,
  wide = false,
  headingLevel = "h3",
}: {
  area: EquipmentArea;
  index: number;
  wide?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const first = toolCategories.find((c) => c.slug === area.categories[0])!;
  const list = entries(area);
  const total = area.categories.reduce((sum, slug) => sum + getProductsIn(slug).length, 0);
  const Heading = headingLevel;
  return (
    <div className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <div className="relative">
        <CategoryImage
          photo={categoryPhoto(first)}
          aspect={wide ? "aspect-[16/10] lg:aspect-[16/6]" : "aspect-[16/10]"}
          sizes={wide ? "(min-width: 1024px) 48rem, 100vw" : "(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"}
        />
        <span className="absolute left-4 top-4 rounded-md bg-fg/80 px-2 py-1 text-[0.68rem] font-semibold tracking-[0.12em] text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-line-2 bg-card/90 text-fg transition duration-300 group-hover:-rotate-45 group-hover:border-accent-fill group-hover:bg-accent-fill group-hover:text-white"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">{total} items</p>
        <Heading className="mt-1 font-display text-3xl font-bold uppercase leading-none">
          <Link href={categoryPath(first)} className="after:absolute after:inset-0 group-hover:text-accent">
            {area.name}
          </Link>
        </Heading>
        <p className="mt-2 text-muted">{area.blurb}</p>
        <ul className={`relative z-10 mt-4 flex-1 space-y-0.5 ${wide ? "sm:columns-2 sm:gap-8" : ""}`}>
          {list.map((entry) => (
            <li key={entry.label} className="break-inside-avoid">
              <Link href={entry.href} className="inline-flex items-baseline gap-2 py-1 font-semibold hover:text-accent">
                <span className="underline decoration-line-2 underline-offset-4 hover:decoration-current">{entry.label}</span>
                <span className="text-sm font-normal text-muted">{entry.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
