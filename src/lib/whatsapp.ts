// Mensajes de WhatsApp armados con los datos del formulario, para que la persona solo
// tenga que tocar "Enviar" y administracion tenga todo para cerrar el pedido.
import { WHATSAPP_ORDERS, waUrl } from "./site";

type Line = [label: string, value: string | null | undefined | false];

/** Arma "intro + *Campo:* valor" salteando lo vacio. WhatsApp muestra *texto* en negrita. */
export function buildMessage(intro: string, lines: Line[], outro?: string) {
  const body = lines
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `*${k}:* ${String(v).trim()}`)
    .join("\n");
  return [intro, body, outro].filter(Boolean).join("\n\n");
}

/** Link al chat de pedidos (administracion) con el mensaje armado. */
export function orderWhatsAppUrl(message: string) {
  return waUrl(message, WHATSAPP_ORDERS);
}

export const VISIT_LABEL: Record<string, string> = {
  MORNING: "Mañana",
  AFTERNOON: "Tarde",
  INDIFFERENT: "Indistinto",
};
