import { describe, it, expect } from "vitest";
import { services } from "@/lib/site-data";
import { marqueeLoop } from "@/lib/site-content";

describe("College Projects service", () => {
  it("sits in the 4th position of the services list", () => {
    expect(services[3]?.title).toBe("College Projects");
  });
  it("keeps the original first three services in order", () => {
    expect(services.slice(0, 3).map((s) => s.slug)).toEqual([
      "website-development",
      "web-applications",
      "mobile-apps",
    ]);
  });
});

describe("startup projects carousel loop", () => {
  it("doubles a filled copy so the right-to-left loop has no gap", () => {
    const loop = marqueeLoop(["a", "b", "c"], 8);
    expect(loop.length).toBe(18);
    expect(loop.slice(0, 9)).toEqual(loop.slice(9));
  });
  it("is empty when there are no projects", () => {
    expect(marqueeLoop([])).toEqual([]);
  });
});
