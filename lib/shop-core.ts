// Pure helpers for the Engine Bay shop, shared by the site (lib/shop.ts) and
// the Stripe report script (scripts/shop-report.ts). No imports, so Node can
// run the script straight from TypeScript.

export type ShipClass = "standard" | "long" | "hose" | "saw";
export const shipClasses: ShipClass[] = ["standard", "long", "hose", "saw"];

// How a category ships: a fixed class, or "measure" to class each item by the
// longest length in its name or size (over 48 in. ships as "long").
export type CategoryShipping = ShipClass | "measure";

export const LONG_OVER_INCHES = 48;

// One active, default price from Stripe, flattened with its product.
export type StripePriceRow = {
  priceId: string;
  unitAmount: number; // cents
  productId: string;
  productName: string;
  sku: string;
  vendor: string;
  taxBehavior: string;
};

export type HoseBuild = {
  line: string; // "Supreme II"
  diameter: string; // '2-1/2"'
  diameterInches: number;
  lengthFt: number;
  color: string;
  coupling: string; // '2-1/2" NH Aluminum'
};

// "3/4" -> 0.75, "2-1/2" -> 2.5, "4" -> 4
export function inches(text: string): number {
  const m = text.trim().match(/^(?:(\d+)-)?(\d+)(?:\/(\d+))?$/);
  if (!m) return NaN;
  const whole = m[1] ? Number(m[1]) : 0;
  return m[3] ? whole + Number(m[2]) / Number(m[3]) : whole + Number(m[2]);
}

// Stripe names each hose build like:
//   Snap-tite Supreme II 3" x 50' Red w/ 2-1/2" NH Aluminum
// Gladiator adds the true inside diameter: 1-3/4" (1.88") x 100' ...
const hosePattern = /^Snap-tite\s+(.+?)\s+((?:\d+-)?\d+(?:\/\d+)?)"(?:\s*\([\d.]+"\))?\s*x\s*(\d+)'\s+(.+?)\s+w\/\s+(.+)$/;

export function parseHoseName(name: string): HoseBuild | null {
  const m = name.trim().match(hosePattern);
  if (!m) return null;
  return {
    line: m[1],
    diameter: `${m[2]}"`,
    diameterInches: inches(m[2]),
    lengthFt: Number(m[3]),
    color: m[4],
    coupling: m[5],
  };
}

// Stripe line names that differ from the site's product names.
const hoseAliases: Record<string, string> = {
  "6T": "6T Military",
  "Gladiator FG": "Gladiator (FG)",
  "Gladiator FGN": "Gladiator (FGN)",
  "5P Industrial": "5P",
  "Blazeline 7": "BlazeLine",
  "Blazeline 8": "BlazeLine",
};

// The site product names a Stripe hose build could belong to, best first.
// 4" and larger is supply hose, which the site lists as "<line> LDH".
export function hoseSiteNames(build: HoseBuild): string[] {
  const line = hoseAliases[build.line] ?? build.line;
  return build.diameterInches >= 4 ? [`${line} LDH`, line] : [line];
}

export function hoseOptionLabel(build: HoseBuild): string {
  return `${build.diameter} x ${build.lengthFt} ft, ${build.color}, ${build.coupling}`;
}

// The longest length written in a product name or size, in inches:
// "24 in. OAL", "6 ft", "1-1/4\" x 60\"". Weights and blade sizes in saws
// never get here; saws ship as their own class.
export function longestInches(texts: string[]): number {
  let longest = 0;
  for (const text of texts) {
    for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*(?:ft\b|feet|foot|')/gi)) longest = Math.max(longest, Number(m[1]) * 12);
    for (const m of text.matchAll(/((?:\d+-)?\d+(?:\/\d+)?(?:\.\d+)?)\s*(?:in\b\.?|inch|inches|")/gi)) {
      const value = m[1].includes(".") ? Number(m[1]) : inches(m[1]);
      if (Number.isFinite(value)) longest = Math.max(longest, value);
    }
  }
  return longest;
}

export function shipClassFor(shipping: CategoryShipping, override: ShipClass | undefined, texts: string[]): ShipClass {
  if (override) return override;
  if (shipping !== "measure") return shipping;
  return longestInches(texts) > LONG_OVER_INCHES ? "long" : "standard";
}

// For spotting near misses between site part numbers and Stripe SKUs,
// like "RT38" and "RT-38". Never used to match for real.
export const normalizeSku = (sku: string) => sku.toUpperCase().replace(/[^A-Z0-9]/g, "");

// Flat shipping: "first item + each additional" per class, in cents.
export type ShippingRates = Record<ShipClass, { first: number; additional: number }>;

// SHOP_SHIPPING_RATES="standard=14+6,long=45+20,hose=30+15,saw=40+15" (dollars).
// Returns null unless every class has a rate, so a half-filled table never
// undercharges.
export function parseShippingRates(value: string | undefined): ShippingRates | null {
  if (!value) return null;
  const out: Partial<ShippingRates> = {};
  for (const part of value.split(",")) {
    const m = part.trim().match(/^(standard|long|hose|saw)\s*=\s*(\d+(?:\.\d{1,2})?)\s*\+\s*(\d+(?:\.\d{1,2})?)$/);
    if (!m) return null;
    out[m[1] as ShipClass] = { first: Math.round(Number(m[2]) * 100), additional: Math.round(Number(m[3]) * 100) };
  }
  return shipClasses.every((c) => out[c]) ? (out as ShippingRates) : null;
}

export type ShippingLine = { vendor: string; shipClass: ShipClass; quantity: number };
export type VendorShipping = { vendor: string; amount: number };

// Each vendor ships its own box, so each vendor's items are charged
// separately: the priciest first item once, then "each additional" for
// every other unit.
export function shippingFor(lines: ShippingLine[], rates: ShippingRates): { byVendor: VendorShipping[]; total: number } {
  const vendors = [...new Set(lines.map((l) => l.vendor))];
  const byVendor = vendors.map((vendor) => {
    const units = lines
      .filter((l) => l.vendor === vendor)
      .flatMap((l) => Array.from({ length: l.quantity }, () => rates[l.shipClass]))
      .sort((a, b) => b.first - a.first);
    const amount = units.reduce((sum, rate, i) => sum + (i === 0 ? rate.first : rate.additional), 0);
    return { vendor, amount };
  });
  return { byVendor, total: byVendor.reduce((sum, v) => sum + v.amount, 0) };
}

export const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
