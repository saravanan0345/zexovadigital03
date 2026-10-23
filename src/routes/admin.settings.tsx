import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

const groups = [
  [
    "Business contact",
    [
      ["phone", "Phone"],
      ["whatsapp", "WhatsApp number"],
      ["email", "Email"],
      ["address", "Address"],
      ["hours", "Business hours"],
    ],
  ],
  [
    "Social links",
    [
      ["facebook", "Facebook URL"],
      ["instagram", "Instagram URL"],
      ["linkedin", "LinkedIn URL"],
      ["x_twitter", "X / Twitter URL"],
      ["youtube", "YouTube URL"],
    ],
  ],
  [
    "Brand & SEO",
    [
      ["tagline", "Footer tagline"],
      ["seo_title", "Default SEO title"],
      ["seo_description", "Default SEO description"],
    ],
  ],
] as const;

type Key = (typeof groups)[number][1][number][0];

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [f, setF] = useState<Partial<Record<Key, string>>>({});
  useEffect(() => {
    if (data)
      setF(
        Object.fromEntries(
          groups.flatMap(([, fs]) => fs.map(([k]) => [k, (data[k] as string | null) ?? ""])),
        ),
      );
  }, [data]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const row = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v?.trim() || null]));
    const { error } = await supabase
      .from("site_settings")
      .update({ ...row, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) {
      toast.error("Could not save settings");
      return;
    }
    toast.success("Settings saved — the website is updated");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Settings</h1>
      <form onSubmit={save} className="space-y-6">
        {groups.map(([title, fields]) => (
          <section key={title} className="rounded-xl border bg-card p-5 shadow-card">
            <h2 className="mb-4 font-bold">{title}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(([k, l]) => (
                <div key={k} className="space-y-1">
                  <Label htmlFor={k}>{l}</Label>
                  <Input
                    id={k}
                    value={f[k] ?? ""}
                    onChange={(e) => setF({ ...f, [k]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
        <p className="text-xs text-muted-foreground">
          Leave a field empty to hide it on the website.
        </p>
        <Button type="submit" variant="hero">
          Save settings
        </Button>
      </form>
      <PasswordForm />
    </div>
  );
}

function PasswordForm() {
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (pw !== pw2) {
      toast.error("Passwords don't match");
      return;
    }
    const { error } = await supabase.auth.updateUser({
      password: pw,
      current_password: cur,
    } as never);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password changed");
    setCur("");
    setPw("");
    setPw2("");
  };
  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-5 shadow-card">
      <h2 className="font-bold">Change administrator password</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <Label>Current password</Label>
          <Input type="password" required value={cur} onChange={(e) => setCur(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>New password</Label>
          <Input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Confirm new password</Label>
          <Input type="password" required value={pw2} onChange={(e) => setPw2(e.target.value)} />
        </div>
      </div>
      <Button type="submit" variant="outline">
        Update password
      </Button>
    </form>
  );
}
