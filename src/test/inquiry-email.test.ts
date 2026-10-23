import { afterEach, describe, it, expect, vi } from "vitest";
import {
  buildInquiryEmail,
  ENQUIRY_NOTIFY_EMAIL,
  notifyNewInquiry,
} from "@/lib/inquiry-email.server";

describe("enquiry notification email", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("goes to the official business inbox", () => {
    expect(ENQUIRY_NOTIFY_EMAIL).toBe("zexovadigital@gmail.com");
  });
  it("escapes customer text so it cannot inject HTML", () => {
    const { html } = buildInquiryEmail({
      kind: "contact",
      name: "<b>x</b>",
      email: "a@b.co",
      message: "<script>hi</script> long msg",
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("sends through Resend using only the Resend API key", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("LOVABLE_API_KEY", "");
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL", "owner@example.com");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await notifyNewInquiry({
      kind: "contact",
      name: "Test Customer",
      email: "customer@example.com",
      message: "I would like to learn more.",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(new Headers(options.headers).get("Authorization")).toBe("Bearer re_test_key");
    expect(JSON.parse(String(options.body))).toMatchObject({
      to: ["owner@example.com"],
      reply_to: "customer@example.com",
    });
  });

  it("does not attempt delivery when the Resend API key is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});

    await notifyNewInquiry({
      kind: "contact",
      name: "Test Customer",
      email: "customer@example.com",
      message: "I would like to learn more.",
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "enquiry email skipped: RESEND_API_KEY is not configured",
    );
  });
});
