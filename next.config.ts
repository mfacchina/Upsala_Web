import type { NextConfig } from "next";
import path from "node:path";

// Sitio estatico: `next build` deja todo en `out/` y se sirve con cualquier servidor
// de archivos (scripts/serve-out.mjs en la vista previa, o el hosting del dominio).
//
// En el dominio definitivo (upsala.com.ar) va en la raiz, sin basePath. Para la vista
// previa con HTTPS detras de la app (https://upsala.aquacontrol.aginet.com.ar/web/)
// se buildea con NEXT_PUBLIC_BASE_PATH=/web.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";
const ROOT = path.resolve(__dirname);

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH || undefined,
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  turbopack: { root: ROOT },
  outputFileTracingRoot: ROOT,
};

export default nextConfig;
