import { Reveal, SectionHeading } from "./ui";
import { FAQ } from "@/lib/content";

export function Faq() {
  return (
    <section id="preguntas" className="relative bg-white py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que nos preguntan antes de pedir" />
        <Reveal className="mx-auto mt-12 max-w-3xl divide-y divide-ink-900/8 rounded-3xl border border-ink-900/8 bg-foam">
          {FAQ.map((item) => (
            <details key={item.q} className="group px-6 py-5 open:bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-ink-900 marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition group-open:rotate-45">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-900/70">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </section>
  );
}
