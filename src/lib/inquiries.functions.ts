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
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();

    const record = {
      id,
      kind: data.kind,
      name: data.name,
      email,
      phone: data.phone || null,
      company: data.company || null,
      service: data.service || null,
      budget: data.budget || null,
      timeline: data.timeline || null,
      message: data.message,
      status: "new",
      created_at,
    };

    // 1. Always persist to local store so enquiries are never lost on localhost
    try {
      const { saveLocalInquiry } = await import("./inquiries-store.server");
      saveLocalInquiry(record);
      console.log(`[Inquiries] Saved enquiry ${id} to local store.`);
    } catch (storeErr) {
      console.warn("Could not save to local store:", storeErr);
    }

    // 2. Attempt database storage in Supabase
    try {
      if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error: insertError } = await supabaseAdmin.from("inquiries").insert(record);
        if (insertError) {
          console.warn("Could not insert inquiry via supabaseAdmin:", insertError.message);
        } else {
          console.log(`[Inquiries] Saved enquiry ${id} via supabaseAdmin.`);
        }
      } else {
        const { supabase } = await import("@/integrations/supabase/client");
        const { error: anonError } = await supabase.from("inquiries").insert(record);
        if (anonError) {
          console.warn("Could not insert inquiry via anon client:", anonError.message);
        } else {
          console.log(`[Inquiries] Saved enquiry ${id} via anon client.`);
        }
      }
    } catch (dbErr) {
      console.warn("Database storage failed for inquiry, proceeding to email dispatch:", dbErr);
    }

    // 3. Deliver email to business inbox
    try {
      const { notifyNewInquiry } = await import("./inquiry-email.server");
      await notifyNewInquiry({ ...data, email });
    } catch (emailErr) {
      console.error("Email notification error:", emailErr);
    }

    return { ok: true as const };
  });

export const fetchAdminEnquiries = createServerFn({ method: "GET" }).handler(async () => {
  const map = new Map<string, any>();

  // 1. Read from local store
  try {
    const { readLocalInquiries } = await import("./inquiries-store.server");
    const local = readLocalInquiries();
    for (const item of local) {
      map.set(item.id, item);
    }
  } catch (e) {
    console.warn("Error reading local inquiries:", e);
  }

  // 2. Read from Supabase if possible
  try {
    if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        for (const item of data) {
          map.set(item.id, item);
        }
      }
    } else {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        for (const item of data) {
          map.set(item.id, item);
        }
      }
    }
  } catch (e) {
    console.warn("Error reading remote inquiries:", e);
  }

  const list = Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return list;
});

export const updateAdminEnquiryStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    // 1. Update local store
    try {
      const { updateLocalInquiryStatus, saveLocalNote } = await import("./inquiries-store.server");
      updateLocalInquiryStatus(data.id, data.status);
      saveLocalNote({
        id: crypto.randomUUID(),
        inquiry_id: data.id,
        kind: "status",
        body: `Status changed to ${data.status}`,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Error updating local inquiry status:", e);
    }

    // 2. Update Supabase
    try {
      if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("inquiries").update({ status: data.status }).eq("id", data.id);
      } else {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("inquiries").update({ status: data.status }).eq("id", data.id);
      }
    } catch (e) {
      console.warn("Error updating remote inquiry status:", e);
    }

    return { ok: true as const };
  });

export const deleteAdminEnquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    // 1. Delete from local store
    try {
      const { deleteLocalInquiry } = await import("./inquiries-store.server");
      deleteLocalInquiry(data.id);
    } catch (e) {
      console.warn("Error deleting local inquiry:", e);
    }

    // 2. Delete from Supabase
    try {
      if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("inquiries").delete().eq("id", data.id);
      } else {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("inquiries").delete().eq("id", data.id);
      }
    } catch (e) {
      console.warn("Error deleting remote inquiry:", e);
    }

    return { ok: true as const };
  });

export const fetchAdminEnquiryNotes = createServerFn({ method: "GET" })
  .validator((data: unknown) =>
    z
      .object({
        inquiry_id: z.string().uuid(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const map = new Map<string, any>();

    // 1. Read local notes
    try {
      const { readLocalNotes } = await import("./inquiries-store.server");
      const local = readLocalNotes(data.inquiry_id);
      for (const n of local) map.set(n.id, n);
    } catch {}

    // 2. Read remote notes
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: remote } = await supabase
        .from("enquiry_notes")
        .select("*")
        .eq("inquiry_id", data.inquiry_id)
        .order("created_at", { ascending: false });
      if (remote) {
        for (const n of remote) map.set(n.id, n);
      }
    } catch {}

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  });

export const addAdminEnquiryNote = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        inquiry_id: z.string().uuid(),
        kind: z.string(),
        body: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const note = {
      id: crypto.randomUUID(),
      inquiry_id: data.inquiry_id,
      kind: data.kind,
      body: data.body,
      created_at: new Date().toISOString(),
    };

    // 1. Save local
    try {
      const { saveLocalNote } = await import("./inquiries-store.server");
      saveLocalNote(note);
    } catch {}

    // 2. Save remote
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("enquiry_notes").insert(note);
    } catch {}

    return { ok: true as const };
  });
