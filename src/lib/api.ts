// Cliente de la API publica de la app de gestion (app-upsala):
//   GET  {API_URL}/api/public/registro -> { zones: string[], products: string[] }
//   POST {API_URL}/api/public/registro -> { ok, id, covered } | { error, field }
import { API_URL } from "./site";

const ENDPOINT = `${API_URL}/api/public/registro`;

export type FormOptions = { zones: string[]; products: string[] };

export type RegistrationPayload = {
  kind: "CLIENT" | "RESELLER";
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  propertyType?: "HOUSE" | "APARTMENT";
  floor?: string;
  apartment?: string;
  neighborhood?: string;
  locality?: string;
  covered?: boolean | null;
  requestedProduct?: string;
  visitTimePreference?: "MORNING" | "AFTERNOON" | "INDIFFERENT";
  message?: string;
  source?: string;
  website?: string;
};

export type RegistrationResult = { ok: true; id?: string; covered: boolean | null };

export class ApiError extends Error {
  field: string | null;
  constructor(message: string, field: string | null = null) {
    super(message);
    this.field = field;
  }
}

let optionsCache: Promise<FormOptions> | null = null;

/** Zonas con cobertura y productos. Si la API no responde, devuelve listas vacias. */
export function fetchFormOptions(): Promise<FormOptions> {
  if (!optionsCache) {
    optionsCache = fetch(ENDPOINT, { headers: { Accept: "application/json" } })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        const data = (await r.json()) as Partial<FormOptions>;
        return { zones: data.zones ?? [], products: data.products ?? [] };
      })
      .catch(() => {
        optionsCache = null;
        return { zones: [], products: [] };
      });
  }
  return optionsCache;
}

export async function submitRegistration(payload: RegistrationPayload): Promise<RegistrationResult> {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError("No pudimos conectar con el sistema. Probá de nuevo o escribinos por WhatsApp.");
  }
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; field?: string | null; covered?: boolean | null; id?: string };
  if (!res.ok || !data.ok) {
    throw new ApiError(data.error ?? "No pudimos guardar tu registro. Escribinos por WhatsApp.", data.field ?? null);
  }
  return { ok: true, id: data.id, covered: data.covered ?? null };
}

/** Normaliza para comparar barrios: minusculas, sin acentos ni signos. */
export function normalizeName(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Busca el barrio elegido entre las zonas con cobertura. */
export function matchZone(zones: string[], name: string): string | null {
  const n = normalizeName(name);
  if (!n) return null;
  return zones.find((z) => normalizeName(z) === n) ?? null;
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];
const SOURCE_KEY = "upsala:source";

/** Guarda con que campania llego la persona (UTM / fbclid) para mandarlo con el registro. */
export function rememberSource() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const parts = UTM_KEYS.filter((k) => params.get(k)).map((k) => `${k}=${params.get(k)!.slice(0, 80)}`);
    if (parts.length) sessionStorage.setItem(SOURCE_KEY, parts.join("&"));
    else if (!sessionStorage.getItem(SOURCE_KEY) && document.referrer) {
      sessionStorage.setItem(SOURCE_KEY, `ref=${new URL(document.referrer).hostname}`.slice(0, 120));
    }
  } catch {
    /* sessionStorage puede no estar disponible */
  }
}

export function getSource(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = sessionStorage.getItem(SOURCE_KEY) ?? "";
    const page = window.location.pathname;
    return [stored, `page=${page}`].filter(Boolean).join("&").slice(0, 300);
  } catch {
    return undefined;
  }
}

/** Evento de conversion para el pixel de Meta, si esta cargado. */
export function trackLead(kind: RegistrationPayload["kind"]) {
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  try {
    w.fbq?.("track", "Lead", { content_name: kind === "RESELLER" ? "revendedor" : "cliente" });
  } catch {
    /* sin pixel */
  }
}
