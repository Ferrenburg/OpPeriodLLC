"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/shop-core";
import { AddToCart } from "./add-to-cart";

export type HoseBuildOption = { sku: string; unitAmount: number; diameter: string; lengthFt: number; color: string; coupling: string };
type Field = "diameter" | "lengthFt" | "color" | "coupling";

const fields: { key: Field; label: string; format: (value: string | number) => string }[] = [
  { key: "diameter", label: "Size", format: (v) => String(v) },
  { key: "lengthFt", label: "Length", format: (v) => `${v} ft` },
  { key: "color", label: "Color", format: (v) => String(v) },
  { key: "coupling", label: "Couplings", format: (v) => String(v) },
];

// Pick size, then length, color, and couplings. Each list only offers what
// Stripe actually sells for the choices above it, so every pick ends on a real
// part number and price.
export function HosePicker({ builds, cartHref, quoteBase }: { builds: HoseBuildOption[]; cartHref: string; quoteBase: string }) {
  const [picked, setPicked] = useState<Partial<Record<Field, string>>>({});

  const choices = useMemo(() => {
    const out: Record<Field, string[]> = { diameter: [], lengthFt: [], color: [], coupling: [] };
    let pool = builds;
    for (const { key } of fields) {
      out[key] = [...new Set(pool.map((b) => String(b[key])))];
      const value = picked[key];
      if (value && out[key].includes(value)) pool = pool.filter((b) => String(b[key]) === value);
      else break;
    }
    return out;
  }, [builds, picked]);

  const match = builds.find((b) => fields.every(({ key }) => picked[key] === String(b[key])));
  const label = fields
    .filter(({ key }) => picked[key])
    .map(({ key, format }) => format(key === "lengthFt" ? Number(picked[key]) : picked[key]!))
    .join(", ");

  function choose(index: number, value: string) {
    const next: Partial<Record<Field, string>> = {};
    fields.forEach(({ key }, i) => {
      if (i < index) next[key] = picked[key];
    });
    if (value) next[fields[index].key] = value;
    setPicked(next);
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(({ key, label: fieldLabel, format }, i) => {
          const disabled = i > 0 && !picked[fields[i - 1].key];
          return (
            <label key={key} className="text-sm font-semibold">
              {fieldLabel}
              <select
                value={picked[key] ?? ""}
                disabled={disabled}
                onChange={(e) => choose(i, e.target.value)}
                className="mt-1 block min-h-12 w-full rounded-lg border border-line-2 bg-card px-3 font-normal disabled:opacity-50"
              >
                <option value="">{disabled ? "Pick the one above first" : `Choose ${fieldLabel.toLowerCase()}`}</option>
                {(disabled ? [] : choices[key]).map((value) => (
                  <option key={value} value={value}>
                    {format(key === "lengthFt" ? Number(value) : value)}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
      <div className="mt-5" aria-live="polite">
        {match ? (
          <>
            <p className="text-sm text-muted">
              Part number <span className="font-semibold text-fg">{match.sku}</span>
            </p>
            <p className="mt-1 font-display text-4xl font-bold">{formatMoney(match.unitAmount)}</p>
            <div className="mt-4">
              <AddToCart sku={match.sku} cartHref={cartHref} />
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">
            Pick all four to see the price.{" "}
            <Link href={`${quoteBase}${encodeURIComponent(label ? ` (${label})` : "")}`} className="font-semibold text-accent underline underline-offset-4">
              Need a build that isn&apos;t listed? Get a quote.
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
