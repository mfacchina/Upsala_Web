"use client";

import { motion } from "motion/react";
import { SectionHeading, fadeUp, stagger } from "./ui";
import { STEPS } from "@/lib/content";

const ICONS = [
  <svg key="a" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="3" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>,
  <svg key="b" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h16v11H9l-5 4z" />
    <path d="M8 9h8M8 12h5" />
  </svg>,
  <svg key="c" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>,
];

export function Steps() {
  return (
    <section id="como-funciona" className="relative bg-foam bg-dots py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={STEPS.eyebrow} title={STEPS.title} />
        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative mt-14 grid gap-6 md:grid-cols-3"
        >
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-12 hidden h-0.5 bg-gradient-to-r from-brand-200 via-aqua-300 to-brand-200 md:block" aria-hidden />
          {STEPS.items.map((s, i) => (
            <motion.li key={s.title} variants={fadeUp} className="relative rounded-3xl border border-ink-900/5 bg-white p-7 shadow-card">
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-glow">
                {ICONS[i]}
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-sun font-display text-sm font-extrabold text-ink-900 ring-4 ring-white">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink-900">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-900/65">{s.text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
