import Image from "next/image";
import type { LogoConfig } from "@/lib/brand";
import type { PublicImage } from "@/lib/images";
import { resolveLogo } from "@/lib/logos";

type Props = {
  logo: LogoConfig;
  // Rendered height in CSS, for example "h-9 md:h-10". Width follows.
  className?: string;
  // The section behind the logo is dark (like a band).
  onDark?: boolean;
  priority?: boolean;
  // Roughly how wide the logo shows, so the browser downloads a small file
  // instead of the full size original. Same format as the <img> sizes attribute.
  sizes?: string;
};

// The site is light only, so the normal logo is used everywhere except dark
// bands. There, a "-light" file is used if one exists. Without one, the
// normal logo sits on a white plate so the black type never disappears.
export function Logo({ logo, className = "h-10", onDark = false, priority = false, sizes = "320px" }: Props) {
  const resolved = resolveLogo(logo);
  const { light } = resolved;
  const img = (src: PublicImage) => (
    <Image
      src={src.src}
      width={src.width}
      height={src.height}
      alt={resolved.alt}
      priority={priority}
      sizes={sizes}
      className={`${className} w-auto max-w-full`}
    />
  );

  if (!onDark) return img(resolved);
  if (light) return img(light);
  return <span className="inline-flex rounded-sm bg-paper px-3 py-2">{img(resolved)}</span>;
}
