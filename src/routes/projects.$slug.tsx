import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";
import { projectBySlugQuery } from "@/lib/site-content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/projects/$slug")({
  head: () => seo("Client Project", "A completed client project by ZEXOVA DIGITAL."),
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data: p, isLoading } = useQuery(projectBySlugQuery(slug));
  if (isLoading)
    return <div className="min-h-screen pt-40 text-center text-muted-foreground">Loading…</div>;
  if (!p)
    return (
      <div className="min-h-screen pt-40 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Button asChild className="mt-6">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  return (
    <>
      <PageHero
        eyebrow={p.category || "Client Project"}
        title={p.title}
        text={p.short_description}
      />
      <article className="mx-auto max-w-4xl space-y-10 px-6 py-20">
        {p.cover_url && (
          <img src={p.cover_url} alt={p.title} className="w-full rounded-2xl border shadow-card" />
        )}
        {p.client_name && (
          <p className="text-sm text-muted-foreground">
            Client: <span className="text-foreground">{p.client_name}</span>
          </p>
        )}
        {p.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {p.technologies.map((t) => (
              <span key={t} className="rounded-full border px-3 py-1 text-xs">
                {t}
              </span>
            ))}
          </div>
        )}
        {(
          [
            ["The challenge", p.challenge],
            ["Our solution", p.solution],
            ["Results", p.results],
          ] as const
        )
          .filter(([, v]) => v)
          .map(([h, v]) => (
            <section key={h}>
              <h2 className="text-2xl font-bold">{h}</h2>
              <p className="mt-3 whitespace-pre-wrap text-muted-foreground">{v}</p>
            </section>
          ))}
        {p.live_url && (
          <Button asChild variant="hero">
            <a href={p.live_url} target="_blank" rel="noopener noreferrer">
              Visit live project <ExternalLink />
            </a>
          </Button>
        )}
      </article>
      <CtaBand />
    </>
  );
}
