import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { processSteps } from "@/lib/site-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/process")({
  head: () =>
    seo("Our Process", "Nine clear steps from discovery to launch and ongoing improvement."),
  component: Process,
});

function Process() {
  return (
    <>
      <PageHero
        eyebrow="Our Process"
        title={
          <>
            A clear path from <span className="text-gradient">idea to launch</span>
          </>
        }
        text="Nine transparent steps, so you always know what's happening and what comes next."
      />
      <section className="relative mx-auto max-w-4xl px-6 py-20">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6 }}
          className="bg-brand absolute bottom-20 left-[2.35rem] top-20 w-0.5 origin-top md:left-1/2"
        />
        <div className="space-y-10">
          {processSteps.map(([t, d], i) => (
            <Reveal
              key={t}
              dir={i % 2 ? "right" : "left"}
              className={`relative flex gap-6 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-10" : "md:pr-10 md:text-right md:flex-row-reverse"}`}
            >
              <span
                className={`bg-brand shadow-glow relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full font-display font-bold text-primary-foreground md:absolute md:top-4 ${i % 2 ? "md:-left-5" : "md:-right-5"}`}
              >
                {i + 1}
              </span>
              <div className="flex-1 rounded-2xl border bg-card p-6 shadow-card">
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
