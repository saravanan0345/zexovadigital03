import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/quote")({
  head: () =>
    seo(
      "Request a Quote",
      "Share your project details and receive a tailored quote from ZEXOVA DIGITAL.",
    ),
  component: () => (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title={
          <>
            Start your <span className="text-gradient">project</span>
          </>
        }
        text="Share a few details and we'll reply with a plan and a tailored quote."
      />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <InquiryForm kind="quote" />
      </section>
    </>
  ),
});
