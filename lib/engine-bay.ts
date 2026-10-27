import { engineBay } from "./brand";

// The Engine Bay catalog. Categories only: no brands, models, or prices until
// the owner confirms them (see CONTENT-TODO.md).

export type ToolCategory = {
  slug: string;
  name: string;
  // Short name for the red category bar.
  short: string;
  blurb: string;
  // What a department should put on a quote request for this kind of tool.
  quoteWith: string[];
  // Optional product photo under public/, like /engine-bay/halligans.jpg.
  // Without one, the card shows a diamond plate panel with the name.
  image?: string;
};

export const toolCategories: ToolCategory[] = [
  {
    slug: "halligans",
    name: "Halligan bars",
    short: "Halligans",
    blurb: "Adz, pike, and fork. For forcing doors, breaching walls, and search.",
    quoteWith: ["Overall length (30 and 36 inch are the usual sizes)", "Steel or titanium", "Finish or color", "Brand, if your department has a standard"],
  },
  {
    slug: "axes",
    name: "Flathead axes",
    short: "Axes",
    blurb: "The striking half of the irons. Also for chopping and vent work.",
    quoteWith: ["Head weight (6 and 8 lb are the usual sizes)", "Fiberglass or wood handle", "Handle length", "Brand, if your department has a standard"],
  },
  {
    slug: "hooks",
    name: "Hooks and pike poles",
    short: "Hooks & Pike Poles",
    blurb: "New York hooks, roof hooks, and drywall hooks for pulling ceilings and overhaul.",
    quoteWith: ["Head pattern (New York, roof, drywall, or other)", "Length", "Fiberglass, steel, or wood handle", "D-handle or straight"],
  },
  {
    slug: "irons",
    name: "Irons sets",
    short: "Irons",
    blurb: "A halligan and a flathead, married and ready to carry.",
    quoteWith: ["Halligan length and axe weight", "Whether you want a strap or a mount with them", "How many sets"],
  },
  {
    slug: "forcible-entry",
    name: "Forcible entry",
    short: "Forcible Entry",
    blurb: "K-tools, lock pullers, and shove knives for through-the-lock work.",
    quoteWith: ["The tools you need", "The lock and door types your district runs into", "Quantity per rig"],
  },
  {
    slug: "straps-mounts",
    name: "Straps and mounts",
    short: "Straps & Mounts",
    blurb: "Irons straps and tool mounts to keep everything where crews expect it.",
    quoteWith: ["Which tools it needs to hold", "Where it mounts on the apparatus", "How many rigs"],
  },
];

// Brands Engine Bay distributes, as plain names. Empty until they're
// confirmed; the Brands section stays off the live site until then.
export const brands: string[] = [];

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

export const ebNav = [
  { label: "Tools", href: `${engineBay.path}/tools` },
  { label: "How to Order", href: `${engineBay.path}#ordering` },
  { label: "About", href: `${engineBay.path}#about` },
] as const;

export const quoteHref = (tool?: string) =>
  tool ? `${engineBay.path}/quote?tool=${encodeURIComponent(tool)}` : `${engineBay.path}/quote`;

export const ebPages = [engineBay.path, `${engineBay.path}/tools`, `${engineBay.path}/quote`];
