import "server-only";

import crypto from "node:crypto";
import { cache } from "react";
import { z } from "zod";
import { categoryShipping, shopExcludedBrands, shopShippingRates, shopVendors } from "./engine-bay";
import { getProducts, type Product } from "./engine-bay-catalog";
import {
  hoseOptionLabel,
  hoseSiteNames,
  parseHoseName,
  parseShippingRates,
  shipClassFor,
  shippingFor,
  type HoseBuild,
  type ShipClass,
  type ShippingRates,
  type StripePriceRow,
  type VendorShipping,
} from "./shop-core";

// The Engine Bay online shop. Stripe holds every price: a site product is for
// sale when a Stripe product's metadata "sku" matches its part number (or, for
// Snap-tite hose, when the Stripe product's name parses into a build of one of
// the site's hose lines). Nothing here stores a price.

export const SHOP_PRICES_TAG = "stripe-prices";
const SNAP_TITE_VENDOR = "Snap-tite Hose";
export const MAX_QUANTITY = 50;
export const MAX_LINES = 40;

// On when SHOP_ENABLED=true and a Stripe key is set. Off, every page is
// exactly the quote-only site.
export function shopEnabled(): boolean {
  return process.env.SHOP_ENABLED === "true" && Boolean(process.env.STRIPE_SECRET_KEY);
}

export function shippingRates(): ShippingRates | null {
  return parseShippingRates(process.env.SHOP_SHIPPING_RATES || shopShippingRates);
}

// The owner's lead time line, like "Ships direct from the manufacturer in 5 to
// 10 business days." Shown on product pages and the cart when set.
export function shopLeadTime(): string | undefined {
  return process.env.SHOP_LEAD_TIME?.trim() || undefined;
}

const apiBase = () => process.env.STRIPE_API_BASE || "https://api.stripe.com";
const authHeader = () => ({ Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` });

type RawProduct = { id: string; name: string; active: boolean; default_price: string | null; metadata?: Record<string, string> };
type RawPrice = {
  id: string;
  unit_amount: number | null;
  tax_behavior?: string | null;
  product: RawProduct | string;
};

// Every active one-time USD price, flattened with its product. Cached for an
// hour and tagged, so the Stripe webhook can refresh it the moment a price
// changes. A Stripe outage leaves the site quote only instead of breaking it.
export const loadStripePrices = cache(async (): Promise<StripePriceRow[]> => {
  const rows: StripePriceRow[] = [];
  let after: string | undefined;
  try {
    for (let page = 0; page < 200; page++) {
      const query = new URLSearchParams({ active: "true", type: "one_time", currency: "usd", limit: "100" });
      query.append("expand[]", "data.product");
      if (after) query.set("starting_after", after);
      const response = await fetch(`${apiBase()}/v1/prices?${query}`, {
        headers: authHeader(),
        next: { revalidate: 3600, tags: [SHOP_PRICES_TAG] },
      });
      if (!response.ok) throw new Error(`Stripe prices request failed: ${response.status}`);
      const list = (await response.json()) as { data: RawPrice[]; has_more: boolean };
      for (const price of list.data) {
        const product = price.product;
        if (typeof product !== "object" || !product.active || price.unit_amount == null) continue;
        if (product.default_price && product.default_price !== price.id) continue;
        const sku = product.metadata?.sku?.trim();
        if (!sku) continue;
        rows.push({
          priceId: price.id,
          unitAmount: price.unit_amount,
          productId: product.id,
          productName: product.name,
          sku,
          vendor: product.metadata?.vendor?.trim() ?? "",
          taxBehavior: price.tax_behavior ?? "unspecified",
        });
      }
      if (!list.has_more || list.data.length === 0) break;
      after = list.data[list.data.length - 1].id;
    }
  } catch (error) {
    console.error("Shop: couldn't load prices from Stripe, so every product stays quote only.", error);
    return [];
  }
  return rows;
});

export type ShopOffer = {
  sku: string; // the Stripe and site part number
  priceId: string;
  unitAmount: number;
  vendor: string; // who drop ships it
  productSlug: string;
  option?: string; // size, or the hose build
  shipClass: ShipClass;
  hose?: HoseBuild;
};

type ShopIndex = { bySku: Map<string, ShopOffer>; byProduct: Map<string, ShopOffer[]> };

export const getShopIndex = cache(async (): Promise<ShopIndex> => {
  const bySku = new Map<string, ShopOffer>();
  const byProduct = new Map<string, ShopOffer[]>();
  if (!shopEnabled()) return { bySku, byProduct };

  const rows = (await loadStripePrices()).filter((row) => shopVendors.includes(row.vendor));
  const rowBySku = new Map<string, StripePriceRow>();
  for (const row of rows) if (!rowBySku.has(row.sku)) rowBySku.set(row.sku, row);

  const products = getProducts().filter((product) => !shopExcludedBrands.includes(product.brand.slug));
  const add = (product: Product, row: StripePriceRow, offer: Omit<ShopOffer, "sku" | "priceId" | "unitAmount" | "vendor" | "productSlug">) => {
    if (bySku.has(row.sku)) return;
    const full: ShopOffer = { sku: row.sku, priceId: row.priceId, unitAmount: row.unitAmount, vendor: row.vendor, productSlug: product.slug, ...offer };
    bySku.set(full.sku, full);
    byProduct.set(product.slug, [...(byProduct.get(product.slug) ?? []), full]);
  };

  for (const product of products) {
    const shipping = categoryShipping[product.category] ?? "measure";
    if (product.sku) {
      const row = rowBySku.get(product.sku);
      if (row) add(product, row, { shipClass: shipClassFor(shipping, product.shipClass, [product.name]) });
    }
    for (const variant of product.variants) {
      const row = rowBySku.get(variant.sku);
      if (row) add(product, row, { option: variant.option, shipClass: shipClassFor(shipping, product.shipClass, [product.name, variant.option]) });
    }
  }

  // Snap-tite hose: one Stripe product per build, matched to the site's line.
  const hoseLines = new Map(
    products.filter((p) => p.category === "hose" && p.brand.slug === "snap-tite-hose").map((p) => [p.name.toLowerCase(), p]),
  );
  for (const row of rows.filter((r) => r.vendor === SNAP_TITE_VENDOR)) {
    const build = parseHoseName(row.productName);
    if (!build) continue;
    const product = hoseSiteNames(build)
      .map((name) => hoseLines.get(name.toLowerCase()))
      .find(Boolean);
    if (product) add(product, row, { option: hoseOptionLabel(build), shipClass: product.shipClass ?? (build.diameterInches >= 4 ? "ldh" : "hose"), hose: build });
  }
  for (const offers of byProduct.values()) {
    if (offers[0]?.hose) {
      offers.sort(
        (a, b) =>
          a.hose!.diameterInches - b.hose!.diameterInches ||
          a.hose!.lengthFt - b.hose!.lengthFt ||
          a.hose!.color.localeCompare(b.hose!.color) ||
          a.hose!.coupling.localeCompare(b.hose!.coupling),
      );
    }
  }
  return { bySku, byProduct };
});

export async function offersFor(product: Product): Promise<ShopOffer[]> {
  return (await getShopIndex()).byProduct.get(product.slug) ?? [];
}

// "From" price for a card: the lowest offer.
export async function lowestPrice(product: Product): Promise<number | undefined> {
  const offers = await offersFor(product);
  return offers.length ? Math.min(...offers.map((o) => o.unitAmount)) : undefined;
}

export async function getSellableProducts(): Promise<Product[]> {
  const index = await getShopIndex();
  return getProducts().filter((product) => index.byProduct.has(product.slug));
}

// A cart from the browser: part numbers and quantities only.
export const cartSchema = z
  .array(z.strictObject({ sku: z.string().trim().min(1).max(80), quantity: z.number().int().min(1).max(MAX_QUANTITY) }))
  .max(MAX_LINES);
export type CartInput = z.infer<typeof cartSchema>;

export type PricedLine = {
  sku: string;
  priceId: string;
  name: string;
  brand: string;
  option?: string;
  href: string;
  image?: string;
  vendor: string;
  shipClass: ShipClass;
  unitAmount: number;
  quantity: number;
  lineTotal: number;
};

export type PricedCart = {
  lines: PricedLine[];
  // Part numbers no longer for sale (removed from Stripe or the site).
  unavailable: string[];
  subtotal: number;
  // null when the owner hasn't set every shipping rate yet.
  shipping: { byVendor: VendorShipping[]; total: number } | null;
};

export async function priceCart(cart: CartInput): Promise<PricedCart> {
  const index = await getShopIndex();
  const products = new Map(getProducts().map((p) => [p.slug, p]));
  const quantities = new Map<string, number>();
  for (const line of cart) quantities.set(line.sku, Math.min(MAX_QUANTITY, (quantities.get(line.sku) ?? 0) + line.quantity));

  const lines: PricedLine[] = [];
  const unavailable: string[] = [];
  for (const [sku, quantity] of quantities) {
    const offer = index.bySku.get(sku);
    const product = offer && products.get(offer.productSlug);
    if (!offer || !product) {
      unavailable.push(sku);
      continue;
    }
    lines.push({
      sku,
      priceId: offer.priceId,
      name: product.name,
      brand: product.brand.name,
      option: offer.option,
      href: product.href,
      image: product.images[0],
      vendor: offer.vendor,
      shipClass: offer.shipClass,
      unitAmount: offer.unitAmount,
      quantity,
      lineTotal: offer.unitAmount * quantity,
    });
  }
  const rates = shippingRates();
  return {
    lines,
    unavailable,
    subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
    shipping: rates && lines.length ? shippingFor(lines, rates) : lines.length ? null : { byVendor: [], total: 0 },
  };
}

// Stripe takes form-encoded bodies with bracketed keys: line_items[0][price].
function formEncode(value: unknown, prefix = "", out = new URLSearchParams()): URLSearchParams {
  if (value === undefined || value === null) return out;
  if (Array.isArray(value)) value.forEach((item, i) => formEncode(item, `${prefix}[${i}]`, out));
  else if (typeof value === "object") {
    for (const [key, item] of Object.entries(value)) formEncode(item, prefix ? `${prefix}[${key}]` : key, out);
  } else out.append(prefix, String(value));
  return out;
}

export async function stripeRequest<T>(method: "GET" | "POST", path: string, body?: Record<string, unknown>): Promise<T> {
  const url = `${apiBase()}${path}`;
  const response = await fetch(url, {
    method,
    headers: { ...authHeader(), ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}) },
    body: body ? formEncode(body).toString() : undefined,
    cache: "no-store",
  });
  const data = (await response.json()) as T & { error?: { message?: string } };
  if (!response.ok) throw new Error(`Stripe ${method} ${path} failed: ${data.error?.message ?? response.status}`);
  return data;
}

// Checks a webhook really came from Stripe: the Stripe-Signature header holds
// a timestamp and an HMAC of "timestamp.body" made with the endpoint secret.
export function verifyStripeSignature(payload: string, header: string | null, secret: string, toleranceSeconds = 300, now = Date.now()): boolean {
  if (!header || !secret) return false;
  const parts = header.split(",").map((part) => part.split("=") as [string, string]);
  const timestamp = Number(parts.find(([key]) => key === "t")?.[1]);
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!Number.isFinite(timestamp) || signatures.length === 0) return false;
  if (Math.abs(now / 1000 - timestamp) > toleranceSeconds) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return signatures.some((signature) => {
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}
