import { getShopIndex, loadStripePrices, priceLoadError, shopEnabled } from "@/lib/shop";

// A quick health check for the owner: is the shop on, did prices load from
// Stripe, and if not, Stripe's error code. Never shows the key or any price.
export const dynamic = "force-dynamic";

export async function GET() {
  const enabled = shopEnabled();
  const keyKind = (process.env.STRIPE_SECRET_KEY?.trim() ?? "").split("_").slice(0, 2).join("_") || "none";
  if (!enabled) return Response.json({ enabled, keyKind, shopFlag: process.env.SHOP_ENABLED ?? null });
  const prices = await loadStripePrices();
  const index = await getShopIndex();
  return Response.json({
    enabled,
    keyKind,
    stripePrices: prices.length,
    sellableItems: index.bySku.size,
    error: priceLoadError(),
  });
}
