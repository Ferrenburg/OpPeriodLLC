import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { Todo } from "@/components/todo";
import { engineBay } from "@/lib/brand";
import { shopEnabled } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Terms of sale",
  description: `Terms of sale for online orders from ${engineBay.name}.`,
  alternates: { canonical: `${engineBay.path}/terms` },
};

export default function Page() {
  if (!shopEnabled()) notFound();
  return (
    <>
      <EbPageHero title="Terms of sale" />
      <div className="container-site max-w-3xl space-y-6 pb-16 text-lg">

        <Todo>Terms of sale, reviewed by a lawyer: warranty (the manufacturer&apos;s), limits of liability, product use and training, and governing law.</Todo>
      </div>
    </>
  );
}
