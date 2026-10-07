import type { NextConfig } from "next";
import path from "node:path";

// Sitio estatico: `next build` deja todo en `out/` y se sirve con cualquier servidor
// de archivos (scripts/serve-out.mjs en la vista previa, o el hosting del dominio).
// Se publica en la raiz del dominio (upsala.com.ar), sin basePath.
const ROOT = path.resolve(__dirname);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  turbopack: { root: ROOT },
  outputFileTracingRoot: ROOT,
};

export default nextConfig;
