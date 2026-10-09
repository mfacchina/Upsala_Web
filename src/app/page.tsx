import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { CoverageStrip } from "@/components/CoverageStrip";
import { Natural } from "@/components/Natural";
import { Products } from "@/components/Products";
import { DispenserSection } from "@/components/DispenserSection";
import { Steps } from "@/components/Steps";
import { ServiceInfo } from "@/components/ServiceInfo";
import { RegisterSection } from "@/components/RegisterSection";
import { About } from "@/components/About";
import { Resellers } from "@/components/Resellers";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { ScrollBottle } from "@/components/ScrollBottle";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CoverageStrip />
        <Natural />
        <Products />
        <DispenserSection />
        <Steps />
        <ServiceInfo />
        <RegisterSection />
        <About />
        <Resellers />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ScrollBottle />
    </>
  );
}
