import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;
export type SiteSettings = Tables<"site_settings">;
export type StartupProject = Tables<"startup_projects">;

export const startupProjectsQuery = queryOptions({
  queryKey: ["startup_projects", "published"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("startup_projects")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

/** Repeats items until one copy holds at least `min` cards, then doubles it so a -50% marquee loops without a gap. */
export function marqueeLoop<T>(items: T[], min = 8): T[] {
  if (!items.length) return [];
  const base: T[] = [];
  while (base.length < min) base.push(...items);
  return [...base, ...base];
}

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  staleTime: 60_000,
});

export const publishedProjectsQuery = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const projectBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["projects", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "in_discussion",
  "quotation_sent",
  "converted",
  "closed",
] as const;
export const statusLabel: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  in_discussion: "In Discussion",
  quotation_sent: "Quotation Sent",
  converted: "Converted",
  closed: "Closed",
};

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]!);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}
