import { getShopIndex, loadStripePrices, priceLoadError, shopEnabled } from "@/lib/shop";

// A quick health check for the owner: is the shop on, did prices load from
// Stripe, and if not, Stripe's error code. Never shows the key or any price.
export const dynamic = "force-dynamic";

export async function GET() {
  const enabled = shopEnabled();
  // Only the prefix (rk_live, sk_live, rk_test, pk_live, mk...), never the key.
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  const keyKind = key ? (/^(rk|sk|pk)_(live|test)_/.exec(key)?.[0].slice(0, -1) ?? `${key.split("_")[0]} (not a secret key)`) : "none";
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
