import { EnquiryLink, WhatsAppIcon } from "@/components/site/WhatsApp";
import { subjectMessage } from "@/lib/whatsapp";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/site-content";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Button } from "@/components/ui/button";
import { services, COLLEGE_PROJECTS_EMAIL } from "@/lib/site-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const s = services.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return { slug: s.slug, title: s.title, short: s.short };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo(loaderData.title, loaderData.short)
      : {
          meta: [
            { title: "Service not found | ZEXOVA DIGITAL" },
            { name: "robots", content: "noindex" },
          ],
        },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useLoaderData();
  const s = services.find((x) => x.slug === slug)!;
  const related = services
    .filter((x) => x.category === s.category && x.slug !== s.slug)
    .slice(0, 3);
  return (
    <>
      <PageHero eyebrow={s.category} title={s.title} text={s.short} />
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All services
          </Link>
          <Reveal dir="left">
            <p className="mt-6 text-lg text-muted-foreground">{s.description}</p>
          </Reveal>
          <h2 className="mt-10 text-xl font-bold">What's included</h2>
          <ul className="mt-4 space-y-3">
            {s.deliverables.map((d, i) => (
              <Reveal key={d} dir="left" delay={i * 0.06}>
                <li className="flex items-center gap-3">
                  <span className="bg-brand inline-flex size-6 items-center justify-center rounded-full text-primary-foreground">
                    <Check className="size-3.5" />
                  </span>
                  {d}
                </li>
              </Reveal>
            ))}
          </ul>
          {related.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-bold">Related services</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {related.map((r) => (
                  <Button key={r.slug} asChild variant="outline" size="sm">
                    <Link to="/services/$slug" params={{ slug: r.slug }}>
                      {r.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="lg:col-span-3">
          <h2 className="mb-5 text-2xl font-bold">Request a quote for this service</h2>
          {s.slug === "college-projects" && <CollegeEmail />}
          <Button asChild variant="outline" className="mb-5">
            <EnquiryLink message={subjectMessage(`your ${s.title} service`)}>
              <WhatsAppIcon className="size-4" /> Enquire on WhatsApp
            </EnquiryLink>
          </Button>
          <InquiryForm kind="quote" defaultService={s.title} />
        </div>
      </section>
    </>
  );
}

function CollegeEmail() {
  const { data: settings } = useQuery(settingsQuery);
  const email = COLLEGE_PROJECTS_EMAIL || settings?.email;
  if (!email) return null;
  return (
    <a
      href={`mailto:${email}?subject=${encodeURIComponent("College Project Enquiry")}`}
      className="mb-5 flex items-center gap-3 rounded-xl border bg-card p-4 shadow-card transition-colors hover:border-primary/50"
    >
      <span className="bg-brand inline-flex size-10 items-center justify-center rounded-lg text-primary-foreground">
        <Mail className="size-5" />
      </span>
      <span>
        <span className="block text-sm text-muted-foreground">
          Email us about your college project
        </span>
        <span className="font-semibold">{email}</span>
      </span>
    </a>
  );
}
