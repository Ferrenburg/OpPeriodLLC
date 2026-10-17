import { ImageResponse } from "next/og";
import { colors, company } from "@/lib/brand";
import { readPublicImage } from "@/lib/images";
import { SlantBar, ogFonts, ogSize, publicImageDataUrl } from "@/lib/og";
import { getAllProjects, getProject } from "@/lib/projects";

export const alt = `A project from ${company.legalName}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

// Name, tagline, and the project's color, with its logo when it has one.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) return new Response("Not found", { status: 404 });

  const logo = project.logo ? readPublicImage(project.logo) : undefined;
  const logoHeight = 300;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: colors.paper,
          borderTop: `24px solid ${project.accent}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 90px", flex: 1 }}>
          <SlantBar color={project.accent} />
          <div
            style={{
              marginTop: 28,
              fontFamily: "Barlow Condensed",
              fontStyle: "italic",
              fontSize: project.name.length > 16 ? 104 : 128,
              lineHeight: 1,
              textTransform: "uppercase",
              color: colors.ink,
            }}
          >
            {project.name}
          </div>
          <div style={{ marginTop: 24, fontFamily: "Barlow", fontSize: 42, color: colors.steel, lineHeight: 1.3, maxWidth: logo ? 620 : 980 }}>
            {project.tagline}
          </div>
          <div
            style={{
              marginTop: 48,
              fontFamily: "Barlow Condensed",
              fontStyle: "italic",
              fontSize: 34,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: colors.opperiodRed,
            }}
          >
            {`Part of ${company.legalName}`}
          </div>
        </div>
        {logo && (
          <div style={{ display: "flex", alignItems: "center", paddingRight: 90 }}>
            <img
              src={publicImageDataUrl(logo.src)}
              height={logoHeight}
              width={Math.round((logoHeight * logo.width) / logo.height)}
              alt=""
            />
          </div>
        )}
      </div>
    ),
    { ...size, fonts: ogFonts() },
  );
}
