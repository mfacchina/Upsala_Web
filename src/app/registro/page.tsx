import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { RegisterForm } from "@/components/RegisterForm";
import { WhatsAppIcon } from "@/components/ui";
import { PROMO, REGISTER } from "@/lib/content";
import { CONTACT, WHATSAPP_URL, asset } from "@/lib/site";
import { PRICE, ars } from "@/lib/order";

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
        <a href={asset("/")} aria-label="Upsala, ir al sitio">
          <Logo className="h-8 sm:h-9" />
        </a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="btn-wa !px-4 !py-2.5 !text-sm">
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
      </header>

      {/* Celular: titulo y promo compactos -> formulario -> condiciones (la gente llega desde
          un anuncio y tiene que ver el formulario enseguida). Compu: titulo y condiciones a la
          izquierda, formulario a la derecha. */}
      <div className="container-x grid gap-6 pb-16 pt-2 sm:pt-6 lg:grid-cols-[0.8fr_1.2fr] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-6">
        <div>
          <span className="eyebrow hidden bg-white text-brand-700 ring-1 ring-brand-200 sm:inline-flex">{REGISTER.eyebrow}</span>
          <h1 className="text-2xl font-extrabold leading-tight text-ink-900 sm:mt-5 sm:text-4xl">
            Agua mineral natural, <span className="bg-gradient-to-r from-brand-600 to-aqua-500 bg-clip-text text-transparent">en la puerta de tu casa.</span>
          </h1>
          <p className="mt-3 hidden text-ink-900/65 sm:block">{REGISTER.text}</p>
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-brand-600 to-ink-900 px-4 py-3 text-white shadow-float sm:mt-6 sm:block sm:rounded-3xl sm:p-6">
            <span className="shrink-0 rounded-full bg-sun px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-900">{PROMO.badge}</span>
            <p className="font-display text-lg font-extrabold leading-tight sm:mt-3 sm:text-3xl">{PROMO.title}</p>
            <p className="mt-1 hidden text-sm text-white/75 sm:block">{PROMO.text}</p>
          </div>
        </div>
        <div className="rounded-[2rem] border border-ink-900/5 bg-white p-5 shadow-card sm:p-9 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <RegisterForm />
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <ul className="space-y-2.5 text-sm text-ink-900/75">
            <li>
              ✓ <strong className="text-ink-900">Bidón 20 L {ars(PRICE.b20)}</strong> y <strong className="text-ink-900">12 L {ars(PRICE.b12)}</strong>, precio final
            </li>
            <li>✓ Un día fijo de reparto por barrio, <strong className="text-ink-900">de 9 a 17 hs</strong></li>
            <li>✓ <strong className="text-ink-900">Pagás al recibir</strong>, en efectivo o transferencia</li>
            <li>✓ Bidones <strong className="text-ink-900">retornables</strong>: cuando se vacían nos los devolvés</li>
            <li>✓ Sin mínimos ni contratos; te avisamos por WhatsApp antes de cada visita</li>
          </ul>
          <div className="mt-8 hidden overflow-hidden rounded-[2rem] shadow-card lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" src={asset("/img/foto-familia-bidon-m.webp")} alt="Bidón Upsala de 20 litros en la cocina de una familia" className="aspect-[4/5] w-full object-cover object-top" />
          </div>
        </div>
      </div>

      <footer className="container-x pb-10 text-center text-xs text-ink-900/45">
        Upsala · Agua mineral natural · {CONTACT.email} · <a href={asset("/")} className="underline">upsala.com.ar</a>
      </footer>
    </main>
  );
}
