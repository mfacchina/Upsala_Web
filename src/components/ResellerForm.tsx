"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Field } from "./RegisterForm";
import { WhatsAppIcon } from "./ui";
import { RESELLERS } from "@/lib/content";
import { WHATSAPP_RESELLER_URL } from "@/lib/site";
import { ApiError, getSource, submitRegistration, trackLead } from "@/lib/api";

const EMPTY = { firstName: "", lastName: "", phone: "", email: "", zone: "", message: "", website: "" };

export function ResellerForm() {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const set = <K extends keyof typeof EMPTY>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      setError("Completá nombre, apellido y teléfono.");
      return;
    }
    setSending(true);
    try {
      await submitRegistration({
        kind: "RESELLER",
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        neighborhood: form.zone.trim() || undefined,
        covered: null,
        message: form.message.trim() || undefined,
        source: getSource(),
        website: form.website,
      });
      trackLead("RESELLER");
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ocurrió un error. Probá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5 py-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-wa/15 text-wa-dark">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 12.75l6 6 9-13.5" /></svg>
        </span>
        <div>
          <h3 className="text-xl font-bold text-ink-900">{RESELLERS.successTitle}</h3>
          <p className="mt-2 text-sm text-ink-900/65">{RESELLERS.successText}</p>
        </div>
        <a href={WHATSAPP_RESELLER_URL} target="_blank" rel="noopener" className="btn-wa !px-5 !py-2.5 !text-sm">
          <WhatsAppIcon className="h-4 w-4" />
          Adelantar la charla por WhatsApp
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
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
        <Field label="Email" hint="opcional">
          <input className="field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        </Field>
      </div>
      <Field label="Zona o localidad donde venderías">
        <input className="field" value={form.zone} onChange={(e) => set("zone", e.target.value)} placeholder="Ej: Villa Devoto / Hurlingham" />
      </Field>
      <Field label="Contanos de vos" hint="opcional">
        <textarea className="field min-h-[88px]" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tenés un comercio, un reparto, un vehículo..." />
      </Field>
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
      <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
        {sending ? "Enviando..." : RESELLERS.cta}
      </button>
    </form>
  );
}
