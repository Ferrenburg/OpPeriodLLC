import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { engineBay } from "@/lib/brand";
import { GENERAL, getContactOptions, turnstileSiteKey } from "@/lib/contact";
import { getListedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: `Send ${engineBay.name} the tools and quantities your department needs and get itemized pricing back.`,
  alternates: { canonical: `${engineBay.path}/quote` },
};

export default function QuotePage() {
  // Routes like any other Engine Bay message, through its project file.
  const project = getListedProjects().find((p) => p.sitePath === engineBay.path)?.slug ?? GENERAL;

  return (
    <>
      <EbPageHero title="Request a quote">
        <p>Send us what your department needs. We&apos;ll get back to you with itemized pricing.</p>
      </EbPageHero>

      <section className="container-site grid gap-12 py-12 md:py-16 lg:grid-cols-[1fr_20rem]">
        <div className="max-w-2xl">
          <ContactForm options={getContactOptions()} email={engineBay.email} turnstileSiteKey={turnstileSiteKey()} quote={{ project }} />
          <noscript>
            <p className="mt-6 font-semibold">
              The form needs JavaScript. You can also email your list to{" "}
              <a href={`mailto:${engineBay.email}`} className="text-accent underline">
                {engineBay.email}
              </a>
              .
            </p>
          </noscript>
        </div>

        <aside className="h-fit border-t-4 border-eb-red bg-eb-paper p-6">
          <h2 className="font-display text-2xl font-bold uppercase italic">What speeds up a quote</h2>
          <ul className="mt-4 space-y-3">
            <li>Each tool and how many you need</li>
            <li>Sizes, materials, or brands your department has standardized on</li>
            <li>When you need them, especially if it&apos;s tied to a budget year</li>
          </ul>
          <h2 className="mt-8 font-display text-2xl font-bold uppercase italic">Rather email?</h2>
          <p className="mt-2 text-muted">Send your list to</p>
          <a href={`mailto:${engineBay.email}`} className="mt-1 inline-block text-lg font-semibold text-accent underline underline-offset-4">
            {engineBay.email}
          </a>
        </aside>
      </section>
    </>
  );
}
