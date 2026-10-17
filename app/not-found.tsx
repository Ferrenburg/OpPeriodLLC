import type { Metadata } from "next";
import { ButtonLink } from "@/components/button";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="container-site py-20 md:py-28">
        <span className="slant-bar" aria-hidden="true" />
        <h1 className="mt-4 font-display text-5xl font-bold uppercase italic md:text-6xl">
          Wrong address
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted">
          That page doesn&apos;t exist, or it moved. Head back to the home page or see what we run.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/projects" variant="secondary">
            View projects
          </ButtonLink>
        </div>
      </section>
    </SiteChrome>
  );
}
