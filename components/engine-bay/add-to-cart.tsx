"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { buttonClass } from "@/components/button";
import { addToCart, cartMaxQuantity } from "./cart-store";

// Quantity box and Add to Cart for one part number. "compact" is the small
// version for a row in the sizes table.
export function AddToCart({
  sku,
  cartHref,
  label,
  compact = false,
  sizes = [],
}: {
  sku: string;
  cartHref: string;
  label?: string;
  compact?: boolean;
  // When set, the buyer must pick one (gloves). Never used with compact.
  sizes?: string[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(0);
  const [size, setSize] = useState("");
  const [needSize, setNeedSize] = useState(false);
  const id = useId();

  function add() {
    if (sizes.length > 0 && !size) {
      setNeedSize(true);
      return;
    }
    addToCart(sku, quantity, size || undefined);
    setAdded((n) => n + quantity);
  }

  return (
    <div className={compact ? "relative flex items-center justify-end gap-2" : ""}>
      {sizes.length > 0 && (
        <label className="mb-3 block text-sm font-semibold">
          Size
          <select
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
              setNeedSize(false);
            }}
            aria-invalid={needSize || undefined}
            className={`mt-1 block min-h-12 w-full max-w-xs rounded-lg border bg-card px-3 font-normal ${needSize ? "border-accent-fill" : "border-line-2"}`}
          >
            <option value="">Choose a size</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {needSize && <span className="mt-1 block font-normal text-accent">Pick a size first.</span>}
        </label>
      )}
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
            {added} added{size ? ` in ${size.split(" (")[0]}` : ""}.{" "}
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
