import { cartSchema, priceCart, shopEnabled } from "@/lib/shop";

// Prices a cart from the browser. The browser only knows part numbers and
// quantities; every price comes from Stripe here.
export async function POST(request: Request) {
  if (!shopEnabled()) return Response.json({ ok: false, error: "The online shop isn't open." }, { status: 404 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "That request didn't look right." }, { status: 400 });
  }
  const parsed = cartSchema.safeParse((body as { lines?: unknown })?.lines);
  if (!parsed.success) return Response.json({ ok: false, error: "That cart didn't look right." }, { status: 400 });
  return Response.json({ ok: true, cart: await priceCart(parsed.data) });
}
