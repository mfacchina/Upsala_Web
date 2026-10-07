"use client";

import { motion } from "motion/react";
import { VideoBlock } from "./VideoBlock";
import { Rain } from "./illustrations/Decor";
import { Check, Reveal, SectionHeading, fadeUp, stagger } from "./ui";
import { NATURAL } from "@/lib/content";

const POINT_ICONS = [
  <svg key="a" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M12 3v4M8 5l4 2 4-2" />
  </svg>,
  <svg key="c" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>,
  <svg key="d" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
];

export function Natural() {
  return (
    <section id="natural" className="relative isolate overflow-hidden bg-foam py-24 sm:py-32">
      <Rain className="opacity-70" />
      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="relative mx-auto w-full max-w-xs lg:max-w-sm">
            <div className="absolute inset-x-10 bottom-4 h-12 rounded-full bg-brand-400/40 blur-2xl" aria-hidden />
            <VideoBlock src="/video/comercial.mp4" poster="/img/foto-vaso.webp" controls={false} className="aspect-[4/5] w-full" label="Agua mineral natural Upsala" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -right-2 top-6 rounded-2xl bg-white px-4 py-3 text-center shadow-card ring-1 ring-ink-900/5 sm:-right-8"
            >
              <span className="block font-display text-2xl font-extrabold text-brand-700">100%</span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-900/60">mineral natural</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -left-2 bottom-10 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-ink-900/5 sm:-left-8"
            >
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-900/60">Origen</span>
              <span className="block text-sm font-semibold text-ink-900">9 de Julio, Bs. As.</span>
            </motion.div>
          </Reveal>

          <div>
            <SectionHeading eyebrow={NATURAL.eyebrow} title={NATURAL.title} text={NATURAL.text} align="left" />

            {/* lo que no es / lo que si es */}
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-10 grid gap-3 sm:grid-cols-2"
            >
              {NATURAL.compare.map((c) => (
                <motion.li
                  key={c.title}
                  variants={fadeUp}
                  className={`flex gap-4 rounded-3xl border p-5 transition hover:-translate-y-0.5 ${
                    c.is ? "border-brand-200 bg-gradient-to-br from-brand-600 to-ink-900 text-white shadow-glow sm:col-span-2" : "border-ink-900/5 bg-white shadow-card"
                  }`}
                >
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${c.is ? "bg-aqua-400/25 text-aqua-300" : "bg-ink-900/5 text-ink-900/45"}`}>
                    {c.is ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                        <path d="M5 5l10 10M15 5L5 15" />
                      </svg>
                    )}
                  </span>
                  <span>
                    <span className={`block font-display text-lg font-bold ${c.is ? "text-white" : "text-ink-900"}`}>{c.title}</span>
                    <span className={`mt-1 block text-sm leading-relaxed ${c.is ? "text-white/80" : "text-ink-900/65"}`}>{c.text}</span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* de donde viene */}
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-4 sm:grid-cols-3"
        >
          {NATURAL.points.map((p, i) => (
            <motion.li key={p.title} variants={fadeUp} className="group flex items-start gap-4 rounded-3xl border border-ink-900/5 bg-white p-5 shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                {POINT_ICONS[i]}
              </span>
              <span>
                <span className="block font-semibold text-ink-900">{p.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-900/65">{p.text}</span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
