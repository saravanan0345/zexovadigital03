import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { FloatingWhatsApp } from "@/components/site/WhatsApp";
import { waLink, waNumber, DEFAULT_WA_MESSAGE } from "@/lib/whatsapp";

// Mock @tanstack/react-router's Link component
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: { to: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("WhatsApp helpers and components", () => {
  it("formats waLink correctly with or without country/phone number", () => {
    expect(waLink("919876543210", "Hello")).toBe("https://wa.me/919876543210?text=Hello");
    expect(waLink("8610224226", "Hello")).toBe("https://wa.me/918610224226?text=Hello");
  });

  it("extracts digits using waNumber and formats 10-digit Indian numbers", () => {
    expect(waNumber("+91 (987) 654-3210")).toBe("919876543210");
    expect(waNumber("8610224226")).toBe("918610224226");
    expect(waNumber("918610224226")).toBe("918610224226");
    expect(waNumber("")).toBe("918610224226");
  });

  it("renders the floating WhatsApp button directing to 8610224226 directly", () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={qc}>
        <FloatingWhatsApp />
      </QueryClientProvider>,
    );

    // Let's talk button is removed from floating container
    expect(screen.queryByText("Let's talk")).not.toBeInTheDocument();

    // Floating WhatsApp button is present and links directly to 918610224226
    const waButton = screen.getByRole("link", { name: /chat with us on whatsapp/i });
    expect(waButton).toBeInTheDocument();
    expect(waButton.getAttribute("href")).toContain("https://wa.me/918610224226");
    expect(waButton.getAttribute("href")).toContain(encodeURIComponent(DEFAULT_WA_MESSAGE));
  });
});
