import Image from "next/image";
import { readPublicImage } from "@/lib/images";

// The picture slot on a category card. With a product photo it shows the
// product on white; without one, diamond plate with the heading (children) on it.
export function CategoryImage({
  photo,
  sizes,
  children,
  aspect = "aspect-[16/10]",
}: {
  photo?: string;
  sizes: string;
  children?: React.ReactNode;
  aspect?: string;
}) {
  const image = photo ? readPublicImage(photo) : undefined;

  if (image) {
    return (
      <div className={`relative ${aspect} overflow-hidden border-b border-line bg-card`}>
                <Image src={image.src} width={image.width} height={image.height} alt="" sizes={sizes} className="absolute inset-0 size-full object-contain p-4" />
      </div>
    );
  }

  return (
    <div className={`diamond-plate relative flex ${aspect} items-end overflow-hidden`}>
      <span className="absolute left-0 top-0 h-2 w-1/3 bg-eb-red" aria-hidden="true" />
      {children && <div className="relative p-5">{children}</div>}
    </div>
  );
}
