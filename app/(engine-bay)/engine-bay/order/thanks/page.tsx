import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/button";
import { ClearCart } from "@/components/engine-bay/clear-cart";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { engineBay } from "@/lib/brand";
import { shopPath } from "@/lib/engine-bay";
import { shopEnabled, shopLeadTime } from "@/lib/shop";
import { formatMoney } from "@/lib/shop-core";
import { getCheckoutSession, type CheckoutSession } from "@/lib/shop-orders";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false },
};

// Stripe sends buyers here after paying, with the checkout session id.
export default async function ThanksPage({ searchParams }: PageProps<"/engine-bay/order/thanks">) {
  if (!shopEnabled()) notFound();
  const id = (await searchParams).session_id;
  let session: CheckoutSession | undefined;
  if (typeof id === "string" && /^cs_[A-Za-z0-9_]+$/.test(id)) {
    try {
      session = await getCheckoutSession(id);
    } catch {
      session = undefined;
    }
  }
  const paid = session?.payment_status === "paid";
  const first = session?.customer_details?.name?.split(" ")[0];

  return (
    <>
      {paid && <ClearCart />}
      <EbPageHero title={paid ? `Thanks${first ? `, ${first}` : ""}.` : "Order received"}>
        {paid ? (
          <p>
            Your order for {formatMoney(session!.amount_total ?? 0)} went through. A receipt is on its way to{" "}
            {session!.customer_details?.email ?? "your email"}. We place it with the manufacturer, and it ships direct to
            the address you gave. {shopLeadTime() ?? ""}
          </p>
        ) : (
          <p>
            If you just checked out, your receipt is on its way by email. If something looks wrong, call{" "}
            <a href={engineBay.phone.href} className="font-semibold text-accent underline underline-offset-4">
              {engineBay.phone.display}
            </a>
            .
          </p>
        )}
      </EbPageHero>
      <div className="container-site pb-16">
        <p className="text-lg">
          Questions about your order? Call{" "}
          <a href={engineBay.phone.href} className="font-semibold text-accent underline underline-offset-4">
            {engineBay.phone.display}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${engineBay.email}`} className="font-semibold text-accent underline underline-offset-4">
            {engineBay.email}
          </a>
          .
        </p>
        <Link href={shopPath} className={buttonClass("secondary", "mt-6")}>
          Keep shopping
        </Link>
      </div>
    </>
  );
}
