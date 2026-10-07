"use client";

import { useEffect, useId } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";

type Props = {
  /** Nivel de agua 0..1. Puede ser un numero fijo o un MotionValue ligado al scroll. */
  level: number | MotionValue<number>;
  className?: string;
  /** Muestra gotas cayendo dentro del pico. */
  drops?: boolean;
  /** Tono del plastico. */
  tone?: "light" | "dark";
};

const TOP = 48; // y del hombro (agua llena)
const BOTTOM = 306; // y de la base (agua vacia)

/** Bidon de 20 litros, con el nivel de agua controlable. */
export function Bidon({ level, className, drops = false, tone = "light" }: Props) {
  const id = useId().replace(/:/g, "");
  const isMotion = typeof level !== "number";
  // Siempre trabajamos con un MotionValue para que los hooks no cambien de orden.
  const own = useMotionValue(isMotion ? 0 : level);
  useEffect(() => {
    if (!isMotion) own.set(level);
  }, [isMotion, level, own]);
  const source = isMotion ? level : own;
  const surfaceY = useTransform(source, (v: number) => BOTTOM - clamp01(v) * (BOTTOM - TOP));

  const plastic = tone === "light" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)";
  const stroke = tone === "light" ? "#0b5bd3" : "#7cc4fb";

  return (
    <svg viewBox="0 0 200 320" className={className} role="img" aria-label="Bidón de agua de 20 litros">
      <defs>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#67e8f9" />
          <stop offset="0.35" stopColor="#1b8df0" />
          <stop offset="1" stopColor="#0b4ba8" />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#42a9f7" />
          <stop offset="1" stopColor="#0b5bd3" />
        </linearGradient>
        <clipPath id={`${id}-body`}>
          <path d={BODY} />
        </clipPath>
      </defs>

      {/* cuerpo translucido */}
      <path d={BODY} fill={plastic} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />

      {/* agua */}
      <g clipPath={`url(#${id}-body)`}>
        <motion.g style={{ y: surfaceY }}>
          {/* el rect arranca en la superficie y baja de sobra */}
          <rect x="0" y="4" width="200" height="400" fill={`url(#${id}-water)`} />
          {/* ola en la superficie: dos capas que se desplazan */}
          <g className="animate-wave">
            <path d={WAVE} fill="#42a9f7" />
          </g>
          <g className="animate-wave-slow">
            <path d={WAVE} fill="#67e8f9" opacity="0.75" />
          </g>
          {[
            [70, 120, 3],
            [120, 180, 2.2],
            [95, 240, 2.6],
            [140, 90, 1.8],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity="0.5" className="animate-pulse-soft" style={{ animationDelay: `${i * 0.6}s` }} />
          ))}
        </motion.g>
        {/* reflejo */}
        <rect x="46" y="60" width="12" height="236" rx="6" fill="white" opacity="0.28" />
        <rect x="64" y="90" width="4" height="150" rx="2" fill="white" opacity="0.18" />
      </g>

      {/* estrias */}
      {[150, 168, 228, 246].map((y) => (
        <line key={y} x1="36" x2="164" y1={y} y2={y} stroke={stroke} strokeOpacity="0.25" strokeWidth="2" />
      ))}

      {/* manija */}
      <path d="M150 70 C184 70 190 112 160 114" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />

      {/* cuello y tapa */}
      <rect x="82" y="26" width="36" height="20" fill={plastic} stroke={stroke} strokeWidth="3" />
      <rect x="74" y="6" width="52" height="24" rx="7" fill={`url(#${id}-cap)`} />
      <rect x="80" y="10" width="40" height="5" rx="2.5" fill="white" opacity="0.35" />

      {/* gotas que caen en el pico */}
      {drops && (
        <g aria-hidden>
          {[0, 0.9, 1.7].map((delay, i) => (
            <path
              key={i}
              d="M100 -30 c0 0 -5 6 -5 9.5 a5 5 0 0 0 10 0 c0 -3.5 -5 -9.5 -5 -9.5z"
              fill="#67e8f9"
              className="animate-drip"
              style={{ animationDelay: `${delay}s`, transformOrigin: "100px -30px" }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

const BODY =
  "M82 46 C82 46 58 58 44 74 C30 90 28 102 28 120 L28 280 C28 298 42 310 60 310 L140 310 C158 310 172 298 172 280 L172 120 C172 102 170 90 156 74 C142 58 118 46 118 46 Z";

// Ola de 200 unidades de ancho repetida para poder desplazarla en loop.
const WAVE =
  "M-200 6 Q-175 -2 -150 6 T-100 6 T-50 6 T0 6 T50 6 T100 6 T150 6 T200 6 T250 6 T300 6 T350 6 T400 6 V20 H-200 Z";

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
