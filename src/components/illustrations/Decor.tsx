"use client";

/** Elementos decorativos: gotas, burbujas y olas. Sin aleatoriedad para que SSR y cliente coincidan. */

export function Drop({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 34" className={className} style={style} aria-hidden>
      <path d="M12 1 C12 1 1 15 1 22 a11 11 0 0 0 22 0 C23 15 12 1 12 1 Z" fill="currentColor" />
      <ellipse cx="8" cy="22" rx="2" ry="4" fill="white" opacity="0.45" />
    </svg>
  );
}

const BUBBLES = [
  { left: 6, size: 10, delay: 0, dur: 11 },
  { left: 14, size: 6, delay: 2.5, dur: 9 },
  { left: 23, size: 14, delay: 1.2, dur: 13 },
  { left: 37, size: 8, delay: 4.1, dur: 10 },
  { left: 48, size: 5, delay: 0.7, dur: 8 },
  { left: 58, size: 12, delay: 3.3, dur: 12 },
  { left: 67, size: 7, delay: 5.6, dur: 9.5 },
  { left: 76, size: 16, delay: 1.9, dur: 14 },
  { left: 85, size: 6, delay: 4.8, dur: 8.5 },
  { left: 93, size: 9, delay: 2.2, dur: 11.5 },
];

/** Burbujas que suben lentamente. Pensado para fondos oscuros. */
export function Bubbles({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="absolute bottom-[-40px] block rounded-full border border-aqua-300/40 bg-aqua-300/10 animate-bubble"
          style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
        />
      ))}
    </div>
  );
}

const RAIN = [
  { left: 4, delay: 0, dur: 4.5, size: 14 },
  { left: 12, delay: 1.3, dur: 5.2, size: 10 },
  { left: 21, delay: 2.6, dur: 4.1, size: 18 },
  { left: 33, delay: 0.6, dur: 5.8, size: 12 },
  { left: 45, delay: 3.1, dur: 4.6, size: 9 },
  { left: 57, delay: 1.9, dur: 5.5, size: 16 },
  { left: 66, delay: 0.2, dur: 4.3, size: 11 },
  { left: 78, delay: 2.2, dur: 6.1, size: 13 },
  { left: 88, delay: 1.1, dur: 4.9, size: 10 },
  { left: 95, delay: 3.6, dur: 5.3, size: 15 },
];

/** Gotas que caen de a poco. Pensado para fondos claros. */
export function Rain({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {RAIN.map((d, i) => (
        <Drop
          key={i}
          className="absolute top-0 text-brand-300/70 animate-rain"
          style={{ left: `${d.left}%`, width: d.size, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }}
        />
      ))}
    </div>
  );
}

/**
 * Separador de ola entre secciones. `fill` es el color de la seccion de ABAJO.
 * Se dibuja al pie de la seccion de arriba y la ola se mueve en loop.
 */
export function WaveDivider({ fill, flip = false, className = "" }: { fill: string; flip?: boolean; className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute left-0 right-0 h-16 overflow-hidden sm:h-24 ${flip ? "top-0 rotate-180" : "bottom-0"} ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="absolute bottom-0 h-full w-[200%] animate-wave-slow" style={{ animationDuration: "18s" }}>
        <path d="M0 60 C120 90 240 90 360 60 C480 30 600 30 720 60 C840 90 960 90 1080 60 C1200 30 1320 30 1440 60 L1440 100 L0 100 Z" fill={fill} opacity="0.5" />
      </svg>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="absolute bottom-0 h-full w-[200%] animate-wave" style={{ animationDuration: "13s" }}>
        <path d="M0 70 C180 100 300 40 480 70 C660 100 780 40 960 70 C1140 100 1260 40 1440 70 L1440 100 L0 100 Z" fill={fill} />
      </svg>
    </div>
  );
}
