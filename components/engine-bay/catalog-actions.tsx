import { buttonClass } from "@/components/button";
import { type PrintCatalog } from "@/lib/engine-bay";

const red = buttonClass("primary");
const outline = buttonClass("secondary");

// Download and open-in-a-new-tab buttons for a catalog PDF. Phones mostly
// can't show an embedded PDF, so these are how they read it.
export function CatalogActions({ catalog, primary = "download" }: { catalog: PrintCatalog; primary?: "download" | "open" }) {
  const download = (
    <a key="download" href={catalog.file} download className={primary === "download" ? red : outline}>
      Download PDF
    </a>
  );
  const open = (
    <a key="open" href={catalog.file} target="_blank" rel="noopener" className={primary === "open" ? red : outline}>
      Open PDF<span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
  return <div className="flex flex-wrap gap-3">{primary === "download" ? [download, open] : [open, download]}</div>;
}
