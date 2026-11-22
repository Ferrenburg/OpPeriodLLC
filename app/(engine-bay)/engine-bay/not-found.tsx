import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/button";
import { equipmentPath, quoteHref } from "@/lib/engine-bay";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function EngineBayNotFound() {
  return (
    <section className="container-site py-20 md:py-28">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-[clamp(2.9rem,6vw,4.8rem)] font-bold uppercase leading-[0.92]">Wrong address</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        That page doesn&apos;t exist, or it moved. Look through the equipment, or tell us what you need and we&apos;ll track it
        down.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={equipmentPath} className={buttonClass("primary")}>
          Shop equipment
        </Link>
        <Link href={quoteHref()} className={buttonClass("secondary")}>
          Request a quote
        </Link>
      </div>
    </section>
  );
}
