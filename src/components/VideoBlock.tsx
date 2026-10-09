"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { asset } from "@/lib/site";

/** Celular, "ahorro de datos" o "reducir movimiento": no bajar videos solos. */
function shouldAutoplay() {
  if (typeof window === "undefined") return false;
  const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(min-width: 1024px)").matches && !conn?.saveData && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Video corto con poster.
 * - En compu: se carga recien cuando entra en pantalla y se reproduce solo, sin sonido, en loop.
 * - En celular: muestra la foto con un boton de play; el video (1 a 6 MB) se baja solo si lo tocan.
 */
export function VideoBlock({
  src,
  poster,
  className = "",
  label,
}: {
  src: string;
  poster?: string;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const [auto, setAuto] = useState(false);
  const [play, setPlay] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => setAuto(shouldAutoplay()), []);
  const load = (auto && inView) || play;

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[2rem] bg-ink-900 shadow-float ${className}`}>
      {poster && !ready && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset(poster)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
      )}
      {load && (
        <video
          className="h-full w-full object-cover"
          src={asset(src)}
          poster={poster ? asset(poster) : undefined}
          muted={!play}
          loop
          playsInline
          autoPlay
          controls={play}
          preload="metadata"
          aria-label={label}
          onLoadedData={() => setReady(true)}
        />
      )}
      {!load && (
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="absolute inset-0 flex items-center justify-center bg-ink-900/15 transition hover:bg-ink-900/25"
          aria-label={`Reproducir video: ${label}`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-float">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
