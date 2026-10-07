import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { DispenserPage } from "@/components/DispenserPage";

export const metadata: Metadata = {
  title: "Dispenser frío/calor en comodato, para tu casa o tu empresa",
  description:
    "Dispenser frío/calor con bidones de agua mineral natural. En casa el alquiler se bonifica con tu consumo; en empresas va sin cargo con el abono mensual, factura A y entrega programada en CABA.",
  alternates: { canonical: "/dispenser/" },
  openGraph: { title: "Dispenser frío/calor Upsala", description: "Agua fría y caliente al instante con agua mineral natural. Para tu casa o tu empresa, en CABA.", url: "/dispenser/" },
};

export default function Page() {
  return (
    <>
      <Nav onDark />
      <main>
        <DispenserPage />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
