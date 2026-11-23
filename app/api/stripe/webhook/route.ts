import { revalidateTag } from "next/cache";
import { SHOP_PRICES_TAG, verifyStripeSignature } from "@/lib/shop";
import { sendOrderEmail } from "@/lib/shop-orders";

// Stripe calls this. In the Stripe dashboard (Developers, Webhooks) point an
// endpoint at https://enginebaysupply.com/api/stripe/webhook with these
// events: checkout.session.completed, checkout.session.async_payment_succeeded,
// price.created, price.updated, price.deleted, product.updated, product.deleted.
// Its signing secret goes in STRIPE_WEBHOOK_SECRET.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook secret not set", { status: 503 });

  const payload = await request.text();
  if (!verifyStripeSignature(payload, request.headers.get("stripe-signature"), secret)) {
    return new Response("Bad signature", { status: 400 });
  }

  const event = JSON.parse(payload) as { type: string; data: { object: { id: string; payment_status?: string } } };
  try {
    if (event.type.startsWith("price.") || event.type.startsWith("product.")) {
      revalidateTag(SHOP_PRICES_TAG, "max");
    } else if (
      (event.type === "checkout.session.completed" && event.data.object.payment_status === "paid") ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await sendOrderEmail(event.data.object.id);
    }
  } catch (error) {
    // A non-2xx makes Stripe retry later; the email's idempotency key keeps a
    // retry from sending a second copy.
    console.error(`[shop] Webhook ${event.type} failed`, error);
    return new Response("Handler failed", { status: 500 });
  }
  return Response.json({ received: true });
}
