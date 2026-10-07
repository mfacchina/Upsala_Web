"use client";

import { RegisterForm } from "./RegisterForm";
import { Bidon } from "./illustrations/Bidon";
import { Reveal, SectionHeading, WhatsAppIcon } from "./ui";
import { PROMO, REGISTER } from "@/lib/content";
import { CONTACT, WHATSAPP_URL } from "@/lib/site";

export function RegisterSection() {
  return (
    <section id="registro" className="relative scroll-mt-20 bg-white py-24 sm:py-32">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="lg:sticky lg:top-28">
          <SectionHeading eyebrow={REGISTER.eyebrow} title={REGISTER.title} text={REGISTER.text} align="left" />

          <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-ink-900 p-7 text-white shadow-float">
            <span className="rounded-full bg-sun px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-900">{PROMO.badge}</span>
            <p className="text-glow mt-4 font-display text-4xl font-extrabold">{PROMO.title}</p>
            <p className="mt-2 text-sm text-white/75">{PROMO.text}</p>
            <div className="pointer-events-none absolute -bottom-8 -right-6 w-28 rotate-[12deg] opacity-40" aria-hidden>
              <Bidon level={0.7} tone="dark" className="w-full" />
            </div>
          </Reveal>

          <Reveal delay={0.2} className="mt-6 space-y-3 text-sm text-ink-900/65">
            <p>¿Preferís hablar con alguien? Escribinos directo.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="btn-wa !px-5 !py-3 !text-sm">
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp {CONTACT.phoneDisplay}
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative rounded-[2rem] border border-ink-900/5 bg-foam p-6 shadow-card sm:p-9">
          <RegisterForm />
        </Reveal>
      </div>
    </section>
  );
}
