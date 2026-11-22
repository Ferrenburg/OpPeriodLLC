import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartView } from "@/components/engine-bay/cart-view";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { engineBay } from "@/lib/brand";
import { quoteHref, shopPath } from "@/lib/engine-bay";
import { shopEnabled } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false },
};

export default function CartPage() {
  if (!shopEnabled()) notFound();
  return (
    <>
      <EbPageHero title="Your cart" />
      <div className="container-site pb-16">
        <CartView shopHref={shopPath} quoteHref={quoteHref()} phone={engineBay.phone.display} />
      </div>
    </>
  );
}
