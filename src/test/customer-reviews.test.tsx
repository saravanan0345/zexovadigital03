import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { calculateReviewStats, SEED_REVIEWS, type Review } from "@/lib/reviews";
import { CustomerReviews } from "@/components/site/CustomerReviews";

describe("Customer Reviews calculation and logic", () => {
  it("correctly computes review stats for SEED_REVIEWS", () => {
    const stats = calculateReviewStats(SEED_REVIEWS);
    expect(stats.averageRating).toBe(5.0);
    expect(stats.totalCount).toBe(6);
    expect(stats.verifiedCount).toBe(6);
    expect(stats.recommendedPercent).toBe(100);
    expect(stats.ratingDistribution[5]).toBe(6);
  });

  it("handles mixed ratings gracefully", () => {
    const sample: Review[] = [
      {
        id: "1",
        name: "Test User",
        role_or_company: "Co-Founder, TestCorp",
        rating: 4,
        message: "Great work!",
        verified: true,
        status: "accepted",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Sample Client",
        role_or_company: "CEO, SampleCo",
        rating: 5,
        message: "Outstanding!",
        verified: false,
        status: "accepted",
        created_at: new Date().toISOString(),
      },
    ];

    const stats = calculateReviewStats(sample);
    expect(stats.averageRating).toBe(4.5);
    expect(stats.totalCount).toBe(2);
    expect(stats.verifiedCount).toBe(1);
    expect(stats.recommendedPercent).toBe(100);
  });
});

describe("CustomerReviews UI Component", () => {
  it("renders review section with overall rating, verified badge, and marquee", () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={qc}>
        <CustomerReviews />
      </QueryClientProvider>,
    );

    // Section title
    expect(screen.getByText(/Trusted by Clients/i)).toBeInTheDocument();
    expect(screen.getByText(/Loved for Results/i)).toBeInTheDocument();

    // Overall average rating display
    expect(screen.getAllByText("5.0").length).toBeGreaterThan(0);
    expect(screen.getByText(/100% Verified Clients/i)).toBeInTheDocument();

    // Prominent "Verified Client" badge
    const verifiedBadges = screen.getAllByText(/Verified Client/i);
    expect(verifiedBadges.length).toBeGreaterThan(0);

    // Action buttons
    expect(screen.getByRole("button", { name: /View All Reviews/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Write a Review/i })).toBeInTheDocument();

    // Marquee list structure
    const list = screen.getByRole("list");
    expect(list).toHaveClass("animate-marquee-slow");
    expect(list.style.animationDuration).toMatch(/\d+(\.\d+)?s/);
  });
});
