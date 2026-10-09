"use client";

import { motion } from "motion/react";
import { Bubbles, WaveDivider } from "./illustrations/Decor";
import { Check, Reveal, SectionHeading } from "./ui";
import { DISPENSER } from "@/lib/content";
import { asset } from "@/lib/site";

export function DispenserSection() {
  return (
    <section id="dispenser" className="relative isolate overflow-hidden bg-ink-900 pt-28 pb-24 text-white sm:pt-36 sm:pb-32">
      <WaveDivider fill="#ffffff" flip />
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute left-[-10%] top-[20%] h-[60vh] w-[60vw] rounded-full bg-brand-600/30 blur-[140px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[50vh] w-[50vw] rounded-full bg-aqua-500/20 blur-[140px]" />
      </div>
      <Bubbles />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading eyebrow={DISPENSER.eyebrow} title={DISPENSER.title} text={DISPENSER.text} tone="dark" align="left" />

          <Reveal delay={0.1} className="mt-9 flex flex-wrap items-end gap-x-6 gap-y-2">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-aqua-300">{DISPENSER.priceLabel}</span>
              <span className="text-glow font-display text-5xl font-extrabold sm:text-6xl">{DISPENSER.price}</span>
            </div>
            <p className="max-w-xs pb-2 text-sm text-white/70">{DISPENSER.priceNote}</p>
          </Reveal>

          {/* escala de bonificacion por consumo */}
          <Reveal delay={0.15} className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Bonificación según tu consumo mensual</p>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3">
              {DISPENSER.tiers.map((t, i) => (
                <motion.li
                  key={t.range}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className={`relative rounded-2xl p-4 ${t.highlight ? "bg-gradient-to-br from-aqua-400 to-brand-500 text-ink-900 shadow-glow" : "glass-dark"}`}
                >
                  {t.highlight && (
                    <span className="absolute -top-3 left-4 rounded-full bg-sun px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-900">Gratis</span>
                  )}
                  <span className={`block text-sm font-semibold ${t.highlight ? "text-ink-900/80" : "text-white/70"}`}>{t.range}</span>
                  <span className={`mt-1 block font-display font-extrabold ${t.bonus.length > 5 ? "text-lg leading-tight" : "text-3xl"} ${t.highlight ? "text-ink-900" : "text-white"}`}>{t.bonus}</span>
                  <span className={`block text-xs ${t.highlight ? "text-ink-900/70" : "text-white/55"}`}>{t.pay}</span>
                </motion.li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-white/55">{DISPENSER.tiersNote}</p>
          </Reveal>

          <ul className="mt-7 grid gap-3 sm:grid-cols-3">
            {DISPENSER.bullets.map((b, i) => (
              <Reveal key={b} delay={0.25 + i * 0.08} as="li" className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aqua-400/20 text-aqua-300">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm text-white/85">{b}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.4} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={asset("/dispenser/")} className="btn-wa !px-8">
              {DISPENSER.cta}
            </a>
            <a href={asset("/dispenser/#empresas")} className="btn-ghost">
              {DISPENSER.ctaBusiness}
            </a>
          </Reveal>
        </div>

        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-x-10 bottom-6 h-14 rounded-full bg-brand-500/40 blur-2xl" aria-hidden />
          {/* foto real: dispenser en una cocina */}
          <motion.a href={asset("/dispenser/")} whileHover={{ y: -6 }} className="relative block overflow-hidden rounded-[2rem] ring-1 ring-white/15 shadow-float">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/img/foto-dispenser-mujer.webp")} alt="Dispenser frío/calor Upsala en una cocina" className="aspect-[3/4] w-full object-cover" />
            <span className="absolute left-5 top-5 rounded-full bg-sun px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-900">Comodato</span>
            <span className="absolute bottom-5 right-5 rounded-full bg-ink-900/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/15 backdrop-blur">Con bidón de 20 L</span>
          </motion.a>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/60">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand-400" /> Agua fría</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /> Agua caliente</span>
          </div>
        </Reveal>
      </div>

      <WaveDivider fill="#ffffff" />
    </section>
  );
}
