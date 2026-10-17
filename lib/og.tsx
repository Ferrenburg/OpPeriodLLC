import "server-only";

import fs from "node:fs";
import path from "node:path";
import { colors } from "./brand";

// Shared pieces for the generated social preview images (1200 x 630).

export const ogSize = { width: 1200, height: 630 };

const fontsDir = path.join(process.cwd(), "assets", "fonts");

export function ogFonts() {
  return [
    {
      name: "Barlow Condensed",
      data: fs.readFileSync(path.join(fontsDir, "BarlowCondensed-BoldItalic.ttf")),
      style: "italic" as const,
      weight: 700 as const,
    },
    {
      name: "Barlow",
      data: fs.readFileSync(path.join(fontsDir, "Barlow-Medium.ttf")),
      style: "normal" as const,
      weight: 500 as const,
    },
  ];
}

// Reads an image from public/ as a data URL, since the image renderer
// can't fetch from the site while it's being built.
export function publicImageDataUrl(src: string): string {
  const file = path.join(process.cwd(), "public", src);
  const type = src.endsWith(".svg") ? "image/svg+xml" : src.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${type};base64,${fs.readFileSync(file).toString("base64")}`;
}

// The slanted bar from the logo, drawn as a parallelogram.
export function SlantBar({
  color = colors.opperiodRed,
  width = 120,
  height = 16,
}: {
  color?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        background: color,
        transform: "skewX(-24deg)",
        marginLeft: height / 2,
      }}
    />
  );
}
