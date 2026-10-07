import { asset } from "@/lib/site";

/** Logo de Upsala (isologo de la etiqueta). `tone` segun el fondo. */
export function Logo({ tone = "dark", className = "h-9" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className="inline-flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(tone === "light" ? "/img/logo-blanco.png" : "/img/logo-azul.png")}
        alt="Upsala"
        className={`${className} w-auto`}
        width={1500}
        height={960}
      />
      <span className={`hidden text-[10px] font-semibold uppercase tracking-[0.22em] sm:block ${tone === "light" ? "text-white/70" : "text-ink-700/70"}`}>
        Agua mineral
        <br />
        natural
      </span>
    </span>
  );
}
