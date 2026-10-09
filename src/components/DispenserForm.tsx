"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Field } from "./RegisterForm";
import { WhatsAppIcon } from "./ui";
import { DISPENSER_PAGE } from "@/lib/content";
import { buildMessage, orderWhatsAppUrl } from "@/lib/whatsapp";
import { ApiError, coverageFor, fetchFormOptions, getSource, submitRegistration, trackLead, type FormOptions } from "@/lib/api";

const OTHER = "__otro__";

type Kind = "home" | "business";

const EMPTY = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  company: "",
  people: "",
  zone: "",
  otherZone: "",
  address: "",
  floor: "",
  message: "",
  website: "",
};

/** Formulario de la pagina del dispenser: casa o empresa. Entra a la app como registro con producto "Dispenser". */
export function DispenserForm({ initialKind = "home" }: { initialKind?: Kind }) {
  const [kind, setKind] = useState<Kind>(initialKind);
  const [form, setForm] = useState(EMPTY);
  const [options, setOptions] = useState<FormOptions | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ covered: boolean | null } | null>(null);

  useEffect(() => {
    setKind(initialKind);
  }, [initialKind]);

  useEffect(() => {
    let alive = true;
    fetchFormOptions().then((o) => alive && setOptions(o));
    return () => {
      alive = false;
    };
  }, []);

  const set = <K extends keyof typeof EMPTY>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const neighborhood = form.zone === OTHER ? form.otherZone.trim() : form.zone;
  const coverage = useMemo(() => (neighborhood && options ? coverageFor(options, neighborhood) : null), [neighborhood, options]);

  const suggestedPlan = useMemo(() => {
    const n = Number(form.people);
    if (!n) return null;
    return DISPENSER_PAGE.business.plans[n <= 25 ? 0 : n <= 45 ? 1 : 2];
  }, [form.people]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Completá nombre, apellido, teléfono y dirección.");
      return;
    }
    if (!neighborhood) {
      setError("Elegí el barrio para saber si tenemos cobertura.");
      return;
    }
    if (kind === "business" && !form.company.trim()) {
      setError("Decinos el nombre de la empresa.");
      return;
    }
    const details = [
      kind === "business" ? `EMPRESA: ${form.company.trim()}` : "Dispenser para el hogar",
      kind === "business" && form.people ? `Personas: ${form.people}` : null,
      kind === "business" && suggestedPlan ? `Plan sugerido: ${suggestedPlan.people} (${suggestedPlan.bidones} bidones, ${suggestedPlan.dispensers})` : null,
      form.message.trim() || null,
    ]
      .filter(Boolean)
      .join(" · ");
    setSending(true);
    try {
      const res = await submitRegistration({
        kind: "CLIENT",
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        address: form.address.trim(),
        propertyType: form.floor.trim() ? "APARTMENT" : "HOUSE",
        floor: form.floor.trim() || undefined,
        neighborhood,
        covered: coverage?.covered ?? null,
        requestedProduct: kind === "business" ? "Dispenser frío/calor · abono empresa" : "Dispenser frío/calor + bidón 20 L",
        message: details,
        source: getSource(),
        website: form.website,
      });
      trackLead("CLIENT", kind === "business" ? "dispenser_empresa" : "dispenser_casa");
      setDone({ covered: res.covered });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ocurrió un error. Probá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    const covered = done.covered !== false;
    const business = kind === "business";
    const message = buildMessage(
      business
        ? "Hola Upsala! Pedí en la web una propuesta de abono con dispenser frío/calor para mi empresa."
        : "Hola Upsala! Me registré en la web y quiero confirmar el dispenser frío/calor para mi casa.",
      [
        ["Empresa", business && form.company.trim()],
        ["Personas", business && form.people],
        ["Plan sugerido", business && suggestedPlan && `${suggestedPlan.people} (${suggestedPlan.bidones} bidones de 20 L/mes, ${suggestedPlan.dispensers})`],
        ["Nombre", `${form.firstName.trim()} ${form.lastName.trim()}`],
        ["Teléfono", form.phone.trim()],
        ["Email", form.email.trim()],
        ["Dirección", [form.address.trim(), form.floor.trim()].filter(Boolean).join(", ")],
        ["Barrio", neighborhood + (coverage?.day ? ` (reparto los ${coverage.day})` : "")],
        ["Comentarios", form.message.trim()],
      ],
      covered ? undefined : "Vi que mi zona todavía no tiene reparto.",
    );
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5 py-6 text-center">
        <span className={`flex h-16 w-16 items-center justify-center rounded-full ${covered ? "bg-wa/15 text-wa-dark" : "bg-sun/25 text-ink-900"}`}>
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </span>
        <div>
          <h3 className="text-2xl font-bold text-ink-900">{covered ? "¡Listo! Ahora confirmá por WhatsApp" : "¡Pedido recibido!"}</h3>
          <p className="mx-auto mt-2 max-w-md text-ink-900/65">
            Gracias, <strong className="text-ink-900">{form.firstName.trim()}</strong>.{" "}
            {covered
              ? business
                ? "Tocá el botón: se abre WhatsApp con los datos de tu empresa ya escritos y te pasamos la propuesta con precio cerrado."
                : "Tocá el botón: se abre WhatsApp con tus datos ya escritos y coordinamos la instalación del dispenser."
              : "Todavía no llegamos a tu zona, pero guardamos tus datos y te avisamos."}
          </p>
        </div>
        <a
          href={orderWhatsAppUrl(message)}
          target="_blank"
          rel="noopener"
          data-wa-context={business ? "confirmar_dispenser_empresa" : "confirmar_dispenser_casa"}
          className={covered ? "btn-wa w-full max-w-sm !py-4 !text-lg" : "btn-wa"}
        >
          <WhatsAppIcon className={covered ? "h-6 w-6" : "h-5 w-5"} />
          {covered ? (business ? "Pedir la propuesta por WhatsApp" : "Confirmar por WhatsApp") : "Consultar por WhatsApp"}
        </a>
        {covered && <p className="max-w-sm text-xs text-ink-900/50">Tus datos ya nos llegaron. Si no tenés WhatsApp a mano, igual te contactamos nosotros.</p>}
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {/* casa / empresa */}
      <div className="grid grid-cols-2 gap-3">
        {(["home", "business"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-2xl border py-3 text-sm font-semibold transition-all ${
              kind === k ? "border-brand-400 bg-brand-50 text-brand-700 ring-4 ring-brand-200/60" : "border-ink-900/10 bg-white text-ink-900/70 hover:border-brand-300"
            }`}
          >
            {DISPENSER_PAGE.segments[k]}
          </button>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {kind === "business" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid gap-4 overflow-hidden sm:grid-cols-[1.4fr_1fr]">
            <Field label="Empresa" required>
              <input className="field" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Ej: Estudio Pérez y Asoc." autoComplete="organization" />
            </Field>
            <Field label="Cantidad de personas">
              <input className="field" type="number" inputMode="numeric" min={1} value={form.people} onChange={(e) => set("people", e.target.value)} placeholder="Ej: 18" />
            </Field>
            {suggestedPlan && (
              <p className="sm:col-span-2 -mt-1 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
                Plan sugerido: <strong>{suggestedPlan.people.toLowerCase()}</strong>, {suggestedPlan.bidones} bidones de 20 L por mes y {suggestedPlan.dispensers}. Lo ajustamos después del primer mes real.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" required>
          <input className="field" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" />
        </Field>
        <Field label="Apellido" required>
          <input className="field" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" />
        </Field>
        <Field label="Celular (WhatsApp)" required>
          <input className="field" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
        </Field>
        <Field label="Email" hint={kind === "business" ? "para mandarte la propuesta" : "opcional"}>
          <input className="field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
        <Field label="Barrio" required>
          <select className="field" value={form.zone} onChange={(e) => set("zone", e.target.value)} disabled={options === null}>
            <option value="">{options === null ? "Cargando..." : "Elegí el barrio"}</option>
            {options?.barrios.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
            {options?.zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
            <option value={OTHER}>No está en la lista</option>
          </select>
        </Field>
        <Field label={kind === "business" ? "Dirección de la empresa" : "Dirección"} required>
          <input className="field" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Calle y número" autoComplete="street-address" />
        </Field>
      </div>
      {form.zone === OTHER && <input className="field" placeholder="Escribí el barrio o localidad" value={form.otherZone} onChange={(e) => set("otherZone", e.target.value)} />}
      {coverage && coverage.covered !== null && (
        <p className={`rounded-2xl px-4 py-2.5 text-sm ${coverage.covered ? "bg-wa/10 text-wa-dark" : "bg-sun/20 text-ink-900"}`}>
          {coverage.covered ? `Tenemos cobertura.${coverage.day ? ` En esa zona repartimos los ${coverage.day}.` : ""}` : "Todavía no llegamos a esa zona; dejanos los datos igual y te avisamos."}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-[0.5fr_1.5fr]">
        <Field label="Piso / oficina" hint="opcional">
          <input className="field" value={form.floor} onChange={(e) => set("floor", e.target.value)} placeholder="Ej: 4° B" />
        </Field>
        <Field label="Comentarios" hint="opcional">
          <input className="field" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder={kind === "business" ? "Horarios de recepción, cantidad de pisos..." : "Dónde iría el dispenser, horarios..."} />
        </Field>
      </div>

      <div className="absolute -left-[9999px] top-0" aria-hidden>
        <label>
          No completar
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={sending} className="btn-primary w-full !py-4 !text-lg disabled:opacity-60">
        {sending ? "Enviando..." : kind === "business" ? "Quiero la propuesta para mi empresa" : "Quiero el dispenser en casa"}
      </button>
      <p className="text-center text-xs text-ink-900/45">Tus datos son confidenciales y solo los usamos para coordinar la instalación.</p>
    </form>
  );
}
