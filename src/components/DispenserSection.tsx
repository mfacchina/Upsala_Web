"use client";

import { motion } from "motion/react";
import { Bubbles, WaveDivider } from "./illustrations/Decor";
import { Dispenser } from "./illustrations/Dispenser";
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

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {DISPENSER.bullets.map((b, i) => (
              <Reveal key={b} delay={0.15 + i * 0.08} as="li" className="glass-dark flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aqua-400/20 text-aqua-300">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm text-white/85">{b}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.4} className="mt-9">
            <a href="#registro" className="btn-wa !px-8">
              {DISPENSER.cta}
            </a>
          </Reveal>
        </div>

        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-x-10 bottom-6 h-14 rounded-full bg-brand-500/40 blur-2xl" aria-hidden />
          <div className="relative grid grid-cols-[1fr_auto] items-end gap-4">
            {/* foto real del dispenser */}
            <motion.div whileHover={{ y: -6 }} className="relative rounded-[2rem] bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/img/dispenser.png")} alt="Dispenser frío/calor" className="mx-auto h-72 w-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)] sm:h-80" />
              <span className="absolute left-4 top-4 rounded-full bg-sun px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-900">Comodato</span>
            </motion.div>
            {/* ilustracion animada: gotea y llena el vaso */}
            <div className="w-24 sm:w-28">
              <Dispenser className="w-full" level={0.7} />
            </div>
          </div>
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
