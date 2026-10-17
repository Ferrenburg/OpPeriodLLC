// Company facts, colors, logos, and nav links live here so pages never hard
// code them. If something about the business changes, change it once here.

export const company = {
  name: "Opperiod",
  legalName: "Opperiod LLC",
  state: "Louisiana",
  // One line used in metadata and the home hero. Plain on purpose.
  description:
    "Opperiod LLC is a small Louisiana company that owns and operates a growing group of businesses.",
} as const;

// The production domain is still an open question (see docs/PLAN.md). Set
// SITE_URL in Vercel once it is decided; until then Vercel's own production
// URL is used, then localhost for local builds.
export function siteUrl(): URL {
  const configured = process.env.SITE_URL;
  if (configured) return new URL(configured);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

// Fixed brand colors, sampled from the logos. Theme aware versions (for
// text, backgrounds, and dark mode) are CSS variables in app/globals.css.
// These raw values are for places CSS can't reach, like OG images.
export const colors = {
  ink: "#0E1010",
  opperiodRed: "#8E0D0E",
  paper: "#FFFFFF",
  smoke: "#F3F3F1",
  steel: "#5B6166",
} as const;

export type LogoConfig = {
  // Path under /public. Swap the extension when SVGs arrive, nothing else.
  src: string;
  alt: string;
};

// A light version for dark backgrounds is picked up automatically: drop a
// file next to the original with "-light" before the extension (for example
// /public/brand/opperiod-logo-light.png). Until one exists, the dark logo
// sits on a white plate whenever the background is dark.
export const logos = {
  opperiod: { src: "/brand/opperiod-logo.png", alt: "Opperiod LLC" },
} satisfies Record<string, LogoConfig>;

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [...mainNav, { label: "Privacy", href: "/privacy" }] as const;
