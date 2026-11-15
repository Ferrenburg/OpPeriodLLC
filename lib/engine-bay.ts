import { engineBay } from "./brand";

// Engine Bay tool categories. Products live in content/engine-bay/products/
// (see lib/engine-bay-catalog.ts) and each one names one of these slugs.

export type ToolCategory = {
  slug: string;
  name: string;
  // Short name for the red category bar.
  short: string;
  blurb: string;
  // Slug of the product whose first photo stands for the category on cards.
  featured: string;
  // Left out of the home page grid and linked in a line under it instead.
  minor?: boolean;
};

export const toolCategories: ToolCategory[] = [
  {
    slug: "halligans",
    name: "Halligan bars",
    short: "Halligans",
    blurb: "Adz, pike, and fork. For forcing doors, breaching walls, and search.",
    featured: "hal1p30",
  },
  {
    slug: "axes",
    name: "Fire axes",
    short: "Axes",
    blurb: "Flathead and pickhead axes on hickory or fiberglass handles.",
    featured: "60f32dg",
  },
  {
    slug: "hooks",
    name: "Hooks",
    short: "Hooks",
    blurb: "New York style roof hooks and FSV hooks in 4, 5, and 6 ft.",
    featured: "rhfsv-4",
  },
  {
    slug: "irons",
    name: "Irons sets",
    short: "Irons",
    blurb: "A halligan and a flathead, married and ready to carry.",
    featured: "irons632",
  },
  {
    slug: "forcible-entry",
    name: "Forcible entry",
    short: "Forcible Entry",
    blurb: "Lock pullers and pry bars for when the door needs more than the irons.",
    featured: "lxt-24",
  },
  {
    slug: "wildland",
    name: "Wildland tools",
    short: "Wildland",
    blurb: "Pulaskis, McLeods, fire rakes, swatters, and shovels for brush and wildland work.",
    featured: "38pe136",
  },
  {
    slug: "parts",
    name: "Handles and parts",
    short: "Parts",
    blurb: "Replacement handles, rake heads, teeth, and swatter flaps to keep tools in service.",
    featured: "70-32dg-b",
    minor: true,
  },
];

export const orderingSteps = [
  {
    title: "Send your list",
    text: "Use the quote form or email us. Tools, quantities, and any specs your department wants.",
  },
  {
    title: "Get an itemized quote",
    text: "Priced line by line, so it can go straight to whoever signs off on purchases.",
  },
  {
    title: "Place the order",
    text: "Your department sends the order and we get the tools headed your way.",
  },
];

// Printable catalogs and price guides, as PDFs in public/downloads/. The
// owner makes these; swap the files (same names) when a new year's comes out.
export type PrintCatalog = {
  slug: string;
  title: string;
  brand: string;
  // Brand page slug in content/engine-bay/products/, when there is one.
  brandSlug?: string;
  blurb: string;
  file: string;
  cover: string;
  pages: number;
  note: string;
};

export const printCatalogs: PrintCatalog[] = [
  {
    slug: "council-tool",
    title: "Council Tool Catalog",
    brand: "Council Tool",
    brandSlug: "council-tool",
    blurb: "Halligans, irons, axes, hooks, and wildland tools.",
    file: "/downloads/engine-bay-council-tool-catalog-2026.pdf",
    cover: "/downloads/engine-bay-council-tool-catalog-2026-cover.webp",
    pages: 9,
    note: "2026 catalog and price guide. Prices good through 12/31/26.",
  },
  {
    slug: "fire-hooks-unlimited",
    title: "Fire Hooks Unlimited Catalog",
    brand: "Fire Hooks Unlimited",
    blurb: "Halligans, hooks, axes, forcible entry, mounting, wildland, and saws.",
    file: "/downloads/engine-bay-fire-hooks-unlimited-catalog-2026.pdf",
    cover: "/downloads/engine-bay-fire-hooks-unlimited-catalog-2026-cover.webp",
    pages: 46,
    note: "2026 catalog and price guide. Prices good through 12/31/26.",
  },
];

export const catalogPath = (catalog: PrintCatalog) => `${engineBay.path}/catalogs/${catalog.slug}`;

export const ebNav = [
  { label: "Tools", href: `${engineBay.path}/tools` },
  { label: "Catalogs", href: `${engineBay.path}/catalogs` },
  { label: "How to Order", href: `${engineBay.path}#ordering` },
  { label: "About", href: `${engineBay.path}#about` },
] as const;

export const quoteHref = (tool?: string) =>
  tool ? `${engineBay.path}/quote?tool=${encodeURIComponent(tool)}` : `${engineBay.path}/quote`;

export const ebPages = [
  engineBay.path,
  `${engineBay.path}/tools`,
  `${engineBay.path}/quote`,
  `${engineBay.path}/catalogs`,
  ...printCatalogs.map(catalogPath),
];
