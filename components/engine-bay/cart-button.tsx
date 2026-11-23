"use client";

import Link from "next/link";
import { useCart } from "./cart-store";

// Header cart link with an item count. The count appears after the page
// loads, since the cart lives in this browser.
export function CartButton({ href }: { href: string }) {
  const count = useCart().reduce((sum, line) => sum + line.quantity, 0);
  return (
    <Link
      href={href}
      aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
      className="relative inline-flex size-11 items-center justify-center rounded-lg border border-line-2 hover:border-accent-fill hover:text-accent"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="1.3" />
        <circle cx="17" cy="20" r="1.3" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-accent-fill px-1.5 text-center text-xs font-semibold leading-5 text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
