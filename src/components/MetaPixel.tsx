"use client";

import { useEffect } from "react";
import { rememberSource, trackContact } from "@/lib/api";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Pixel de Meta (solo si hay META_PIXEL_ID) y captura de UTM.
 *
 * Eventos que manda el sitio:
 * - PageView: cada pagina.
 * - Lead: cuando un formulario se guarda en la app (cliente, dispenser, empresa o revendedor).
 * - Contact: cada click a WhatsApp (incluye "Confirmar por WhatsApp" despues del formulario).
 *
 * El "stub" de fbq es el del snippet oficial de Meta: encola las llamadas hasta que carga
 * fbevents.js y despues se las pasa por callMethod. Sin eso, los eventos que se disparan
 * despues de la carga (como Lead) se pierden.
 */
export function MetaPixel({ id }: { id: string }) {
  useEffect(() => {
    rememberSource();
    if (!id) return;
    const w = window as any;
    if (!w.fbq) {
      const n: any = function () {
        // eslint-disable-next-line prefer-rest-params
        if (n.callMethod) n.callMethod.apply(n, arguments);
        // eslint-disable-next-line prefer-rest-params
        else n.queue.push(arguments);
      };
      if (!w._fbq) w._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      w.fbq = n;
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(s);
      w.fbq("init", id);
    }
    w.fbq("track", "PageView");

    // Contact en cualquier link a WhatsApp, este donde este.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href*='wa.me/']") as HTMLAnchorElement | null;
      if (a) trackContact(a.dataset.waContext ?? "whatsapp");
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [id]);
  return null;
}
