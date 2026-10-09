import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CONTACT, META_DOMAIN_VERIFICATION, META_PIXEL_ID, SITE_URL, WHATSAPP_NUMBER } from "@/lib/site";
import { MetaPixel } from "@/components/MetaPixel";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const TITLE = "Upsala | Agua mineral natural a domicilio en Buenos Aires";
const DESCRIPTION =
  "Bidones de agua mineral natural de 12 y 20 litros y dispensers frío/calor con reparto a domicilio en la Ciudad de Buenos Aires. Envasada en origen en 9 de Julio, sin procesos artificiales. Registrate y te contactamos.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Upsala" },
  description: DESCRIPTION,
  applicationName: "Upsala",
  keywords: [
    "agua mineral natural a domicilio",
    "bidones de agua CABA",
    "reparto de agua Buenos Aires",
    "bidón 20 litros",
    "bidón 12 litros",
    "dispenser frío calor",
    "agua mineral 9 de Julio",
    "Upsala agua",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Upsala",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Upsala, agua mineral natural a domicilio" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.png"] },
  robots: { index: true, follow: true },
  // Verificacion del dominio en Meta Business (necesaria para configurar eventos de conversion).
  ...(META_DOMAIN_VERIFICATION ? { other: { "facebook-domain-verification": META_DOMAIN_VERIFICATION } } : {}),
  category: "food",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b3f5e",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}#org`,
      name: "Upsala BA",
      alternateName: "Upsala Agua Mineral Natural",
      url: SITE_URL,
      email: CONTACT.email,
      telephone: `+${WHATSAPP_NUMBER}`,
      image: `${SITE_URL}og.png`,
      description: DESCRIPTION,
      areaServed: { "@type": "City", name: "Ciudad Autónoma de Buenos Aires" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Mosconi 3777",
        addressLocality: "Ciudad Autónoma de Buenos Aires",
        postalCode: "C1419",
        addressCountry: "AR",
      },
      sameAs: [CONTACT.instagram],
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Bidón de agua mineral natural 12 L" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Bidón de agua mineral natural 20 L" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dispenser frío/calor en comodato" } },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Marca que hay JS antes de pintar. Sin JS, el CSS muestra lo que las animaciones
            dejan oculto al principio, asi la pagina nunca queda vacia. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <MetaPixel id={META_PIXEL_ID} />
        {META_PIXEL_ID && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} />
          </noscript>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
