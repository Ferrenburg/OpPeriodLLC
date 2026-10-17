import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { company } from "@/lib/brand";
import { getContactOptions, turnstileSiteKey } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${company.legalName} or any of its projects.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="container-site py-14 md:py-20">
      <span className="slant-bar" aria-hidden="true" />
      <h1 className="mt-3 font-display text-5xl font-bold uppercase italic md:text-6xl">Contact</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_18rem]">
        <div className="max-w-2xl">
          <p className="mb-8 text-lg text-muted">
            Estimates, questions, or anything about one of our projects. Pick what it&apos;s about and your
            message comes straight to us.
          </p>
          <ContactForm options={getContactOptions()} email={company.email} turnstileSiteKey={turnstileSiteKey()} />
          <noscript>
            <p className="mt-6 font-semibold">
              The form needs JavaScript. You can also email{" "}
              <a href={`mailto:${company.email}`} className="text-accent underline">
                {company.email}
              </a>
              .
            </p>
          </noscript>
        </div>

        <aside className="h-fit bg-surface p-6">
          <h2 className="font-display text-2xl font-bold uppercase italic">Rather email?</h2>
          <p className="mt-2 text-muted">Write to us directly at</p>
          <a href={`mailto:${company.email}`} className="mt-1 inline-block text-lg font-semibold text-accent underline underline-offset-4">
            {company.email}
          </a>
          <p className="mt-6 text-sm text-muted">
            {company.legalName}, {company.city}, {company.state}
          </p>
        </aside>
      </div>
    </section>
  );
}
