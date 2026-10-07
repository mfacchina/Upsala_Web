"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./ui";
import { NAV_LINKS } from "@/lib/content";
import { WHATSAPP_URL } from "@/lib/site";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-white/85 shadow-lg shadow-ink-950/10 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between sm:h-[72px]">
        <a href="/#inicio" aria-label="Upsala, ir al inicio" onClick={() => setOpen(false)}>
          <Logo className="h-8 sm:h-9" />
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Secciones">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink-900/70 transition hover:text-ink-900">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="btn-wa hidden !px-4 !py-2.5 !text-sm md:inline-flex">
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
          <a href="/#registro" className="btn-primary !px-4 !py-2.5 !text-sm">
            Quiero agua
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-movil"
            aria-label="Secciones"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ink-900/10 lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base font-medium text-ink-900/85 hover:bg-brand-50">
                  {l.label}
                </a>
              ))}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="btn-wa mt-3">
                <WhatsAppIcon />
                Escribir por WhatsApp
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
