"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WhatsAppIcon } from "./ui";
import { REGISTER } from "@/lib/content";
import { WHATSAPP_URL } from "@/lib/site";
import { ApiError, coverageFor, fetchFormOptions, getSource, submitRegistration, trackLead, type FormOptions, type RegistrationPayload } from "@/lib/api";

const OTHER = "__otro__";

type Form = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  zone: string; // valor del select: un barrio/localidad, OTHER o ""
  otherZone: string;
  address: string;
  propertyType: "HOUSE" | "APARTMENT";
  floor: string;
  apartment: string;
  product: string;
  visit: "MORNING" | "AFTERNOON" | "INDIFFERENT";
  message: string;
  website: string; // honeypot
};

const EMPTY: Form = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  zone: "",
  otherZone: "",
  address: "",
  propertyType: "HOUSE",
  floor: "",
  apartment: "",
  product: "",
  visit: "INDIFFERENT",
  message: "",
  website: "",
};

type Coverage = "idle" | "covered" | "not-covered" | "unknown";

export function RegisterForm({ compact = false }: { compact?: boolean }) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [options, setOptions] = useState<FormOptions | null>(null); // null = cargando
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<{ message: string; field: string | null } | null>(null);
  const [done, setDone] = useState<{ covered: boolean | null; day: string | null } | null>(null);

  useEffect(() => {
    let alive = true;
    fetchFormOptions().then((o) => alive && setOptions(o));
    return () => {
      alive = false;
    };
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const neighborhood = form.zone === OTHER ? form.otherZone.trim() : form.zone;
  const { coverage, day } = useMemo((): { coverage: Coverage; day: string | null } => {
    if (!neighborhood || !options) return { coverage: "idle", day: null };
    const c = coverageFor(options, neighborhood);
    return { coverage: c.covered === true ? "covered" : c.covered === false ? "not-covered" : "unknown", day: c.day };
  }, [neighborhood, options]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError({ message: "Completá nombre, apellido, teléfono y dirección.", field: null });
      return;
    }
    if (!neighborhood) {
      setError({ message: "Elegí tu barrio para saber si tenemos cobertura.", field: "zone" });
      return;
    }
    const payload: RegistrationPayload = {
      kind: "CLIENT",
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      address: form.address.trim(),
      propertyType: form.propertyType,
      floor: form.floor.trim() || undefined,
      apartment: form.apartment.trim() || undefined,
      neighborhood,
      covered: coverage === "covered" ? true : coverage === "not-covered" ? false : null,
      requestedProduct: form.product || undefined,
      visitTimePreference: form.visit,
      message: form.message.trim() || undefined,
      source: getSource(),
      website: form.website,
    };
    setSending(true);
    try {
      const res = await submitRegistration(payload);
      trackLead("CLIENT");
      setDone({ covered: res.covered, day: res.day ?? day });
    } catch (err) {
      setError(err instanceof ApiError ? { message: err.message, field: err.field } : { message: "Ocurrió un error. Probá de nuevo.", field: null });
    } finally {
      setSending(false);
    }
  };

  if (done) {
    const covered = done.covered !== false;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 py-6 text-center">
        <span className={`flex h-20 w-20 items-center justify-center rounded-full ${covered ? "bg-wa/15 text-wa-dark" : "bg-sun/25 text-ink-900"}`}>
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {covered ? <path d="M4.5 12.75l6 6 9-13.5" /> : <path d="M12 3C8 8 6 11 6 14a6 6 0 0 0 12 0c0-3-2-6-6-11z" />}
          </svg>
        </span>
        <div>
          <h3 className="text-2xl font-bold text-ink-900">{REGISTER.successTitle}</h3>
          <p className="mx-auto mt-2 max-w-md text-ink-900/65">
            Gracias, <strong className="text-ink-900">{form.firstName.trim()}</strong>. {covered ? REGISTER.successCovered : REGISTER.successNotCovered}
            {covered && done.day && (
              <>
                {" "}
                En tu zona repartimos los <strong className="text-ink-900">{done.day}</strong>.
              </>
            )}
          </p>
        </div>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="btn-wa">
          <WhatsAppIcon />
          Escribir por WhatsApp
        </a>
      </motion.div>
    );
  }

  const loading = options === null;

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {/* 1. barrio primero: cobertura al instante */}
      <div>
        <label htmlFor="zone" className="label">
          Tu barrio <span className="text-brand-600">*</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <select id="zone" className="field" value={form.zone} onChange={(e) => set("zone", e.target.value)} disabled={loading}>
            <option value="">{loading ? "Cargando barrios..." : "Elegí tu barrio"}</option>
            {options && (
              <optgroup label="Ciudad de Buenos Aires">
                {options.barrios.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </optgroup>
            )}
            {options && options.zones.length > 0 && (
              <optgroup label="Otras localidades">
                {options.zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </optgroup>
            )}
            <option value={OTHER}>Mi barrio o localidad no está en la lista</option>
          </select>
          <AnimatePresence mode="wait">
            {coverage !== "idle" && (
              <motion.span
                key={coverage}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`inline-flex items-center gap-2 self-center rounded-full px-4 py-2 text-sm font-semibold ${
                  coverage === "covered" ? "bg-wa/15 text-wa-dark" : coverage === "not-covered" ? "bg-sun/25 text-ink-900" : "bg-brand-100 text-brand-700"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${coverage === "covered" ? "bg-wa" : coverage === "not-covered" ? "bg-sun" : "bg-brand-400"}`} />
                {coverage === "covered" ? "Con cobertura" : coverage === "not-covered" ? "Sin cobertura aún" : "A confirmar"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {form.zone === OTHER && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <input className="field mt-3" placeholder="Escribí tu barrio o localidad" value={form.otherZone} onChange={(e) => set("otherZone", e.target.value)} autoComplete="address-level2" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {coverage !== "idle" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 text-sm text-ink-900/65">
              {coverage === "covered"
                ? day
                  ? `${REGISTER.coveredMsg} En tu zona repartimos los ${day}.`
                  : REGISTER.coveredMsg
                : coverage === "not-covered"
                  ? REGISTER.notCoveredMsg
                  : REGISTER.unknownMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 2. datos de contacto */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" required>
          <input className="field" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Ej: Martín" autoComplete="given-name" />
        </Field>
        <Field label="Apellido" required>
          <input className="field" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Ej: García" autoComplete="family-name" />
        </Field>
        <Field label="Celular (WhatsApp)" required>
          <input className="field" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Ej: 11 2345-6789" autoComplete="tel" />
        </Field>
        <Field label="Email" hint="opcional">
          <input className="field" type="email" inputMode="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@email.com" autoComplete="email" />
        </Field>
      </div>

      {/* 3. direccion */}
      <div className="space-y-4">
        <Field label="Dirección (calle y número)" required>
          <input className="field" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Ej: Av. Corrientes 1234" autoComplete="street-address" />
        </Field>
        <div className="flex gap-3">
          {(["HOUSE", "APARTMENT"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("propertyType", t)}
              className={`flex-1 rounded-2xl border py-3 text-sm font-semibold transition-all ${
                form.propertyType === t ? "border-brand-400 bg-brand-50 text-brand-700 ring-4 ring-brand-200/60" : "border-ink-900/10 bg-white text-ink-900/70 hover:border-brand-300"
              }`}
            >
              {t === "HOUSE" ? "Casa" : "Departamento"}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {form.propertyType === "APARTMENT" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-2 gap-3 overflow-hidden">
              <Field label="Piso">
                <input className="field" value={form.floor} onChange={(e) => set("floor", e.target.value)} placeholder="Ej: 3" />
              </Field>
              <Field label="Depto">
                <input className="field" value={form.apartment} onChange={(e) => set("apartment", e.target.value)} placeholder="Ej: B" />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. que quiere */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="¿Qué te interesa?">
          <select className="field" value={form.product} onChange={(e) => set("product", e.target.value)}>
            <option value="">Elegí una opción</option>
            {REGISTER.products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Horario de visita preferido">
          <select className="field" value={form.visit} onChange={(e) => set("visit", e.target.value as Form["visit"])}>
            <option value="INDIFFERENT">Indiferente</option>
            <option value="MORNING">Mañana</option>
            <option value="AFTERNOON">Tarde</option>
          </select>
        </Field>
      </div>

      {!compact && (
        <Field label="Comentarios" hint="opcional">
          <textarea className="field min-h-[88px]" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Ej: timbre roto, llamar antes de pasar" />
        </Field>
      )}

      {/* honeypot */}
      <div className="absolute -left-[9999px] top-0" aria-hidden>
        <label>
          No completar
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={sending} className="btn-primary w-full !py-4 !text-lg disabled:cursor-not-allowed disabled:opacity-60">
        {sending ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Enviando...
          </span>
        ) : coverage === "not-covered" ? (
          "Avisame cuando lleguen"
        ) : (
          "Quiero mi primera entrega"
        )}
      </button>
      <p className="text-center text-xs text-ink-900/45">{REGISTER.privacy}</p>
    </form>
  );
}

export function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">
        {label} {required && <span className="text-brand-600">*</span>}
        {hint && <span className="ml-1 font-normal text-ink-900/40">({hint})</span>}
      </span>
      {children}
    </label>
  );
}
