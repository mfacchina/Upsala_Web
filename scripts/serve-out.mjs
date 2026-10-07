// Servidor estatico minimo para `out/`, tal como queda publicado en la raiz del dominio.
// Uso: npm run build && npm run preview   (PORT=2520 node scripts/serve-out.mjs en el server)
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("../out/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const PORT = Number(process.env.PORT ?? 3500);

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
  let rel = normalize(url.slice(1)).replace(/^(\.\.[/\\])+/, "");
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
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream", "Cache-Control": cache });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`sitio en http://localhost:${PORT}/`));
