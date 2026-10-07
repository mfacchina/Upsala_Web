"use client";

import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { asset } from "@/lib/site";

/**
 * Video corto con poster: no carga nada hasta que entra en pantalla y recien reproduce
 * (sin sonido, en loop) cuando la persona lo ve. Con `controls` deja activar el audio.
 */
export function VideoBlock({
  src,
  poster,
  className = "",
  controls = true,
  autoPlay = true,
  label,
}: {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const [ready, setReady] = useState(false);
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[2rem] bg-ink-900 shadow-float ${className}`}>
      {poster && !ready && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset(poster)} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
      )}
      {inView && (
        <video
          className="h-full w-full object-cover"
          src={asset(src)}
          poster={poster ? asset(poster) : undefined}
          muted
          loop
          playsInline
          autoPlay={autoPlay}
          controls={controls}
          preload="metadata"
          aria-label={label}
          onLoadedData={() => setReady(true)}
        />
      )}
    </div>
  );
}
