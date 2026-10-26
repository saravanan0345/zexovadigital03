import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Star,
  Check,
  X,
  BadgeCheck,
  Plus,
  Trash2,
  Search,
  MessageSquareQuote,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchAdminReviews,
  updateReviewStatus,
  toggleReviewVerified,
  createAdminReview,
  deleteReview,
} from "@/lib/reviews.functions";
import type { Review } from "@/lib/reviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

export const Route = createFileRoute("/admin/reviews")({ component: AdminReviews });

function StarDisplay({ rating = 5 }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-4 ${
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function AdminReviews() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "declined">("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New review form states
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newMessage, setNewMessage] = useState("");
  const [newVerified, setNewVerified] = useState(true);
  const [newStatus, setNewStatus] = useState<"accepted" | "pending">("accepted");
  const [isCreating, setIsCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const res = await fetchAdminReviews();
      return res;
    },
  });

  const reviews = data?.reviews || [];
  const stats = data?.stats;

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    qc.invalidateQueries({ queryKey: ["public", "reviews"] });
  };

  // Status update mutation (Accept / Decline)
  const handleStatusChange = async (id: string, status: "accepted" | "declined") => {
    try {
      await updateReviewStatus({ data: { id, status } });
      toast.success(
        status === "accepted"
          ? "Review accepted! It is now published on the website."
          : "Review declined! It is hidden from the website.",
      );
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update review status.");
    }
  };

  // Toggle verified
  const handleToggleVerified = async (id: string, currentVerified: boolean) => {
    try {
      await toggleReviewVerified({ data: { id, verified: !currentVerified } });
      toast.success(!currentVerified ? "Marked as Verified Client" : "Unmarked from Verified");
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update verified status.");
    }
  };

  // Delete review
  const handleDelete = async (id: string) => {
    try {
      await deleteReview({ data: { id } });
      toast.success("Review deleted successfully.");
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete review.");
    }
  };

  // Create review
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim() || !newMessage.trim()) {
      toast.error("Please fill in author name, company/role, and review message.");
      return;
    }

    try {
      setIsCreating(true);
      await createAdminReview({
        data: {
          name: newName,
          role_or_company: newRole,
          email: newEmail || undefined,
          rating: newRating,
          message: newMessage,
          verified: newVerified,
          status: newStatus,
        },
      });

      toast.success(
        newStatus === "accepted"
          ? "Review created and published on the website!"
          : "Review saved as pending.",
      );
      setNewName("");
      setNewRole("");
      setNewEmail("");
      setNewRating(5);
      setNewMessage("");
      setNewVerified(true);
      setNewStatus("accepted");
      setIsAddOpen(false);
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create review.");
    } finally {
      setIsCreating(false);
    }
  };

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const acceptedCount = reviews.filter((r) => r.status === "accepted").length;
  const declinedCount = reviews.filter((r) => r.status === "declined").length;

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.role_or_company.toLowerCase().includes(q) ||
      r.message.toLowerCase().includes(q) ||
      (r.email && r.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Reviews</h1>
          <p className="text-sm text-muted-foreground">
            Approve or decline customer reviews. Accepted reviews appear live in the homepage marquee and “View All” modal.
          </p>
        </div>
        <Button variant="hero" onClick={() => setIsAddOpen(true)} className="gap-2">
          <Plus className="size-4" /> Add Review
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overall Rating
            </span>
            <Star className="size-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold">
              {stats?.averageRating ? stats.averageRating.toFixed(1) : "5.0"}
            </span>
            <span className="text-xs text-muted-foreground">/ 5.0 Stars</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Based on {acceptedCount} active client reviews
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Accepted (Live)
            </span>
            <BadgeCheck className="size-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-emerald-400">
              {acceptedCount}
            </span>
            <span className="text-xs text-muted-foreground">Published</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Showing on homepage carousel</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pending Approval
            </span>
            <Clock className="size-5 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-amber-400">
              {pendingCount}
            </span>
            <span className="text-xs text-muted-foreground">Awaiting Review</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Needs accept or decline</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Declined (Hidden)
            </span>
            <X className="size-5 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-muted-foreground">
              {declinedCount}
            </span>
            <span className="text-xs text-muted-foreground">Rejected</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Hidden from visitors</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, email or feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border bg-card p-1 text-xs font-medium">
          <button
            onClick={() => setFilterStatus("all")}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filterStatus === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filterStatus === "pending"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus("accepted")}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filterStatus === "accepted"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Accepted ({acceptedCount})
          </button>
          <button
            onClick={() => setFilterStatus("declined")}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filterStatus === "declined"
                ? "bg-muted-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Declined ({declinedCount})
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">Loading reviews…</div>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
            No reviews found matching the current filter.
          </div>
        ) : (
          filteredReviews.map((r) => {
            const isAccepted = r.status === "accepted";
            const isDeclined = r.status === "declined";
            const isPending = r.status === "pending";

            return (
              <div
                key={r.id}
                className={`relative rounded-xl border bg-card p-6 shadow-card transition-all ${
                  isPending
                    ? "border-amber-500/40 bg-amber-500/[0.02]"
                    : isAccepted
                    ? "border-emerald-500/30"
                    : "opacity-75"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{r.name}</h3>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {r.role_or_company}
                      </span>

                      {/* Verified Badge */}
                      {r.verified ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[11px] font-semibold text-cyan">
                          <BadgeCheck className="size-3 text-cyan" />
                          Verified Client
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          Unverified
                        </span>
                      )}

                      {/* Status Badge */}
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                          <Check className="size-3 text-emerald-400" />
                          Accepted / Live
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
                          <Clock className="size-3 text-amber-400" />
                          Pending Decision
                        </span>
                      )}
                      {isDeclined && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-400">
                          <X className="size-3 text-rose-400" />
                          Declined / Hidden
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <StarDisplay rating={r.rating} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {r.email && (
                        <span className="text-xs text-muted-foreground">
                          Email: <span className="font-mono">{r.email}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons: Accept / Decline / Toggle Verified / Delete */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Accept Button */}
                    <Button
                      size="sm"
                      variant={isAccepted ? "outline" : "default"}
                      onClick={() => handleStatusChange(r.id, "accepted")}
                      className={`gap-1.5 ${
                        isAccepted
                          ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                          : "bg-emerald-600 text-white hover:bg-emerald-500"
                      }`}
                    >
                      <Check className="size-4" />
                      {isAccepted ? "Accepted" : "Accept Review"}
                    </Button>

                    {/* Decline Button */}
                    <Button
                      size="sm"
                      variant={isDeclined ? "outline" : "destructive"}
                      onClick={() => handleStatusChange(r.id, "declined")}
                      className={`gap-1.5 ${
                        isDeclined
                          ? "border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
                          : ""
                      }`}
                    >
                      <X className="size-4" />
                      {isDeclined ? "Declined" : "Decline"}
                    </Button>

                    {/* Toggle Verified */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleVerified(r.id, r.verified)}
                      title={r.verified ? "Remove verified badge" : "Add verified badge"}
                      className="gap-1.5 text-xs"
                    >
                      <BadgeCheck className={`size-3.5 ${r.verified ? "text-cyan" : "text-muted-foreground"}`} />
                      {r.verified ? "Verified" : "Verify"}
                    </Button>

                    {/* Delete Alert Dialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove this review by "{r.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(r.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-muted/40 p-3.5 text-sm leading-relaxed text-foreground/90">
                  "{r.message}"
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Review Dialog for Admin */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="size-5 text-primary" />
              Add Client Review
            </DialogTitle>
            <DialogDescription>
              Add a customer review directly. You can set it to Accepted to immediately publish it to the website.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="admin-rev-name">Author / Client Name *</Label>
              <Input
                id="admin-rev-name"
                placeholder="e.g. Ramesh Chandran"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="admin-rev-role">Role & Business / Company *</Label>
              <Input
                id="admin-rev-role"
                placeholder="e.g. Managing Partner, Chandran Logistics"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="admin-rev-email">Email (Optional)</Label>
              <Input
                id="admin-rev-email"
                type="email"
                placeholder="e.g. ramesh@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="admin-rev-rating">Star Rating (1 to 5 Stars)</Label>
              <div className="mt-2 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`size-6 ${
                        star <= newRating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-transparent text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold">{newRating} Stars</span>
              </div>
            </div>

            <div>
              <Label htmlFor="admin-rev-message">Review Feedback *</Label>
              <Textarea
                id="admin-rev-message"
                placeholder="Enter the customer testimonial..."
                rows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/30 p-3">
              <div className="space-y-0.5">
                <Label htmlFor="admin-rev-verified" className="text-sm font-semibold">
                  Verified Client Badge
                </Label>
                <p className="text-xs text-muted-foreground">
                  Shows the "✓ Verified Client" badge on this review
                </p>
              </div>
              <Switch
                id="admin-rev-verified"
                checked={newVerified}
                onCheckedChange={setNewVerified}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/30 p-3">
              <div className="space-y-0.5">
                <Label htmlFor="admin-rev-status" className="text-sm font-semibold">
                  Publish Immediately
                </Label>
                <p className="text-xs text-muted-foreground">
                  Accepted reviews show up live in the marquee loop
                </p>
              </div>
              <Switch
                id="admin-rev-status"
                checked={newStatus === "accepted"}
                onCheckedChange={(checked) => setNewStatus(checked ? "accepted" : "pending")}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={isCreating}>
                {isCreating ? "Saving..." : "Add & Publish"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
