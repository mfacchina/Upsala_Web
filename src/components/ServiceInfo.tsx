"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Reveal, SectionHeading, fadeUp, stagger } from "./ui";
import { SERVICE } from "@/lib/content";
import { DELIVERY_HOURS } from "@/lib/site";
import { fetchFormOptions } from "@/lib/api";

const ICONS: Record<string, React.ReactNode> = {
  dia: <path d="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 12h3v3H8z" />,
  hora: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  pago: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.5 9.5h.01M17.5 14.5h.01" />
    </>
  ),
  envase: <path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6M17.7 3v3.4h-3.4M6.3 21v-3.4h3.4" />,
  precio: <path d="M12 3v18M7.5 7.5h6.5a2.5 2.5 0 0 1 0 5H10a2.5 2.5 0 0 0 0 5h6.5" />,
  minimo: <path d="M5 12.5l4 4 10-10" />,
};

const DAY_ORDER = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** Condiciones del servicio + que dia pasamos por cada barrio (de la API de la app). */
export function ServiceInfo() {
  const [byDay, setByDay] = useState<[string, string[]][] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchFormOptions().then((o) => {
      if (!alive || !o.live) return;
      const map = new Map<string, string[]>();
      for (const b of o.barrios) if (b.covered && b.day) map.set(b.day, [...(map.get(b.day) ?? []), b.name]);
      setByDay(DAY_ORDER.filter((d) => map.has(d)).map((d) => [d, map.get(d)!.sort((a, b) => a.localeCompare(b, "es"))]));
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="condiciones" className="relative scroll-mt-20 bg-white py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={SERVICE.eyebrow} title={SERVICE.title} text={SERVICE.text} />

        <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE.items.map((it) => (
            <motion.li key={it.key} variants={fadeUp} className="flex gap-4 rounded-3xl border border-ink-900/5 bg-foam p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONS[it.key]}
                </svg>
              </span>
              <span>
                <span className="block font-display text-lg font-bold text-ink-900">{it.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-900/65">{it.text}</span>
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {byDay && byDay.length > 0 && (
          <Reveal className="mt-14">
            <h3 className="text-center font-display text-2xl font-bold text-ink-900 sm:text-3xl">{SERVICE.daysTitle}</h3>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-ink-900/60">{SERVICE.daysNote}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {byDay.map(([d, barrios]) => (
                <div key={d} className="rounded-3xl border border-ink-900/5 bg-white p-5 shadow-card">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-xl font-extrabold capitalize text-brand-700">{d}</span>
                    <span className="text-xs text-ink-900/45">{DELIVERY_HOURS}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-900/70">{barrios.join(" · ")}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <a href="#registro" className="btn-primary">
                Armar mi pedido
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
