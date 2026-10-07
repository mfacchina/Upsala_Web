// Datos de contacto, URLs y configuracion publica. Un solo lugar para cambiarlos.

export const SITE_URL = "https://upsala.com.ar/";

/** Ventas y pedidos (el numero que atiende a clientes nuevos). */
export const WHATSAPP_NUMBER = "5491134495488";
/** Central / administracion. */
export const WHATSAPP_CENTRAL = "5491170658458";

export const WHATSAPP_MESSAGE = "Hola Upsala! Quiero agua mineral natural a domicilio.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
export const WHATSAPP_RESELLER_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola Upsala! Quiero sumarme como revendedor.",
)}`;

/** Link de WhatsApp a ventas con un mensaje armado. */
export function waUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Formatea pesos argentinos: 9700 -> "$ 9.700". */
export function ars(n: number) {
  return `$ ${n.toLocaleString("es-AR")}`;
}

export const CONTACT = {
  email: "ventas@upsala.com.ar",
  businessEmail: "administracion@upsala.com.ar",
  phoneDisplay: "11 7065-8458",
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

/** Pixel de Meta para medir las campanias (opcional). NEXT_PUBLIC_META_PIXEL_ID en build. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefija una ruta de /public con el basePath del sitio (hoy vacio). */
export function asset(path: string) {
  return `${BASE_PATH}${path}`;
}
