import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, ImageUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { slugify, type Project } from "@/lib/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/projects")({ component: Projects });

function Projects() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: async () =>
      (await supabase.from("projects").select("*").order("created_at", { ascending: false }))
        .data ?? [],
  });
  const refresh = () =>
    qc
      .invalidateQueries({ queryKey: ["projects"] })
      .then(() => qc.invalidateQueries({ queryKey: ["admin"] }));

  const togglePublish = async (p: Project) => {
    const { error } = await supabase
      .from("projects")
      .update({
        published: !p.published,
        published_at: !p.published ? new Date().toISOString() : p.published_at,
      })
      .eq("id", p.id);
    if (error) {
      toast.error("Could not update");
      return;
    }
    toast.success(p.published ? "Unpublished" : "Published");
    refresh();
  };
  const del = async (p: Project) => {
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) {
      toast.error("Could not delete");
      return;
    }
    toast.success("Project deleted");
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Portfolio Projects</h1>
        <Button variant="hero" onClick={() => setEditing({})}>
          <Plus className="size-4" /> Add project
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-xl border bg-card shadow-card">
            <div className="aspect-video bg-muted">
              {p.cover_url && (
                <img src={p.cover_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="space-y-2 p-4">
              <p className="text-xs text-primary">{p.category || "Uncategorised"}</p>
              <h3 className="font-bold">{p.title}</h3>
              <div className="flex items-center gap-2 text-sm">
                <Switch checked={p.published} onCheckedChange={() => togglePublish(p)} />{" "}
                {p.published ? "Published" : "Draft"}
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                  <Pencil className="size-4" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete “{p.title}”?</AlertDialogTitle>
                      <AlertDialogDescription>
                        It will be removed from the website straight away.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => del(p)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
        {!data.length && (
          <p className="col-span-full rounded-xl border bg-card p-10 text-center text-muted-foreground">
            {isLoading ? "Loading…" : "No projects yet. Add your first completed client project."}
          </p>
        )}
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {editing && (
            <ProjectForm
              initial={editing}
              onDone={() => {
                setEditing(null);
                refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectForm({ initial, onDone }: { initial: Partial<Project>; onDone: () => void }) {
  const [f, setF] = useState({
    title: initial.title ?? "",
    category: initial.category ?? "",
    cover_url: initial.cover_url ?? "",
    technologies: (initial.technologies ?? []).join(", "),
    short_description: initial.short_description ?? "",
    challenge: initial.challenge ?? "",
    solution: initial.solution ?? "",
    results: initial.results ?? "",
    client_name: initial.client_name ?? "",
    live_url: initial.live_url ?? "",
    published: initial.published ?? false,
  });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF({ ...f, [k]: e.target.value });

  const upload = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isSupportedType =
      file.type.startsWith("image/") || ["jpg", "jpeg", "png", "webp"].includes(ext);
    if (!isSupportedType) {
      toast.error("Please choose a supported image (JPG, JPEG, PNG, or WEBP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setBusy(true);
    try {
      const cleanExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "png";
      const contentType = file.type || `image/${cleanExt === "jpg" ? "jpeg" : cleanExt}`;
      const path = `${crypto.randomUUID()}.${cleanExt}`;

      let up = await supabase.storage.from("project-images").upload(path, file, {
        contentType,
        upsert: true,
      });

      if (
        up.error &&
        (up.error.message?.toLowerCase().includes("not found") ||
          (up.error as { code?: string }).code === "NoSuchBucket" ||
          (up.error as { statusCode?: string }).statusCode === "404")
      ) {
        const { error: createErr } = await supabase.storage.createBucket("project-images", {
          public: false,
        });
        if (!createErr) {
          up = await supabase.storage.from("project-images").upload(path, file, {
            contentType,
            upsert: true,
          });
        }
      }

      if (up.data && !up.error) {
        const { data: signData, error: signErr } = await supabase.storage
          .from("project-images")
          .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);

        if (!signErr && signData?.signedUrl) {
          setF((x) => ({ ...x, cover_url: signData.signedUrl }));
          toast.success("Image uploaded successfully");
          return;
        }
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to process image file"));
        reader.readAsDataURL(file);
      });

      setF((x) => ({ ...x, cover_url: dataUrl }));
      toast.success("Image uploaded successfully");
    } catch (err: unknown) {
      console.error("Unexpected upload error:", err);
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred during upload",
      );
    } finally {
      setBusy(false);
    }
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (f.title.trim().length < 2) {
      toast.error("Title is required");
      return;
    }
    if (f.live_url && !/^https?:\/\//.test(f.live_url)) {
      toast.error("Live link must start with http(s)://");
      return;
    }
    setBusy(true);
    const row = {
      title: f.title.trim(),
      category: f.category.trim(),
      cover_url: f.cover_url || null,
      technologies: f.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      short_description: f.short_description.trim(),
      challenge: f.challenge.trim(),
      solution: f.solution.trim(),
      results: f.results.trim(),
      client_name: f.client_name.trim() || null,
      live_url: f.live_url.trim() || null,
      published: f.published,
      updated_at: new Date().toISOString(),
      published_at: f.published
        ? (initial.published_at ?? new Date().toISOString())
        : (initial.published_at ?? null),
    };
    const { error } = initial.id
      ? await supabase.from("projects").update(row).eq("id", initial.id)
      : await supabase.from("projects").insert({
          ...row,
          slug: `${slugify(row.title)}-${Math.random().toString(36).slice(2, 6)}`,
        });
    setBusy(false);
    if (error) {
      console.error("Save portfolio project failed:", error);
      toast.error(error.message || "Could not save project");
      return;
    }
    toast.success("Project saved");
    onDone();
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initial.id ? "Edit project" : "Add project"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Project title *</Label>
          <Input value={f.title} onChange={set("title")} required />
        </div>
        <div className="space-y-1">
          <Label>Category</Label>
          <Input
            value={f.category}
            onChange={set("category")}
            placeholder="e.g. Website, Mobile App"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Cover image</Label>
        {f.cover_url && (
          <img src={f.cover_url} alt="" className="aspect-video w-full rounded-lg object-cover" />
        )}
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground hover:bg-muted">
          <ImageUp className="size-4" />{" "}
          {busy ? "Uploading…" : f.cover_url ? "Change image (max 5 MB)" : "Add image (max 5 MB)"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <div className="space-y-1">
        <Label>Technologies used (comma separated)</Label>
        <Input value={f.technologies} onChange={set("technologies")} />
      </div>
      <div className="space-y-1">
        <Label>Short description</Label>
        <Textarea
          rows={2}
          maxLength={300}
          value={f.short_description}
          onChange={set("short_description")}
        />
      </div>
      <div className="space-y-1">
        <Label>Challenge</Label>
        <Textarea rows={3} value={f.challenge} onChange={set("challenge")} />
      </div>
      <div className="space-y-1">
        <Label>Solution</Label>
        <Textarea rows={3} value={f.solution} onChange={set("solution")} />
      </div>
      <div className="space-y-1">
        <Label>Results (optional)</Label>
        <Textarea rows={2} value={f.results} onChange={set("results")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Client name (optional)</Label>
          <Input value={f.client_name} onChange={set("client_name")} />
        </div>
        <div className="space-y-1">
          <Label>Live link (optional)</Label>
          <Input value={f.live_url} onChange={set("live_url")} placeholder="https://" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={f.published} onCheckedChange={(v) => setF({ ...f, published: v })} />{" "}
        Publish on the website
      </label>
      <Button type="submit" variant="hero" disabled={busy} className="w-full">
        {f.published ? "Save & publish" : "Save as draft"}
      </Button>
    </form>
  );
}
