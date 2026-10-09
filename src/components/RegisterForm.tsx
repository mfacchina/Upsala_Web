"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WhatsAppIcon } from "./ui";
import { DISPENSER, REGISTER } from "@/lib/content";
import { DELIVERY_HOURS } from "@/lib/site";
import { MAX_PER_PRODUCT, PRICE, ars, computeOrder, type Quantities } from "@/lib/order";
import { VISIT_LABEL, buildMessage, goToWhatsApp, orderWhatsAppUrl } from "@/lib/whatsapp";
import { ApiError, coverageFor, fetchFormOptions, getSource, submitRegistration, trackContact, trackLead, type FormOptions, type RegistrationPayload } from "@/lib/api";

const OTHER = "__otro__";

type Visit = "MORNING" | "AFTERNOON" | "INDIFFERENT";

type Form = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cuil: string;
  zone: string; // valor del select: un barrio/localidad, OTHER o ""
  otherZone: string;
  address: string;
  propertyType: "HOUSE" | "APARTMENT";
  floor: string;
  bell: string; // timbre / depto
  q: Quantities;
  dispenser: boolean;
  visit: Visit;
  message: string;
  website: string; // honeypot
};

const EMPTY: Form = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  cuil: "",
  zone: "",
  otherZone: "",
  address: "",
  propertyType: "HOUSE",
  floor: "",
  bell: "",
  q: { b20: 1, b12: 0 },
  dispenser: false,
  visit: "INDIFFERENT",
  message: "",
  website: "",
};

type Coverage = "idle" | "covered" | "not-covered" | "unknown";
type FieldKey = "zone" | "firstName" | "lastName" | "phone" | "email" | "cuil" | "address" | "bell" | "q";

/** "20123456789" -> "20-12345678-9" (si tiene 11 digitos). */
function formatCuil(v: string) {
  const d = v.replace(/\D/g, "");
  return d.length === 11 ? `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}` : v.trim();
}

export function RegisterForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [options, setOptions] = useState<FormOptions | null>(null); // null = cargando
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<{ message: string; field: string | null } | null>(null);
  const [redirect, setRedirect] = useState<string | null>(null); // link de WhatsApp ya armado

  useEffect(() => {
    let alive = true;
    fetchFormOptions().then((o) => alive && setOptions(o));
    return () => {
      alive = false;
    };
  }, []);

  // Al tocar un campo se va el aviso de error (ya lo esta corrigiendo).
  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setError(null);
    setForm((f) => ({ ...f, [k]: v }));
  };
  const setQty = (k: keyof Quantities, delta: number) => {
    setError(null);
    setForm((f) => ({ ...f, q: { ...f.q, [k]: Math.max(0, Math.min(MAX_PER_PRODUCT, f.q[k] + delta)) } }));
  };

  const neighborhood = form.zone === OTHER ? form.otherZone.trim() : form.zone;
  const { coverage, day } = useMemo((): { coverage: Coverage; day: string | null } => {
    if (!neighborhood || !options) return { coverage: "idle", day: null };
    const c = coverageFor(options, neighborhood);
    return { coverage: c.covered === true ? "covered" : c.covered === false ? "not-covered" : "unknown", day: c.day };
  }, [neighborhood, options]);

  const order = useMemo(() => computeOrder(form.q), [form.q]);
  const covered = coverage !== "not-covered";

  const validate = (): { message: string; field: FieldKey } | null => {
    if (!neighborhood) return { message: "Elegí tu barrio para saber qué día pasamos.", field: "zone" };
    if (!form.firstName.trim()) return { message: "Completá tu nombre.", field: "firstName" };
    if (!form.lastName.trim()) return { message: "Completá tu apellido.", field: "lastName" };
    if (form.phone.replace(/\D/g, "").length < 8) return { message: "Ingresá un celular válido, con código de área.", field: "phone" };
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return { message: "Ingresá un email válido.", field: "email" };
    if (form.cuil.replace(/\D/g, "").length !== 11) return { message: "El CUIL tiene 11 números (ej: 20-12345678-9).", field: "cuil" };
    if (!form.address.trim()) return { message: "Completá tu dirección (calle y número).", field: "address" };
    if (form.propertyType === "APARTMENT" && !form.bell.trim()) return { message: "Decinos qué timbre tocar (piso y depto).", field: "bell" };
    if (order.units === 0) return { message: "Elegí al menos un bidón.", field: "q" };
    return null;
  };

  const buildWhatsApp = () => {
    const address = [
      form.address.trim(),
      form.propertyType === "APARTMENT" && form.floor.trim() && `piso ${form.floor.trim()}`,
      form.propertyType === "APARTMENT" && `timbre ${form.bell.trim()}`,
    ]
      .filter(Boolean)
      .join(", ");
    return orderWhatsAppUrl(
      buildMessage(
        covered ? "Hola Upsala! Quiero confirmar mi pedido desde la web." : "Hola Upsala! Dejé mis datos en la web. Mi barrio todavía no tiene reparto, ¿me avisan cuando lleguen?",
        [
          ["Nombre", `${form.firstName.trim()} ${form.lastName.trim()}`],
          ["Teléfono", form.phone.trim()],
          ["CUIL", formatCuil(form.cuil)],
          ["Email", form.email.trim()],
          ["Dirección", address + (form.propertyType === "APARTMENT" ? " (departamento)" : "")],
          ["Barrio", neighborhood],
          ["Día de reparto", day && `${day}, ${DELIVERY_HOURS}`],
          ["Horario preferido", VISIT_LABEL[form.visit]],
          ["Pedido", order.text],
          ["Total primer pedido", `${ars(order.total)}${order.discountLabel ? ` (${order.discountLabel})` : ""}`],
          ["Dispenser frío/calor", form.dispenser && "Sí, me interesa"],
          ["Comentarios", form.message.trim()],
        ],
      ),
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const invalid = validate();
    if (invalid) {
      setError(invalid);
      document.getElementById(`f-${invalid.field}`)?.focus();
      return;
    }
    const cuil = formatCuil(form.cuil);
    const payload: RegistrationPayload = {
      kind: "CLIENT",
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      cuit: cuil,
      address: form.address.trim(),
      propertyType: form.propertyType,
      floor: form.propertyType === "APARTMENT" ? form.floor.trim() || undefined : undefined,
      apartment: form.propertyType === "APARTMENT" ? form.bell.trim() || undefined : undefined,
      neighborhood,
      covered: coverage === "covered" ? true : coverage === "not-covered" ? false : null,
      requestedProduct: [order.text, form.dispenser && "dispenser F/C"].filter(Boolean).join(" + "),
      visitTimePreference: form.visit,
      // CUIL, timbre y total tambien en el comentario, para que se vean en Nuevos Web.
      message: [
        `CUIL ${cuil}`,
        form.propertyType === "APARTMENT" && `Timbre ${form.bell.trim()}`,
        `Total 1er pedido ${ars(order.total)}`,
        form.dispenser && "Le interesa el dispenser frío/calor",
        form.message.trim(),
      ]
        .filter(Boolean)
        .join(" · "),
      source: getSource(),
      website: form.website,
    };
    setSending(true);
    try {
      await submitRegistration(payload);
    } catch (err) {
      // Error en los datos (o demasiados intentos): se corrige y se reintenta.
      // Falla del sistema: seguimos igual a WhatsApp, el mensaje lleva todos los datos.
      if (!(err instanceof ApiError) || !err.isSystemFailure) {
        setError(err instanceof ApiError ? { message: err.message, field: err.field } : { message: "Ocurrió un error. Probá de nuevo.", field: null });
        setSending(false);
        return;
      }
    }
    setSending(false);
    trackLead("CLIENT", "cliente");
    trackContact(covered ? "confirmar_pedido" : "sin_cobertura");
    const url = buildWhatsApp();
    setRedirect(url);
    goToWhatsApp(url);
  };

  if (redirect) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 py-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-wa/15 text-wa-dark">
          <WhatsAppIcon className="h-10 w-10" />
        </span>
        <div>
          <h3 className="text-2xl font-bold text-ink-900">{REGISTER.redirectTitle}</h3>
          <p className="mx-auto mt-2 max-w-md text-ink-900/65">{REGISTER.redirectText}</p>
        </div>
        <a href={redirect} className="btn-wa w-full max-w-sm !py-4 !text-lg">
          <WhatsAppIcon className="h-6 w-6" />
          {REGISTER.redirectFallback}
        </a>
      </motion.div>
    );
  }

  const fieldError = (k: FieldKey) => error?.field === k;
  const cls = (k: FieldKey) => `field ${fieldError(k) ? "!border-red-400 !ring-4 !ring-red-100" : ""}`;

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {/* 1. barrio primero: cobertura y dia de reparto al instante */}
      <div>
        <label htmlFor="f-zone" className="label">
          Tu barrio <span className="text-brand-600">*</span>
        </label>
        <select id="f-zone" className={cls("zone")} value={form.zone} onChange={(e) => set("zone", e.target.value)} disabled={options === null}>
          <option value="">{options === null ? "Cargando barrios..." : "Elegí tu barrio"}</option>
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
        <AnimatePresence>
          {form.zone === OTHER && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <input className="field mt-3" placeholder="Escribí tu barrio o localidad" value={form.otherZone} onChange={(e) => set("otherZone", e.target.value)} autoComplete="address-level2" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {coverage !== "idle" && (
            <motion.div
              key={coverage + (day ?? "")}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-3 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ${
                coverage === "covered" ? "bg-wa/10 text-ink-900" : coverage === "not-covered" ? "bg-sun/20 text-ink-900" : "bg-brand-50 text-brand-800"
              }`}
            >
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${coverage === "covered" ? "bg-wa" : coverage === "not-covered" ? "bg-sun" : "bg-brand-400"}`} />
              <span>
                {coverage === "covered" ? (
                  day ? (
                    <>
                      <strong>Llegamos a tu barrio.</strong> Pasamos los <strong>{day}</strong>, {DELIVERY_HOURS}.
                    </>
                  ) : (
                    <>
                      <strong>Llegamos a tu barrio.</strong> Repartimos {DELIVERY_HOURS}; te confirmamos el día por WhatsApp.
                    </>
                  )
                ) : coverage === "not-covered" ? (
                  REGISTER.notCoveredMsg
                ) : (
                  REGISTER.unknownMsg
                )}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. que quiere: calculadora */}
      <div>
        <span className="label">
          Tu pedido <span className="text-brand-600">*</span>
        </span>
        <div id="f-q" tabIndex={-1} className={`space-y-2 rounded-2xl ${fieldError("q") ? "ring-4 ring-red-100" : ""}`}>
          {(
            [
              ["b20", "Bidón 20 L", "Para dispenser o consumos grandes"],
              ["b12", "Bidón 12 L", "Liviano, ideal para departamentos"],
            ] as const
          ).map(([k, label, hint]) => (
            <div key={k} className="flex items-center justify-between gap-3 rounded-2xl border border-ink-900/10 bg-white px-4 py-3">
              <div>
                <span className="block font-semibold text-ink-900">{label}</span>
                <span className="block text-xs text-ink-900/55">
                  {ars(PRICE[k])}
                  <span className="hidden sm:inline"> · {hint}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setQty(k, -1)} disabled={form.q[k] === 0} aria-label={`Quitar ${label}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/15 text-lg font-bold text-ink-900 transition hover:bg-brand-50 disabled:opacity-30">
                  −
                </button>
                <span className="w-6 text-center font-display text-xl font-extrabold text-ink-900" aria-live="polite">
                  {form.q[k]}
                </span>
                <button type="button" onClick={() => setQty(k, 1)} disabled={form.q[k] === MAX_PER_PRODUCT} aria-label={`Agregar ${label}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white transition hover:bg-brand-700 disabled:opacity-30">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-900/10 bg-white px-4 py-3">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-brand-600" checked={form.dispenser} onChange={(e) => set("dispenser", e.target.checked)} />
          <span className="text-sm text-ink-900/80">
            <strong className="text-ink-900">También me interesa el dispenser frío/calor.</strong> {DISPENSER.price}/mes, bonificado según tu consumo (gratis con 6 bidones de 20 L al mes).
          </span>
        </label>

        {/* resumen de precio */}
        <AnimatePresence initial={false}>
          {order.units > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-3 rounded-2xl bg-ink-900 px-5 py-4 text-white">
                {order.lines.map((l) => (
                  <div key={l.label} className="flex justify-between gap-3 text-sm text-white/75">
                    <span>
                      {l.qty} × {l.label}
                    </span>
                    <span className="whitespace-nowrap">{ars(l.subtotal)}</span>
                  </div>
                ))}
                {order.discount > 0 && (
                  <div className="flex justify-between gap-3 text-sm font-semibold text-aqua-300">
                    <span>Bienvenida: {order.discountLabel}</span>
                    <span className="whitespace-nowrap">− {ars(order.discount)}</span>
                  </div>
                )}
                <div className="mt-2 flex items-end justify-between border-t border-white/10 pt-2">
                  <span className="text-sm text-white/75">Total primer pedido</span>
                  <span className="whitespace-nowrap font-display text-3xl font-extrabold">{ars(order.total)}</span>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Pedidos siguientes con la misma cantidad: {ars(order.nextTotal)}. Pagás al recibir, en efectivo o transferencia.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. datos personales */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" required>
          <input id="f-firstName" className={cls("firstName")} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Ej: Martín" autoComplete="given-name" />
        </Field>
        <Field label="Apellido" required>
          <input id="f-lastName" className={cls("lastName")} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Ej: García" autoComplete="family-name" />
        </Field>
        <Field label="Celular (WhatsApp)" required>
          <input id="f-phone" className={cls("phone")} type="tel" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Ej: 11 2345-6789" autoComplete="tel" />
        </Field>
        <Field label="Email" required>
          <input id="f-email" className={cls("email")} type="email" inputMode="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@email.com" autoComplete="email" />
        </Field>
        <Field label="CUIL" required hint="11 números">
          <input id="f-cuil" className={cls("cuil")} inputMode="numeric" value={form.cuil} onChange={(e) => set("cuil", e.target.value)} onBlur={(e) => set("cuil", formatCuil(e.target.value))} placeholder="Ej: 20-12345678-9" />
        </Field>
      </div>

      {/* 4. direccion */}
      <div className="space-y-4">
        <Field label="Dirección (calle y número)" required>
          <input id="f-address" className={cls("address")} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Ej: Av. Corrientes 1234" autoComplete="street-address" />
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
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-[0.6fr_1.4fr] gap-3 overflow-hidden">
              <Field label="Piso">
                <input className="field" value={form.floor} onChange={(e) => set("floor", e.target.value)} placeholder="Ej: 3" />
              </Field>
              <Field label="Timbre / depto" required>
                <input id="f-bell" className={cls("bell")} value={form.bell} onChange={(e) => set("bell", e.target.value)} placeholder="Ej: 3B, o portero 12" />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. preferencias */}
      <div>
        <span className="label">Horario preferido</span>
        <div className="grid grid-cols-3 gap-2">
          {(["INDIFFERENT", "MORNING", "AFTERNOON"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set("visit", v)}
              className={`rounded-2xl border px-2 py-2.5 text-sm font-semibold transition-all ${
                form.visit === v ? "border-brand-400 bg-brand-50 text-brand-700 ring-4 ring-brand-200/60" : "border-ink-900/10 bg-white text-ink-900/70 hover:border-brand-300"
              }`}
            >
              {v === "INDIFFERENT" ? "Indistinto" : v === "MORNING" ? "Mañana" : "Tarde"}
              <span className="block text-[11px] font-normal text-ink-900/50">{v === "INDIFFERENT" ? "9 a 17 hs" : v === "MORNING" ? "9 a 13 hs" : "13 a 17 hs"}</span>
            </button>
          ))}
        </div>
      </div>

      <Field label="Comentarios" hint="opcional">
        <textarea className="field min-h-[80px]" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Ej: dejar en portería, llamar antes de subir" />
      </Field>

      {/* honeypot */}
      <div className="absolute -left-[9999px] top-0" aria-hidden>
        <label>
          No completar
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      {/* lo que la persona acepta al confirmar */}
      <ul className="space-y-1.5 rounded-2xl border border-ink-900/8 bg-white px-4 py-3 text-sm text-ink-900/70">
        <li>
          📅 Pasamos {day ? <strong className="text-ink-900">los {day}</strong> : "el día de tu zona"}, {DELIVERY_HOURS}.
        </li>
        <li>💵 Pagás al recibir: efectivo o transferencia.</li>
        <li>♻️ Los bidones son retornables: cuando se vacían nos los devolvés.</li>
      </ul>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={sending} className="btn-wa w-full !py-4 !text-lg disabled:cursor-not-allowed disabled:opacity-60">
        {sending ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Enviando...
          </span>
        ) : (
          <>
            <WhatsAppIcon className="h-6 w-6" />
            {covered ? REGISTER.submit : REGISTER.submitNotCovered}
          </>
        )}
      </button>
      <p className="text-center text-xs text-ink-900/45">Se abre WhatsApp con tu pedido escrito: solo tocás Enviar. {REGISTER.privacy}</p>
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
