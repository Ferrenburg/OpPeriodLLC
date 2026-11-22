// Read-only report on how the Stripe catalog lines up with the Engine Bay
// site. It never writes to Stripe.
//
//   STRIPE_SECRET_KEY=rk_... node scripts/shop-report.ts
//
// It lists what will be sold online, site part numbers Stripe has no price
// for, Stripe products the site has no page for, near misses ("RT38" vs
// "RT-38"), duplicate SKUs, hose names it can't read, and prices without a
// tax behavior (Stripe Tax needs one).
import fs from "node:fs";
import path from "node:path";
import { categoryShipping, shopExcludedBrands, shopVendors } from "../lib/engine-bay.ts";
import { formatMoney, hoseSiteNames, normalizeSku, parseHoseName, shipClassFor, type StripePriceRow } from "../lib/shop-core.ts";

type SiteProduct = { slug: string; sku?: string; name: string; category: string; shipClass?: "standard" | "long" | "hose" | "saw"; variants?: { sku: string; option: string }[] };
type BrandFile = { brand: { slug: string; name: string }; products: SiteProduct[] };

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Set STRIPE_SECRET_KEY first.");
  process.exit(1);
}

async function stripePrices(): Promise<StripePriceRow[]> {
  const rows: StripePriceRow[] = [];
  let after = "";
  for (;;) {
    const q = new URLSearchParams({ active: "true", type: "one_time", currency: "usd", limit: "100" });
    q.append("expand[]", "data.product");
    if (after) q.set("starting_after", after);
    const res = await fetch(`https://api.stripe.com/v1/prices?${q}`, { headers: { Authorization: `Bearer ${key}` } });
    if (!res.ok) throw new Error(`Stripe: ${res.status} ${await res.text()}`);
    type Price = { id: string; unit_amount: number | null; tax_behavior?: string; product: string | { id: string; name: string; active: boolean; default_price: string | null; metadata?: Record<string, string> } };
    const list = (await res.json()) as { data: Price[]; has_more: boolean };
    for (const price of list.data) {
      const p = price.product;
      if (typeof p !== "object" || !p.active || price.unit_amount == null) continue;
      if (p.default_price && p.default_price !== price.id) continue;
      rows.push({
        priceId: price.id,
        unitAmount: price.unit_amount,
        productId: p.id,
        productName: p.name,
        sku: (p.metadata?.sku ?? "").trim(),
        vendor: (p.metadata?.vendor ?? "").trim(),
        taxBehavior: price.tax_behavior ?? "unspecified",
      });
    }
    if (!list.has_more || list.data.length === 0) break;
    after = list.data[list.data.length - 1].id;
  }
  return rows;
}

const dir = path.join(process.cwd(), "content", "engine-bay", "products");
const files: BrandFile[] = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));

const rows = await stripePrices();
const counts = new Map<string, number>();
for (const row of rows) counts.set(row.vendor || "(no vendor)", (counts.get(row.vendor || "(no vendor)") ?? 0) + 1);
console.log(`Stripe: ${rows.length} active default prices`);
for (const [vendor, n] of counts) console.log(`  ${vendor}: ${n}${shopVendors.includes(vendor) ? "" : " (not a shop vendor, ignored)"}`);

const sellable = rows.filter((r) => shopVendors.includes(r.vendor));
const bySku = new Map<string, StripePriceRow[]>();
for (const row of sellable) if (row.sku) bySku.set(row.sku, [...(bySku.get(row.sku) ?? []), row]);
const byNorm = new Map<string, string>();
for (const sku of bySku.keys()) byNorm.set(normalizeSku(sku), sku);

const used = new Set<string>();
const missing: string[] = [];
const nearMisses: string[] = [];
const longItems: string[] = [];
let matched = 0;
for (const file of files) {
  if (shopExcludedBrands.includes(file.brand.slug)) continue;
  for (const product of file.products) {
    const shipping = categoryShipping[product.category] ?? "measure";
    const parts = [
      ...(product.sku ? [{ sku: product.sku, texts: [product.name] }] : []),
      ...(product.variants ?? []).map((v) => ({ sku: v.sku, texts: [product.name, v.option] })),
    ];
    for (const part of parts) {
      if (bySku.has(part.sku)) {
        matched++;
        used.add(part.sku);
        const shipClass = shipClassFor(shipping, product.shipClass, part.texts);
        if (shipClass === "long") longItems.push(`${part.sku}  ${product.name}`);
      } else {
        const near = byNorm.get(normalizeSku(part.sku));
        if (near) nearMisses.push(`site ${part.sku}  vs  Stripe ${near}  (${file.brand.name} ${product.name})`);
        else missing.push(`${file.brand.name}  ${part.sku}  ${product.name}`);
      }
    }
  }
}

// Snap-tite hose builds
const hoseLines = new Map(
  files
    .filter((f) => f.brand.slug === "snap-tite-hose")
    .flatMap((f) => f.products.filter((p) => p.category === "hose").map((p) => [p.name.toLowerCase(), p.name] as const)),
);
const hoseByLine = new Map<string, number>();
const unparsed: string[] = [];
let firequip = 0;
const noLine = new Map<string, number>();
for (const row of sellable.filter((r) => r.vendor === "Snap-tite Hose")) {
  const build = parseHoseName(row.productName);
  if (!build && row.productName.startsWith("FireQuip")) {
    firequip++;
    continue;
  }
  if (!build) {
    unparsed.push(`${row.sku}  ${row.productName}`);
    continue;
  }
  const line = hoseSiteNames(build).find((n) => hoseLines.has(n.toLowerCase()));
  if (line) {
    hoseByLine.set(line, (hoseByLine.get(line) ?? 0) + 1);
    used.add(row.sku);
  } else noLine.set(build.line, (noLine.get(build.line) ?? 0) + 1);
}

const extra = sellable.filter((r) => r.sku && !used.has(r.sku));
const dupes = [...bySku.entries()].filter(([, list]) => list.length > 1);
const noSku = sellable.filter((r) => !r.sku);
const untaxed = sellable.filter((r) => r.taxBehavior === "unspecified");
const section = (title: string, lines: string[], limit = 400) => {
  console.log(`\n${title} (${lines.length})`);
  for (const line of lines.slice(0, limit)) console.log(`  ${line}`);
  if (lines.length > limit) console.log(`  ...and ${lines.length - limit} more`);
};

console.log(`\nSold online: ${matched} site part numbers, plus ${[...hoseByLine.values()].reduce((a, b) => a + b, 0)} hose builds`);
for (const [line, n] of hoseByLine) console.log(`  Snap-tite ${line}: ${n} builds`);
section("Near misses: same part number written differently, fix one side", nearMisses);
section("Site part numbers with no Stripe price (stay quote only)", missing, 60);
section("Stripe products with no site page (not sold until they get one)", extra.map((r) => `${r.vendor}  ${r.sku}  ${r.productName}  ${formatMoney(r.unitAmount)}`), 60);
section("Snap-tite hose lines in Stripe with no site product", [...noLine].map(([line, n]) => `${line}: ${n} builds`));
console.log(`\nFireQuip hose under the Snap-tite vendor (not on the site, so not sold): ${firequip}`);
section("Snap-tite products that aren't hose builds (add-ons and anything the hose reader couldn't read)", unparsed);
section("Duplicate SKUs in Stripe (the first one wins)", dupes.map(([sku, list]) => `${sku}: ${list.map((r) => r.productName).join(" | ")}`));
section("Stripe products with no sku metadata", noSku.map((r) => `${r.vendor}  ${r.productName}`), 30);
section("Long items (ship as 'long', over 48 in.)", longItems, 30);
const tax = (await (await fetch("https://api.stripe.com/v1/tax/settings", { headers: { Authorization: `Bearer ${key}` } })).json()) as {
  status?: string;
  defaults?: { tax_behavior?: string | null };
};
const registrations = (await (await fetch("https://api.stripe.com/v1/tax/registrations?limit=100&status=active", { headers: { Authorization: `Bearer ${key}` } })).json()) as { data?: { country: string; country_options?: { us?: { state?: string } } }[] };
const states = (registrations.data ?? []).map((r) => r.country_options?.us?.state ?? r.country);
console.log(`\nStripe Tax: ${tax.status ?? "unknown"}. Default tax behavior: ${tax.defaults?.tax_behavior ?? "none"} (${untaxed.length} of ${sellable.length} prices use the default).`);
console.log(states.length ? `Collecting sales tax in: ${states.join(", ")}` : "Tax registrations: none. Stripe collects $0 tax until you add at least one (Stripe Dashboard, Tax, Registrations).");
