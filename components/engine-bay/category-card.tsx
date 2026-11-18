import Link from "next/link";
import type { ToolCategory } from "@/lib/engine-bay";
import { categoryPath, categoryPhoto, getProductsIn } from "@/lib/engine-bay-catalog";
import { CategoryImage } from "./category-image";

// A category tile with its featured product's photo, used on the Engine Bay
// equipment overview and category sections. The whole card links to the category.
export function CategoryCard({ category, headingLevel = "h3" }: { category: ToolCategory; headingLevel?: "h2" | "h3" }) {
  const count = getProductsIn(category.slug).length;
  const Heading = headingLevel;
  return (
    <div className="group relative flex h-full flex-col border border-line bg-bg transition-shadow hover:shadow-lg">
      <CategoryImage photo={categoryPhoto(category)} sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw" />
      <div className="flex flex-1 flex-col p-6">
        <Heading className="font-display text-3xl font-bold uppercase italic leading-none">
          <Link href={categoryPath(category)} className="after:absolute after:inset-0 group-hover:text-accent">
            {category.name}
          </Link>
        </Heading>
        <p className="mt-2 flex-1 text-muted">{category.blurb}</p>
        <p className="mt-5 font-display text-lg font-semibold uppercase italic tracking-wide text-accent">
          Shop {count} {count === 1 ? "item" : "items"} <span aria-hidden="true">&rarr;</span>
        </p>
      </div>
    </div>
  );
}
