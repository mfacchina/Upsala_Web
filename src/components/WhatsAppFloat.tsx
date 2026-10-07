"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { WhatsAppIcon } from "./ui";
import { WHATSAPP_URL } from "@/lib/site";

/** Boton de WhatsApp fijo abajo a la izquierda, aparece despues del primer scroll. */
export function WhatsAppFloat() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 300));

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Escribir por WhatsApp"
          className="btn-wa fixed bottom-5 left-5 z-40 !px-4 !py-3 !text-sm shadow-float sm:bottom-7 sm:left-7"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
