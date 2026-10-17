import { getNavProjects } from "@/lib/projects";
import { Footer } from "./footer";
import { Header } from "./header";

// Header, footer, and skip link. Shared by the site layout and the 404 page,
// which renders outside the (site) route group.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-bg focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>
      <Header projects={getNavProjects()} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
