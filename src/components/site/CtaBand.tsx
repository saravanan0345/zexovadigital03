import { EnquiryLink } from "./WhatsApp";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

export function CtaBand() {
  return (
    <section className="px-6 py-24">
      <Reveal className="dark relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-hero px-8 py-16 text-center text-foreground md:py-20">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative">
          <h2 className="text-3xl font-extrabold md:text-5xl">
            Ready to move your business <span className="text-gradient">forward?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us about your idea. We'll reply with a plan and a tailored quote.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="lg">
              <EnquiryLink>
                Start Your Project <ArrowRight />
              </EnquiryLink>
            </Button>
            <Button asChild variant="glass" size="lg">
              <EnquiryLink fallback="/contact">Contact Us</EnquiryLink>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
