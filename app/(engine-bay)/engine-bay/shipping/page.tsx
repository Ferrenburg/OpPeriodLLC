import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PolicyPage } from "@/components/engine-bay/policy-page";
import { ShippingTable } from "@/components/engine-bay/shipping-table";
import { engineBay } from "@/lib/brand";
import { shopEnabled } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Shipping",
  description: `Shipping rates and times for online orders from ${engineBay.name}.`,
  alternates: { canonical: `${engineBay.path}/shipping` },
};

export default function ShippingPage() {
  if (!shopEnabled()) notFound();
  return (
    <PolicyPage title="Shipping" updated="[date]">
      <h2>Where we ship</h2>
      <p>
        We ship online orders to addresses in the United States only. We can&apos;t ship online orders to PO boxes, APO/FPO
        addresses, or outside the US. For anything else, request a quote.
      </p>

      <h2>Who ships your order</h2>
      <p>
        Online orders ship direct from the manufacturer: Council Tool, Snap-tite Hose, or Fire Hooks Unlimited. An order with
        more than one brand ships in more than one box, from more than one place, and may arrive on different days.
      </p>

      <h2>Shipping charges</h2>
      <p>
        We charge a flat rate for each manufacturer&apos;s box, based on what&apos;s in it: the first item at the full rate,
        and each additional item at the lower rate. Your cart shows the total before you check out.
      </p>
      <div className="not-prose my-6">
        <ShippingTable />
      </div>

      <h2>When it ships</h2>
      <p>
        Most orders leave the manufacturer within [X] business days after we place them, and arrive [X to X] business days after
        that. Some items are made or cut to order and take longer; we&apos;ll tell you if yours will. These are estimates, not
        guarantees.
      </p>

      <h2>Tracking</h2>
      <p>We&apos;ll email tracking for each box once the manufacturer ships it.</p>

      <h2>Large and heavy items</h2>
      <p>
        Supply hose and some saws ship by freight. Someone may need to be there to sign, and a liftgate or delivery appointment
        may be required. [Attorney: decide whether extra freight charges can be billed after the order, or must be absorbed.]
      </p>

      <h2>Damaged or missing items</h2>
      <p>
        Check every box when it arrives. Note any visible damage with the driver if you can, and tell us within [5] days of
        delivery at <a href={engineBay.phone.href}>{engineBay.phone.display}</a> or{" "}
        <a href={`mailto:${engineBay.email}`}>{engineBay.email}</a>, with photos. We&apos;ll work with the manufacturer and
        carrier to repair, replace, or refund the item. Claims reported later may not be covered.
      </p>

      <h2>Wrong address</h2>
      <p>
        We ship to the address you enter at checkout. If a box comes back because the address was wrong or no one accepted it,
        we may charge for reshipping.
      </p>

      <h2>Title and risk of loss</h2>
      <p>
        [Attorney: confirm.] Title and risk of loss pass to you when the manufacturer hands your order to the carrier. We still
        help with damage claims as described above.
      </p>
    </PolicyPage>
  );
}
