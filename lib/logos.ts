import "server-only";

import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { LogoConfig } from "./brand";

export type LogoImage = { src: string; width: number; height: number };

export type ResolvedLogo = LogoImage & {
  alt: string;
  // Present only when a "-light" file exists next to the original.
  light?: LogoImage;
};

const publicDir = path.join(process.cwd(), "public");

function lightPath(src: string): string {
  const ext = path.extname(src);
  return `${src.slice(0, -ext.length)}-light${ext}`;
}

function readImage(src: string): LogoImage | undefined {
  const file = path.join(publicDir, src);
  if (!fs.existsSync(file)) return undefined;
  const { width, height } = imageSize(fs.readFileSync(file));
  if (!width || !height) throw new Error(`Could not read the size of ${src}`);
  return { src, width, height };
}

// Reads sizes from the files at build time, so swapping a PNG for an SVG
// (or adding a light version) never means editing dimensions by hand.
export function resolveLogo(logo: LogoConfig): ResolvedLogo {
  const image = readImage(logo.src);
  if (!image) throw new Error(`Logo file not found: public${logo.src}`);
  return { ...image, alt: logo.alt, light: readImage(lightPath(logo.src)) };
}
