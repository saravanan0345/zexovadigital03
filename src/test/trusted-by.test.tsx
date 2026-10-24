import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { TrustedBy } from "@/components/site/TrustedBy";
import { publishedProjectsQuery } from "@/lib/site-content";

// Mock @tanstack/react-router Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
    children,
    ...props
  }: {
    to: string;
    params?: { slug: string };
    children: ReactNode;
  } & AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const href = params?.slug ? to.replace("$slug", params.slug) : to;
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

describe("TrustedBy portfolio projects carousel", () => {
  it("renders infinite marquee with dynamic animation duration and no gaps", () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    qc.setQueryData(publishedProjectsQuery.queryKey, [
      {
        id: "1",
        title: "Acme Store",
        slug: "acme-store",
        category: "E-Commerce",
        short_description: "Modern online store",
        cover_url: "https://example.com/cover.jpg",
        published: true,
        sort_order: 1,
        published_at: new Date().toISOString(),
        challenge: null,
        solution: null,
        results: null,
        client_name: null,
        technologies: [],
        created_at: new Date().toISOString(),
      },
    ]);

    render(
      <QueryClientProvider client={qc}>
        <TrustedBy />
      </QueryClientProvider>,
    );

    const heading = screen.getByRole("heading", { level: 2, name: /TRUSTED BY CLIENT/i });
    expect(heading).toBeInTheDocument();

    const links = screen.getAllByRole("link", { name: /Acme Store/i, hidden: true });
    // marqueeLoop ensures at least 16 cards (8 pairs of 1 item duplicated)
    expect(links.length).toBeGreaterThanOrEqual(16);

    const list = screen.getByRole("list");
    expect(list).toHaveClass("animate-marquee-slow");
    expect(list.style.animationDuration).toMatch(/\d+s/);
  });
});
