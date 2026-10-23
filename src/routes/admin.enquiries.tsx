import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  fetchAdminEnquiries,
  updateAdminEnquiryStatus,
  deleteAdminEnquiry,
  fetchAdminEnquiryNotes,
  addAdminEnquiryNote,
} from "@/lib/inquiries.functions";
import { ENQUIRY_STATUSES, statusLabel, toCsv } from "@/lib/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/enquiries")({ component: Enquiries });

type Inq = Tables<"inquiries">;

function Enquiries() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<Inq | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: async () => {
      const res = await fetchAdminEnquiries();
      return res as Inq[];
    },
  });
  const list = data.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (!q ||
        [r.name, r.email, r.service, r.message, r.company].some((v) =>
          v?.toLowerCase().includes(q.toLowerCase()),
        )),
  );

  const exportCsv = () => {
    const csv = toCsv(list.map(({ id: _id, ...r }) => r));
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "enquiries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Enquiries</h1>
        <Button variant="outline" onClick={exportCsv} disabled={!list.length}>
          <Download className="size-4" /> Export CSV
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, email, service…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All statuses</option>
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Service</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((r) => (
              <tr key={r.id} className="hover:bg-muted/40">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3">{r.email}</td>
                <td className="p-3">{r.service ?? "—"}</td>
                <td className="p-3 text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {statusLabel[r.status] ?? r.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => setOpen(r)}>
                    Open
                  </Button>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  {isLoading ? "Loading…" : "No enquiries found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {open && (
            <Detail
              inq={open}
              onClose={() => {
                setOpen(null);
                qc.invalidateQueries({ queryKey: ["admin"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ inq, onClose }: { inq: Inq; onClose: () => void }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState(inq.status);
  const [note, setNote] = useState("");
  const [kind, setKind] = useState("note");
  const notes = useQuery({
    queryKey: ["admin", "notes", inq.id],
    queryFn: async () => {
      const res = await fetchAdminEnquiryNotes({ data: { inquiry_id: inq.id } });
      return res;
    },
  });
  const saveStatus = useMutation({
    mutationFn: async (s: string) => {
      await updateAdminEnquiryStatus({ data: { id: inq.id, status: s } });
    },
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin"] });
      notes.refetch();
    },
    onError: () => toast.error("Could not update status"),
  });
  const addNote = useMutation({
    mutationFn: async () => {
      await addAdminEnquiryNote({
        data: { inquiry_id: inq.id, kind, body: note.trim() },
      });
    },
    onSuccess: () => {
      setNote("");
      notes.refetch();
    },
    onError: () => toast.error("Could not save note"),
  });
  const del = async () => {
    try {
      await deleteAdminEnquiry({ data: { id: inq.id } });
      toast.success("Enquiry deleted");
      onClose();
    } catch {
      toast.error("Could not delete");
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{inq.name}</DialogTitle>
      </DialogHeader>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        {(
          [
            ["Email", inq.email],
            ["Phone", inq.phone],
            ["Company", inq.company],
            ["Service", inq.service],
            ["Budget", inq.budget],
            ["Timeline", inq.timeline],
            ["Type", inq.kind],
            ["Received", new Date(inq.created_at).toLocaleString()],
          ] as const
        )
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
      <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">{inq.message}</div>
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            saveStatus.mutate(e.target.value);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="ml-auto">
              <Trash2 className="size-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this enquiry?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the enquiry and its notes permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={del}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Private notes & follow-ups</h3>
        <div className="flex gap-2">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="rounded-md border bg-background px-2 text-sm"
          >
            <option value="note">Note</option>
            <option value="follow_up">Follow-up</option>
          </select>
          <Textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a private note…"
          />
        </div>
        <Button
          size="sm"
          disabled={!note.trim() || addNote.isPending}
          onClick={() => addNote.mutate()}
        >
          Save note
        </Button>
        <ul className="space-y-2">
          {notes.data?.map((n) => (
            <li key={n.id} className="rounded-md border p-3 text-sm">
              <p className="text-xs text-muted-foreground">
                {n.kind === "follow_up" ? "Follow-up" : n.kind === "status" ? "Status" : "Note"} ·{" "}
                {new Date(n.created_at).toLocaleString()}
              </p>
              <p className="whitespace-pre-wrap">{n.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
