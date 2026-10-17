import { ImageResponse } from "next/og";
import { colors, company, logos } from "@/lib/brand";
import { resolveLogo } from "@/lib/logos";
import { ogFonts, ogSize, publicImageDataUrl } from "@/lib/og";

export const alt = `${company.legalName}`;
export const size = ogSize;
export const contentType = "image/png";

// The default preview for every page that doesn't have its own.
export default function Image() {
  const logo = resolveLogo(logos.opperiod);
  const logoWidth = 640;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: colors.paper,
          borderBottom: `24px solid ${colors.opperiodRed}`,
        }}
      >
        <img
          src={publicImageDataUrl(logo.src)}
          width={logoWidth}
          height={Math.round((logoWidth * logo.height) / logo.width)}
          alt=""
        />
        <div style={{ marginTop: 48, fontFamily: "Barlow", fontSize: 40, color: colors.steel, maxWidth: 900, lineHeight: 1.35 }}>
          {company.description}
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts() },
  );
}
