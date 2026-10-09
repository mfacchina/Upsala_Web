// Calculadora del primer pedido. Precios y regla de la promo en un solo lugar.
//
// Promo de bienvenida: 50% en UN solo bidon del primer pedido. Si el pedido tiene
// bidones de 20 L, el descuento va sobre uno de 20 L; si solo tiene de 12 L, sobre uno de 12 L.
import { PRODUCTS } from "./content";
import { ars } from "./site";

export const MAX_PER_PRODUCT = 4;

export type Quantities = { b20: number; b12: number };

export const PRICE = {
  b20: PRODUCTS.items.find((p) => p.key === "b20")!.price,
  b12: PRODUCTS.items.find((p) => p.key === "b12")!.price,
};

export type OrderSummary = {
  lines: { label: string; qty: number; unit: number; subtotal: number }[];
  subtotal: number;
  discount: number;
  discountLabel: string | null;
  total: number;
  /** Lo que sale cada pedido siguiente con las mismas cantidades (sin promo). */
  nextTotal: number;
  units: number;
  /** "2 × Bidón 20 L, 1 × Bidón 12 L" */
  text: string;
};

export function computeOrder(q: Quantities): OrderSummary {
  const lines = [
    { label: "Bidón 20 L", qty: q.b20, unit: PRICE.b20, subtotal: q.b20 * PRICE.b20 },
    { label: "Bidón 12 L", qty: q.b12, unit: PRICE.b12, subtotal: q.b12 * PRICE.b12 },
  ].filter((l) => l.qty > 0);
  const subtotal = lines.reduce((s, l) => s + l.subtotal, 0);
  const discountOn = q.b20 > 0 ? "b20" : q.b12 > 0 ? "b12" : null;
  const discount = discountOn ? PRICE[discountOn] / 2 : 0;
  return {
    lines,
    subtotal,
    discount,
    discountLabel: discountOn ? `50% en 1 bidón de ${discountOn === "b20" ? "20" : "12"} L` : null,
    total: subtotal - discount,
    nextTotal: subtotal,
    units: q.b20 + q.b12,
    text: lines.map((l) => `${l.qty} × ${l.label}`).join(", "),
  };
}

export { ars };
