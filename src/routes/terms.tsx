import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => seo("Terms & Conditions", "Terms for using the ZEXOVA DIGITAL website."),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <article className="mx-auto max-w-3xl space-y-6 px-6 py-20 text-muted-foreground">
        <p>
          By using this website you agree to use it lawfully and not to misuse its forms or content.
        </p>
        <p>
          Information on this website is provided for general purposes. Project scope, pricing and
          timelines are confirmed only in a written agreement.
        </p>
        <p>
          All content, branding and design on this website belong to ZEXOVA DIGITAL unless stated
          otherwise.
        </p>
        <p>
          We may update these terms from time to time. Continued use of the website means you accept
          the latest version.
        </p>
      </article>
    </>
  ),
});
