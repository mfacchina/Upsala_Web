"use client";

import { Bidon } from "./illustrations/Bidon";
import { Bubbles } from "./illustrations/Decor";
import { Reveal, WhatsAppIcon } from "./ui";
import { FINAL_CTA } from "@/lib/content";
import { CONTACT, WHATSAPP_URL } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="contacto" className="relative isolate overflow-hidden bg-gradient-to-b from-foam to-brand-100 py-24 sm:py-28">
      <Bubbles className="opacity-60" />
      <div className="container-x">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-white bg-white/70 px-6 py-14 text-center shadow-card backdrop-blur-md sm:px-14">
          <div className="pointer-events-none absolute -left-10 -bottom-10 w-36 rotate-[-12deg] opacity-50 sm:w-44" aria-hidden>
            <Bidon level={0.7} className="w-full" />
          </div>
          <div className="pointer-events-none absolute -right-8 -top-12 w-28 rotate-[14deg] opacity-40 sm:w-36" aria-hidden>
            <Bidon level={0.5} className="w-full" />
          </div>

          <Reveal>
            <h2 className="font-display text-3xl font-extrabold text-ink-900 sm:text-5xl">{FINAL_CTA.title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-900/65">{FINAL_CTA.text}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#registro" className="btn-primary !px-8 !py-4 !text-lg">
                {FINAL_CTA.button}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="btn-wa">
                <WhatsAppIcon />
                WhatsApp
              </a>
            </div>
            <p className="mt-8 text-sm text-ink-900/50">
              {CONTACT.phoneDisplay} · {CONTACT.email} · {CONTACT.instagramHandle}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
