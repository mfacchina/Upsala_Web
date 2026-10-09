// Datos de contacto, URLs y configuracion publica. Un solo lugar para cambiarlos.

export const SITE_URL = "https://upsala.com.ar/";

/**
 * WhatsApp de VENTAS (lo atiende un bot): botones generales del sitio y confirmacion de
 * pedidos. El bot responde "pedido recibido", el dia de visita, el numero de gestion y el
 * alias para transferencias.
 */
export const WHATSAPP_NUMBER = "5491134495488";
/** WhatsApp de GESTION / administracion (lo informa el bot; en el sitio solo se muestra). */
export const WHATSAPP_ADMIN = "5491170658458";
/** A donde va "Confirmar pedido por WhatsApp" al enviar un formulario: ventas (el bot). */
export const WHATSAPP_ORDERS = WHATSAPP_NUMBER;

/** Horario de reparto. */
export const DELIVERY_HOURS = "de 9 a 17 hs";

export const WHATSAPP_MESSAGE = "Hola Upsala! Quiero agua mineral natural a domicilio.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
export const WHATSAPP_RESELLER_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola Upsala! Quiero sumarme como revendedor.",
)}`;

/** Link de WhatsApp con un mensaje armado (por defecto a ventas). */
export function waUrl(text: string, number: string = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** "5491134495488" -> "11 3449-5488", para mostrar el numero que de verdad abre el link. */
export function phoneDisplay(number: string) {
  const local = number.replace(/^549/, "");
  return `${local.slice(0, 2)} ${local.slice(2, 6)}-${local.slice(6)}`;
}

/** Formatea pesos argentinos: 9700 -> "$ 9.700", con espacio que no corta (el monto nunca se parte en dos renglones). */
export function ars(n: number) {
  return `$\u00a0${n.toLocaleString("es-AR")}`;
}

export const CONTACT = {
  email: "ventas@upsala.com.ar",
  businessEmail: "administracion@upsala.com.ar",
  // Siempre el mismo numero que abren los botones de WhatsApp (antes decia 7065-8458 y abria 3449-5488).
  phoneDisplay: phoneDisplay(WHATSAPP_NUMBER),
  adminPhoneDisplay: phoneDisplay(WHATSAPP_ADMIN),
  instagram: "https://www.instagram.com/upsala.ba/",
  instagramHandle: "@upsala.ba",
  plant: "Villa Fournier, 9 de Julio (CP 6500), Provincia de Buenos Aires",
  sales: "Mosconi 3777, C1419, Ciudad Autónoma de Buenos Aires",
};

/**
 * API de la app de gestion (Aquacontrol / app-upsala). Ahi caen los registros y de ahi
 * salen las zonas con cobertura. Se puede cambiar con NEXT_PUBLIC_API_URL en build.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://upsala.aquacontrol.aginet.com.ar").replace(/\/$/, "");

/**
 * Pixel de Meta (Facebook/Instagram Ads). Pegar aca el ID del pixel (Administrador de
 * eventos > Origenes de datos) o pasarlo en build con NEXT_PUBLIC_META_PIXEL_ID.
 * Vacio = sin pixel.
 */
// "Upsala CAPI" (negocio Upsala BA), confirmado por Matias el 09/10/2026. El mismo conjunto de
// datos recibe los eventos del sitio (PageView, Lead, Contact) y los "Comprar" de la API de conversiones.
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "2272461290182516";

/**
 * Codigo de verificacion del dominio en Meta Business (Configuracion del negocio >
 * Seguridad de la marca > Dominios > "Etiqueta meta"). Solo el valor de content="...".
 * Alternativa: cargarlo como registro TXT en el Editor de zona del cPanel.
 */
export const META_DOMAIN_VERIFICATION = process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION ?? "";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefija una ruta de /public con el basePath del sitio (hoy vacio). */
export function asset(path: string) {
  return `${BASE_PATH}${path}`;
}
