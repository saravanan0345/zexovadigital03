import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/site-content";

/**
 * Fallback WhatsApp number (country code + number, digits only, e.g. "919876543210").
 * The number saved in Admin Settings → "WhatsApp number" takes priority.
 */
export const WHATSAPP_NUMBER = "";

export const DEFAULT_WA_MESSAGE =
  "Hi, I am interested in your services and would like to make an enquiry.";
export const ENQUIRY_WA_MESSAGE =
  "Hi, I am interested in your services. I would like to discuss my requirements.";

export const waNumber = (raw?: string | null) => (raw || WHATSAPP_NUMBER).replace(/\D/g, "");

export const waLink = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const subjectMessage = (subject: string) =>
  `Hi, I am interested in ${subject}. I would like to discuss my requirements.`;

/** Returns the configured WhatsApp number (digits) or "" if none is set. */
export function useWhatsAppNumber() {
  const { data } = useQuery(settingsQuery);
  return waNumber(data?.whatsapp);
}
