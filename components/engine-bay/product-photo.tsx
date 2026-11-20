import Image from "next/image";
import { readPublicImage } from "@/lib/images";

// A product photo on white, or, for the catalog items that have no photo,
// the product name on diamond plate so grids still line up.
export function ProductPhoto({
  src,
  name,
  sizes,
  priority = false,
  padding = "p-4",
  alt = "",
}: {
  src?: string;
  name: string;
  sizes: string;
  priority?: boolean;
  padding?: string;
  alt?: string;
}) {
  const photo = src ? readPublicImage(src) : undefined;
  if (!photo) {
    return (
      <div className="diamond-plate absolute inset-0 flex items-center justify-center p-4 text-center" aria-hidden={alt ? undefined : true}>
        <span className="line-clamp-3 font-display text-xl font-bold uppercase leading-tight text-white/90">{name}</span>
      </div>
    );
  }
  return (
    <Image
      src={photo.src}
      width={photo.width}
      height={photo.height}
      alt={alt}
      sizes={sizes}
      priority={priority}
      className={`absolute inset-0 size-full object-contain ${padding}`}
    />
  );
}
