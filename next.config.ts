import type { NextConfig } from "next";
import { loadProjects } from "./lib/project-loader";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Short links: opperiod.com/<slug> goes to opperiod.com/projects/<slug>.
  // Built from the content folder, so new projects get one automatically.
  // A project with its own section (sitePath) sends its /projects page there
  // instead, and needs no short link when the section already lives at /<slug>.
  async redirects() {
    const published = loadProjects().filter((project) => project.published);
    const shortLinks = published
      .filter((project) => project.href !== `/${project.slug}` && project.sitePath !== `/${project.slug}`)
      .map((project) => ({ source: `/${project.slug}`, destination: project.href, permanent: true }));
    const sections = published
      .filter((project) => project.sitePath)
      .map((project) => ({ source: `/projects/${project.slug}`, destination: project.href, permanent: true }));
    // Engine Bay's "tools" pages became "equipment" when it grew past hand tools.
    const renamed = [
      { source: "/engine-bay/tools", destination: "/engine-bay/equipment", permanent: true },
      { source: "/engine-bay/tools/:category", destination: "/engine-bay/equipment/:category", permanent: true },
    ];
    // Engine Bay moved to enginebaysupply.com (proxy.ts serves it there).
    // Old opperiod.com/engine-bay links follow it, www goes to the bare
    // domain, and its old /tools links work on the new domain too.
    const ebHost = "enginebaysupply.com";
    const opperiodHost = "(?:www\\.)?opperiod\\.com";
    const engineBayMoved = [
      { source: "/engine-bay", has: [{ type: "host" as const, value: opperiodHost }], destination: `https://${ebHost}/`, permanent: true },
      { source: "/engine-bay/:path*", has: [{ type: "host" as const, value: opperiodHost }], destination: `https://${ebHost}/:path*`, permanent: true },
      { source: "/:path*", has: [{ type: "host" as const, value: `www.${ebHost}` }], destination: `https://${ebHost}/:path*`, permanent: true },
      { source: "/tools", has: [{ type: "host" as const, value: ebHost }], destination: "/equipment", permanent: true },
      { source: "/tools/:category", has: [{ type: "host" as const, value: ebHost }], destination: "/equipment/:category", permanent: true },
    ];
    // The About page was removed; send old links home instead of to a 404.
    return [
      ...engineBayMoved,
      ...shortLinks,
      ...sections,
      ...renamed,
      { source: "/about", has: [{ type: "host" as const, value: ebHost }], destination: "/#about", permanent: true },
      { source: "/about", missing: [{ type: "host" as const, value: ebHost }], destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // SAMEORIGIN, not DENY, so the Engine Bay catalog pages can show
          // the PDFs from /downloads. Other sites still can't frame the site.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
