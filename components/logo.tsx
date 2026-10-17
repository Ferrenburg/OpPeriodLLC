import Image from "next/image";
import type { LogoConfig } from "@/lib/brand";
import { resolveLogo } from "@/lib/logos";

type Props = {
  logo: LogoConfig;
  // Rendered height in CSS, for example "h-9 md:h-10". Width follows.
  className?: string;
  // The section behind the logo is dark in both themes (like a band).
  onDark?: boolean;
  priority?: boolean;
};

// Picks the right logo for the background. With a "-light" file, dark
// backgrounds get the light version. Without one, the normal logo sits on a
// white plate so the black type never disappears.
export function Logo({ logo, className = "h-10", onDark = false, priority = false }: Props) {
  const resolved = resolveLogo(logo);
  const { light } = resolved;
  const img = (src: { src: string; width: number; height: number }, extra = "") => (
    <Image
      src={src.src}
      width={src.width}
      height={src.height}
      alt={resolved.alt}
      priority={priority}
      className={`${className} w-auto max-w-full ${extra}`}
    />
  );

  if (light) {
    if (onDark) return img(light);
    return (
      <>
        {img(resolved, "dark:hidden")}
        {img(light, "hidden dark:block")}
      </>
    );
  }

  const plate = "inline-flex rounded-sm bg-paper px-3 py-2";
  return (
    <span className={onDark ? plate : `inline-flex dark:rounded-sm dark:bg-paper dark:px-3 dark:py-2`}>
      {img(resolved)}
    </span>
  );
}
