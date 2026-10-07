"use client";

import { useId, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

type Props = { className?: string; /** Nivel del bidon de arriba 0..1 */ level?: number };

/** Dispenser frio/calor con bidon arriba. Cuando entra en pantalla, gotea y llena el vaso. */
export function Dispenser({ className, level = 0.65 }: Props) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const animate = inView && !reduce;

  const bottleTop = 8;
  const bottleBottom = 92;
  const surface = bottleBottom - level * (bottleBottom - bottleTop);

  return (
    <svg ref={ref} viewBox="0 0 160 330" className={className} role="img" aria-label="Dispenser frío/calor">
      <defs>
        <linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#67e8f9" />
          <stop offset="1" stopColor="#1270ea" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbeafe" />
        </linearGradient>
        <clipPath id={`${id}-bottle`}>
          <rect x="40" y="6" width="80" height="90" rx="20" />
        </clipPath>
        <clipPath id={`${id}-cup`}>
          <path d={CUP} />
        </clipPath>
      </defs>

      {/* bidon invertido */}
      <rect x="40" y="6" width="80" height="90" rx="20" fill="rgba(255,255,255,0.6)" stroke="#0b5bd3" strokeWidth="3" />
      <g clipPath={`url(#${id}-bottle)`}>
        <rect x="40" y={surface} width="80" height="100" fill={`url(#${id}-w)`} />
        <g className="animate-wave" style={{ transformOrigin: "0 0" }}>
          <path d={WAVE} transform={`translate(0 ${surface - 6})`} fill="#42a9f7" />
        </g>
        <rect x="52" y="14" width="8" height="70" rx="4" fill="white" opacity="0.35" />
      </g>
      <rect x="30" y="92" width="100" height="14" rx="5" fill="#0b5bd3" />

      {/* torre */}
      <rect x="26" y="104" width="108" height="200" rx="12" fill={`url(#${id}-body)`} stroke="#0b4ba8" strokeOpacity="0.35" strokeWidth="3" />
      <rect x="44" y="124" width="72" height="42" rx="8" fill="#071a2f" opacity="0.08" />
      {/* canillas */}
      <g>
        <rect x="52" y="150" width="14" height="22" rx="3" fill="#ef4444" />
        <circle cx="59" cy="146" r="8" fill="#ef4444" />
        <rect x="94" y="150" width="14" height="22" rx="3" fill="#1b8df0" />
        <circle cx="101" cy="146" r="8" fill="#1b8df0" />
      </g>
      {/* panel */}
      <circle cx="80" cy="200" r="4" fill="#22c55e" className={animate ? "animate-pulse-soft" : undefined} />
      <rect x="60" y="214" width="40" height="4" rx="2" fill="#0b4ba8" opacity="0.2" />

      {/* bandeja */}
      <rect x="42" y="256" width="76" height="12" rx="4" fill="#0b4ba8" opacity="0.6" />
      {[50, 60, 70, 80, 90, 100, 110].map((x) => (
        <line key={x} x1={x} x2={x} y1="258" y2="266" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
      ))}

      {/* vaso debajo de la canilla azul */}
      <path d={CUP} fill="rgba(255,255,255,0.75)" stroke="#0b5bd3" strokeWidth="2.5" />
      <g clipPath={`url(#${id}-cup)`}>
        <motion.rect
          x="84"
          width="36"
          height="60"
          fill={`url(#${id}-w)`}
          initial={{ y: 256 }}
          animate={animate ? { y: 230 } : { y: 256 }}
          transition={{ duration: 4, ease: "easeOut" }}
        />
      </g>

      {/* gota que cae de la canilla azul */}
      {animate && (
        <g aria-hidden>
          {[0, 0.9].map((delay, i) => (
            <path
              key={i}
              d="M101 176 c0 0 -4 5 -4 8 a4 4 0 0 0 8 0 c0 -3 -4 -8 -4 -8z"
              fill="#22d3ee"
              className="animate-drip"
              style={{ animationDelay: `${delay}s`, transformOrigin: "101px 176px" }}
            />
          ))}
        </g>
      )}

      {/* base */}
      <rect x="20" y="300" width="120" height="14" rx="5" fill="#0b2745" />
    </svg>
  );
}

const CUP = "M86 228 L118 228 L114 256 L90 256 Z";
const WAVE = "M-200 6 Q-175 0 -150 6 T-100 6 T-50 6 T0 6 T50 6 T100 6 T150 6 T200 6 T250 6 T300 6 T350 6 T400 6 V20 H-200 Z";
