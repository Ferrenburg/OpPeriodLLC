import type { Metadata } from "next";
import Link from "next/link";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { CategoryImage } from "@/components/engine-bay/category-image";
import { engineBay } from "@/lib/brand";
import { quoteHref, toolCategories } from "@/lib/engine-bay";

export const metadata: Metadata = {
  title: "Tools",
  description: `Halligan bars, flathead axes, hooks and pike poles, irons, forcible entry tools, and mounts from ${engineBay.name}.`,
  alternates: { canonical: `${engineBay.path}/tools` },
};

export default function ToolsPage() {
  return (
    <>
      <EbPageHero title="Tools">
        <p>
          What we quote, by category. Looking for something that isn&apos;t here?{" "}
          <Link href={quoteHref()} className="font-semibold text-white underline underline-offset-4">
            Ask
          </Link>{" "}
          and we&apos;ll track it down.
        </p>
      </EbPageHero>

      <div className="container-site divide-y divide-line">
        {toolCategories.map((category) => (
          <section
            key={category.slug}
            id={category.slug}
            aria-labelledby={`${category.slug}-heading`}
            className={`grid scroll-mt-4 gap-6 py-12 md:gap-10 md:py-14 ${
              category.image ? "md:grid-cols-[18rem_1fr] lg:grid-cols-[20rem_1fr_14rem]" : "md:grid-cols-[1fr_14rem]"
            }`}
          >
            {/* Photos show here once they're added; until then the heading carries it. */}
            {category.image && <CategoryImage category={category} sizes="(min-width: 768px) 20rem, 100vw" />}
            <div>
              <h2 id={`${category.slug}-heading`} className="font-display text-3xl font-bold uppercase italic md:text-4xl">
                {category.name}
              </h2>
              <p className="mt-2 text-lg text-muted">{category.blurb}</p>
              <h3 className="mt-6 font-semibold">Put this on your quote request</h3>
              <ul className="mt-2 space-y-1 text-lg">
                {category.quoteWith.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-3 h-1 w-3 shrink-0 -skew-x-12 bg-eb-red" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={category.image ? "md:col-start-2 lg:col-start-auto lg:pt-2" : "md:pt-2"}>
              <Link
                href={quoteHref(category.name)}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-eb-red px-6 font-display text-lg font-semibold uppercase italic tracking-wide text-white hover:bg-eb-red-dark"
              >
                Get pricing
              </Link>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
