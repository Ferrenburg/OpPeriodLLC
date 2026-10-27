import type { Metadata } from "next";
import { EbFooter } from "@/components/engine-bay/footer";
import { EbHeader } from "@/components/engine-bay/header";
import { engineBay } from "@/lib/brand";

// Engine Bay has its own header and footer instead of the OpPeriod ones, so
// it reads like a tool supplier's site. It still runs inside the root layout
// (fonts, html, body).
export const metadata: Metadata = {
  title: { default: engineBay.name, template: `%s | ${engineBay.name}` },
  description: engineBay.description,
  openGraph: { siteName: engineBay.name, type: "website" },
};

export default function EngineBayLayout({ children }: LayoutProps<"/engine-bay">) {
  return (
    <div className="eb-theme flex flex-1 flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-bg focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>
      <EbHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <EbFooter />
    </div>
  );
}
