// Genera las imagenes para publicar en grupos de Facebook (1080x1350) a partir de los HTML de esta carpeta.
// Uso: node scripts/posts/render.mjs [carpeta-de-salida]
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] ?? join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const CHROME =
  process.env.CHROME_PATH ??
  ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "/usr/bin/google-chrome"].find(existsSync);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] });
for (const file of readdirSync(HERE).filter((f) => f.endsWith(".html"))) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(HERE, file)).href, { waitUntil: "networkidle0" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))));
  });
  const out = join(OUT, `upsala-${file.replace(".html", ".png")}`);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  console.log("listo:", out);
  await page.close();
}
await browser.close();
