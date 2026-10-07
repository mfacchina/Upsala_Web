"use client";

import { useEffect, useState } from "react";
import { fetchFormOptions } from "@/lib/api";

/** Cinta con los barrios y localidades con cobertura (vienen de la app). Sin datos, no se muestra. */
export function CoverageStrip() {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    let alive = true;
    fetchFormOptions().then((o) => {
      if (!alive || !o.live) return;
      const covered = o.barrios.filter((b) => b.covered).map((b) => b.name);
      // Los barrios que no son oficiales de CABA ya figuran en la lista; San Martin va como localidad.
      setItems([...covered, ...o.zones]);
    });
    return () => {
      alive = false;
    };
  }, []);
  if (items.length === 0) return null;

  const chip = (z: string, key: string) => (
    <span key={key} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-brand-100 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-800">
      <span className="h-1.5 w-1.5 rounded-full bg-aqua-500" />
      {z}
    </span>
  );

  return (
    <div className="relative overflow-hidden border-y border-ink-900/5 bg-white py-4" aria-label="Zonas con cobertura">
      <div className="container-x mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-900/45">Llegamos a</div>
      {items.length < 6 ? (
        <div className="container-x flex flex-wrap justify-center gap-3">{items.map((z, i) => chip(z, `${z}-${i}`))}</div>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" aria-hidden />
          <div className="flex w-max gap-3 animate-marquee" style={{ animationDuration: `${Math.max(30, items.length * 2.2)}s` }}>
            {[...items, ...items].map((z, i) => chip(z, `${z}-${i}`))}
          </div>
        </>
      )}
    </div>
  );
}
