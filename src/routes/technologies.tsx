import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { technologies } from "@/lib/site-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/technologies")({
  head: () =>
    seo(
      "Technologies We Use",
      "The modern frontend, backend, mobile, AI and cloud technologies behind our work.",
    ),
  component: Tech,
});

function Tech() {
  return (
    <>
      <PageHero
        eyebrow="Technologies"
        title={
          <>
            A modern, <span className="text-gradient">proven stack</span>
          </>
        }
        text="We choose dependable tools that keep your product fast, secure and easy to grow."
      />
      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-20 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(technologies).map(([cat, list], i) => (
          <Reveal
            key={cat}
            delay={(i % 3) * 0.06}
            className="rounded-2xl border bg-card p-6 shadow-card"
          >
            <h2 className="text-lg font-bold">{cat}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {list.map((t) => (
                <span key={t} className="rounded-full border bg-muted px-3 py-1 text-sm">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
