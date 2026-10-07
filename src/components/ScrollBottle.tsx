"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Bidon } from "./illustrations/Bidon";

/** Bidon chico fijo abajo a la derecha: se llena con el avance de la pagina y vuelve arriba al tocarlo. */
export function ScrollBottle() {
  const { scrollYProgress, scrollY } = useScroll();
  const level = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 400));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Volver arriba"
          title="Volver arriba"
          className="fixed bottom-5 right-5 z-40 flex h-16 w-11 items-end justify-center rounded-2xl bg-white/80 p-1 shadow-card ring-1 ring-ink-900/10 backdrop-blur sm:bottom-7 sm:right-7"
        >
          <Bidon level={level} className="h-full w-auto" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
