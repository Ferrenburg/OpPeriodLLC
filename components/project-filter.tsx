"use client";

import { useState } from "react";

type Item = { slug: string; category: string; card: React.ReactNode };

// Category chips for /projects. They only appear once there are two or more
// categories. Without JavaScript every project still shows.
export function ProjectFilter({ items }: { items: Item[] }) {
  const categories = [...new Set(items.map((item) => item.category))].sort();
  const [selected, setSelected] = useState<string | null>(null);
  const visible = selected ? items.filter((item) => item.category === selected) : items;

  const chip = (label: string, value: string | null) => (
    <button
      key={label}
      type="button"
      aria-pressed={selected === value}
      onClick={() => setSelected(value)}
      className="min-h-11 rounded-sm border-2 border-line px-4 font-semibold hover:border-fg aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg"
    >
      {label}
    </button>
  );

  return (
    <>
      {categories.length >= 2 && (
        <div role="group" aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
          {chip("All", null)}
          {categories.map((category) => chip(category, category))}
        </div>
      )}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.slug}>{item.card}</li>
        ))}
      </ul>
    </>
  );
}
