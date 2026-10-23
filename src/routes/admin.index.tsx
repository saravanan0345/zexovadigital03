import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { statusLabel } from "@/lib/site-content";

export const Route = createFileRoute("/admin/")({ component: Overview });

function Overview() {
  const [days, setDays] = useState(30);
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const [inq, projects] = await Promise.all([
        supabase
          .from("inquiries")
          .select("id,name,email,service,status,created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("projects")
          .select("id,title,slug,published,published_at")
          .order("published_at", { ascending: false, nullsFirst: false }),
      ]);
      return { inq: inq.data ?? [], projects: projects.data ?? [] };
    },
  });
  const inq = data?.inq ?? [];
  const pub = (data?.projects ?? []).filter((p) => p.published);

  const since = Date.now() - days * 864e5;
  const buckets: { day: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    buckets.push({ day: d.slice(5), count: 0 });
  }
  inq
    .filter((r) => new Date(r.created_at).getTime() >= since)
    .forEach((r) => {
      const b = buckets.find((x) => x.day === r.created_at.slice(5, 10));
      if (b) b.count++;
    });

  const cards: [string, string | number][] = [
    ["Website visitors", "Not configured yet"],
    ["Total enquiries", inq.length],
    ["New enquiries", inq.filter((r) => r.status === "new").length],
    ["Active chats", "Coming soon"],
    ["Published projects", pub.length],
    ["Published articles", "Coming soon"],
    ["Confirmed revenue", "No records yet"],
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([l, v]) => (
          <div key={l} className="rounded-xl border bg-card p-5 shadow-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{l}</p>
            <p
              className={`mt-2 font-bold ${typeof v === "number" ? "text-3xl" : "text-sm text-muted-foreground"}`}
            >
              {v}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Enquiry trend</h2>
          <div className="flex gap-1">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`rounded-md px-3 py-1 text-xs ${days === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={buckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" fontSize={11} stroke="var(--muted-foreground)" />
              <YAxis allowDecimals={false} fontSize={11} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }}
              />
              <Area
                dataKey="count"
                name="Enquiries"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Website traffic chart: analytics not configured yet.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex justify-between">
            <h2 className="font-bold">Recent enquiries</h2>
            <Link to="/admin/enquiries" className="text-sm text-primary">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y">
            {inq.slice(0, 5).map((r) => (
              <li key={r.id} className="flex justify-between py-2 text-sm">
                <span>
                  {r.name} <span className="text-muted-foreground">· {r.service ?? "General"}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {statusLabel[r.status] ?? r.status}
                </span>
              </li>
            ))}
            {!inq.length && (
              <li className="py-4 text-sm text-muted-foreground">No enquiries yet.</li>
            )}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex justify-between">
            <h2 className="font-bold">Recently published projects</h2>
            <Link to="/admin/projects" className="text-sm text-primary">
              Manage
            </Link>
          </div>
          <ul className="mt-3 divide-y">
            {pub.slice(0, 5).map((p) => (
              <li key={p.id} className="py-2 text-sm">
                {p.title}
              </li>
            ))}
            {!pub.length && (
              <li className="py-4 text-sm text-muted-foreground">No published projects yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
