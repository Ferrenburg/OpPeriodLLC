import "server-only";

import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

export type PublicImage = { src: string; width: number; height: number };

const publicDir = path.join(process.cwd(), "public");

// Reads an image's size from public/ at build time, so nobody has to type
// dimensions by hand. Returns undefined when the file doesn't exist.
export function readPublicImage(src: string): PublicImage | undefined {
  const file = path.join(publicDir, src);
  if (!fs.existsSync(file)) return undefined;
  const { width, height } = imageSize(fs.readFileSync(file));
  if (!width || !height) throw new Error(`Could not read the size of public${src}`);
  return { src, width, height };
}
