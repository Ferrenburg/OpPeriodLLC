import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PolicyPage } from "@/components/engine-bay/policy-page";
import { company, engineBay, formatAddress } from "@/lib/brand";
import { quoteHref } from "@/lib/engine-bay";
import { shopEnabled } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Terms of sale",
  description: `Terms of sale for online orders from ${engineBay.name}.`,
  alternates: { canonical: `${engineBay.path}/terms` },
};

export default function TermsPage() {
  if (!shopEnabled()) notFound();
  const shipping = `${engineBay.path}/shipping`;
  return (
    <PolicyPage title="Terms of sale" updated="[date]">
      <h2>1. Who you&apos;re buying from</h2>
      <p>
        These terms cover purchases made online at {engineBay.domain} from {company.legalName}, a {company.formedIn} limited
        liability company doing business as {engineBay.name} (&quot;Engine Bay,&quot; &quot;we,&quot; &quot;us&quot;). By
        placing an order you agree to these terms, the <Link href={shipping}>Shipping</Link> policy, and the{" "}
        <Link href={`${engineBay.path}/returns`}>Returns</Link> policy. Purchases made through a{" "}
        <Link href={quoteHref()}>quote</Link> or purchase order follow the terms on that quote.
      </p>

      <h2>2. Orders and acceptance</h2>
      <p>
        Your order is an offer to buy. We accept it when we place it with the manufacturer, not when you check out. We may refuse
        or cancel any order, including for suspected fraud, a pricing or listing error, or an item the manufacturer can&apos;t
        supply. If we cancel, we refund what you paid in full.
      </p>

      <h2>3. Prices and errors</h2>
      <p>
        Prices are in US dollars and can change without notice. Sales tax, where it applies, and shipping are added at checkout.
        If an item was listed at the wrong price, we&apos;ll contact you to confirm the correct price or cancel the order.
      </p>

      <h2>4. Payment</h2>
      <p>Payment is taken by card at checkout through Stripe, our payment processor. We don&apos;t see or store your full card number.</p>

      <h2>5. Sales tax and exemptions</h2>
      <p>
        We collect sales tax where we&apos;re required to. Online orders can&apos;t apply a tax exemption at checkout.
        Tax-exempt departments should <Link href={quoteHref()}>request a quote</Link> and send their exemption certificate.
        [Attorney: confirm wording.]
      </p>

      <h2>6. Shipping, title, and risk of loss</h2>
      <p>
        Orders ship as described in the <Link href={shipping}>Shipping</Link> policy. [Attorney: confirm.] Title and risk of loss
        pass to you when the manufacturer delivers your order to the carrier.
      </p>

      <h2>7. Warranty</h2>
      <p>
        Engine Bay resells products made by other companies. Each product carries only its manufacturer&apos;s warranty, if
        any, and we&apos;ll help you file a claim.{" "}
        <strong className="uppercase">
          To the extent the law allows, Engine Bay makes no warranty of its own and disclaims all implied warranties, including
          merchantability and fitness for a particular purpose.
        </strong>{" "}
        [Attorney: confirm conspicuousness and state limits.]
      </p>

      <h2>8. Use, training, and inspection</h2>
      <p>
        These products are tools for dangerous work. They must be used only by trained personnel, following the
        manufacturer&apos;s instructions, your department&apos;s procedures, and applicable standards (for example, NFPA 1962 for
        the care, use, inspection, and service testing of fire hose). You are responsible for choosing the right product for
        your use, and for inspecting and testing it before it goes into service and on schedule after that.
      </p>

      <h2>9. Limit of liability</h2>
      <p>
        <strong className="uppercase">
          To the extent the law allows, Engine Bay is not liable for indirect, incidental, special, consequential, or punitive
          damages, and our total liability for any claim about an order is limited to the amount you paid for that order.
        </strong>{" "}
        Nothing here limits liability that can&apos;t be limited by law. [Attorney: review for agency buyers and personal injury
        carve-outs.]
      </p>

      <h2>10. Product information</h2>
      <p>
        Descriptions, specs, and photos come from the manufacturers. We work to keep them accurate, but manufacturers change
        products. The manufacturer&apos;s current specifications control.
      </p>

      <h2>11. California Proposition 65</h2>
      <p>Some products carry the manufacturer&apos;s Proposition 65 warning, shown on the product page.</p>

      <h2>12. Governing law and disputes</h2>
      <p>
        [Attorney: choose.] These terms are governed by the laws of [Wyoming / Louisiana]. Any dispute will be resolved in the
        state or federal courts in [county, state] [or by binding individual arbitration under (rules), with a class action
        waiver].
      </p>

      <h2>13. Changes</h2>
      <p>We may update these terms. The version posted when you place your order applies to that order.</p>

      <h2>14. Contact</h2>
      <p>
        {engineBay.name}, a division of {company.legalName}. {formatAddress()}.{" "}
        <a href={engineBay.phone.href}>{engineBay.phone.display}</a>. <a href={`mailto:${engineBay.email}`}>{engineBay.email}</a>.
      </p>
    </PolicyPage>
  );
}
