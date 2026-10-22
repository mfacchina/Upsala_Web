import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { CopyField } from "@/components/CopyField";
import { CONTACT, PAYMENT, WHATSAPP_ADMIN, asset, phoneDisplay, waUrl } from "@/lib/site";

/**
 * Pagina a la que llega alguien con saldo pendiente: es el destino del link de pago
 * cargado en Equifax Mora Control, que viaja como QR impreso en las cartas y como
 * link en los SMS de intimacion.
 *
 * Tres decisiones a tener en cuenta si se toca:
 *  - Sin indexar: es una pagina de cobranza, no de venta. No va en Google ni en el menu.
 *  - Sin ofertas ni promociones: el que entra acaba de recibir una intimacion.
 *  - El numero de operacion en el concepto es lo mas importante de la pagina. Sin eso
 *    la transferencia llega sin saber de quien es y no se le puede dar de baja la deuda.
 */
export const metadata: Metadata = {
  title: "Pagar tu cuenta",
  description: "Datos para transferir y regularizar tu cuenta con Upsala.",
  alternates: { canonical: "/pagar/" },
  robots: { index: false, follow: false },
};

const WA_TEXT = "Hola, quiero regularizar mi cuenta. Mi número de operación es:";

export default function Page() {
  return (
    <main className="min-h-screen bg-foam">
      <header className="border-b border-ink-900/10 bg-white">
        <div className="mx-auto flex max-w-2xl items-center px-5 py-4 sm:px-6">
          <a href={asset("/")} aria-label="Upsala, ir al inicio">
            <Logo className="h-9" />
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 pb-20 pt-10 sm:px-6 sm:pt-14">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Pagar tu cuenta
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-900/70">
          Transferí desde tu banco o billetera virtual con estos datos. Si tenés dudas sobre el
          importe, escribinos y lo revisamos juntos.
        </p>

        <section className="mt-8 flex flex-col gap-3" aria-labelledby="datos">
          <h2 id="datos" className="sr-only">
            Datos para transferir
          </h2>
          <CopyField label="Alias" value={PAYMENT.alias} />
          {PAYMENT.cvu && (
            <CopyField label="CVU" value={PAYMENT.cvu} hint="Va en el mismo campo que un CBU." />
          )}
          <div className="rounded-2xl border border-ink-900/10 bg-white p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-900/45">Titular</p>
            <p className="mt-1 font-display text-lg font-bold text-ink-900">{PAYMENT.holder}</p>
          </div>
        </section>

        {/* Lo unico que no puede pasarse por alto: sin el numero de operacion la
            transferencia llega sin identificar y la deuda no se puede dar de baja. */}
        <section className="mt-6 rounded-2xl border-l-4 border-brand-600 bg-brand-50 p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-ink-900">
            Importante: poné tu número de operación
          </h2>
          <p className="mt-2 leading-relaxed text-ink-900/75">
            Al transferir, escribí tu número de operación en el <strong>concepto</strong> o la
            referencia. Lo encontrás en la carta o el mensaje que recibiste, y tiene esta forma:
          </p>
          <p className="mt-3 inline-block rounded-lg bg-white px-3 py-2 font-display text-lg font-bold tracking-wide text-brand-800">
            CC-2026-000
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-900/60">
            Sin ese dato no podemos identificar tu pago y la deuda sigue figurando a tu nombre.
          </p>
        </section>

        <section className="mt-8" aria-labelledby="despues">
          <h2 id="despues" className="font-display text-xl font-bold text-ink-900">
            Después de transferir
          </h2>
          <p className="mt-2 leading-relaxed text-ink-900/70">
            Mandanos el comprobante y damos de baja la deuda. Es el paso que hace que deje de
            figurar.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={waUrl(WA_TEXT, WHATSAPP_ADMIN)}
              target="_blank"
              rel="noopener"
              className="btn-wa w-full sm:w-auto"
            >
              Enviar comprobante por WhatsApp
            </a>
            <a href={`mailto:${CONTACT.businessEmail}`} className="btn-ghost-dark w-full sm:w-auto">
              Escribir por mail
            </a>
          </div>
          <dl className="mt-6 space-y-1 text-sm text-ink-900/60">
            <div className="flex gap-2">
              <dt className="font-semibold text-ink-900/75">WhatsApp:</dt>
              <dd>{phoneDisplay(WHATSAPP_ADMIN)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-ink-900/75">Mail:</dt>
              <dd>{CONTACT.businessEmail}</dd>
            </div>
          </dl>
        </section>

        {/* La razon social ya termina en punto, asi que no se le agrega otro. */}
        <p className="mt-12 border-t border-ink-900/10 pt-6 text-sm leading-relaxed text-ink-900/50">
          Upsala es una marca de {PAYMENT.holder} Esta es su página oficial de pagos: los únicos
          datos válidos para transferir son los que figuran acá arriba. Nunca te vamos a pedir que
          transfieras a otra cuenta ni por otro canal.
        </p>
      </div>
    </main>
  );
}
