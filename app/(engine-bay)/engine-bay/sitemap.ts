import type { MetadataRoute } from "next";
import { engineBayUrl } from "@/lib/brand";
import { ebPages } from "@/lib/engine-bay";
import { brandPath, getBrands, getProducts } from "@/lib/engine-bay-catalog";

// enginebaysupply.com/sitemap.xml (proxy.ts maps it here). Every Engine Bay
// page, brand, and product.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = engineBayUrl();
  const paths = new Set([...ebPages, ...getBrands().map(brandPath), ...getProducts().map((product) => product.href)]);
  return [...paths].map((path) => ({ url: new URL(path, base).toString() }));
}
