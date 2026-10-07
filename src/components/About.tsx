"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading } from "./ui";
import { ABOUT } from "@/lib/content";
import { CONTACT, asset } from "@/lib/site";

function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, value]);
  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="empresa" className="relative bg-white py-24 sm:py-32">
      <div className="container-x grid items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading eyebrow={ABOUT.eyebrow} title={ABOUT.title} align="left" />
          <div className="mt-7 space-y-4 text-lg leading-relaxed text-ink-900/70">
            {ABOUT.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08} as="div">
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 grid grid-cols-3 gap-4">
            {ABOUT.stats.map((s) => (
              <div key={s.label} className="rounded-3xl border border-ink-900/5 bg-foam p-5 text-center">
                <span className="block font-display text-3xl font-extrabold text-brand-700 sm:text-4xl">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-ink-900/55">{s.label}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink-900 to-brand-800 p-8 text-white shadow-float sm:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/img/logo-blanco.png")} alt="Upsala" className="h-14 w-auto opacity-95" />
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-aqua-300">Agua mineral natural</p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-aqua-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" /></svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{ABOUT.plantLabel}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/85">{CONTACT.plant}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-aqua-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{ABOUT.salesLabel}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/85">{CONTACT.sales}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <RouteMap />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Recorrido animado: de la planta en 9 de Julio hasta la Ciudad de Buenos Aires. */
function RouteMap() {
  return (
    <div>
      <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="De 9 de Julio a Buenos Aires, 260 kilómetros">
        <defs>
          <linearGradient id="route" x1="0" x2="1">
            <stop offset="0" stopColor="#7adcf0" />
            <stop offset="1" stopColor="#58a6e8" />
          </linearGradient>
        </defs>
        {/* la ruta queda fija; lo que se mueve es el punteado (dashoffset) y un camioncito que la recorre */}
        <path d="M24 60 C 90 20, 180 80, 296 36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 60 C 90 20, 180 80, 296 36" fill="none" stroke="url(#route)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 8" className="animate-dash" />
        <circle cx="24" cy="60" r="6" fill="#7adcf0" />
        <circle cx="24" cy="60" r="11" fill="none" stroke="#7adcf0" strokeOpacity="0.5" className="animate-pulse-soft" />
        <circle cx="296" cy="36" r="6" fill="#ffffff" />
        <circle cx="296" cy="36" r="11" fill="none" stroke="#ffffff" strokeOpacity="0.5" className="animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <g>
          <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" calcMode="spline" keySplines="0.4 0 0.6 1" keyTimes="0;1" path="M24 60 C 90 20, 180 80, 296 36" />
          <g transform="translate(-10 -7)">
            <rect x="0" y="2" width="12" height="9" rx="2" fill="#ffffff" />
            <path d="M12 5h4l3 3v3h-7z" fill="#ffffff" />
            <circle cx="4" cy="12" r="2" fill="#0c2640" stroke="#ffffff" strokeWidth="1.2" />
            <circle cx="15" cy="12" r="2" fill="#0c2640" stroke="#ffffff" strokeWidth="1.2" />
          </g>
        </g>
        <text x="24" y="82" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10" fontWeight="600">9 de Julio</text>
        <text x="290" y="20" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10" fontWeight="600">CABA</text>
      </svg>
      <p className="mt-1 text-center text-xs text-white/50">Envasada en origen y repartida en la Ciudad de Buenos Aires</p>
    </div>
  );
}
