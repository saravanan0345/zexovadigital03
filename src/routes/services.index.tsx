import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { services } from "@/lib/site-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () =>
    seo(
      "Services",
      "Website design, apps, AI, automation, SEO, branding and more from ZEXOVA DIGITAL.",
    ),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Digital solutions for <span className="text-gradient">every stage</span>
          </>
        }
        text="Explore our full range of services. Every engagement starts with understanding your business."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-20 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.06}>
            <Link
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group block h-full rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <div className="bg-brand inline-flex size-11 items-center justify-center rounded-xl text-primary-foreground">
                  <s.icon className="size-5" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {s.category}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-bold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Details{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
