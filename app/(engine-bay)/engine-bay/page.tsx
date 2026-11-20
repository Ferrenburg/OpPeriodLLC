import type { Metadata } from "next";
import {
  AreasSection,
  BrandStrip,
  CatalogsSection,
  CtaBand,
  EbHero,
  FeaturedRow,
  OrderingSection,
  Statement,
  StatsStrip,
  TextBand,
} from "@/components/engine-bay/home-sections";
import { engineBay } from "@/lib/brand";

export const metadata: Metadata = {
  title: { absolute: `${engineBay.name} | Fire Department Loose Equipment` },
  alternates: { canonical: engineBay.path },
};

export default function EngineBayHome() {
  return (
    <>
      <EbHero />
      <StatsStrip />
      <BrandStrip />
      <AreasSection />
      <Statement />
      <FeaturedRow />
      <OrderingSection />
      <TextBand />
      <CatalogsSection />
      <CtaBand />
    </>
  );
}
