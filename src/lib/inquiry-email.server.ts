const RESEND_API_URL = "https://api.resend.com/emails";

/** Where new website enquiries are emailed. */
export const ENQUIRY_NOTIFY_EMAIL =
  process.env["ENQUIRY_NOTIFY_EMAIL"] || "zexovadigital@gmail.com";

export type InquiryEmailData = {
  kind: string;
  name: string;
  email: string;
  phone?: string | null | undefined;
  company?: string | null | undefined;
  service?: string | null | undefined;
  budget?: string | null | undefined;
  timeline?: string | null | undefined;
  message: string;
};

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function buildInquiryEmail(d: InquiryEmailData) {
  const label = d.kind === "quote" ? "Quote request" : "Contact enquiry";
  const rows: [string, string | null | undefined][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Company", d.company],
    ["Service", d.service],
    ["Budget", d.budget],
    ["Timeline", d.timeline],
  ];
  const tr = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top">${k}</td><td style="padding:6px 0;color:#07152B;font-weight:600">${esc(String(v))}</td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#ffffff">
  <h2 style="margin:0 0 4px;color:#07152B">New ${label.toLowerCase()}</h2>
  <p style="margin:0 0 16px;color:#1769E8;font-weight:600">ZEXOVA DIGITAL website</p>
  <table style="border-collapse:collapse;font-size:14px">${tr}</table>
  <h3 style="margin:20px 0 6px;color:#07152B;font-size:15px">Message</h3>
  <p style="margin:0;white-space:pre-wrap;font-size:14px;color:#07152B;line-height:1.5">${esc(d.message)}</p>
  <p style="margin:24px 0 0;font-size:12px;color:#64748b">Reply to this email to answer ${esc(d.name)} directly. It is also saved in your admin Enquiries page.</p>
</div>`;
  const subject = `${label}${d.service ? ` – ${d.service}` : ""} from ${d.name}`;
  return { subject, html };
}

/** Emails the enquiry to the business inbox. Never throws: a failed email must not lose the enquiry. */
export async function notifyNewInquiry(d: InquiryEmailData) {
  const resendKey = process.env["RESEND_API_KEY"]?.trim();
  if (!resendKey) {
    console.error("enquiry email skipped: RESEND_API_KEY is not configured");
    return;
  }
  const { subject, html } = buildInquiryEmail(d);
  const toEmail = process.env["ENQUIRY_NOTIFY_EMAIL"] || ENQUIRY_NOTIFY_EMAIL;
  const configuredFrom = process.env["RESEND_FROM_EMAIL"]?.trim();
  const defaultFrom = "ZEXOVA DIGITAL Website <onboarding@resend.dev>";
  const from =
    configuredFrom && !configuredFrom.includes("@gmail.com") ? configuredFrom : defaultFrom;

  try {
    let res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from,
        to: [toEmail],
        reply_to: d.email,
        subject,
        html,
      }),
    });

    if (!res.ok && from !== defaultFrom) {
      console.warn(
        `Resend failed with custom sender [${res.status}], retrying with default onboarding sender...`,
      );
      res = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: defaultFrom,
          to: [toEmail],
          reply_to: d.email,
          subject,
          html,
        }),
      });
    }

    if (!res.ok) {
      console.error(`enquiry email failed [${res.status}]: ${await res.text()}`);
    } else {
      console.log(`Enquiry notification email sent successfully to ${toEmail}`);
    }
  } catch (e) {
    console.error("enquiry email error", e);
  }
}
