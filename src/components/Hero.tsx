"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Drop, WaveDivider } from "./illustrations/Decor";
import { WhatsAppIcon } from "./ui";
import { HERO, PROMO } from "@/lib/content";
import { WHATSAPP_URL, asset } from "@/lib/site";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const bottleY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 110]);
  const bgY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 60]);
  const chipsY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 40]);

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-white pt-28 sm:pt-36">
      {/* fondo: foto de agua + brillos */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/img/hero-agua.webp")} alt="" className="h-full w-full object-cover object-left-bottom opacity-90" />
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/55 to-foam" />
        <div className="absolute right-[-10%] top-[10%] h-[50vh] w-[50vw] rounded-full bg-aqua-300/30 blur-[120px]" />
      </motion.div>
      <FloatingDrops />

      <div className="container-x relative grid items-center gap-12 pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pb-40">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow bg-white/80 text-brand-700 ring-1 ring-brand-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-aqua-500 animate-pulse-soft" />
            {HERO.eyebrow}
          </motion.span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-ink-900 sm:text-5xl lg:text-[3.9rem]">
            {HERO.title.map((line, i) => (
              <motion.span
                key={line}
                className="block"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {i === 1 ? <span className="bg-gradient-to-r from-brand-600 to-aqua-500 bg-clip-text text-transparent">{line}</span> : line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-900/70 sm:text-xl"
          >
            {HERO.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a href="#registro" className="btn-primary !px-8">
              {HERO.primaryCta}
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 10h12m0 0l-5-5m5 5l-5 5" />
              </svg>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="btn-wa">
              <WhatsAppIcon />
              {HERO.secondaryCta}
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 flex items-center gap-3 text-sm text-ink-900/60"
          >
            <span className="inline-flex -space-x-2">
              {["#2f87d6", "#3cc9e8", "#8cc4f2"].map((c) => (
                <span key={c} className="h-6 w-6 rounded-full ring-2 ring-white" style={{ background: c }} />
              ))}
            </span>
            {HERO.trust}
          </motion.p>
        </div>

        {/* bidon real + chips */}
        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center lg:max-w-none">
          <motion.div style={{ y: bottleY }} className="relative z-10 w-[190px] sm:w-[280px] lg:w-[330px]">
            <div className="absolute inset-x-8 bottom-0 h-10 rounded-full bg-brand-500/40 blur-2xl" aria-hidden />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="animate-float-slow drop-shadow-[0_30px_40px_rgba(47,135,214,0.35)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/img/bidon-20.webp")} alt="Bidón Upsala de 20 litros" className="w-full" width={239} height={450} />
            </motion.div>
            {/* brillo que recorre el bidon */}
            {!reduce && (
              <span className="pointer-events-none absolute inset-y-10 left-0 w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" aria-hidden />
            )}
          </motion.div>

          <motion.ul style={{ y: chipsY }} className="pointer-events-none absolute inset-0 z-20" aria-label="Beneficios">
            {HERO.chips.map((chip, i) => (
              <motion.li
                key={chip.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 1 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={`glass absolute flex items-center gap-3 px-4 py-3 shadow-card animate-float ${CHIP_POS[i]}`}
                style={{ animationDelay: `${i * 0.8}s` }}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${CHIP_ICON_BG[i]}`}>{CHIP_ICONS[i]}</span>
                <span className="leading-tight">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-900/50">{chip.label}</span>
                  <span className="block text-sm font-semibold text-ink-900">{chip.value}</span>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* cinta de promo */}
      <motion.a
        href="#registro"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="container-x relative z-10 -mt-14 mb-16 block lg:-mt-24"
      >
        <span className="mx-auto flex max-w-2xl items-center gap-4 rounded-2xl border border-sun/40 bg-white/90 px-5 py-3 shadow-card backdrop-blur">
          <span className="rounded-full bg-sun px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-900">{PROMO.badge}</span>
          <span className="text-sm text-ink-900/80">
            <strong className="text-ink-900">{PROMO.title}.</strong> {PROMO.text}
          </span>
        </span>
      </motion.a>

      <WaveDivider fill="#f5fafe" />
    </section>
  );
}

const CHIP_POS = ["left-0 top-[6%] sm:-left-6 lg:left-0", "right-0 top-[40%] sm:-right-8 lg:right-0", "left-2 bottom-[6%] sm:-left-2 lg:left-6"];

const CHIP_ICON_BG = ["bg-sun/30 text-ink-900", "bg-brand-100 text-brand-700", "bg-aqua-200 text-brand-800"];

const CHIP_ICONS = [
  <svg key="a" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.6 5.1 17.2 6 11.7 2 7.8 7.6 7z" />
  </svg>,
  <svg key="b" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10.5l4 4 8-9" />
  </svg>,
  <svg key="c" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6h9v8H2zM11 9h4l3 3v2h-7z" />
    <circle cx="5.5" cy="15" r="1.5" />
    <circle cx="14.5" cy="15" r="1.5" />
  </svg>,
];

const DROPS = [
  { left: 8, top: 20, size: 18, delay: 0 },
  { left: 22, top: 70, size: 12, delay: 1.1 },
  { left: 55, top: 15, size: 10, delay: 2.2 },
  { left: 88, top: 60, size: 16, delay: 0.6 },
  { left: 70, top: 85, size: 9, delay: 1.7 },
];

function FloatingDrops() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {DROPS.map((d, i) => (
        <Drop
          key={i}
          className="absolute text-brand-300/60 animate-float"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, animationDelay: `${d.delay}s`, animationDuration: `${6 + i}s` }}
        />
      ))}
    </div>
  );
}
