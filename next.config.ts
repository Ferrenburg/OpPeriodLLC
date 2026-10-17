import type { NextConfig } from "next";
import { loadProjects } from "./lib/project-loader";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Short links: opperiod.com/<slug> goes to opperiod.com/projects/<slug>.
  // Built from the content folder, so new projects get one automatically.
  async redirects() {
    const shortLinks = loadProjects()
      .filter((project) => project.published)
      .map((project) => ({ source: `/${project.slug}`, destination: project.href, permanent: true }));
    // The About page was removed; send old links home instead of to a 404.
    return [...shortLinks, { source: "/about", destination: "/", permanent: true }];
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
