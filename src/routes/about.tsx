import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { whyUs } from "@/lib/site-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    seo(
      "About Us",
      "ZEXOVA DIGITAL is a digital agency powering local businesses with websites, apps, AI and automation.",
    ),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            Powering <span className="text-gradient">local businesses</span>
          </>
        }
        text="We help local businesses compete digitally with premium websites, smart applications, and practical AI."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2">
        <Reveal dir="left">
          <h2 className="text-3xl font-extrabold">Our mission</h2>
          <p className="mt-4 text-muted-foreground">
            To make modern digital technology accessible to every local business — so great
            businesses get the online presence they deserve.
          </p>
        </Reveal>
        <Reveal dir="right">
          <h2 className="text-3xl font-extrabold">Our approach</h2>
          <p className="mt-4 text-muted-foreground">
            We listen first, plan carefully, design beautifully, and build with dependable
            technology. Then we stay with you as you grow.
          </p>
        </Reveal>
      </section>
      <section className="border-y bg-muted/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Values" title="What we stand for" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map(([t, d], i) => (
              <Reveal
                key={t}
                delay={i * 0.06}
                className="rounded-2xl border bg-card p-6 shadow-card"
              >
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
