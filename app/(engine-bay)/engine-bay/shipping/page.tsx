import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { ShippingTable } from "@/components/engine-bay/shipping-table";
import { Todo } from "@/components/todo";
import { engineBay } from "@/lib/brand";
import { shopEnabled } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Shipping",
  description: `Shipping rates and times for online orders from ${engineBay.name}.`,
  alternates: { canonical: `${engineBay.path}/shipping` },
};

export default function Page() {
  if (!shopEnabled()) notFound();
  return (
    <>
      <EbPageHero title="Shipping" />
      <div className="container-site max-w-3xl space-y-6 pb-16 text-lg">
        <p>Online orders ship direct from the manufacturer to the address you give at checkout. Each brand ships from its own warehouse, so an order with more than one brand arrives in more than one box, and each brand&apos;s items are charged shipping on their own.</p>
        <ShippingTable />
        <Todo>Ship times, where we ship (US only now), and what happens with damaged or lost shipments.</Todo>
      </div>
    </>
  );
}
