import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/engine-bay-catalog";
import { readPublicImage } from "@/lib/images";

// A product in a grid: photo, brand, name, and model number. The whole card
// links to the product page, where the Get Pricing button lives.
export function ProductCard({ product, headingLevel = "h3" }: { product: Product; headingLevel?: "h2" | "h3" }) {
  const photo = readPublicImage(product.images[0]);
  const Heading = headingLevel;
  return (
    <Link href={product.href} className="group flex h-full flex-col border border-line bg-bg transition-shadow hover:shadow-lg">
      <div className="relative aspect-square border-b border-line bg-white">
        {photo && (
          <Image
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt=""
            sizes="(min-width: 1024px) 18rem, (min-width: 640px) 33vw, 50vw"
            className="absolute inset-0 size-full object-contain p-4"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{product.brand.name}</p>
        <Heading className="mt-1 flex-1 font-semibold leading-snug group-hover:text-accent">{product.name}</Heading>
        <p className="mt-3 text-sm text-muted">
          Model <span className="font-semibold text-fg">{product.sku}</span>
        </p>
      </div>
    </Link>
  );
}
