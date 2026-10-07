// Genera public/og.png (1200x630) con una captura del hero. Requiere `npm run dev` corriendo
// (o LANDING_URL apuntando al sitio) y Chrome instalado (o CHROME_PATH).
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const LANDING = process.env.LANDING_URL ?? "http://localhost:3400/";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "og.png");
const CHROME =
  process.env.CHROME_PATH ??
  [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find(existsSync);
if (!CHROME) throw new Error("No encuentro Chrome. Definí CHROME_PATH.");

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto(LANDING, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log(`listo: ${OUT}`);
