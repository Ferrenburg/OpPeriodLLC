import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PolicyPage } from "@/components/engine-bay/policy-page";
import { engineBay } from "@/lib/brand";
import { shopEnabled } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Returns",
  description: `Returns and exchanges for online orders from ${engineBay.name}.`,
  alternates: { canonical: `${engineBay.path}/returns` },
};

export default function ReturnsPage() {
  if (!shopEnabled()) notFound();
  return (
    <PolicyPage title="Returns" updated="[date]">
      <h2>Ask us first</h2>
      <p>
        Every return needs a return authorization from us before anything ships back. Call{" "}
        <a href={engineBay.phone.href}>{engineBay.phone.display}</a> or email{" "}
        <a href={`mailto:${engineBay.email}`}>{engineBay.email}</a> within [30] days of delivery with your order number, the
        items, and the reason. Returns sent without one may be refused.
      </p>

      <h2>What can come back</h2>
      <p>Unused items in the original packaging, with all parts and paperwork, within [30] days of delivery.</p>

      <h2>What can&apos;t come back</h2>
      <ul>
        <li>Hose cut, built, or coupled to your order (any length, color, or coupling choice), and anything else made or marked to order</li>
        <li>Items that have been used, mounted, painted, engraved, or altered</li>
        <li>Saws, batteries, and chargers once the packaging is opened, unless they arrive defective</li>
        <li>Special order items marked as special order on the product page</li>
      </ul>

      <h2>Return shipping</h2>
      <p>
        If we or the manufacturer made a mistake (wrong item, damaged, or defective on arrival), we cover return shipping.
        Otherwise you pay to ship it back, and the original shipping charge isn&apos;t refunded.
      </p>

      <h2>Restocking fee</h2>
      <p>
        Returns for reasons other than our mistake may carry a restocking fee of up to [15]%, to cover what the manufacturer
        charges us. [Owner: confirm each manufacturer&apos;s restocking fee.]
      </p>

      <h2>Where it goes</h2>
      <p>Items go back to the manufacturer that shipped them, not to us. We&apos;ll send the return address with your authorization.</p>

      <h2>Refunds</h2>
      <p>
        Once the manufacturer receives and checks the item, we refund the item price, less any restocking fee, to the card you
        paid with. Allow [5 to 10] business days for it to post.
      </p>

      <h2>Exchanges</h2>
      <p>
        Need a different size, length, or coupling? Return the original under these terms and place a new order, or call us and
        we&apos;ll set it up.
      </p>

      <h2>Defects after the return window</h2>
      <p>
        Problems that show up later are covered by the manufacturer&apos;s warranty, not by this return policy. We&apos;ll help
        you file the claim; see the <Link href={`${engineBay.path}/terms`}>Terms of Sale</Link>.
      </p>

      <h2>Department purchases</h2>
      <p>Orders placed through a quote or purchase order follow the terms on that quote.</p>
    </PolicyPage>
  );
}
