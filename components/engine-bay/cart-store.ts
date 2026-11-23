"use client";

import { useSyncExternalStore } from "react";

// The shop cart, kept in this browser only. It holds part numbers and
// quantities, never prices: the server prices everything from Stripe.
export type CartLine = { sku: string; size?: string; quantity: number };

// One line per part number and size (matches cartLineKey in lib/shop.ts).
export const lineKey = (line: { sku: string; size?: string }) => (line.size ? `${line.sku}|${line.size}` : line.sku);

const KEY = "eb-cart-v1";
const EVENT = "eb-cart";
const MAX_QUANTITY = 50;
const EMPTY: CartLine[] = [];
let cachedRaw: string | null = null;
let cachedLines: CartLine[] = EMPTY;

function read(): CartLine[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedLines;
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    cachedLines = Array.isArray(parsed)
      ? parsed
          .filter((l): l is CartLine => typeof l?.sku === "string" && Number.isInteger(l?.quantity) && l.quantity > 0)
          .map((l) => ({ sku: l.sku, ...(typeof l.size === "string" && l.size ? { size: l.size } : {}), quantity: Math.min(MAX_QUANTITY, l.quantity) }))
      : EMPTY;
  } catch {
    cachedLines = EMPTY;
  }
  return cachedLines;
}

function write(lines: CartLine[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Private mode or storage full: the cart just won't persist.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => event.key === KEY && onChange();
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

// Empty on the server and during hydration, then the saved cart.
export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function addToCart(sku: string, quantity: number, size?: string) {
  const lines = read();
  const key = lineKey({ sku, size });
  const existing = lines.find((l) => lineKey(l) === key);
  write(
    existing
      ? lines.map((l) => (lineKey(l) === key ? { ...l, quantity: Math.min(MAX_QUANTITY, l.quantity + quantity) } : l))
      : [...lines, { sku, ...(size ? { size } : {}), quantity: Math.min(MAX_QUANTITY, quantity) }],
  );
}

export function setQuantity(key: string, quantity: number) {
  const lines = read();
  write(quantity <= 0 ? lines.filter((l) => lineKey(l) !== key) : lines.map((l) => (lineKey(l) === key ? { ...l, quantity: Math.min(MAX_QUANTITY, quantity) } : l)));
}

export function removeFromCart(keys: string[]) {
  write(read().filter((l) => !keys.includes(lineKey(l))));
}

export function clearCart() {
  write([]);
}

export const cartMaxQuantity = MAX_QUANTITY;
