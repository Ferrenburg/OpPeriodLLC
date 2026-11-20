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
    blurb: "Flathead, pickhead, and combo axes on hickory or fiberglass handles, plus sheaths.",
    featured: "60f32dg",
  },
  {
    slug: "hooks",
    name: "Hooks and pike poles",
    short: "Hooks",
    blurb: "Roof hooks, pike poles, drywall and Boston rake hooks, and more, by length.",
    featured: "rhfsv-4",
  },
  {
    slug: "hose",
    name: "Fire hose",
    short: "Hose",
    blurb: "Attack, supply (LDH), booster, and forestry hose, sized and coupled to order.",
    featured: "snap-tite-supreme-ii",
  },
  {
    slug: "nozzles",
    name: "Nozzles and tips",
    short: "Nozzles",
    blurb: "Fog, select flow, and constant flow nozzles, smooth bore and stacked tips, master streams, and foam eductors.",
    featured: "rawhide-1-1-2-in-1366-select-flow-municipal-nozzle",
  },
  {
    slug: "appliances",
    name: "Valves, wyes, and fittings",
    short: "Valves & Wyes",
    blurb: "Hydrant gate and ball valves, wyes, caps and plugs, and dry hydrant adapters.",
    featured: "rawhide-hydrant-wye-1-4-turn-ball-valve-self-locking",
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
    blurb: "Hydraulic rams, through-the-lock tools and keys, officer's tools, sledges, and pry bars.",
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
    slug: "straps-mounts",
    name: "Straps and mounts",
    short: "Straps & Mounts",
    blurb: "Irons straps, tool loops, harnesses, wrench holders, and brackets to mount tools on the rig.",
    featured: "iss-82",
  },
  {
    slug: "rescue",
    name: "Hydrant and rescue tools",
    short: "Rescue",
    blurb: "Hydrant, spanner, and Storz wrenches, punches, and other tools for the rig.",
    featured: "hw-1",
  },
  {
    slug: "saws",
    name: "Saws and blades",
    short: "Saws",
    blurb: "Husqvarna rescue and battery saws, batteries, chargers, and blades.",
    featured: "k12fd",
  },
  {
    slug: "parts",
    name: "Handles and parts",
    short: "Parts",
    blurb: "Replacement poles, handles, rake heads, teeth, and swatter flaps to keep equipment in service.",
    featured: "70-32dg-b",
  },
];

// Flagship brands, in order. Anywhere the site lists brands or mixes their
// products (menus, the brand strip, category pages, related items), these
// come first and the rest follow alphabetically. The catalog loader applies it.
export const flagshipBrands = ["council-tool", "snap-tite-hose"];

export const orderingSteps = [
  {
    title: "Send your list",
    text: "Use the quote form or email us. Items, quantities, and any specs your department wants.",
  },
  {
    title: "Get an itemized quote",
    text: "Priced line by line, so it can go straight to whoever signs off on purchases.",
  },
  {
    title: "Place the order",
    text: "Your department sends the order and we get it headed your way.",
  },
];

export const categoryPath = (category: { slug: string }) => `${engineBay.path}/equipment/${category.slug}`;

// The categories grouped the way a fire department thinks about loose
// equipment. Every category belongs to exactly one area (the catalog loader
// checks). The first category's photo stands for the area.
export type EquipmentArea = {
  slug: string;
  name: string;
  blurb: string;
  categories: string[];
};

export const equipmentAreas: EquipmentArea[] = [
  {
    slug: "hand-tools",
    name: "Forcible entry and hand tools",
    blurb: "Halligans, axes, hooks and pike poles, irons, and through-the-lock tools.",
    categories: ["halligans", "axes", "hooks", "irons", "forcible-entry"],
  },
  {
    slug: "hose",
    name: "Hose and nozzles",
    blurb: "Attack, supply, booster, and forestry hose, plus nozzles, valves, wyes, and fittings.",
    categories: ["hose", "nozzles", "appliances"],
  },
  {
    slug: "saws-rescue",
    name: "Saws and rescue",
    blurb: "Rescue and battery saws, blades, hydrant wrenches, and spanners.",
    categories: ["saws", "rescue"],
  },
  {
    slug: "wildland",
    name: "Wildland",
    blurb: "Pulaskis, McLeods, fire rakes, swatters, shovels, and brush gear.",
    categories: ["wildland"],
  },
  {
    slug: "mounting-parts",
    name: "Mounting and parts",
    blurb: "Straps, harnesses, brackets, replacement handles, and parts.",
    categories: ["straps-mounts", "parts"],
  },
];

export const equipmentPath = `${engineBay.path}/equipment`;

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
    brandSlug: "fire-hooks-unlimited",
    blurb: "Halligans, hooks, axes, forcible entry, mounting, wildland, and saws.",
    file: "/downloads/engine-bay-fire-hooks-unlimited-catalog-2026.pdf",
    cover: "/downloads/engine-bay-fire-hooks-unlimited-catalog-2026-cover.webp",
    pages: 46,
    note: "2026 catalog and price guide. Prices good through 12/31/26.",
  },
];

export const catalogPath = (catalog: PrintCatalog) => `${engineBay.path}/catalogs/${catalog.slug}`;

export const ebNav = [
  { label: "Equipment", href: `${engineBay.path}/equipment` },
  { label: "Catalogs", href: `${engineBay.path}/catalogs` },
  { label: "How to Order", href: `${engineBay.path}#ordering` },
  { label: "About", href: `${engineBay.path}#about` },
] as const;

export const quoteHref = (tool?: string) =>
  tool ? `${engineBay.path}/quote?tool=${encodeURIComponent(tool)}` : `${engineBay.path}/quote`;

export const ebPages = [
  engineBay.path,
  `${engineBay.path}/equipment`,
  `${engineBay.path}/quote`,
  `${engineBay.path}/catalogs`,
  ...printCatalogs.map(catalogPath),
  ...toolCategories.map(categoryPath),
];
