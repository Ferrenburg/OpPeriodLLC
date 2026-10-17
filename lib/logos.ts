import "server-only";

import path from "node:path";
import type { LogoConfig } from "./brand";
import { readPublicImage, type PublicImage } from "./images";

export type ResolvedLogo = PublicImage & {
  alt: string;
  // Present only when a "-light" file exists next to the original.
  light?: PublicImage;
};

function lightPath(src: string): string {
  const ext = path.extname(src);
  return `${src.slice(0, -ext.length)}-light${ext}`;
}

// Sizes come from the files, so swapping a PNG for an SVG (or adding a
// light version) never means editing dimensions by hand.
export function resolveLogo(logo: LogoConfig): ResolvedLogo {
  const image = readPublicImage(logo.src);
  if (!image) throw new Error(`Logo file not found: public${logo.src}`);
  return { ...image, alt: logo.alt, light: readPublicImage(lightPath(logo.src)) };
}
