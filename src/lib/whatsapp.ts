import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/site-content";

/**
 * Fallback WhatsApp number (country code + number, digits only, e.g. "918610224226").
 * The number saved in Admin Settings → "WhatsApp number" takes priority.
 */
export const WHATSAPP_NUMBER =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_WHATSAPP_NUMBER) || "918610224226";

export const DEFAULT_WA_MESSAGE =
  "Hi, I am interested in your services and would like to make an enquiry.";
export const ENQUIRY_WA_MESSAGE =
  "Hi, I am interested in your services. I would like to discuss my requirements.";

export const waNumber = (raw?: string | null) => {
  const digits = (raw || WHATSAPP_NUMBER).replace(/\D/g, "");
  if (!digits) return "";
  // If 10 digits starting with 6-9, prefix India country code 91
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return `91${digits}`;
  }
  return digits;
};

export const waLink = (number: string, message: string) => {
  const clean = waNumber(number);
  return clean
    ? `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
};

export const subjectMessage = (subject: string) =>
  `Hi, I am interested in ${subject}. I would like to discuss my requirements.`;

/** Returns the configured WhatsApp number (digits) or "" if none is set. */
export function useWhatsAppNumber() {
  const { data } = useQuery(settingsQuery);
  return waNumber(data?.whatsapp || data?.phone);
}
