import { Logo } from "./Logo";
import { NAV_LINKS } from "@/lib/content";
import { CONTACT, WHATSAPP_URL, asset } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink-950 py-12 text-white/60">
      <div className="container-x grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo tone="light" className="h-10" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Agua mineral natural envasada en origen en 9 de Julio y repartida a domicilio en la Ciudad de Buenos Aires.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Secciones</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={asset(l.href)} className="transition hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={asset("/registro/")} className="transition hover:text-white">
                Registro de clientes
              </a>
            </li>
            <li>
              <a href={asset("/dispenser/#empresas")} className="transition hover:text-white">
                Dispenser para empresas
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Contacto</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="transition hover:text-white">
                WhatsApp {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="transition hover:text-white">
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={CONTACT.instagram} target="_blank" rel="noopener" className="transition hover:text-white">
                Instagram {CONTACT.instagramHandle}
              </a>
            </li>
            <li className="pt-2 text-xs leading-relaxed text-white/45">
              <span className="block font-semibold text-white/55">Planta embotelladora</span>
              {CONTACT.plant}
            </li>
            <li className="text-xs leading-relaxed text-white/45">
              <span className="block font-semibold text-white/55">Ventas y distribución</span>
              {CONTACT.sales}
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Upsala. Agua mineral natural. Todos los derechos reservados.</p>
        <p>Promociones válidas para clientes nuevos en zonas con cobertura.</p>
      </div>
    </footer>
  );
}
