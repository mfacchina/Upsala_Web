"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { WhatsAppIcon } from "./ui";
import { WHATSAPP_URL, asset } from "@/lib/site";

/**
 * Barra fija abajo, solo en celular: "Armar mi pedido" + WhatsApp. Reemplaza a los botones
 * flotantes (que en pantallas chicas tapaban texto y campos). Aparece despues del primer
 * scroll y se esconde mientras el formulario esta en pantalla, para no taparlo.
 */
export function MobileCta({ href = "/#registro", label = "Armar mi pedido", watch = "#registro, #pedir" }: { href?: string; label?: string; watch?: string }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [formInView, setFormInView] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 450));

  useEffect(() => {
    const targets = [...document.querySelectorAll(watch)];
    if (!targets.length) return;
    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? seen.add(e.target) : seen.delete(e.target);
        setFormInView(seen.size > 0);
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [watch]);

  const visible = scrolled && !formInView;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ type: "spring", stiffness: 400, damping: 36 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-900/10 bg-white/95 px-4 pt-3 shadow-[0_-10px_30px_-12px_rgba(12,38,64,0.25)] backdrop-blur sm:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center gap-3">
            <a href={href.startsWith("/") ? asset(href) : href} className="btn-primary flex-1 !py-3.5 !text-base">
              {label}
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" data-wa-context="barra_movil" aria-label="Escribir por WhatsApp" className="btn-wa h-[52px] w-[52px] shrink-0 !p-0">
              <WhatsAppIcon className="h-6 w-6" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
