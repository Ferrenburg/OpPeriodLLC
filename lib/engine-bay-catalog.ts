import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { z } from "zod";
import { toolCategories, type ToolCategory } from "./engine-bay";

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

const productSchema = z.strictObject({
  slug,
  // The manufacturer's model or part number, exactly as they print it.
  sku: text,
  name: text,
  category: z.enum(categorySlugs, `must be one of: ${categorySlugs.join(", ")}`),
  summary: text,
  details: z.array(text).default([]),
  features: z.array(text).default([]),
  // California Prop 65 warning from the manufacturer, shown on the product page.
  prop65: text.optional(),
  images: z.array(z.string().startsWith("/", "must be a path in public/, like /catalog/photo.webp")).min(1, "add at least one photo"),
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

const productPath = (product: { slug: string }) => `/engine-bay/products/${product.slug}`;

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
        problems.push(`${file}\n  - ${product.sku}: slug "${product.slug}" is already used by another product`);
      }
      for (const image of product.images) {
        if (!fs.existsSync(/*turbopackIgnore: true*/ path.join(root, "public", image))) {
          problems.push(`${file}\n  - ${product.sku}: no photo at public${image}`);
        }
      }
      products.push({ ...product, brand, href: productPath(product) });
    }
  }

  for (const category of toolCategories) {
    const featured = products.find((p) => p.slug === category.featured);
    if (products.length > 0 && featured?.category !== category.slug) {
      problems.push(`lib/engine-bay.ts\n  - category ${category.slug}: featured product "${category.featured}" isn't a product in that category`);
    }
  }

  if (problems.length > 0) throw new Error(`Engine Bay product files have problems:\n\n${problems.join("\n\n")}\n`);
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

export const brandPath = (brand: Brand) => `/engine-bay/brands/${brand.slug}`;

// What a Get Pricing link puts at the top of the quote form.
export const quoteLabel = (product: Product) => `${product.brand.name} ${product.sku}, ${product.name}`;
