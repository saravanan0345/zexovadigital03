import { EnquiryLink } from "@/components/site/WhatsApp";
import { subjectMessage } from "@/lib/whatsapp";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { packages } from "@/lib/site-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () =>
    seo(
      "Pricing & Packages",
      "Flexible website, app and AI packages. Request a tailored quote for your business.",
    ),
  component: Pricing,
});

function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Packages that <span className="text-gradient">fit your goals</span>
          </>
        }
        text="Every business is different, so every quote is tailored. Pick a starting point and we'll shape it around you."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-20 md:grid-cols-3">
        {packages.map((p, i) => (
          <Reveal
            key={p.name}
            delay={i * 0.08}
            className={`relative flex flex-col rounded-2xl border bg-card p-8 shadow-card ${p.featured ? "border-primary shadow-glow md:-translate-y-3" : ""}`}
          >
            {p.featured && (
              <span className="bg-brand absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground">
                Most popular
              </span>
            )}
            <h2 className="text-2xl font-extrabold">{p.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.tag}</p>
            <p className="mt-6 font-display text-xl font-bold text-primary">Custom quote</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant={p.featured ? "hero" : "outline"} size="lg" className="mt-8">
              <EnquiryLink message={subjectMessage(`your ${p.name} package`)}>
                Request a Quote
              </EnquiryLink>
            </Button>
          </Reveal>
        ))}
      </section>
    </>
  );
}
