import { EnquiryLink } from "@/components/site/WhatsApp";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Check, MessageSquare } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero-visual.jpg";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { TrustedBy } from "@/components/site/TrustedBy";
import { StartupsTrustedUs } from "@/components/site/StartupsTrustedUs";
import {
  processSteps,
  serviceCategories,
  services,
  techTicker,
  whyUs,
  industries,
} from "@/lib/site-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "Websites, Apps, AI & Automation",
      "ZEXOVA DIGITAL builds digital experiences that move local businesses forward — websites, applications, AI and automation.",
    ),
  component: Home,
});

const words = "WE BUILD DIGITAL EXPERIENCES THAT MOVE BUSINESSES FORWARD.".split(" ");

function Home() {
  return (
    <>
      <Hero />
      <TechTicker />
      <ServicesTabs />
      <WhyUs />
      <ProcessPreview />
      <TrustedBy />
      <IndustriesStrip />
      <StartupsTrustedUs />
      <CtaBand />
    </>
  );
}

function Hero() {
  return (
    <section className="dark relative min-h-screen overflow-hidden bg-hero text-foreground">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-36 lg:grid-cols-2 lg:pt-40">
        <div>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-cyan"
          >
            <span className="size-1.5 rounded-full bg-cyan" /> Powering Local Businesses
          </motion.p>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] md:text-6xl xl:text-7xl">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={`mr-[0.25em] inline-block ${i === 4 || i === 5 ? "text-gradient" : ""}`}
              >
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            From powerful websites and applications to intelligent automation and digital growth,
            ZEXOVA DIGITAL transforms ideas into meaningful digital solutions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button asChild variant="hero" size="lg">
              <EnquiryLink>
                Start Your Project <ArrowRight />
              </EnquiryLink>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/services">Explore Our Work</Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/contact">
                <MessageSquare className="size-4" /> Enquiry
              </Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          <div className="bg-brand absolute -inset-10 rounded-full opacity-20 blur-3xl" />
          <img
            src={hero}
            alt="Website and mobile app interfaces connected by AI workflows"
            width={1280}
            height={1024}
            className="animate-float relative rounded-3xl border shadow-glow"
          />
          <div className="glass absolute -bottom-6 -left-4 hidden rounded-xl px-4 py-3 font-mono text-xs text-cyan md:block">
            {"<build launch={true} />"}
          </div>
        </motion.div>
      </div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <ChevronDown />
      </motion.div>
    </section>
  );
}

function TechTicker() {
  const items = [...techTicker, ...techTicker];
  return (
    <div className="dark overflow-hidden border-y bg-navy py-5 text-foreground">
      <div className="animate-marquee flex w-max gap-12">
        {items.map((t, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ServicesTabs() {
  const [cat, setCat] = useState<string>(serviceCategories[0]);
  const list = services.filter((s) => s.category === cat);
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Digital Solutions"
        title={
          <>
            Everything you need to <span className="text-gradient">grow online</span>
          </>
        }
        text="Nineteen services across design, development, intelligence and growth — all under one roof."
      />
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {serviceCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${cat === c ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {cat === c && (
              <motion.span layoutId="tab" className="bg-brand absolute inset-0 rounded-full" />
            )}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
      <motion.div
        key={cat}
        initial="h"
        animate="s"
        variants={{ s: { transition: { staggerChildren: 0.07 } } }}
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {list.map((s) => (
          <motion.div key={s.slug} variants={{ h: { opacity: 0, y: 24 }, s: { opacity: 1, y: 0 } }}>
            <Link
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group block h-full rounded-2xl border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
            >
              <div className="bg-brand inline-flex size-11 items-center justify-center rounded-xl text-primary-foreground">
                <s.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Learn more{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-10 text-center">
        <Button asChild variant="outline" size="lg">
          <Link to="/services">View all services</Link>
        </Button>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="border-y bg-muted/40 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
        <SectionHeading
          center={false}
          eyebrow="Why ZEXOVA"
          title={
            <>
              A partner built for <span className="text-gradient">local growth</span>
            </>
          }
          text="We combine premium design with dependable engineering, so your business looks credible and works smarter."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {whyUs.map(([t, d], i) => (
            <Reveal
              key={t}
              dir={i % 2 ? "right" : "left"}
              delay={i * 0.05}
              className="rounded-xl border bg-card p-5 shadow-card"
            >
              <Check className="size-5 text-primary" />
              <h3 className="mt-3 font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading eyebrow="Our Process" title="From first call to launch, and beyond" />
      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        {processSteps.slice(0, 6).map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.08} className="rounded-2xl border bg-card p-6 shadow-card">
            <span className="text-gradient font-display text-4xl font-extrabold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-bold">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild variant="outline" size="lg">
          <Link to="/process">See the full process</Link>
        </Button>
      </div>
    </section>
  );
}

function IndustriesStrip() {
  return (
    <section className="dark bg-navy py-24 text-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Industries"
          title="Built for the businesses in your neighbourhood"
        />
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {industries.map(([t], i) => (
            <Reveal key={t} delay={i * 0.04}>
              <span className="glass inline-block rounded-full px-5 py-2.5 text-sm font-medium">
                {t}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
