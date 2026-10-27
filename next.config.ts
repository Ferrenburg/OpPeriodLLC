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
      .filter((project) => project.href !== `/${project.slug}`)
      .map((project) => ({ source: `/${project.slug}`, destination: project.href, permanent: true }));
    const sections = published
      .filter((project) => project.sitePath)
      .map((project) => ({ source: `/projects/${project.slug}`, destination: project.href, permanent: true }));
    // The About page was removed; send old links home instead of to a 404.
    return [...shortLinks, ...sections, { source: "/about", destination: "/", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
