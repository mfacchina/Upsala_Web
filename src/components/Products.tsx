"use client";

import { motion } from "motion/react";
import { Check, Reveal, SectionHeading, WhatsAppIcon } from "./ui";
import { PRODUCTS, PROMO } from "@/lib/content";
import { ars, asset, waUrl } from "@/lib/site";

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
                  <img loading="lazy" src={asset(p.image)} alt={p.name} className="relative h-full w-auto object-contain drop-shadow-[0_20px_30px_rgba(47,135,214,0.3)]" />
                </motion.div>
                <div>
                  <span className="eyebrow bg-white text-brand-700 ring-1 ring-brand-200">{p.name}</span>
                  <h3 className="mt-4 text-2xl font-bold text-ink-900">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-900/65">{p.text}</p>

                  {/* precio */}
                  <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-1">
                    <span className="font-display text-4xl font-extrabold text-ink-900">{ars(p.price)}</span>
                    <span className="pb-1.5 text-sm text-ink-900/55">por bidón</span>
                    <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-sun/25 px-2.5 py-1 text-xs font-semibold text-ink-900">
                      Primer bidón {ars(p.price / 2)}
                    </span>
                  </div>

                  <ul className="mt-5 space-y-2">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-ink-900/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a href="#registro" className="btn-primary !px-6 !py-3 !text-sm">
                      Pedir bidón de {p.liters} L
                    </a>
                    <a
                      href={waUrl(`Hola Upsala! Quiero pedir un bidón de ${p.liters} litros de agua mineral natural a domicilio.`)}
                      target="_blank"
                      rel="noopener"
                      className="btn-wa !px-5 !py-3 !text-sm"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      Pedir por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 text-center text-xs text-ink-900/50">
          {PRODUCTS.priceNote} {PROMO.badge}: {PROMO.title.toLowerCase()}.
        </Reveal>

        {/* posicionamiento de precio */}
        <Reveal className="mt-10 overflow-hidden rounded-[2rem] border border-ink-900/5 bg-foam">
          <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{PRODUCTS.pricing.title}</h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-ink-900/65">{PRODUCTS.pricing.text}</p>
            </div>
            <div className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-full ring-8 ring-white shadow-card sm:h-48 sm:w-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={asset("/img/foto-vaso-m.webp")} alt="Vaso de agua mineral natural Upsala" className="h-full w-full object-cover" />
            </div>
          </div>
          <p className="border-t border-ink-900/5 px-7 py-4 text-center text-sm text-ink-900/60 sm:px-10">
            Los bidones son <strong className="text-ink-900">retornables</strong>: en cada visita te dejamos los llenos y nos llevamos los vacíos, lavados y sanitizados en planta antes de volver a envasar.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
