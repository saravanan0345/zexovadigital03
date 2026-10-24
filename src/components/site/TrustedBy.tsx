import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { marqueeLoop, publishedProjectsQuery } from "@/lib/site-content";
import { SectionHeading } from "./Reveal";

export function TrustedBy() {
  const { data = [] } = useQuery(publishedProjectsQuery);
  if (!data.length) return null;
  const loop = marqueeLoop(data);
  const half = loop.length / 2;
  // ~7s per card keeps the pace steady however many projects there are.
  const duration = `${half * 7}s`;

  return (
    <section className="overflow-hidden border-y bg-muted/40 py-24">
      <SectionHeading
        eyebrow="Client Work"
        title={
          <>
            Trusted by <span className="text-gradient">Businesses</span>
          </>
        }
        text="Real businesses. Real solutions. Digital experiences built with purpose."
      />
      <div
        className="marquee-wrap relative mt-12 overflow-x-auto [scrollbar-width:none] md:overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <ul
          className="animate-marquee-slow flex w-max py-3"
          style={{ animationDuration: duration }}
        >
          {loop.map((p, i) => {
            const dup = i >= data.length;
            return (
              <li
                key={`${p.id}-${i}`}
                aria-hidden={dup || undefined}
                className="w-72 shrink-0 pr-6 md:w-80"
              >
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  tabIndex={dup ? -1 : undefined}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {p.cover_url ? (
                      <img
                        src={p.cover_url}
                        alt={dup ? "" : p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="bg-brand flex h-full w-full items-center justify-center text-primary-foreground">
                        <FolderKanban className="size-10" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {p.category && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {p.category}
                      </p>
                    )}
                    <h3 className="mt-1 font-bold">{p.title}</h3>
                    {p.short_description && (
                      <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                        {p.short_description}
                      </p>
                    )}
                    <div className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary">
                      View case study{" "}
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
