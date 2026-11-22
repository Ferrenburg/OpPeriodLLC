import { Todo } from "@/components/todo";
import { shippingRates } from "@/lib/shop";
import { formatMoney, type ShipClass } from "@/lib/shop-core";

const labels: Record<ShipClass, string> = {
  standard: "Most tools and parts",
  long: "Long items over 48 in. (hooks, pike poles, bars)",
  hose: "Attack, booster, and forestry hose, per length",
  ldh: "Supply hose (LDH), 4 in. and up, per length",
  saw: "Saws, batteries, and chargers",
};

// The flat shipping rates (shopShippingRates, or SHOP_SHIPPING_RATES to override). Each brand ships its own
// box, so each brand's items are charged on their own.
export function ShippingTable() {
  const rates = shippingRates();
  if (!rates) return <Todo>Shipping rates: first item and each additional, for each kind of item (shopShippingRates in lib/engine-bay.ts).</Todo>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[22rem] border-collapse text-left">
        <thead>
          <tr className="bg-eb-ink text-sm uppercase tracking-wider text-white">
            <th scope="col" className="px-3 py-2 font-semibold">Item</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">First item</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">Each additional</th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(labels) as ShipClass[]).map((key) => (
            <tr key={key} className="border-b border-line">
              <th scope="row" className="px-3 py-3 font-normal">{labels[key]}</th>
              <td className="px-3 py-3 text-right font-semibold">{formatMoney(rates[key].first)}</td>
              <td className="px-3 py-3 text-right font-semibold">{formatMoney(rates[key].additional)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
