"use client";

import { motion } from "motion/react";
import { ResellerForm } from "./ResellerForm";
import { Bubbles, WaveDivider } from "./illustrations/Decor";
import { Reveal, SectionHeading, fadeUp, stagger } from "./ui";
import { RESELLERS } from "@/lib/content";

const ICONS = [
  <svg key="a" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M7 7.5h7a2.5 2.5 0 0 1 0 5H9a2.5 2.5 0 0 0 0 5h8" /></svg>,
  <svg key="b" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3C8 8 6 11 6 14a6 6 0 0 0 12 0c0-3-2-6-6-11z" /></svg>,
  <svg key="c" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>,
  <svg key="d" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></svg>,
];

export function Resellers() {
  return (
    <section id="revendedores" className="relative isolate overflow-hidden bg-ink-900 pt-28 pb-24 text-white sm:pt-36 sm:pb-32">
      <WaveDivider fill="#ffffff" flip />
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute left-1/2 top-[30%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[140px]" />
      </div>
      <Bubbles />

      <div className="container-x relative grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading eyebrow={RESELLERS.eyebrow} title={RESELLERS.title} text={RESELLERS.text} tone="dark" align="left" />
          <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-10 grid gap-4 sm:grid-cols-2">
            {RESELLERS.points.map((p, i) => (
              <motion.li key={p.title} variants={fadeUp} className="glass-dark p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-400/15 text-aqua-300">{ICONS[i]}</span>
                <h3 className="mt-3 font-semibold text-white">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/65">{p.text}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <Reveal delay={0.15} className="rounded-[2rem] bg-white p-6 text-ink-900 shadow-float sm:p-8">
          <h3 className="text-xl font-bold">Dejanos tus datos</h3>
          <p className="mt-1 mb-5 text-sm text-ink-900/60">Te contamos las condiciones y vemos tu zona.</p>
          <ResellerForm />
        </Reveal>
      </div>

      <WaveDivider fill="#ffffff" />
    </section>
  );
}
