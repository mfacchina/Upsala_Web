"use client";

import { motion } from "motion/react";
import { Check, Reveal, SectionHeading } from "./ui";
import { PRODUCTS } from "@/lib/content";
import { asset } from "@/lib/site";

export function Products() {
  return (
    <section id="productos" className="relative bg-white py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={PRODUCTS.eyebrow} title={PRODUCTS.title} text={PRODUCTS.text} />

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {PRODUCTS.items.map((p, i) => (
            <Reveal key={p.key} delay={i * 0.12} className="group relative overflow-hidden rounded-[2rem] border border-ink-900/5 bg-gradient-to-b from-brand-50 to-white p-7 shadow-card sm:p-9">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-aqua-200/50 blur-3xl transition group-hover:bg-aqua-300/60" aria-hidden />
              <div className="relative grid items-center gap-6 sm:grid-cols-[0.8fr_1.2fr]">
                <motion.div whileHover={{ scale: 1.04, rotate: -1.5 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="relative mx-auto flex items-end justify-center" style={{ height: p.liters === 20 ? 300 : 260 }}>
                  <div className="absolute inset-x-6 bottom-2 h-8 rounded-full bg-brand-500/30 blur-xl" aria-hidden />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(p.image)} alt={p.name} className="relative h-full w-auto object-contain drop-shadow-[0_20px_30px_rgba(47,135,214,0.3)]" />
                </motion.div>
                <div>
                  <span className="eyebrow bg-white text-brand-700 ring-1 ring-brand-200">{p.name}</span>
                  <h3 className="mt-4 text-2xl font-bold text-ink-900">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-900/65">{p.text}</p>
                  <ul className="mt-5 space-y-2">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-ink-900/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a href="#registro" className="btn-primary mt-7 !px-6 !py-3 !text-sm">
                    Pedir bidón de {p.liters} L
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 rounded-3xl border border-ink-900/5 bg-foam p-6 text-center text-sm text-ink-900/70 sm:p-8">
          Los bidones son <strong className="text-ink-900">retornables</strong>: en cada visita te dejamos los llenos y nos llevamos los vacíos, lavados y sanitizados en planta antes de volver a envasar.
        </Reveal>
      </div>
    </section>
  );
}
