import Link from "next/link";
import { partNumbers, type Product } from "@/lib/engine-bay-catalog";
import { ProductPhoto } from "./product-photo";

// A product in a grid: photo, brand, name, and part number (or the range of
// part numbers for a product sold in several sizes). The whole card links to
// the product page, where the Get Pricing buttons live.
export function ProductCard({ product, headingLevel = "h3" }: { product: Product; headingLevel?: "h2" | "h3" | "h4" }) {
  const Heading = headingLevel;
  return (
    <Link href={product.href} className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-square border-b border-line bg-card">
        <ProductPhoto src={product.images[0]} name={product.name} sizes="(min-width: 1024px) 18rem, (min-width: 640px) 33vw, 50vw" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{product.brand.name}</p>
        <Heading className="mt-1 flex-1 font-semibold leading-snug group-hover:text-accent">{product.name}</Heading>
        <p className="mt-3 text-sm text-muted">
          {partNumbers(product) ? (
            <>
              {product.variants.length > 0 ? `${product.variants.length} options: ` : "Model "}
              <span className="font-semibold text-fg">{partNumbers(product)}</span>
            </>
          ) : (
            "Sized to order"
          )}
        </p>
      </div>
    </Link>
  );
}
