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
    expect(waLink("", "Hello world")).toBe("https://wa.me/?text=Hello%20world");
  });

  it("extracts digits using waNumber", () => {
    expect(waNumber("+91 (987) 654-3210")).toBe("919876543210");
    expect(waNumber("")).toBe("");
  });

  it("renders both 'Let's talk' button and the floating WhatsApp button under it", () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={qc}>
        <FloatingWhatsApp />
      </QueryClientProvider>,
    );

    // Let's talk button is present
    const talkButton = screen.getByRole("link", { name: /start your project/i });
    expect(talkButton).toBeInTheDocument();
    expect(talkButton).toHaveTextContent("Let's talk");
    expect(talkButton).toHaveAttribute("href", "/quote");

    // WhatsApp button is present under it
    const waButton = screen.getByRole("link", { name: /chat with us on whatsapp/i });
    expect(waButton).toBeInTheDocument();
    expect(waButton.getAttribute("href")).toContain("https://wa.me/");
    expect(waButton.getAttribute("href")).toContain(encodeURIComponent(DEFAULT_WA_MESSAGE));
  });
});
