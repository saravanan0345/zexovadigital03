import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const inquirySchema = z.object({
  kind: z.enum(["contact", "quote"]),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  timeline: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please tell us a little more (10+ characters)").max(3000),
  website: z.string().max(0).optional(), // honeypot
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const }; // silently drop bots

    const email = data.email.toLowerCase();

    // 1. Attempt database storage if service role key is available
    try {
      if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const { count, error: countError } = await supabaseAdmin
          .from("inquiries")
          .select("id", { count: "exact", head: true })
          .eq("email", email)
          .gte("created_at", since);

        if (!countError && (count ?? 0) >= 5) {
          return {
            ok: false as const,
            error: "You've sent several messages recently. Please try again in a few minutes.",
          };
        }

        const { error: insertError } = await supabaseAdmin.from("inquiries").insert({
          kind: data.kind,
          name: data.name,
          email,
          phone: data.phone || null,
          company: data.company || null,
          service: data.service || null,
          budget: data.budget || null,
          timeline: data.timeline || null,
          message: data.message,
        });

        if (insertError) {
          console.warn("Could not insert inquiry via supabaseAdmin:", insertError.message);
        }
      }
    } catch (dbErr) {
      console.warn("Database storage failed for inquiry, proceeding to email dispatch:", dbErr);
    }

    // 2. Deliver email to business inbox
    try {
      const { notifyNewInquiry } = await import("./inquiry-email.server");
      await notifyNewInquiry({ ...data, email });
    } catch (emailErr) {
      console.error("Email notification error:", emailErr);
    }

    return { ok: true as const };
  });
