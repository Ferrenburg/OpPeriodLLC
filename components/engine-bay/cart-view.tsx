"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { buttonClass } from "@/components/button";
import { formatMoney } from "@/lib/shop-core";
import type { PricedCart } from "@/lib/shop";
import { cartMaxQuantity, removeFromCart, setQuantity, useCart } from "./cart-store";

const noop = () => () => {};

type State =
  | { status: "loading" }
  | { status: "ready"; cart: PricedCart }
  | { status: "error"; message: string };

// The cart page. The browser holds part numbers and quantities; the server
// prices them from Stripe every time the cart changes.
export function CartView({ shopHref, quoteHref, phone }: { shopHref: string; quoteHref: string; phone: string }) {
  const lines = useCart();
  const [state, setState] = useState<State>({ status: "loading" });
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [removed, setRemoved] = useState<string[]>([]);
  const [checkout, setCheckout] = useState<{ busy: boolean; error?: string }>({ busy: false });
  const key = JSON.stringify(lines);

  useEffect(() => {
    if (!hydrated) return;
    const controller = new AbortController();
    fetch("/api/shop/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines: JSON.parse(key) }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = (await response.json()) as { ok: boolean; cart?: PricedCart; error?: string };
        if (!data.ok || !data.cart) throw new Error(data.error ?? "The cart didn't load.");
        if (data.cart.unavailable.length > 0) {
          setRemoved((old) => [...new Set([...old, ...data.cart!.unavailable])]);
          removeFromCart(data.cart.unavailable);
        }
        setState({ status: "ready", cart: data.cart });
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setState({ status: "error", message: error.message });
      });
    return () => controller.abort();
  }, [key, hydrated]);

  async function startCheckout() {
    setCheckout({ busy: true });
    try {
      const response = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = (await response.json()) as { ok: boolean; url?: string; error?: string };
      if (!data.ok || !data.url) throw new Error(data.error ?? "Checkout didn't start.");
      window.location.assign(data.url);
    } catch (error) {
      setCheckout({ busy: false, error: (error as Error).message });
    }
  }

  if (!hydrated || state.status === "loading") {
    return <p className="py-10 text-lg text-muted">Loading your cart...</p>;
  }
  if (state.status === "error") {
    return (
      <p role="alert" className="py-10 text-lg">
        {state.message} Try again, or call {phone}.
      </p>
    );
  }

  const { cart } = state;
  const notice = removed.length > 0 && (
    <p role="status" className="card mb-6 border-l-4 border-l-accent-fill p-4">
      We took out {removed.length === 1 ? "an item" : `${removed.length} items`} that {removed.length === 1 ? "isn't" : "aren't"} sold online anymore ({removed.map((key) => key.replace("|", ", size ")).join("; ")}).{" "}
      <Link href={quoteHref} className="font-semibold text-accent underline underline-offset-4">
        Request a quote
      </Link>{" "}
      instead.
    </p>
  );

  if (cart.lines.length === 0) {
    return (
      <div className="py-6">
        {notice}
        <p className="text-lg">Your cart is empty.</p>
        <Link href={shopHref} className={buttonClass("primary", "mt-6")}>
          Shop online
        </Link>
      </div>
    );
  }

  const vendors = [...new Set(cart.lines.map((l) => l.vendor))];
  return (
    <div className="grid gap-10 py-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        {notice}
        {vendors.map((vendor) => (
          <section key={vendor} aria-label={`Ships from ${vendor}`} className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Ships from {vendor}</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {cart.lines
                .filter((line) => line.vendor === vendor)
                .map((line) => (
                  <li key={line.key} className="flex gap-4 py-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-line bg-card">
                      {line.image && <Image src={line.image} alt="" fill sizes="5rem" className="object-contain p-1" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{line.brand}</p>
                      <Link href={line.href} className="font-semibold leading-snug hover:text-accent">
                        {line.name}
                      </Link>
                      <p className="text-sm text-muted">
                        {line.option ? `${line.option} · ` : ""}{line.size ? `Size ${line.size} · ` : ""}Part # {line.sku}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <label className="text-sm">
                          <span className="sr-only">Quantity for {line.sku}</span>
                          <input
                            type="number"
                            min={1}
                            max={cartMaxQuantity}
                            defaultValue={line.quantity}
                            onBlur={(e) => setQuantity(line.key, Math.max(1, Math.min(cartMaxQuantity, Number(e.target.value) || 1)))}
                            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                            className="min-h-10 w-16 rounded-lg border border-line-2 bg-card px-2 text-center"
                          />
                        </label>
                        <span className="text-sm text-muted">x {formatMoney(line.unitAmount)}</span>
                        <button type="button" onClick={() => removeFromCart([line.key])} className="text-sm font-semibold text-accent underline underline-offset-4">
                          Remove<span className="sr-only"> {line.sku}</span>
                        </button>
                      </div>
                    </div>
                    <p className="shrink-0 font-semibold">{formatMoney(line.lineTotal)}</p>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      <aside className="card h-fit p-6" aria-label="Order summary">
        <h2 className="font-display text-2xl font-bold uppercase">Order summary</h2>
        <dl className="mt-4 space-y-2">
          <div className="flex justify-between">
            <dt>Items</dt>
            <dd className="font-semibold">{formatMoney(cart.subtotal)}</dd>
          </div>
          {cart.shipping ? (
            cart.shipping.byVendor.map((v) => (
              <div key={v.vendor} className="flex justify-between text-sm">
                <dt className="text-muted">Shipping from {v.vendor}</dt>
                <dd>{formatMoney(v.amount)}</dd>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted">Shipping isn&apos;t set up yet.</div>
          )}
          <div className="flex justify-between text-sm">
            <dt className="text-muted">Tax</dt>
            <dd className="text-muted">At checkout</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-lg">
            <dt className="font-semibold">Before tax</dt>
            <dd className="font-semibold">{formatMoney(cart.subtotal + (cart.shipping?.total ?? 0))}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={startCheckout}
          disabled={checkout.busy || !cart.shipping}
          className={buttonClass("primary", "mt-6 w-full disabled:opacity-60")}
        >
          {checkout.busy ? "Starting checkout..." : "Check out"}
        </button>
        {checkout.error && (
          <p role="alert" className="mt-3 text-sm">
            {checkout.error}
          </p>
        )}
        <p className="mt-4 text-sm text-muted">
          Each brand ships direct from its manufacturer, so items can arrive in separate boxes. You&apos;ll enter the shipping
          address, and a department name and PO number if you have them, on the secure checkout page.
        </p>
      </aside>
    </div>
  );
}
