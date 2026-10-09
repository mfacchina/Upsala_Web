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
  MORNING: "Mañana (9 a 13 hs)",
  AFTERNOON: "Tarde (13 a 17 hs)",
  INDIFFERENT: "Indistinto (9 a 17 hs)",
};

/**
 * Abre WhatsApp en la misma pestaña. Se usa despues de guardar el formulario: abrir una
 * ventana nueva despues de un `await` la bloquean los navegadores (sobre todo en iPhone),
 * navegar en la misma pestaña no. En el celular abre directo la app de WhatsApp.
 */
export function goToWhatsApp(url: string, delayMs = 700) {
  // La demora deja salir los eventos del pixel antes de cambiar de pagina.
  window.setTimeout(() => window.location.assign(url), delayMs);
}
