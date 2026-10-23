// Genera las fotos de perfil de WhatsApp (1000x1000) de cada numero de Upsala, y una vista
// previa recortada en circulo y chica, como se ve en la lista de chats.
// Uso: node scripts/perfiles/render.mjs [carpeta-de-salida]
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] ?? join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const CHROME =
  process.env.CHROME_PATH ??
  ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "/usr/bin/google-chrome"].find(existsSync);
const VARIANTS = ["central", "ventas", "confirmacion", "repartidor1", "repartidor2", "grupo"];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] });
const files = [];
for (const [i, v] of VARIANTS.entries()) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000, deviceScaleFactor: 1 });
  await page.goto(`${pathToFileURL(join(HERE, "perfil.html")).href}#${v}`, { waitUntil: "networkidle0" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((im) => (im.complete ? null : new Promise((r) => (im.onload = im.onerror = r)))));
  });
  const out = join(OUT, `${i + 1}-whatsapp-${v}.png`);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1000, height: 1000 } });
  files.push(out);
  console.log("listo:", out);
  await page.close();
}

// Vista previa: como una lista de chats (circulos chicos) y como el perfil abierto (circulo grande).
const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 760, deviceScaleFactor: 1 });
const rows = files
  .map((f, i) => `<div class="row"><img class="sm" src="${pathToFileURL(f).href}"><div><b>${["Upsala Central", "Upsala Ventas", "Upsala Confirmación", "Upsala Repartidor 1", "Upsala Repartidor 2", "Upsala Reparto (grupo)"][i]}</b><span>Mensaje de ejemplo…</span></div></div>`)
  .join("");
const bigs = files.map((f) => `<img class="lg" src="${pathToFileURL(f).href}">`).join("");
const previewHtml = join(OUT, "vista-previa.html");
writeFileSync(
  previewHtml,
  `<meta charset="utf-8"><style>body{margin:0;font-family:Segoe UI,sans-serif;background:#f0f2f5;display:flex;gap:30px;padding:24px}.list{background:#fff;width:380px;border-radius:12px}.row{display:flex;gap:12px;align-items:center;padding:12px 16px;border-bottom:1px solid #eee}.row b{display:block;font-size:16px}.row span{color:#667;font-size:14px}.sm{width:49px;height:49px;border-radius:50%}.grid{display:flex;flex-wrap:wrap;gap:18px;align-content:flex-start;width:640px}.lg{width:200px;height:200px;border-radius:50%}</style><div class="list">${rows}</div><div class="grid">${bigs}</div>`,
);
await page.goto(pathToFileURL(previewHtml).href, { waitUntil: "load" });
await page.evaluate(() => Promise.all([...document.images].map((im) => (im.complete ? null : new Promise((r) => (im.onload = im.onerror = r))))));
const preview = join(OUT, "vista-previa.png");
await page.screenshot({ path: preview, fullPage: true });
rmSync(previewHtml);
console.log("vista previa:", preview);
await browser.close();
