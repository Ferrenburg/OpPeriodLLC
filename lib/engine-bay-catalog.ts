import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { z } from "zod";
import { equipmentAreas, flagshipBrands, toolCategories, type ToolCategory } from "./engine-bay";

// The Engine Bay product catalog. One JSON file per brand in
// content/engine-bay/products/ (council-tool.json, for example). Adding a
// brand means adding a file; the brand page, product pages, tools page, and
// sitemap pick it up. A problem in a file stops the build with a message
// that says which file, product, and field.

const root = process.cwd();
const dir = path.join(root, "content", "engine-bay", "products");
const categorySlugs = toolCategories.map((c) => c.slug) as [string, ...string[]];

const text = z.string().trim().min(1, "can't be empty");
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "use lowercase letters, numbers, and single dashes");

const productSchema = z
  .strictObject({
  slug,
  // The manufacturer's model or part number, exactly as they print it. A
  // product sold in several sizes lists variants instead, and one sized and
  // coupled to order (like fire hose) can have neither.
  sku: text.optional(),
  name: text,
  category: z.enum(categorySlugs, `must be one of: ${categorySlugs.join(", ")}`),
  // Optional heading inside the category, like "Through-the-lock tools and keys".
  group: text.optional(),
  summary: text,
  details: z.array(text).default([]),
  features: z.array(text).default([]),
  // California Prop 65 warning from the manufacturer, shown on the product page.
  prop65: text.optional(),
  // Photos, main one first. Can be empty; the site shows a placeholder.
  images: z.array(z.string().startsWith("/", "must be a path in public/, like /catalog/photo.webp")).default([]),
  // Sizes or options, each with its own part number, like a hook in 4, 5, and 6 ft.
  variants: z.array(z.strictObject({ sku: text, option: text })).default([]),
  // The manufacturer's spec or data sheet (a PDF on their site), linked from the product page.
  datasheet: z.url().optional(),
  // Shop shipping class, when the category default (categoryShipping in
  // lib/engine-bay.ts) is wrong for this item: standard, long, hose, ldh, or saw.
  shipClass: z.enum(["standard", "long", "hose", "ldh", "saw"], "must be one of: standard, long, hose, ldh, saw").optional(),
  // Where the product details came from, for checking later. Not shown.
  source: z.url().optional(),
  });

const fileSchema = z.strictObject({
  brand: z.strictObject({
    slug,
    name: text,
    about: z.array(text).default([]),
    website: z.url().optional(),
  }),
  products: z.array(productSchema).min(1, "list at least one product"),
});

export type Brand = z.infer<typeof fileSchema>["brand"];
export type Product = z.infer<typeof productSchema> & { brand: Brand; href: string };

import { engineBay } from "./brand";

const productPath = (product: { slug: string }) => `${engineBay.path}/products/${product.slug}`;

export const loadCatalog = cache((): { brands: Brand[]; products: Product[] } => {
  const brands: Brand[] = [];
  const products: Product[] = [];
  const problems: string[] = [];
  if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) return { brands, products };

  for (const name of fs.readdirSync(/*turbopackIgnore: true*/ dir).sort()) {
    if (!name.endsWith(".json") || name.startsWith("_")) continue;
    const file = path.join("content", "engine-bay", "products", name);
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ path.join(dir, name), "utf8"));
    } catch (error) {
      problems.push(`${file}\n  - isn't valid JSON: ${(error as Error).message}`);
      continue;
    }
    const result = fileSchema.safeParse(raw);
    if (!result.success) {
      const lines = result.error.issues.map((issue) => `  - ${issue.path.join(".") || "file"}: ${issue.message}`);
      problems.push(`${file}\n${lines.join("\n")}`);
      continue;
    }
    const { brand } = result.data;
    if (brands.some((b) => b.slug === brand.slug)) problems.push(`${file}\n  - brand.slug: "${brand.slug}" is used by another file`);
    brands.push(brand);
    for (const product of result.data.products) {
      if (products.some((p) => p.slug === product.slug)) {
        problems.push(`${file}\n  - ${product.name}: slug "${product.slug}" is already used by another product`);
      }
      for (const image of product.images) {
        if (!fs.existsSync(/*turbopackIgnore: true*/ path.join(root, "public", image))) {
          problems.push(`${file}\n  - ${product.name}: no photo at public${image}`);
        }
      }
      products.push({ ...product, brand, href: productPath(product) });
    }
  }

  for (const category of toolCategories) {
    const areas = equipmentAreas.filter((area) => area.categories.includes(category.slug));
    if (areas.length !== 1) {
      problems.push(`lib/engine-bay.ts\n  - category ${category.slug}: must be in exactly one of equipmentAreas (it's in ${areas.length})`);
    }
    const featured = products.find((p) => p.slug === category.featured);
    if (products.length > 0 && featured?.category !== category.slug) {
      problems.push(`lib/engine-bay.ts\n  - category ${category.slug}: featured product "${category.featured}" isn't a product in that category`);
    }
  }

  if (brands.length > 0) {
    for (const slug of flagshipBrands) {
      if (!brands.some((b) => b.slug === slug)) {
        problems.push(`lib/engine-bay.ts\n  - flagshipBrands: no brand file has the slug "${slug}" (remove it from the list or fix the slug)`);
      }
    }
  }

  if (problems.length > 0) throw new Error(`Engine Bay product files have problems:\n\n${problems.join("\n\n")}\n`);

  // Flagship brands first, in the order listed, then the rest by name. Products
  // follow their brand's place and keep their file order within a brand.
  const rank = (slug: string) => {
    const i = flagshipBrands.indexOf(slug);
    return i === -1 ? flagshipBrands.length : i;
  };
  brands.sort((a, b) => rank(a.slug) - rank(b.slug) || a.name.localeCompare(b.name));
  const brandOrder = new Map(brands.map((b, i) => [b.slug, i]));
  products.sort((a, b) => brandOrder.get(a.brand.slug)! - brandOrder.get(b.brand.slug)!);
  return { brands, products };
});

export function getBrands(): Brand[] {
  return loadCatalog().brands;
}

export function getBrand(slug: string): Brand | undefined {
  return getBrands().find((b) => b.slug === slug);
}

export function getProducts(): Product[] {
  return loadCatalog().products;
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductsIn(category: string): Product[] {
  return getProducts().filter((p) => p.category === category);
}

export function getBrandProducts(brandSlug: string): Product[] {
  return getProducts().filter((p) => p.brand.slug === brandSlug);
}

// The photo that stands for a category: its featured product's first photo.
export function categoryPhoto(category: ToolCategory): string | undefined {
  return getProduct(category.featured)?.images[0];
}

export const brandPath = (brand: Brand) => `${engineBay.path}/brands/${brand.slug}`;

// What a Get Pricing link puts at the top of the quote form. Pass a variant
// for one size of a product sold in several.
export const quoteLabel = (product: Product, variant?: { sku: string; option: string }) => {
  if (variant) return `${product.brand.name} ${variant.sku}, ${product.name} (${variant.option})`;
  return product.sku ? `${product.brand.name} ${product.sku}, ${product.name}` : `${product.brand.name} ${product.name}`;
};

// The part number line on cards: the model, the range of a product's sizes,
// or nothing for a product sized to order.
export function partNumbers(product: Product): string {
  if (product.sku) return product.sku;
  if (product.variants.length === 0) return "";
  const skus = product.variants.map((v) => v.sku);
  return skus.length > 2 ? `${skus[0]} to ${skus[skus.length - 1]}` : skus.join(", ");
}

export { categoryPath } from "./engine-bay";
