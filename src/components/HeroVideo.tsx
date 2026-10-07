"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { asset } from "@/lib/site";

/**
 * Video de fondo del hero. Solo en pantallas grandes y sin "reducir movimiento":
 * en el celular queda la foto, que pesa mucho menos y no gasta datos.
 */
export function HeroVideo() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    const apply = () => setEnabled(mq.matches && !conn?.saveData);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reduce]);
  if (!enabled) return null;
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover opacity-70"
      src={asset("/video/pureza-natural.mp4")}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
    />
  );
}
