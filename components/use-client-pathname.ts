"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

// The current path for highlighting the active nav item, read only after the
// page mounts. Engine Bay pages are built under /engine-bay but served at the
// root of enginebaysupply.com (proxy.ts), so the path on the server and in the
// browser differ. Reading it after mount avoids a hydration mismatch; the
// highlight just appears a moment after load.
export function useClientPathname(): string | null {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return mounted ? pathname : null;
}
