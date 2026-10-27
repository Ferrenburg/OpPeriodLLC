import Link from "next/link";
import { Logo } from "@/components/logo";
import { engineBay } from "@/lib/brand";
import { ebNav, quoteHref, toolCategories } from "@/lib/engine-bay";
import { EbMobileMenu } from "./mobile-menu";

// Utility bar, logo and nav, then the red category bar, like a dealer site.
export function EbHeader() {
  return (
    <header className="bg-eb-ink text-white">
      <div className="border-b border-white/10 bg-black">
        <div className="container-site flex h-9 items-center justify-between gap-4 text-sm">
          <p className="hidden text-white/70 sm:block">Questions about a tool? Give us a call.</p>
          <div className="flex items-center gap-5">
            <a href={engineBay.phone.href} className="font-semibold text-white hover:underline">
              {engineBay.phone.display}
            </a>
            <a href={`mailto:${engineBay.email}`} className="hidden text-white/80 hover:text-white md:inline">
              {engineBay.email}
            </a>
            <Link href={quoteHref()} className="font-semibold uppercase tracking-wider text-white hover:underline">
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      <div className="container-site relative flex h-20 items-center justify-between gap-6 md:h-24">
        <Link href={engineBay.path} className="flex shrink-0 items-center gap-3">
          <Logo logo={engineBay.logo} onDark className="h-10 md:h-12" sizes="80px" priority />
          <span className="leading-none">
            <span className="block font-display text-2xl font-bold uppercase italic tracking-wide md:text-3xl">Engine Bay</span>
            <span className="mt-1 block text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/70 md:text-xs">Supply Co.</span>
          </span>
        </Link>

        <nav aria-label="Engine Bay" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {ebNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-display text-lg font-semibold uppercase italic tracking-wide hover:text-white/70">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={quoteHref()}
                className="inline-flex min-h-12 items-center rounded-sm bg-eb-red px-6 font-display text-lg font-semibold uppercase italic tracking-wide text-white hover:bg-eb-red-dark"
              >
                Request a Quote
              </Link>
            </li>
          </ul>
        </nav>

        <EbMobileMenu />
      </div>

      <nav aria-label="Tool categories" className="bg-eb-red">
        <ul className="container-site flex gap-x-8 overflow-x-auto whitespace-nowrap py-3 [scrollbar-width:none] lg:justify-between">
          {toolCategories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`${engineBay.path}/tools#${category.slug}`}
                className="font-display text-base font-semibold uppercase italic tracking-wide text-white hover:underline md:text-lg"
              >
                {category.short}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
