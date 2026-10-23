import { describe, it, expect } from "vitest";
import { slugify, toCsv, ENQUIRY_STATUSES } from "@/lib/site-content";

describe("site content helpers", () => {
  it("has the six enquiry statuses from the brief", () => {
    expect(ENQUIRY_STATUSES).toEqual([
      "new",
      "contacted",
      "in_discussion",
      "quotation_sent",
      "converted",
      "closed",
    ]);
  });
  it("slugifies titles", () => {
    expect(slugify("  Café Bloom — Website!  ")).toBe("caf-bloom-website");
  });
  it("escapes CSV values", () => {
    expect(toCsv([{ a: 'x,"y"', b: 1 }])).toBe('a,b\n"x,""y""",1');
  });
});
