import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { inquirySchema, submitInquiry } from "@/lib/inquiries.functions";
import { services } from "@/lib/site-data";

const selectCls =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function InquiryForm({
  kind,
  defaultService,
}: {
  kind: "contact" | "quote";
  defaultService?: string;
}) {
  const submit = useServerFn(submitInquiry);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = inquirySchema.safeParse({ ...raw, kind });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      toast.error("Please fill in all required fields (message must be at least 10 characters).");
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await submit({ data: parsed.data });
      if (res.ok) {
        setDone(true);
        toast.success("Thanks! Your message has been received.");
      } else toast.error(res.error);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center rounded-2xl border bg-card p-10 text-center shadow-card"
      >
        <CheckCircle2 className="size-14 text-primary" />
        <h3 className="mt-4 text-2xl font-bold">Message received</h3>
        <p className="mt-2 text-muted-foreground">
          Thank you for reaching out. Our team will review your{" "}
          {kind === "quote" ? "project details" : "message"} and get back to you.
        </p>
      </motion.div>
    );
  }

  const Err = ({ n }: { n: string }) => (
    <AnimatePresence>
      {errors[n] && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-1 text-xs text-destructive"
        >
          {errors[n]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-5 rounded-2xl border bg-card p-6 shadow-card md:grid-cols-2 md:p-8"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div>
        <Label htmlFor="name">Full name *</Label>
        <Input id="name" name="name" className="mt-1.5 h-10" />
        <Err n="name" />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" className="mt-1.5 h-10" />
        <Err n="email" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" className="mt-1.5 h-10" />
        <Err n="phone" />
      </div>
      <div>
        <Label htmlFor="company">Business name</Label>
        <Input id="company" name="company" className="mt-1.5 h-10" />
      </div>
      <div className={kind === "quote" ? "" : "md:col-span-2"}>
        <Label htmlFor="service">Service of interest</Label>
        <select
          id="service"
          name="service"
          defaultValue={defaultService ?? ""}
          className={`${selectCls} mt-1.5`}
        >
          <option value="">Not sure yet</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      {kind === "quote" && (
        <>
          <div>
            <Label htmlFor="budget">Estimated budget</Label>
            <select id="budget" name="budget" className={`${selectCls} mt-1.5`}>
              <option value="">Prefer to discuss</option>
              <option>Small project</option>
              <option>Medium project</option>
              <option>Large project</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="timeline">Timeline</Label>
            <select id="timeline" name="timeline" className={`${selectCls} mt-1.5`}>
              <option value="">Flexible</option>
              <option>As soon as possible</option>
              <option>Within 1 month</option>
              <option>1–3 months</option>
              <option>3+ months</option>
            </select>
          </div>
        </>
      )}
      <div className="md:col-span-2">
        <Label htmlFor="message">
          {kind === "quote" ? "Tell us about your project *" : "Your message *"}
        </Label>
        <Textarea id="message" name="message" rows={5} className="mt-1.5" />
        <Err n="message" />
      </div>
      <div className="md:col-span-2">
        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading && <Loader2 className="animate-spin" />}{" "}
          {kind === "quote" ? "Request a Quote" : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
