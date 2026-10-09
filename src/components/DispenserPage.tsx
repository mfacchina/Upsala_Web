"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DispenserForm } from "./DispenserForm";
import { VideoBlock } from "./VideoBlock";
import { Bubbles, WaveDivider } from "./illustrations/Decor";
import { Check, Reveal, SectionHeading, WhatsAppIcon } from "./ui";
import { DISPENSER, DISPENSER_PAGE } from "@/lib/content";
import { CONTACT, ars, asset, waUrl } from "@/lib/site";

type Segment = "home" | "business";

export function DispenserPage() {
  const [segment, setSegment] = useState<Segment>("home");

  // /dispenser/#empresas abre directo la pestaña de empresas.
  useEffect(() => {
    const apply = () => {
      if (window.location.hash === "#empresas") setSegment("business");
      else if (window.location.hash === "#casa") setSegment("home");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden bg-ink-900 pt-28 text-white sm:pt-36">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute left-[-10%] top-[10%] h-[60vh] w-[60vw] rounded-full bg-brand-600/30 blur-[140px]" />
          <div className="absolute right-[-10%] bottom-0 h-[50vh] w-[50vw] rounded-full bg-aqua-500/20 blur-[140px]" />
        </div>
        <Bubbles />
        <div className="container-x relative grid items-center gap-12 pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:pb-40">
          <div>
            <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow bg-white/10 text-aqua-300 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-aqua-300 animate-pulse-soft" />
              {DISPENSER_PAGE.eyebrow}
            </motion.span>
            <h1 className="text-glow mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              {DISPENSER_PAGE.title.map((line, i) => (
                <motion.span key={line} className="block" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 + i * 0.12 }}>
                  {i === 1 ? <span className="bg-gradient-to-r from-aqua-300 to-brand-300 bg-clip-text text-transparent">{line}</span> : line}
                </motion.span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
              {DISPENSER_PAGE.subtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#pedir" onClick={() => setSegment("home")} className="btn-primary !px-8">
                {DISPENSER_PAGE.segments.home}
              </a>
              <a href="#empresas" onClick={() => setSegment("business")} className="btn-ghost">
                {DISPENSER_PAGE.segments.business}
              </a>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-x-10 bottom-4 h-14 rounded-full bg-brand-500/40 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-white/15 shadow-float">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={asset("/img/foto-dispenser-mujer-m.webp")} alt="Dispenser frío/calor Upsala en una cocina" className="aspect-[3/4] w-full object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-sun px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-900">Comodato</span>
            </div>
          </motion.div>
        </div>
        <WaveDivider fill="#ffffff" />
      </section>

      {/* casa / empresa */}
      <section id="planes" className="relative scroll-mt-20 bg-white py-20 sm:py-28">
        <span id="empresas" className="absolute -top-20" aria-hidden />
        <span id="casa" className="absolute -top-20" aria-hidden />
        <div className="container-x">
          <div className="mx-auto flex max-w-md rounded-full border border-ink-900/10 bg-foam p-1.5">
            {(["home", "business"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSegment(s)}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${segment === s ? "bg-ink-900 text-white shadow-card" : "text-ink-900/65 hover:text-ink-900"}`}
              >
                {DISPENSER_PAGE.segments[s]}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {segment === "home" ? (
              <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="mt-14 grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <SectionHeading eyebrow={DISPENSER_PAGE.segments.home} title={DISPENSER_PAGE.home.title} text={DISPENSER_PAGE.home.text} align="left" />
                  <div className="mt-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-4">
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{DISPENSER.priceLabel}</span>
                      <span className="font-display text-5xl font-extrabold text-ink-900">{DISPENSER.price}</span>
                    </div>
                    <p className="max-w-xs text-sm text-ink-900/60 sm:pb-2">{DISPENSER.priceNote}</p>
                  </div>
                  <ol className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                    {DISPENSER.tiers.map((t) => (
                      <li key={t.range} className={`relative rounded-2xl px-3 pb-3 pt-4 sm:p-4 ${t.highlight ? "bg-gradient-to-br from-aqua-400 to-brand-500 text-ink-900 shadow-glow" : "border border-ink-900/8 bg-foam"}`}>
                        {t.highlight && <span className="absolute -top-3 left-3 rounded-full bg-sun px-2 py-0.5 text-[10px] sm:left-4 sm:px-2.5 font-bold uppercase tracking-wider text-ink-900">Gratis</span>}
                        <span className={`block text-xs font-semibold leading-tight sm:text-sm ${t.highlight ? "text-ink-900/80" : "text-ink-900/60"}`}>{t.range}</span>
                        <span className={`mt-1 block font-display font-extrabold ${t.bonus.length > 5 ? "text-sm leading-tight sm:text-lg" : "text-2xl sm:text-3xl"} text-ink-900`}>{t.bonus}</span>
                        <span className={`mt-0.5 block text-[11px] leading-tight sm:text-xs ${t.highlight ? "text-ink-900/70" : "text-ink-900/50"}`}>{t.pay}</span>
                      </li>
                    ))}
                  </ol>
                  <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                    {DISPENSER_PAGE.home.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-ink-900/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <Reveal className="lg:pt-6">
                  <VideoBlock src="/video/cocina.mp4" poster="/img/foto-cocina-dispenser.webp" className="aspect-[9/16] max-h-[560px] w-full max-w-xs mx-auto" label="Dispenser Upsala en una cocina" />
                </Reveal>
              </motion.div>
            ) : (
              <motion.div key="business" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="mt-14">
                <SectionHeading eyebrow={DISPENSER_PAGE.segments.business} title={DISPENSER_PAGE.business.title} text={DISPENSER_PAGE.business.text} />
                <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-ink-900/60">{DISPENSER_PAGE.business.reference}</p>

                {/* promo */}
                <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3 rounded-[2rem] bg-gradient-to-r from-brand-600 to-ink-900 px-6 py-6 text-center text-white shadow-float sm:flex-row sm:text-left">
                  <span className="rounded-full bg-sun px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-900">{DISPENSER_PAGE.business.promo.badge}</span>
                  <div>
                    <p className="font-display text-2xl font-extrabold">{DISPENSER_PAGE.business.promo.title}</p>
                    <p className="text-sm text-white/75">{DISPENSER_PAGE.business.promo.text}</p>
                  </div>
                </div>

                {/* planes */}
                <ol className="mt-10 grid gap-6 md:grid-cols-3">
                  {DISPENSER_PAGE.business.plans.map((p, i) => (
                    <li key={p.people} className={`relative rounded-[2rem] border p-7 shadow-card ${i === 1 ? "border-brand-300 bg-gradient-to-b from-brand-50 to-white" : "border-ink-900/5 bg-white"}`}>
                      {i === 1 && <span className="absolute -top-3 left-7 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">El más elegido</span>}
                      <span className="eyebrow bg-foam text-brand-700 ring-1 ring-brand-100">{p.people}</span>
                      <p className="mt-5 text-sm text-ink-900/60">
                        <strong className="text-ink-900">{p.bidones} bidones</strong> de 20 L por mes · {p.dispensers}
                      </p>
                      <div className="mt-5">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-ink-900/50">Los primeros 2 meses</span>
                        <span className="font-display text-4xl font-extrabold text-ink-900">{ars(p.promo)}</span>
                        <span className="text-sm text-ink-900/50"> /mes</span>
                      </div>
                      <p className="mt-2 text-sm text-ink-900/60">
                        Después, <strong className="text-ink-900">{ars(p.price)}</strong> por mes
                      </p>
                      <a href="#pedir" className="btn-primary mt-6 w-full !py-3 !text-sm">
                        Pedir este plan
                      </a>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-center text-xs text-ink-900/45">{DISPENSER_PAGE.business.priceNote}</p>

                {/* condiciones */}
                <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
                  {DISPENSER_PAGE.business.conditions.map((c) => (
                    <li key={c} className="flex items-start gap-3 rounded-2xl border border-ink-900/5 bg-foam px-4 py-3 text-sm text-ink-900/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua-500" />
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-center text-sm text-ink-900/60">
                  ¿Preferís hablarlo?{" "}
                  <a href={waUrl("Hola Upsala! Quiero una propuesta de abono con dispenser para mi empresa.")} target="_blank" rel="noopener" className="font-semibold text-wa-dark underline">
                    WhatsApp
                  </a>{" "}
                  o <a href={`mailto:${CONTACT.businessEmail}`} className="font-semibold text-brand-700 underline">{CONTACT.businessEmail}</a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* formulario */}
      <section id="pedir" className="relative isolate scroll-mt-20 overflow-hidden bg-foam py-20 sm:py-28">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow={DISPENSER_PAGE.form.eyebrow} title={DISPENSER_PAGE.form.title} text={DISPENSER_PAGE.form.text} align="left" />
            <div className="relative mt-8 overflow-hidden rounded-[2rem] shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={asset("/img/foto-dispenser-vaso.webp")} alt="Vaso servido del dispenser Upsala" className="aspect-[4/5] w-full object-cover" />
            </div>
            <a href={waUrl("Hola Upsala! Quiero un dispenser frío/calor.")} target="_blank" rel="noopener" className="btn-wa mt-6 !px-5 !py-3 !text-sm">
              <WhatsAppIcon className="h-4 w-4" />
              Pedirlo por WhatsApp
            </a>
          </div>
          <Reveal className="relative rounded-[2rem] border border-ink-900/5 bg-white p-6 shadow-card sm:p-9">
            <DispenserForm initialKind={segment} />
          </Reveal>
        </div>
      </section>

      {/* faq */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Preguntas" title="Sobre el dispenser" />
          <Reveal className="mx-auto mt-10 max-w-3xl divide-y divide-ink-900/8 rounded-3xl border border-ink-900/8 bg-foam">
            {DISPENSER_PAGE.faq.map((item) => (
              <details key={item.q} className="group px-6 py-5 open:bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-ink-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition group-open:rotate-45">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                      <path d="M10 4v12M4 10h12" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-900/70">{item.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
