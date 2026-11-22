"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { buttonClass } from "@/components/button";
import { addToCart, cartMaxQuantity } from "./cart-store";

// Quantity box and Add to Cart for one part number. "compact" is the small
// version for a row in the sizes table.
export function AddToCart({ sku, cartHref, label, compact = false }: { sku: string; cartHref: string; label?: string; compact?: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(0);
  const id = useId();

  function add() {
    addToCart(sku, quantity);
    setAdded((n) => n + quantity);
  }

  return (
    <div className={compact ? "flex items-center justify-end gap-2" : ""}>
      <div className="flex items-center gap-2">
        <label htmlFor={id} className={compact ? "sr-only" : "text-sm font-semibold"}>
          Qty{compact ? ` for ${sku}` : ""}
        </label>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          max={cartMaxQuantity}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(cartMaxQuantity, Number(e.target.value) || 1)))}
          className={`${compact ? "w-14 min-h-10" : "w-20 min-h-12"} rounded-lg border border-line-2 bg-card px-2 text-center focus:border-accent-fill focus:outline-none`}
        />
        <button
          type="button"
          onClick={add}
          className={compact ? "min-h-10 rounded-lg bg-accent-fill px-3 text-sm font-semibold text-white hover:bg-accent-fill-hover" : buttonClass("primary")}
        >
          {compact ? "Add" : (label ?? "Add to cart")}
          {compact && <span className="sr-only"> {sku} to cart</span>}
        </button>
      </div>
      <p aria-live="polite" className={`${compact ? "sr-only" : "mt-2 min-h-6 text-sm"}`}>
        {added > 0 && (
          <>
            {added} added.{" "}
            {!compact && (
              <Link href={cartHref} className="font-semibold text-accent underline underline-offset-4">
                View cart
              </Link>
            )}
          </>
        )}
      </p>
    </div>
  );
}
