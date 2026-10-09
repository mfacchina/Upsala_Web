// Servidor estatico minimo para `out/`, tal como queda publicado.
// Uso: npm run build && npm run preview
// En el server: PORT=2520 BASE_PATH=/web node scripts/serve-out.mjs (si se buildeo con
// NEXT_PUBLIC_BASE_PATH=/web; sin BASE_PATH sirve en la raiz).
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("../out/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const PORT = Number(process.env.PORT ?? 3500);
const BASE = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".json": "application/json",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  res.on("finish", () => {
    const ip = req.headers["x-forwarded-for"] ?? req.socket.remoteAddress;
    console.log(`${new Date().toISOString()} ${ip} ${req.method} ${url} -> ${res.statusCode}`);
  });
  if (BASE) {
    if (url === "/" || url === BASE) {
      res.writeHead(302, { Location: `${BASE}/` });
      return res.end();
    }
    if (!url.startsWith(`${BASE}/`)) {
      res.writeHead(404);
      return res.end(`fuera de ${BASE}`);
    }
  }
  const rel = normalize(url.slice(BASE.length + 1)).replace(/^(\.\.[/\\])+/, "");
  let file = join(ROOT, rel);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!existsSync(file)) {
    file = join(ROOT, "404.html");
    if (!existsSync(file)) {
      res.writeHead(404);
      return res.end("no encontrado");
    }
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    return createReadStream(file).pipe(res);
  }
  // El HTML y las imagenes cambian entre publicaciones con el mismo nombre: que el navegador
  // siempre revalide. Lo de _next/static lleva hash en el nombre y se puede cachear para siempre.
  const cache = url.includes("/_next/static/") ? "public, max-age=31536000, immutable" : "no-cache";
  const type = TYPES[extname(file)] ?? "application/octet-stream";
  const size = statSync(file).size;
  // Rango para los videos (el navegador pide trozos).
  const range = req.headers.range;
  if (range && extname(file) === ".mp4") {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m && m[1] ? Number(m[1]) : 0;
    const end = m && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
    res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1, "Cache-Control": cache });
    return createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes", "Cache-Control": cache });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`sitio en http://localhost:${PORT}${BASE}/`));
