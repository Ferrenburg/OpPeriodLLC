import type { Metadata } from "next";
import Link from "next/link";
import { Todo } from "@/components/todo";
import { company } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${company.legalName} handles the information you send through this site.`,
  alternates: { canonical: "/privacy" },
};

// Draft written from how the site actually works (contact form, Vercel
// hosting, Resend email, no analytics). Update it whenever any of that
// changes, and have it reviewed before launch. See CONTENT-TODO.md.
export default function PrivacyPage() {
  const email = (
    <a href={`mailto:${company.email}`}>{company.email}</a>
  );

  return (
    <section className="container-site py-14 md:py-20">
      <span className="slant-bar" aria-hidden="true" />
      <h1 className="mt-3 font-display text-5xl font-bold uppercase italic md:text-6xl">Privacy policy</h1>
      <div className="mt-6 max-w-2xl">
        <Todo>The effective date, and a review of this draft before launch.</Todo>
      </div>

      <div className="mdx-body mt-10">
        <p>
          This page explains what information {company.legalName} collects through {company.url.replace("https://", "")},
          what we do with it, and what you can ask us to do with it. The short version: we only collect what
          you choose to send us, we use it to answer you, and we don&apos;t sell it.
        </p>

        <h2>What we collect</h2>
        <h3>When you use the contact form</h3>
        <p>
          The <Link href="/contact">contact form</Link> asks for your name, email address, an optional phone
          number, which project your message is about, and your message. We use that to read and answer your
          message, and for nothing else.
        </p>
        <h3>When you visit the site</h3>
        <p>
          Like most websites, our hosting provider automatically processes basic technical information, such
          as your IP address and browser type, to deliver pages and protect the site from abuse. The contact
          form also uses your IP address for a short time to stop repeated spam submissions.
        </p>
        <p>
          If you switch between light and dark mode, your choice is saved in your own browser. It never gets
          sent to us.
        </p>
        <p>
          We don&apos;t use advertising trackers or analytics tools, and we don&apos;t set cookies. If that
          changes, we&apos;ll update this page first.
        </p>

        <h2>Who else sees it</h2>
        <p>We don&apos;t sell or rent your information. We share it only with the services that run this site:</p>
        <ul>
          <li>Vercel, which hosts the website.</li>
          <li>Resend, which delivers contact form messages to our email inbox.</li>
        </ul>
        <p>We may also share information if the law requires it.</p>

        <h2>How long we keep it</h2>
        <p>
          Contact form messages stay in our email for as long as we need them to follow up with you or keep a
          record of the conversation. You can ask us to delete them at any time.
        </p>

        <h2>Your choices</h2>
        <p>
          To ask what information we have about you, or to have it deleted, email {email}. We&apos;ll answer as
          soon as we can.
        </p>

        <h2>Children</h2>
        <p>This site isn&apos;t meant for children under 13, and we don&apos;t knowingly collect their information.</p>

        <h2>Changes</h2>
        <p>If we change how we handle information, we&apos;ll update this page and its effective date.</p>

        <h2>Contact</h2>
        <p>
          {company.legalName}, {company.state}. Email {email}.
        </p>
      </div>
    </section>
  );
}
