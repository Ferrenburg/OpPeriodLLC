import { notFound } from "next/navigation";

// Any Engine Bay address with no page shows Engine Bay's own not-found page
// (./not-found.tsx inside its layout) instead of OpPeriod's.
export default function Missing() {
  notFound();
}
