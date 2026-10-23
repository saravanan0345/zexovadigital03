import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo(
      "Privacy Policy",
      "How ZEXOVA DIGITAL collects and uses information submitted through this website.",
    ),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <article className="mx-auto max-w-3xl space-y-6 px-6 py-20 text-muted-foreground">
        <p>
          When you contact us or request a quote, we collect the details you provide (such as your
          name, email, phone and project information) so we can respond to your inquiry.
        </p>
        <p>
          We use this information only to communicate with you about your request and our services.
          We do not sell your personal information.
        </p>
        <p>
          Submitted information is stored securely and is accessible only to authorised ZEXOVA
          DIGITAL staff.
        </p>
        <p>
          You may ask us to update or delete your information at any time by contacting us through
          the contact page.
        </p>
      </article>
    </>
  ),
});
