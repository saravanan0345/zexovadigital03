import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { industries } from "@/lib/site-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/industries")({
  head: () =>
    seo(
      "Industries We Serve",
      "Digital solutions for retail, restaurants, clinics, education, real estate and more.",
    ),
  component: Industries,
});

function Industries() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={
          <>
            Solutions for <span className="text-gradient">your industry</span>
          </>
        }
        text="We tailor every project to the way your industry works and how your customers buy."
      />
      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-20 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map(([t, d], i) => (
          <Reveal
            key={t}
            delay={(i % 3) * 0.06}
            className="rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow"
          >
            <Building2 className="size-6 text-primary" />
            <h2 className="mt-4 text-lg font-bold">{t}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </Reveal>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
