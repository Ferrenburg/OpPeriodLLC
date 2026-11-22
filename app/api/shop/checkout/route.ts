import { engineBay } from "@/lib/brand";
import { rateLimited } from "@/lib/contact";
import { cartPath } from "@/lib/engine-bay";
import { cartSchema, priceCart, shopEnabled, stripeRequest } from "@/lib/shop";
import { formatMoney } from "@/lib/shop-core";

// Only our own addresses, so a forged Host header can't send buyers elsewhere
// after they pay.
const allowedHost = /^(?:(?:www\.)?enginebaysupply\.com|(?:www\.)?opperiod\.com|[a-z0-9-]+\.vercel\.app|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)$/;

function returnOrigin(request: Request): string | null {
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").split(",")[0].trim().toLowerCase();
  if (!allowedHost.test(host)) return null;
  const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() || (local ? "http" : "https");
  return `${proto === "http" && !local ? "https" : proto}://${host}`;
}

function clientIp(request: Request): string {
  return request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

// Turns a cart into a Stripe Checkout page. The cart is priced again here from
// Stripe, so nothing the browser sends can change a price.
export async function POST(request: Request) {
  if (!shopEnabled()) return Response.json({ ok: false, error: "The online shop isn't open." }, { status: 404 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "That request didn't look right." }, { status: 400 });
  }
  const parsed = cartSchema.safeParse((body as { lines?: unknown })?.lines);
  if (!parsed.success || parsed.data.length === 0) {
    return Response.json({ ok: false, error: "Your cart is empty or didn't look right." }, { status: 400 });
  }
  if (rateLimited(clientIp(request))) {
    return Response.json(
      { ok: false, error: `That's a lot of checkouts in a short time. Wait a few minutes, or call ${engineBay.phone.display}.` },
      { status: 429 },
    );
  }

  const cart = await priceCart(parsed.data);
  if (cart.unavailable.length > 0) {
    return Response.json(
      { ok: false, error: "Some items in your cart aren't sold online anymore. We took them out; check the cart and try again.", cart },
      { status: 409 },
    );
  }
  if (!cart.shipping) {
    return Response.json(
      { ok: false, error: `Online checkout isn't open yet. Request a quote, or call ${engineBay.phone.display}.` },
      { status: 503 },
    );
  }

  // Back to the address the buyer is on: enginebaysupply.com (www or not) in
  // production, the preview's own address on previews.
  const origin = returnOrigin(request);
  if (!origin) return Response.json({ ok: false, error: "That request didn't look right." }, { status: 400 });
  const back = (path: string) => `${origin}${path}`;

  try {
    const session = await stripeRequest<{ url: string }>("POST", "/v1/checkout/sessions", {
      mode: "payment",
      line_items: cart.lines.map((line) => ({ price: line.priceId, quantity: line.quantity })),
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: "Ground, ships direct from the manufacturer",
            fixed_amount: { amount: cart.shipping.total, currency: "usd" },
            tax_behavior: "exclusive",
            tax_code: "txcd_92010001",
          },
        },
      ],
      automatic_tax: { enabled: process.env.SHOP_AUTOMATIC_TAX !== "false" },
      invoice_creation: { enabled: true },
      custom_fields: [
        { key: "department", label: { type: "custom", custom: "Department or agency (optional)" }, type: "text", optional: true },
        { key: "po_number", label: { type: "custom", custom: "PO number (optional)" }, type: "text", optional: true },
      ],
      metadata: {
        source: "engine-bay-shop",
        shipping_by_vendor: cart.shipping.byVendor.map((v) => `${v.vendor} ${formatMoney(v.amount)}`).join("; ").slice(0, 490),
      },
      success_url: back(`${engineBay.path}/order/thanks?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: back(cartPath),
    });
    return Response.json({ ok: true, url: session.url });
  } catch (error) {
    console.error("[shop] Couldn't start checkout", error);
    return Response.json(
      { ok: false, error: `Checkout didn't start. Try again in a minute, or call ${engineBay.phone.display}.` },
      { status: 502 },
    );
  }
}
