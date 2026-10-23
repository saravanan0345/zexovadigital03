import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { publishedProjectsQuery } from "@/lib/site-content";
import { SectionHeading } from "./Reveal";

export function TrustedBy() {
  const { data = [] } = useQuery(publishedProjectsQuery);
  if (!data.length) return null;
  const loop = data.length < 4 ? [...data, ...data, ...data, ...data] : [...data, ...data];
  return (
    <section className="overflow-hidden border-y bg-muted/40 py-24">
      <SectionHeading
        eyebrow="Client Work"
        title="TRUSTED BY BUSINESSES"
        text="Real businesses. Real solutions. Digital experiences built with purpose."
      />
      <div className="marquee-wrap relative mt-12 overflow-x-auto [scrollbar-width:none] md:overflow-hidden">
        <div className="animate-marquee-slow flex w-max gap-6 px-6">
          {loop.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              to="/projects/$slug"
              params={{ slug: p.slug }}
              aria-hidden={i >= data.length || undefined}
              tabIndex={i >= data.length ? -1 : undefined}
              className="group w-72 shrink-0 overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow md:w-80"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                {p.cover_url && (
                  <img
                    src={p.cover_url}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {p.category}
                </p>
                <h3 className="mt-1 font-bold">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {p.short_description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
