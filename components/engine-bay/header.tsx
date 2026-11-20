import Link from "next/link";
import { buttonClass } from "@/components/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavLink } from "@/components/nav-link";
import { engineBay } from "@/lib/brand";
import { categoryPath, ebNav, equipmentAreas, equipmentPath, quoteHref, toolCategories } from "@/lib/engine-bay";
import { brandPath, getBrandProducts, getBrands, getProductsIn } from "@/lib/engine-bay-catalog";
import { EbMobileMenu } from "./mobile-menu";

// Light utility bar with the equipment areas and the phone number, then a
// translucent sticky bar with the logo, menus, and the quote button.
export function EbHeader() {
  const brands = getBrands();
  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-line bg-surface/95">
        <div className="container-site flex h-9 items-center justify-between gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
          <nav aria-label="Equipment areas" className="hidden lg:block">
            <ul className="-ml-3 flex gap-1">
              {equipmentAreas.map((area) => (
                <li key={area.slug}>
                  <Link href={`${equipmentPath}#${area.slug}`} className="rounded-md px-3 py-1.5 text-muted hover:bg-fg/[0.04] hover:text-accent">
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-5">
            <Link href="/" className="hidden text-muted hover:text-accent sm:inline">
              Division of OpPeriod LLC
            </Link>
            <a href={engineBay.phone.href} className="text-fg hover:text-accent">
              {engineBay.phone.display}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="container-site relative flex h-[4.5rem] items-center justify-between gap-6">
          <Link href={engineBay.path} className="flex shrink-0 items-center gap-3">
            <Logo logo={engineBay.logo} className="h-9 md:h-10" sizes="80px" priority />
            <span className="leading-none">
              <span className="block font-display text-2xl font-bold uppercase tracking-wide">Engine Bay</span>
              <span className="mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-muted">Supply Co.</span>
            </span>
          </Link>

          <nav aria-label="Engine Bay" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              <li>
                <NavMenu label="Equipment" activePrefix={equipmentPath} align="center">
                  <div className="grid gap-x-6 gap-y-6 p-4 md:grid-cols-5">
                    {equipmentAreas.map((area) => (
                      <div key={area.slug}>
                        <Link
                          href={`${equipmentPath}#${area.slug}`}
                          className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted hover:text-accent"
                        >
                          {area.name}
                        </Link>
                        <ul className="mt-3 space-y-1">
                          {area.categories.map((slug) => {
                            const category = toolCategories.find((c) => c.slug === slug)!;
                            return (
                              <li key={slug}>
                                <Link href={categoryPath(category)} className="flex items-baseline justify-between gap-3 rounded-md py-1 font-semibold hover:text-accent">
                                  {category.name}
                                  <span className="text-xs font-normal text-muted">{getProductsIn(slug).length}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-surface px-4 py-3">
                    <span className="text-sm text-muted">Don&apos;t see it? Ask and we&apos;ll track it down.</span>
                    <Link href={equipmentPath} className="text-sm font-semibold text-accent underline underline-offset-4">
                      All equipment
                    </Link>
                  </div>
                </NavMenu>
              </li>
              <li>
                <NavMenu label="Brands" activePrefix={`${engineBay.path}/brands`} panelClassName="min-w-64">
                  <ul>
                    {brands.map((brand) => (
                      <li key={brand.slug}>
                        <Link
                          href={brandPath(brand)}
                          className="flex items-baseline justify-between gap-4 rounded-md px-3 py-2.5 font-semibold hover:bg-surface hover:text-accent"
                        >
                          {brand.name}
                          <span className="text-xs font-normal text-muted">{getBrandProducts(brand.slug).length}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavMenu>
              </li>
              {ebNav
                .filter((item) => item.href !== equipmentPath && !item.href.endsWith("#about"))
                .map((item) => (
                  <li key={item.href}>
                    <NavLink href={item.href}>{item.label}</NavLink>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href={engineBay.phone.href} className={buttonClass("secondary", "min-h-11 px-4 max-xl:hidden")}>
              Call us
            </a>
            <Link href={quoteHref()} className={buttonClass("primary", "min-h-11 px-5 max-sm:hidden")}>
              Request a quote
            </Link>
            <EbMobileMenu
              areas={equipmentAreas.map((area) => ({ label: area.name, href: `${equipmentPath}#${area.slug}` }))}
              brands={brands.map((brand) => ({ label: brand.name, href: brandPath(brand) }))}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
