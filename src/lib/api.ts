// Cliente de la API publica de la app de gestion (app-upsala):
//   GET  {API_URL}/api/public/registro -> { barrios: {name, covered}[], zones: string[], products: string[] }
//   POST {API_URL}/api/public/registro -> { ok, id, covered } | { error, field }
import { API_URL } from "./site";
import { CABA_BARRIOS } from "./barrios";

const ENDPOINT = `${API_URL}/api/public/registro`;

export type Barrio = { name: string; covered: boolean | null; day?: string | null };

export type FormOptions = {
  /** Barrios de CABA con su cobertura. */
  barrios: Barrio[];
  /** Otras localidades/zonas con cobertura (conurbano, etc.). */
  zones: string[];
  products: string[];
  /** false = la API no respondio y la cobertura no se pudo verificar. */
  live: boolean;
};

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
  /** CUIL/CUIT. La app lo guarda cuando su API lo acepte; mientras, va tambien en `message`. */
  cuit?: string;
  website?: string;
};

export type RegistrationResult = { ok: true; id?: string; covered: boolean | null; day: string | null };

export class ApiError extends Error {
  field: string | null;
  /** HTTP status. 0 = no hubo conexion. 400/429 = datos o intentos (hay que corregir); 0 o 5xx = falla del sistema. */
  status: number;
  constructor(message: string, field: string | null = null, status = 0) {
    super(message);
    this.field = field;
    this.status = status;
  }
  /** La app no pudo recibir el registro por un problema propio (no por los datos de la persona). */
  get isSystemFailure() {
    return this.status === 0 || this.status >= 500;
  }
}

const FALLBACK: FormOptions = {
  barrios: CABA_BARRIOS.map((name) => ({ name, covered: null })),
  zones: [],
  products: [],
  live: false,
};

let optionsCache: Promise<FormOptions> | null = null;

/** Barrios/zonas con cobertura y productos. Si la API no responde, los barrios sin cobertura conocida. */
export function fetchFormOptions(): Promise<FormOptions> {
  if (!optionsCache) {
    optionsCache = fetch(ENDPOINT, { headers: { Accept: "application/json" } })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        const data = (await r.json()) as Partial<FormOptions>;
        const barrios = (data.barrios ?? []).filter((b) => b && typeof b.name === "string");
        return {
          barrios: barrios.length ? barrios : FALLBACK.barrios,
          zones: data.zones ?? [],
          products: data.products ?? [],
          live: barrios.length > 0,
        };
      })
      .catch(() => {
        optionsCache = null;
        return FALLBACK;
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
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; field?: string | null; covered?: boolean | null; day?: string | null; id?: string };
  if (!res.ok || !data.ok) {
    throw new ApiError(data.error ?? "No pudimos guardar tu registro. Escribinos por WhatsApp.", data.field ?? null, res.status);
  }
  return { ok: true, id: data.id, covered: data.covered ?? null, day: data.day ?? null };
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

/**
 * Cobertura de un barrio/localidad escrito a mano: covered true/false si la API respondio,
 * null si no se puede saber.  es el dia de reparto de la zona, si se conoce.
 */
export function coverageFor(options: FormOptions, name: string): { covered: boolean | null; day: string | null } {
  const n = normalizeName(name);
  if (!n) return { covered: null, day: null };
  const barrio = options.barrios.find((b) => normalizeName(b.name) === n);
  if (barrio) return { covered: barrio.covered, day: barrio.day ?? null };
  if (options.zones.some((z) => normalizeName(z) === n)) return { covered: true, day: null };
  return { covered: options.live ? false : null, day: null };
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

function fbq(...args: unknown[]) {
  const w = window as unknown as { fbq?: (...a: unknown[]) => void };
  try {
    w.fbq?.(...args);
  } catch {
    /* sin pixel */
  }
}

/**
 * Evento Lead del pixel de Meta: un formulario se guardo en la app.
 * `content_name` distingue de que formulario vino (cliente, dispenser_casa, dispenser_empresa, revendedor),
 * para armar audiencias y conversiones personalizadas en Meta.
 */
export function trackLead(kind: RegistrationPayload["kind"], contentName?: string) {
  fbq("track", "Lead", { content_name: contentName ?? (kind === "RESELLER" ? "revendedor" : "cliente") });
}

/** Evento Contact del pixel: click a un link de WhatsApp. */
export function trackContact(context: string) {
  fbq("track", "Contact", { content_name: context });
}
