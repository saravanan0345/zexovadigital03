import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Star,
  BadgeCheck,
  Quote,
  MessageSquarePlus,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { fetchPublicReviews, submitPublicReview } from "@/lib/reviews.functions";
import { SEED_REVIEWS, calculateReviewStats, type Review } from "@/lib/reviews";
import { marqueeLoop } from "@/lib/site-content";
import { SectionHeading } from "./Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function StarRating({ rating = 5, size = "size-4" }: { rating?: number; size?: string }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${
            i <= rounded
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, isDuplicate }: { review: Review; isDuplicate?: boolean }) {
  // Generate consistent initial letter colors
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article
      aria-hidden={isDuplicate || undefined}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
    >
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <StarRating rating={review.rating} />
          {review.verified && (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan shadow-sm backdrop-blur-sm"
              title="Verified Client of ZEXOVA DIGITAL"
            >
              <BadgeCheck className="size-3.5 text-cyan" />
              Verified Client
            </span>
          )}
        </div>

        <div className="relative mt-4">
          <Quote className="absolute -left-1 -top-2 size-6 text-primary/15 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary/25" />
          <p className="relative pl-3 text-sm leading-relaxed text-foreground/90">
            "{review.message}"
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t pt-4">
        <div className="bg-brand flex size-10 shrink-0 items-center justify-center rounded-full font-bold text-primary-foreground shadow-sm">
          {initials || "C"}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-foreground">{review.name}</h4>
          <p className="truncate text-xs text-muted-foreground">{review.role_or_company}</p>
        </div>
      </div>
    </article>
  );
}

export function CustomerReviews() {
  const qc = useQueryClient();
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const { data } = useQuery({
    queryKey: ["public", "reviews"],
    queryFn: async () => {
      try {
        const res = await fetchPublicReviews();
        return res;
      } catch (err) {
        console.warn("Falling back to seed reviews:", err);
        return {
          reviews: SEED_REVIEWS,
          stats: calculateReviewStats(SEED_REVIEWS),
        };
      }
    },
    initialData: {
      reviews: SEED_REVIEWS,
      stats: calculateReviewStats(SEED_REVIEWS),
    },
  });

  const reviews = data?.reviews || SEED_REVIEWS;
  const stats = data?.stats || calculateReviewStats(reviews);

  const loop = marqueeLoop(reviews, 8);
  const half = loop.length / 2;
  const duration = `${Math.max(22, half * 6.5)}s`;

  // Write review mutation
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWriteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim() || !formMessage.trim()) {
      toast.error("Please fill in your name, company/role, and review message.");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitPublicReview({
        data: {
          name: formName,
          role_or_company: formRole,
          email: formEmail || undefined,
          rating: formRating,
          message: formMessage,
        },
      });

      toast.success(
        "Thank you! Your review has been submitted and will appear upon admin verification.",
        { duration: 5000 },
      );
      setFormName("");
      setFormRole("");
      setFormEmail("");
      setFormRating(5);
      setFormMessage("");
      setWriteOpen(false);
      qc.invalidateQueries({ queryKey: ["public", "reviews"] });
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.role_or_company.toLowerCase().includes(q) ||
      r.message.toLowerCase().includes(q)
    );
  });

  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Customer Reviews"
          title={
            <>
              Trusted by Clients, <span className="text-gradient">Loved for Results</span>
            </>
          }
          text="Hear directly from business owners, founders, and leaders who partner with ZEXOVA DIGITAL to scale their digital presence."
        />

        {/* Overall Rating & Stats Summary Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-2xl border bg-card/60 p-6 shadow-card backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {stats.averageRating.toFixed(1)}
              </span>
              <div>
                <StarRating rating={stats.averageRating} size="size-5" />
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  Overall Rating ({stats.totalCount} Verified Reviews)
                </p>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-border sm:block" />

            <div className="flex flex-wrap gap-2 text-xs">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/10 px-3 py-1 font-semibold text-cyan">
                <BadgeCheck className="size-3.5" />
                100% Verified Clients
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                {stats.recommendedPercent}% Client Satisfaction
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWriteOpen(true)}
              className="gap-2"
            >
              <MessageSquarePlus className="size-4" />
              Write a Review
            </Button>
            <Button
              variant="hero"
              size="sm"
              onClick={() => setViewAllOpen(true)}
              className="gap-2"
            >
              View All Reviews
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Continuous Right-to-Left Marquee Flow */}
      <div
        className="marquee-wrap relative mt-12 overflow-x-auto [scrollbar-width:none] md:overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <ul
          className="animate-marquee-slow flex w-max py-3"
          style={{ animationDuration: duration }}
        >
          {loop.map((review, i) => {
            const isDuplicate = i >= reviews.length;
            return (
              <li
                key={`${review.id}-${i}`}
                className="w-80 shrink-0 pr-6 md:w-96"
              >
                <ReviewCard review={review} isDuplicate={isDuplicate} />
              </li>
            );
          })}
        </ul>
      </div>

      {/* "View All" Modal Dialog */}
      <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-2xl font-bold">Client Reviews & Testimonials</DialogTitle>
                <DialogDescription className="mt-1">
                  Read genuine experiences from our verified clients across diverse industries.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-extrabold text-foreground">
                  {stats.averageRating.toFixed(1)}
                </span>
                <div>
                  <StarRating rating={stats.averageRating} size="size-4" />
                  <span className="text-xs text-muted-foreground">
                    {stats.totalCount} Verified Reviews
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="relative min-w-60 flex-1">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews by name, company, or keyword..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setViewAllOpen(false);
                setWriteOpen(true);
              }}
              className="gap-2"
            >
              <MessageSquarePlus className="size-4" />
              Write a Review
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {filteredReviews.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No reviews found matching "{searchFilter}".
              </div>
            ) : (
              filteredReviews.map((r) => <ReviewCard key={r.id} review={r} />)
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* "Write a Review" Modal Dialog */}
      <Dialog open={writeOpen} onOpenChange={setWriteOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="size-5 text-primary" />
              Share Your Experience
            </DialogTitle>
            <DialogDescription>
              We appreciate your feedback! Reviews are verified before publication to ensure quality.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleWriteSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="review-rating">Rating (1 to 5 Stars)</Label>
              <div className="mt-2 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    title={`${star} Star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`size-6 ${
                        star <= formRating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-transparent text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold text-foreground">
                  {formRating} of 5 Stars
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="review-name">Your Full Name *</Label>
              <Input
                id="review-name"
                placeholder="e.g. Rajesh Kannan"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="review-role">Your Role & Business / Company *</Label>
              <Input
                id="review-role"
                placeholder="e.g. Director, Kannan Textiles"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="review-email">Email Address (Private / Verification only)</Label>
              <Input
                id="review-email"
                type="email"
                placeholder="e.g. rajesh@example.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="review-message">Your Review *</Label>
              <Textarea
                id="review-message"
                placeholder="Tell us about the project, results achieved, and your overall experience working with ZEXOVA DIGITAL..."
                rows={4}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setWriteOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
