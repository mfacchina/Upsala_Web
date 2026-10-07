"use client";

import { useEffect } from "react";
import { rememberSource } from "@/lib/api";

type Fbq = ((...args: unknown[]) => void) & { queue: unknown[]; loaded: boolean; version: string };

/**
 * Pixel de Meta (opcional, solo si hay NEXT_PUBLIC_META_PIXEL_ID) y captura de UTM.
 * El evento Lead se dispara desde el formulario cuando el registro se guarda.
 */
export function MetaPixel({ id }: { id: string }) {
  useEffect(() => {
    rememberSource();
    if (!id) return;
    const w = window as unknown as { fbq?: Fbq };
    if (w.fbq) return;
    const queue: unknown[] = [];
    const fbq = Object.assign((...args: unknown[]) => void queue.push(args), { queue, loaded: true, version: "2.0" }) as Fbq;
    w.fbq = fbq;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    fbq("init", id);
    fbq("track", "PageView");
  }, [id]);
  return null;
}
