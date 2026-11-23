"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/shop-core";
import { AddToCart } from "./add-to-cart";

// For a product sold in styles that each have a part number and price, and
// also in sizes (Holik Vespid Evo or Neo, in XXS to 4XL): pick the style,
// then the size, then add.
export function OptionPicker({
  options,
  sizes,
  cartHref,
}: {
  options: { sku: string; label: string; unitAmount: number }[];
  sizes: string[];
  cartHref: string;
}) {
  const [sku, setSku] = useState(options[0].sku);
  const chosen = options.find((o) => o.sku === sku) ?? options[0];
  return (
    <div>
      <fieldset>
        <legend className="text-sm font-semibold">Style</legend>
        <div className="mt-2 grid gap-2">
          {options.map((option) => (
            <label
              key={option.sku}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 ${option.sku === sku ? "border-accent-fill bg-card" : "border-line-2"}`}
            >
              <span className="flex items-center gap-3">
                <input type="radio" name="style" value={option.sku} checked={option.sku === sku} onChange={() => setSku(option.sku)} />
                <span>
                  {option.label}
                  <span className="block text-xs text-muted">Part # {option.sku}</span>
                </span>
              </span>
              <span className="font-semibold">{formatMoney(option.unitAmount)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-4 font-display text-4xl font-bold">{formatMoney(chosen.unitAmount)}</p>
      <div className="mt-4">
        <AddToCart key={chosen.sku} sku={chosen.sku} sizes={sizes} cartHref={cartHref} />
      </div>
    </div>
  );
}
