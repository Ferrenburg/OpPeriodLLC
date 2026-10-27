// Company facts, colors, logos, and nav links live here so pages never hard
// code them. If something about the business changes, change it once here.

export const company = {
  name: "OpPeriod",
  legalName: "OpPeriod LLC",
  // Where the company is formed, which is not where it works from.
  formedIn: "Wyoming",
  // Registered address of the LLC.
  address: {
    street: "30 N Gould St Ste R",
    city: "Sheridan",
    region: "WY",
    postalCode: "82801",
    country: "US",
  },
  url: "https://opperiod.com",
  // Every project routes here until one gets its own inbox.
  email: "sales@opperiod.com",
  // One line used in metadata and the home hero. Plain on purpose.
  description: "OpPeriod LLC is a diversified holding company.",
} as const;

export function formatAddress(address = company.address): string {
  return `${address.street}, ${address.city}, ${address.region} ${address.postalCode}`;
}

// SITE_URL overrides the domain, which is only useful for testing a preview
// deploy's social previews. Production always uses opperiod.com.
export function siteUrl(): URL {
  return new URL(process.env.SITE_URL || company.url);
}

// Fixed brand colors, sampled from the logos. The versions pages use (for
// text and backgrounds) are CSS variables in app/globals.css.
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

// The site is light only. For a logo on a dark band, a light version is
// picked up automatically: drop a file next to the original with "-light"
// before the extension (for example /public/brand/opperiod-logo-light.png).
// Until one exists, the dark logo sits on a white plate there.
export const logos = {
  opperiod: { src: "/brand/opperiod-logo.png", alt: "OpPeriod LLC" },
} satisfies Record<string, LogoConfig>;

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [...mainNav, { label: "Privacy", href: "/privacy" }] as const;

// Engine Bay Supply Co., the OpPeriod division that supplies fire service
// hand tools. It has its own section at /engine-bay with its own header and
// footer. Its catalog content lives in lib/engine-bay.ts.
export const engineBay = {
  name: "Engine Bay Supply Co.",
  shortName: "Engine Bay",
  path: "/engine-bay",
  description:
    "Fire service hand tools for departments, from halligans to New York hooks. Engine Bay Supply Co. is a division of OpPeriod LLC.",
  // Quote requests go here until Engine Bay gets its own inbox.
  email: company.email,
  // Sampled from the logo. The CSS versions are the eb-* colors in app/globals.css.
  colors: {
    red: "#E2241B",
    redDark: "#A9141B",
    ink: "#121418",
    paper: "#F4F3F0",
  },
  logo: { src: "/brand/engine-bay-logo.png", alt: "Engine Bay Supply Co." },
} as const;
