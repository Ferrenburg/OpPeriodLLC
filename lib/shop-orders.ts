import "server-only";

import { engineBay } from "./brand";
import { resolveRecipient, sendEmail } from "./contact";
import { getProducts } from "./engine-bay-catalog";
import { getShopIndex, stripeRequest } from "./shop";
import { formatMoney } from "./shop-core";

type Address = { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null };

export type CheckoutSession = {
  id: string;
  livemode: boolean;
  payment_status: string;
  amount_subtotal: number | null;
  amount_total: number | null;
  total_details?: { amount_shipping?: number | null; amount_tax?: number | null } | null;
  customer_details?: { name?: string | null; email?: string | null; phone?: string | null; address?: Address | null } | null;
  shipping_details?: { name?: string | null; address?: Address | null } | null;
  collected_information?: { shipping_details?: { name?: string | null; address?: Address | null } | null } | null;
  custom_fields?: { key: string; text?: { value?: string | null } | null }[];
  metadata?: Record<string, string>;
  payment_intent?: string | { id: string; latest_charge?: { outcome?: { risk_level?: string; risk_score?: number } | null } | string | null } | null;
};

type LineItem = {
  description: string;
  quantity: number;
  amount_total: number;
  price: { unit_amount: number | null; product: { metadata?: Record<string, string>; name: string } | string };
};

const addressLines = (address?: Address | null) =>
  address
    ? [address.line1, address.line2, [address.city, address.state, address.postal_code].filter(Boolean).join(", "), address.country]
        .filter(Boolean)
        .map((line) => `  ${line}`)
    : ["  (none given)"];

export const customField = (session: CheckoutSession, key: string) =>
  session.custom_fields?.find((field) => field.key === key)?.text?.value?.trim() || "";

export async function getCheckoutSession(id: string, expand: string[] = []): Promise<CheckoutSession> {
  const query = new URLSearchParams();
  for (const field of expand) query.append("expand[]", field);
  return stripeRequest<CheckoutSession>("GET", `/v1/checkout/sessions/${encodeURIComponent(id)}?${query}`);
}

// Emails the owner a paid order, grouped by the vendor who drop ships each
// item, so each group can go straight onto that vendor's purchase order.
// Nothing is sent to a vendor automatically.
export async function sendOrderEmail(sessionId: string): Promise<void> {
  const session = await getCheckoutSession(sessionId, ["payment_intent.latest_charge"]);
  const items = await stripeRequest<{ data: LineItem[] }>(
    "GET",
    `/v1/checkout/sessions/${encodeURIComponent(sessionId)}/line_items?limit=100&expand[]=data.price.product`,
  );

  const index = await getShopIndex();
  const products = new Map(getProducts().map((p) => [p.slug, p]));
  const groups = new Map<string, string[]>();
  for (const item of items.data) {
    const product = typeof item.price.product === "object" ? item.price.product : undefined;
    const sku = product?.metadata?.sku ?? "";
    const vendor = product?.metadata?.vendor || "Unknown vendor";
    const offer = index.bySku.get(sku);
    const site = offer && products.get(offer.productSlug);
    const name = site ? `${site.brand.name} ${site.name}${offer.option ? ` (${offer.option})` : ""}` : item.description;
    const unit = item.price.unit_amount ?? 0;
    const line = `  ${item.quantity} x ${sku || "(no part number)"}  ${name}  ${formatMoney(unit)} each, ${formatMoney(item.amount_total)}`;
    groups.set(vendor, [...(groups.get(vendor) ?? []), line]);
  }

  const shipTo = session.collected_information?.shipping_details ?? session.shipping_details;
  const customer = session.customer_details;
  const department = customField(session, "department");
  const po = customField(session, "po_number");
  const intent = typeof session.payment_intent === "object" ? session.payment_intent : undefined;
  const charge = intent && typeof intent.latest_charge === "object" ? intent.latest_charge : undefined;
  const risk = charge?.outcome?.risk_level
    ? `${charge.outcome.risk_level}${charge.outcome.risk_score != null ? ` (score ${charge.outcome.risk_score})` : ""}`
    : "not available";
  const intentId = typeof session.payment_intent === "string" ? session.payment_intent : intent?.id;
  const dashboard = intentId ? `https://dashboard.stripe.com/${session.livemode ? "" : "test/"}payments/${intentId}` : "";

  const text = [
    `New paid order from the ${engineBay.domain} shop.${session.livemode ? "" : " (TEST MODE, not a real order.)"}`,
    "",
    "Check the risk level before you place any vendor order.",
    `Stripe risk level: ${risk}`,
    ...(dashboard ? [`Payment in Stripe: ${dashboard}`] : []),
    "",
    ...[...groups.entries()].flatMap(([vendor, lines]) => [`Place with ${vendor}:`, ...lines, ""]),
    `Shipping charged by vendor: ${session.metadata?.shipping_by_vendor || "(not recorded)"}`,
    "",
    `Subtotal: ${formatMoney(session.amount_subtotal ?? 0)}`,
    `Shipping: ${formatMoney(session.total_details?.amount_shipping ?? 0)}`,
    `Tax: ${formatMoney(session.total_details?.amount_tax ?? 0)}`,
    `Total paid: ${formatMoney(session.amount_total ?? 0)}`,
    "",
    "Ship to (drop ship address for the vendor):",
    `  ${shipTo?.name ?? customer?.name ?? "(no name)"}`,
    ...addressLines(shipTo?.address),
    "",
    "Customer:",
    `  ${customer?.name ?? "(no name)"}`,
    `  ${customer?.email ?? "(no email)"}`,
    `  ${customer?.phone ?? "(no phone)"}`,
    ...(department ? [`  Department or agency: ${department}`] : []),
    ...(po ? [`  PO number: ${po}`] : []),
    "",
    `Stripe checkout session: ${session.id}`,
    "Hit reply to write to the customer.",
  ].join("\n");

  const to = process.env.SHOP_ORDER_EMAIL || resolveRecipient("engine-bay").to;
  if (!to) throw new Error("No inbox for shop orders: set SHOP_ORDER_EMAIL or CONTACT_EMAIL_DEFAULT");
  await sendEmail({
    to,
    subject: `${session.livemode ? "" : "[TEST] "}[${engineBay.shortName}] Order from ${department || customer?.name || "a customer"}, ${formatMoney(session.amount_total ?? 0)}`,
    text,
    replyTo: customer?.email ?? undefined,
    idempotencyKey: `engine-bay-order-${session.id}`,
  });
}
