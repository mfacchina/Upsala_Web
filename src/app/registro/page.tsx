import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { RegisterForm } from "@/components/RegisterForm";
import { WhatsAppIcon } from "@/components/ui";
import { PROMO, REGISTER } from "@/lib/content";
import { CONTACT, WHATSAPP_URL, asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "Registrate y recibí agua mineral natural en tu casa",
  description: "Completá tus datos, elegí tu barrio y te confirmamos al instante si tenemos cobertura. 50% de descuento en tu primer bidón.",
  alternates: { canonical: "/registro/" },
};

/**
 * Pagina de registro sola, pensada como destino de las campanias (Instagram, Facebook):
 * sin menu ni secciones, carga rapido y va directo al formulario.
 */
export default function RegistroPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-foam to-white">
      <header className="container-x flex h-16 items-center justify-between sm:h-20">
        <a href="/" aria-label="Upsala, ir al sitio">
          <Logo className="h-8 sm:h-9" />
        </a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="btn-wa !px-4 !py-2.5 !text-sm">
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
      </header>

      <div className="container-x grid gap-8 pb-16 pt-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div>
          <span className="eyebrow bg-white text-brand-700 ring-1 ring-brand-200">{REGISTER.eyebrow}</span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
            Agua mineral natural, <span className="bg-gradient-to-r from-brand-600 to-aqua-500 bg-clip-text text-transparent">en la puerta de tu casa.</span>
          </h1>
          <p className="mt-4 text-ink-900/65">{REGISTER.text}</p>
          <div className="mt-6 rounded-3xl bg-gradient-to-br from-brand-600 to-ink-900 p-6 text-white shadow-float">
            <span className="rounded-full bg-sun px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-900">{PROMO.badge}</span>
            <p className="mt-3 font-display text-3xl font-extrabold">{PROMO.title}</p>
            <p className="mt-1 text-sm text-white/75">{PROMO.text}</p>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-ink-900/70">
            <li>✓ Bidones de 12 y 20 litros, retornables</li>
            <li>✓ Dispenser frío/calor en comodato</li>
            <li>✓ Sin mínimos ni contratos para los bidones</li>
            <li>✓ Te avisamos por WhatsApp antes de cada visita</li>
          </ul>
          <div className="mt-8 hidden overflow-hidden rounded-[2rem] shadow-card lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/img/foto-familia-bidon.webp")} alt="Bidón Upsala de 20 litros en la cocina de una familia" className="aspect-[4/5] w-full object-cover object-top" />
          </div>
        </div>
        <div className="rounded-[2rem] border border-ink-900/5 bg-white p-6 shadow-card sm:p-9">
          <RegisterForm />
        </div>
      </div>

      <footer className="container-x pb-10 text-center text-xs text-ink-900/45">
        Upsala · Agua mineral natural · {CONTACT.email} · <a href="/" className="underline">upsala.com.ar</a>
      </footer>
    </main>
  );
}
