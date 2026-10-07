# Upsala · sitio web

Sitio de **Upsala BA**, agua mineral natural a domicilio en la Ciudad de Buenos Aires.
Reemplaza al sitio de Canva de **https://upsala.com.ar/**.

- Next.js 16 (App Router) exportado como sitio **estático** (`out/`), sin basePath: se publica en la raíz del dominio.
- Tailwind CSS 4 y [Motion](https://motion.dev) para las animaciones.
- Textos en `src/lib/content.ts`; contacto, WhatsApp, URLs y pixel en `src/lib/site.ts`.
- Fotos de producto y logos en `public/img/` (las mismas del sitio anterior; si hay versiones en mejor resolución, reemplazar con el mismo nombre).

## Páginas

| Ruta | Para qué |
|------|----------|
| `/` | Landing completa: agua mineral natural, bidones 12/20 L, dispenser frío/calor, cómo funciona, registro, empresa, revendedores, preguntas. |
| `/registro/` | Solo el formulario, sin menú. **Destino de las campañas** de Instagram/Facebook (`https://upsala.com.ar/registro/?utm_source=ig&utm_campaign=octubre`). |

## El formulario y la app de gestión

El formulario no guarda nada acá: llama a la API pública de la app (app-upsala):

- `GET  {API_URL}/api/public/registro` → los 48 barrios de CABA con su cobertura, las otras localidades con cobertura y los productos.
- `POST {API_URL}/api/public/registro` → crea el registro, que aparece en **Clientes > Nuevos Web** con canal `WEB`.

Al elegir el barrio se le dice a la persona al instante si hay cobertura. Si no la hay, igual puede dejar sus datos y queda marcado como "Sin cobertura" en la app. Los revendedores entran por el mismo canal con tipo `RESELLER`.

**Cómo se decide la cobertura** (en la app, no acá): un barrio o localidad tiene cobertura si coincide con una *Localidad activa* de la app (Ajustes > Localidades), o si es un barrio de CABA y la localidad "Ciudad de Buenos Aires" está activa. Hoy están activas "Ciudad de Buenos Aires" y "San Martín", así que todos los barrios de CABA y San Martín aparecen con cobertura. Para acotar la cobertura dentro de CABA: desactivar la localidad CABA y cargar como localidades los barrios que sí se atienden. Si la API no responde, el formulario ofrece igual los barrios de CABA con cobertura "a confirmar".

`API_URL` es `https://upsala.aquacontrol.aginet.com.ar` salvo que se defina `NEXT_PUBLIC_API_URL` al buildear. La API acepta llamadas solo desde los orígenes del sitio (`PUBLIC_SITE_ORIGINS` en el `.env` de la app si se agrega un dominio nuevo).

Para medir campañas, los parámetros `utm_*` / `fbclid` con los que llega la persona se guardan en el registro (campo `source`). Si se define `NEXT_PUBLIC_META_PIXEL_ID` al buildear, se carga el pixel de Meta y se dispara el evento `Lead` al enviar el formulario.

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:3400/
```

`dev` y `build` usan `--webpack`: Turbopack falla al procesar el CSS de Tailwind en el entorno de desarrollo que usamos.

## Publicar

```bash
npm run build        # deja el sitio listo en out/
npm run preview      # lo sirve en http://localhost:3500/ tal como va a quedar
```

Subir **el contenido** de `out/` a la raíz del hosting del dominio (`out/index.html` tiene que quedar en `https://upsala.com.ar/index.html`).

### Vista previa en el servidor (PM2)

Hay una vista previa servida con PM2 (`upsala-web`) en el servidor de la app, puerto **2520**:
http://serverfer.aginet.com.ar:2520/

Para actualizarla:

```bash
npm run build
tar -czf - out scripts/serve-out.mjs | ssh upsala-delivery@serverfer.aginet.com.ar 'rm -rf ~/upsala-web/out && mkdir -p ~/upsala-web && tar -C ~/upsala-web -xzf - && pm2 restart upsala-web'
```

La primera vez (ya hecho): `cd ~/upsala-web && PORT=2520 pm2 start scripts/serve-out.mjs --name upsala-web && pm2 save`.

Cuando se apunte el dominio a este servidor, alcanza con un `proxy_pass` de Nginx a `127.0.0.1:2520` (o subir `out/` al hosting actual).

## Imagen para compartir (og.png)

`npm run og` saca una captura del hero (1200×630) con el Chrome instalado y la deja en `public/og.png`. Requiere el sitio corriendo en `http://localhost:3400/`.
