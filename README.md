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
| `/dispenser/` | Dispenser frío/calor: pestaña "Para tu casa" (alquiler $15.000 bonificado por consumo) y "Para tu empresa" (abonos de la propuesta corporativa, dispenser sin cargo, factura A). `/dispenser/#empresas` abre directo la pestaña de empresas. Formulario propio con empresa y cantidad de personas; entra a la app como registro con producto "Dispenser". |

Precios de los bidones (20 L $9.700, 12 L $7.250), la escala de bonificación y los planes para empresas están en `src/lib/content.ts`.

## Fotos y videos

`public/img/foto-*.webp` son las fotos de ambiente (dispenser en cocina, familia con bidón, vaso) y `public/video/*.mp4` los tres videos cortos: `pureza-natural.mp4` es el fondo del hero (solo en pantallas grandes y sin "reducir movimiento"), `comercial.mp4` va en la sección de agua natural y `cocina.mp4` en la página del dispenser. Los videos se cargan recién cuando entran en pantalla.

## El formulario y la app de gestión

El formulario no guarda nada acá: llama a la API pública de la app (app-upsala):

- `GET  {API_URL}/api/public/registro` → los 48 barrios de CABA con su cobertura, las otras localidades con cobertura y los productos.
- `POST {API_URL}/api/public/registro` → crea el registro, que aparece en **Clientes > Nuevos Web** con canal `WEB`.

Al elegir el barrio se le dice a la persona al instante si hay cobertura. Si no la hay, igual puede dejar sus datos y queda marcado como "Sin cobertura" en la app. Los revendedores entran por el mismo canal con tipo `RESELLER`.

**Cómo se decide la cobertura** (en la app, no acá): la lista de barrios por zona de reparto (A a F, con su día de visita) vive en `src/lib/caba-barrios.ts` del repo de la app (`COVERAGE_ZONES`). Un barrio tiene cobertura si figura ahí o si coincide con una *Localidad activa* de la app (p. ej. "San Martín"). El select muestra los 48 barrios oficiales de CABA más los nombres de zona que no son oficiales (Palermo Soho, Barrio Norte, Villa Lynch…); los que no tienen cobertura se ofrecen igual y la persona puede dejar sus datos para que le avisemos. Cuando hay cobertura, el formulario dice también qué día repartimos en esa zona. Para cambiar la cobertura: editar esa lista en la app y deployarla. Si la API no responde, el formulario ofrece igual los barrios de CABA con cobertura "a confirmar".

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

Subir **el contenido** de `out/` a la raíz del hosting del dominio (`out/index.html` tiene que quedar en `https://upsala.com.ar/index.html`). `public/.htaccess` sale dentro de `out/` y configura Apache (404, tipos de video, caché).

### Publicar en upsala.com.ar (DonWeb, panel Ferozo)

El dominio y el mail están en DonWeb (panel Ferozo, cuenta `c2700043`, DNS ns3/ns4.hostmar.com). El hosting es Apache en **200.58.111.95** (`c2700043.ferozo.com`, `ftp.upsala.com.ar` y `mail.upsala.com.ar` resuelven ahí). La web apuntaba a Canva (103.169.142.0).

1. Buildear para la raíz (con el pixel si ya está el ID) y zipear el **contenido** de `out/`, incluido `.htaccess`:
   ```bash
   MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH= npm run build
   cd out && tar.exe -a -c -f ../upsala-web-donweb.zip .htaccess *
   ```
   `tar.exe` es el de Windows (`C:\Windows\System32\tar.exe`): arma el zip con barras `/`, que es lo que necesita el servidor Linux.
2. Ferozo > Mi Sitio Web > Administrador de archivos > `public_html`: borrar lo que haya del sitio viejo, subir el zip y descomprimirlo ahí. `index.html` tiene que quedar directamente en `public_html`. (También se puede subir por FTP con FileZilla a `ftp.upsala.com.ar`.)
3. Ferozo > Dominios > upsala.com.ar > Zona DNS: cambiar los registros **A** de `upsala.com.ar` y `www.upsala.com.ar` de 103.169.142.0 a 200.58.111.95. **No tocar MX, `mail`, `mx1` ni el TXT de SPF.** El TXT `canva-domain-verify` se puede borrar.
4. Cuando el dominio ya muestre la web nueva: Ferozo > Dominios > Certificados SSL, activar el certificado gratuito para `upsala.com.ar` y `www`.
5. En Canva, desconectar el dominio del sitio viejo.

### Publicación automática (GitHub → rama deploy → Git de Ferozo)

Cada push a `main` corre `.github/workflows/deploy.yml`: compila el sitio sin basePath y fuerza el contenido de `out/` (con `.htaccess`) en la rama **`deploy`**. Esa rama tiene solo la web armada; no se edita a mano.

El hosting baja esa rama con el Git de Ferozo (Mi Sitio Web > GIT), usando la clave SSH de la cuenta c2700043, cargada en GitHub como deploy key de **solo lectura** ("DonWeb Ferozo c2700043"). Repo: `git@github.com:mfacchina/Upsala_Web.git`, rama `deploy`, destino `public_html`. El `.htaccess` no sirve la carpeta `.git`.

El zip manual (pasos de arriba) sigue sirviendo como plan B.

### Pixel de Meta

El pixel es **Upsala CAPI (2272461290182516)**, cargado por defecto en `src/lib/site.ts` (se puede pisar con `NEXT_PUBLIC_META_PIXEL_ID`). Ojo al probarlo: el script de Meta no manda eventos desde navegadores automatizados (headless/webdriver), así que las pruebas automáticas dan cero aunque funcione; se verifica a mano con "Probar eventos". Eventos: `PageView` en cada página, `Lead` cuando un formulario se guarda en la app (`content_name`: cliente, dispenser_casa, dispenser_empresa, revendedor) y `Contact` en cada click a WhatsApp (`content_name`: confirmar_pedido, confirmar_dispenser_casa, confirmar_dispenser_empresa, revendedor, whatsapp). Para verificar el dominio en Meta Business: `NEXT_PUBLIC_META_DOMAIN_VERIFICATION=<código>` o un registro TXT en la Zona DNS. En la vista previa `/web/` el pixel no carga porque la app tiene una política de seguridad que no permite scripts de Facebook; se prueba en upsala.com.ar.

### Formulario y confirmación por WhatsApp

El formulario principal pide barrio (con el día de reparto al instante), cantidad de bidones de 20 y 12 L (hasta 4 de cada uno) con calculadora del primer pedido, nombre, apellido, celular, email, DNI/CUIL/CUIT (7, 8 u 11 números; la app guarda en `cuit` solo el CUIL/CUIT, el DNI va en el comentario), dirección (y piso/timbre si es departamento), horario preferido y comentarios. Precios y regla de la promo en `src/lib/order.ts`: 50% en **un solo bidón** del primer pedido, sobre uno de 20 L si hay; si no, sobre uno de 12 L.

Al tocar **Confirmar pedido por WhatsApp** el registro se guarda en la app (Clientes > Nuevos Web) y en la misma pestaña se abre el WhatsApp de **ventas** (`WHATSAPP_ORDERS` = 11 3449-5488, lo atiende el bot) con todo el pedido escrito; la persona solo toca Enviar. Si la app no responde, igual abre WhatsApp con el mensaje completo. Los formularios de dispenser y revendedores hacen lo mismo. El WhatsApp de gestión (11 7065-8458) solo se muestra en el footer.

El mensaje arranca siempre con "Hola Upsala! Quiero confirmar mi pedido desde la web." y sigue con líneas `*Campo:* valor` (Nombre, Teléfono, DNI/CUIL/CUIT, Email, Dirección, Barrio, Día de reparto, Horario preferido, Pedido, Total primer pedido, Dispenser frío/calor, Comentarios), por si el bot las quiere leer.

Los formularios siguen llegando a la app: el navegador llama a `https://upsala.aquacontrol.aginet.com.ar/api/public/registro`, que ya acepta `https://upsala.com.ar` y `https://www.upsala.com.ar`. Para actualizar el sitio, repetir los pasos 1 y 2.

### Vista previa en el servidor de la app (PM2)

Mientras no esté el dominio, hay una vista previa servida con PM2 (`upsala-web`, puerto 2520, `BASE_PATH=/web`) que la app publica con HTTPS en
**https://upsala.aquacontrol.aginet.com.ar/web/** (rewrite en `next.config.ts` de app-upsala). El puerto 2520 pelado no sirve: Chrome fuerza HTTPS.

Para actualizarla (ojo: buildear con `/web`):

```bash
MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/web npm run build
tar -czf - out scripts/serve-out.mjs | ssh upsala-delivery@serverfer.aginet.com.ar 'rm -rf ~/upsala-web/out && tar -C ~/upsala-web -xzf - && pm2 restart upsala-web'
```

Sin `MSYS_NO_PATHCONV=1`, Git Bash convierte `/web` en `C:/Program Files/Git/web` y el build falla. Cuando el sitio esté en su dominio, sacar el rewrite de la app y este proceso.

## Imagen para compartir (og.png)

`npm run og` saca una captura del hero (1200×630) con el Chrome instalado y la deja en `public/og.png`. Requiere el sitio corriendo en `http://localhost:3400/`.
