import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EbPageHero } from "@/components/engine-bay/page-hero";
import { Todo } from "@/components/todo";
import { engineBay } from "@/lib/brand";
import { shopEnabled } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Returns",
  description: `Returns and exchanges for online orders from ${engineBay.name}.`,
  alternates: { canonical: `${engineBay.path}/returns` },
};

export default function Page() {
  if (!shopEnabled()) notFound();
  return (
    <>
      <EbPageHero title="Returns" />
      <div className="container-site max-w-3xl space-y-6 pb-16 text-lg">

        <Todo>The returns policy: how long buyers have, condition, who pays return shipping, restocking fees, and items that can&apos;t be returned (cut hose, custom builds).</Todo>
      </div>
    </>
  );
}
