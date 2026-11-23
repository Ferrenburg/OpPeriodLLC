import type { MetadataRoute } from "next";
import { engineBayUrl } from "@/lib/brand";
import { ebPages, shopPath, shopPolicyPages } from "@/lib/engine-bay";
import { shopEnabled } from "@/lib/shop";
import { brandPath, getBrands, getProducts } from "@/lib/engine-bay-catalog";

// enginebaysupply.com/sitemap.xml (proxy.ts maps it here). Every Engine Bay
// page, brand, and product.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = engineBayUrl();
  const shop = shopEnabled() ? [shopPath, ...shopPolicyPages.map((page) => page.href)] : [];
  const paths = new Set([...ebPages, ...shop, ...getBrands().map(brandPath), ...getProducts().map((product) => product.href)]);
  return [...paths].map((path) => ({ url: new URL(path, base).toString() }));
}
