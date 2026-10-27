import Image from "next/image";
import type { ToolCategory } from "@/lib/engine-bay";
import { readPublicImage } from "@/lib/images";

// The picture slot on a category card: the product photo when there is one,
// otherwise diamond plate. Children (the card's heading) sit on top.
export function CategoryImage({ category, sizes, children }: { category: ToolCategory; sizes: string; children?: React.ReactNode }) {
  const photo = category.image ? readPublicImage(category.image) : undefined;
  if (category.image && !photo) throw new Error(`Engine Bay category ${category.slug}: no file at public${category.image}`);

  return (
    <div className="diamond-plate relative flex aspect-[16/10] items-end overflow-hidden">
      {photo && (
        <>
          <Image src={photo.src} width={photo.width} height={photo.height} alt="" sizes={sizes} className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
        </>
      )}
      <span className="absolute left-0 top-0 h-2 w-1/3 bg-eb-red" aria-hidden="true" />
      {children && <div className="relative p-5">{children}</div>}
    </div>
  );
}
