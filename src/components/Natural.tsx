"use client";

import { motion } from "motion/react";
import { Bidon } from "./illustrations/Bidon";
import { Rain } from "./illustrations/Decor";
import { Reveal, SectionHeading, fadeUp, stagger } from "./ui";
import { NATURAL } from "@/lib/content";

const ICONS = [
  // napa
  <svg key="a" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M12 3v4M8 5l4 2 4-2" />
  </svg>,
  // sin procesos
  <svg key="b" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3C8 8 6 11 6 14a6 6 0 0 0 12 0c0-3-2-6-6-11z" />
    <path d="M9 14a3 3 0 0 0 3 3" />
  </svg>,
  // origen
  <svg key="c" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>,
  // control
  <svg key="d" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
];

export function Natural() {
  return (
    <section id="natural" className="relative isolate overflow-hidden bg-foam py-24 sm:py-32">
      <Rain className="opacity-70" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="relative mx-auto w-full max-w-xs lg:max-w-sm">
          <div className="absolute inset-x-10 bottom-4 h-12 rounded-full bg-brand-400/40 blur-2xl" aria-hidden />
          <div className="animate-float-slow">
            <Bidon level={0.82} drops className="w-full drop-shadow-[0_30px_40px_rgba(47,135,214,0.3)]" />
          </div>
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
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            {NATURAL.points.map((p, i) => (
              <motion.li key={p.title} variants={fadeUp} className="group rounded-3xl border border-ink-900/5 bg-white p-6 shadow-card transition hover:-translate-y-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                  {ICONS[i]}
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-900/65">{p.text}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
