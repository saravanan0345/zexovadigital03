import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Review, ReviewStats, calculateReviewStats, SEED_REVIEWS } from "./reviews";

export const reviewSubmitSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  role_or_company: z.string().trim().min(2, "Please enter your role or company").max(120),
  email: z.string().trim().email("Please enter a valid email").max(255).optional().or(z.literal("")),
  rating: z.coerce.number().min(1).max(5).default(5),
  message: z.string().trim().min(10, "Please share a few words about your experience (10+ characters)").max(2000),
  website: z.string().max(0).optional(), // Honeypot
});

export const adminCreateReviewSchema = z.object({
  name: z.string().trim().min(2, "Please enter author name").max(100),
  role_or_company: z.string().trim().min(2, "Please enter role or company").max(120),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  rating: z.coerce.number().min(1).max(5).default(5),
  message: z.string().trim().min(5, "Please enter review text").max(2000),
  verified: z.boolean().default(true),
  status: z.enum(["accepted", "declined", "pending"]).default("accepted"),
});

// Helper to map an inquiries row to Review
function mapInquiryToReview(row: any): Review {
  const ratingNum = Number(row.service) || 5;
  const isVerified = row.timeline === "verified" || row.timeline === "true" || row.timeline === true;
  return {
    id: row.id,
    name: row.name,
    role_or_company: row.company || "Client",
    email: row.email,
    rating: Math.min(5, Math.max(1, ratingNum)),
    message: row.message,
    verified: isVerified,
    status: (row.status === "accepted" || row.status === "declined" || row.status === "pending"
      ? row.status
      : "pending") as "accepted" | "declined" | "pending",
    created_at: row.created_at || new Date().toISOString(),
  };
}

async function getAllMergedReviews(): Promise<Review[]> {
  const map = new Map<string, Review>();

  // 1. Seed defaults first
  for (const item of SEED_REVIEWS) {
    map.set(item.id, item);
  }

  // 2. Local store reviews (may override seed status or add new ones)
  try {
    const { readLocalReviews } = await import("./reviews-store.server");
    const local = readLocalReviews();
    for (const item of local) {
      map.set(item.id, item);
    }
  } catch (e) {
    console.warn("Could not read local reviews in getAllMergedReviews:", e);
  }

  // 3. Supabase inquiries table with kind="review"
  try {
    let rows: any[] = [];
    if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("inquiries")
        .select("*")
        .eq("kind", "review")
        .order("created_at", { ascending: false });
      if (!error && data) rows = data;
    } else {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .eq("kind", "review")
        .order("created_at", { ascending: false });
      if (!error && data) rows = data;
    }

    for (const r of rows) {
      const rev = mapInquiryToReview(r);
      map.set(rev.id, rev);
    }
  } catch (e) {
    console.warn("Remote reviews fetch bypassed or failed:", e);
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export const fetchPublicReviews = createServerFn({ method: "GET" }).handler(async () => {
  const all = await getAllMergedReviews();
  const accepted = all.filter((r) => r.status === "accepted");
  const stats = calculateReviewStats(accepted);
  return {
    reviews: accepted,
    stats,
  };
});

export const fetchAdminReviews = createServerFn({ method: "GET" }).handler(async () => {
  const all = await getAllMergedReviews();
  const stats = calculateReviewStats(all.filter((r) => r.status === "accepted"));
  return {
    reviews: all,
    stats,
  };
});

export const submitPublicReview = createServerFn({ method: "POST" })
  .validator((data: unknown) => reviewSubmitSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const }; // Honeypot

    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();

    const review: Review = {
      id,
      name: data.name,
      role_or_company: data.role_or_company,
      email: data.email || null,
      rating: data.rating,
      message: data.message,
      verified: false,
      status: "pending",
      created_at,
    };

    // 1. Save locally
    try {
      const { saveLocalReview } = await import("./reviews-store.server");
      saveLocalReview(review);
    } catch (e) {
      console.warn("Local review store write failed:", e);
    }

    // 2. Persist to Supabase inquiries table as kind="review"
    try {
      const record = {
        id,
        kind: "review",
        name: data.name,
        company: data.role_or_company,
        email: data.email || "review@zexovadigital.online",
        service: String(data.rating),
        timeline: "unverified",
        message: data.message,
        status: "pending",
        created_at,
      };

      if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("inquiries").insert(record);
      } else {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("inquiries").insert(record);
      }
    } catch (e) {
      console.warn("Remote review insert failed:", e);
    }

    return { ok: true as const, id };
  });

export const createAdminReview = createServerFn({ method: "POST" })
  .validator((data: unknown) => adminCreateReviewSchema.parse(data))
  .handler(async ({ data }) => {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();

    const review: Review = {
      id,
      name: data.name,
      role_or_company: data.role_or_company,
      email: data.email || null,
      rating: data.rating,
      message: data.message,
      verified: data.verified,
      status: data.status,
      created_at,
    };

    // 1. Save locally
    try {
      const { saveLocalReview } = await import("./reviews-store.server");
      saveLocalReview(review);
    } catch (e) {
      console.warn("Local review store write failed:", e);
    }

    // 2. Persist to Supabase
    try {
      const record = {
        id,
        kind: "review",
        name: data.name,
        company: data.role_or_company,
        email: data.email || "admin@zexovadigital.online",
        service: String(data.rating),
        timeline: data.verified ? "verified" : "unverified",
        message: data.message,
        status: data.status,
        created_at,
      };

      if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("inquiries").insert(record);
      } else {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("inquiries").insert(record);
      }
    } catch (e) {
      console.warn("Remote review insert failed:", e);
    }

    return { ok: true as const, id };
  });

export const updateReviewStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string(),
        status: z.enum(["accepted", "declined", "pending"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    // 1. Update local
    try {
      const { updateLocalReviewStatus } = await import("./reviews-store.server");
      updateLocalReviewStatus(data.id, data.status);
    } catch (e) {
      console.warn("Local review status update failed:", e);
    }

    // 2. Update remote
    try {
      if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("inquiries").update({ status: data.status }).eq("id", data.id);
      } else {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("inquiries").update({ status: data.status }).eq("id", data.id);
      }
    } catch (e) {
      console.warn("Remote review status update failed:", e);
    }

    return { ok: true as const };
  });

export const toggleReviewVerified = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string(),
        verified: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    // 1. Update local
    try {
      const { toggleLocalReviewVerified } = await import("./reviews-store.server");
      toggleLocalReviewVerified(data.id, data.verified);
    } catch (e) {
      console.warn("Local review verified toggle failed:", e);
    }

    // 2. Update remote
    try {
      const timelineVal = data.verified ? "verified" : "unverified";
      if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("inquiries").update({ timeline: timelineVal }).eq("id", data.id);
      } else {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("inquiries").update({ timeline: timelineVal }).eq("id", data.id);
      }
    } catch (e) {
      console.warn("Remote review verified toggle failed:", e);
    }

    return { ok: true as const };
  });

export const deleteReview = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    // 1. Delete local
    try {
      const { deleteLocalReview } = await import("./reviews-store.server");
      deleteLocalReview(data.id);
    } catch (e) {
      console.warn("Local review delete failed:", e);
    }

    // 2. Delete remote
    try {
      if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("inquiries").delete().eq("id", data.id);
      } else {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("inquiries").delete().eq("id", data.id);
      }
    } catch (e) {
      console.warn("Remote review delete failed:", e);
    }

    return { ok: true as const };
  });
