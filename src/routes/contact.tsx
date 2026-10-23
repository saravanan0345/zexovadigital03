import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo("Contact Us", "Send ZEXOVA DIGITAL a message about your website, app or digital project."),
  component: () => (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let's <span className="text-gradient">talk</span>
          </>
        }
        text="Tell us what you're working on. No account needed — we'll get back to you."
      />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <InquiryForm kind="contact" />
      </section>
    </>
  ),
});
