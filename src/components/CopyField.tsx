"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dato para transferir con boton de copiar. Pensado para un celular: el numero
 * se toca una vez y queda en el portapapeles.
 *
 * El portapapeles puede no estar disponible (navegador viejo, o la pagina servida
 * por http). En ese caso se selecciona el texto para que se pueda copiar a mano,
 * en lugar de fallar en silencio.
 */
export function CopyField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const [copiado, setCopiado] = useState(false);
  const valorRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(value);
      setCopiado(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiado(false), 2200);
    } catch {
      // Sin portapapeles: dejamos el texto seleccionado para copiarlo a mano.
      const nodo = valorRef.current;
      if (!nodo) return;
      const rango = document.createRange();
      rango.selectNodeContents(nodo);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(rango);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-900/45">{label}</p>
          {/* Un CVU son 22 digitos: en un celular angosto no entra al tamano de un
              alias, asi que el dato largo se achica para no partirse en dos renglones. */}
          <span
            ref={valorRef}
            className={`mt-1 block break-all font-display font-bold tracking-tight text-ink-900 tabular-nums ${
              value.length > 18 ? "text-[15px] sm:text-xl" : "text-xl sm:text-2xl"
            }`}
          >
            {value}
          </span>
          {hint && <p className="mt-1 text-sm text-ink-900/55">{hint}</p>}
        </div>
        <button
          type="button"
          onClick={copiar}
          aria-label={`Copiar ${label.toLowerCase()}`}
          className="shrink-0 rounded-full border border-brand-600/30 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/60"
        >
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>
      <span aria-live="polite" className="sr-only">
        {copiado ? `${label} copiado` : ""}
      </span>
    </div>
  );
}
