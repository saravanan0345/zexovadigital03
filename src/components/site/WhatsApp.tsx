import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { DEFAULT_WA_MESSAGE, ENQUIRY_WA_MESSAGE, useWhatsAppNumber, waLink } from "@/lib/whatsapp";

export function WhatsAppIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.42 9.43-9.42a9.37 9.37 0 0 1 9.42 9.43c0 5.2-4.23 9.42-9.43 9.42m8.02-17.44A11.27 11.27 0 0 0 12.05.75C5.8.75.72 5.83.72 12.08c0 2 .52 3.95 1.52 5.66L.62 23.62l6.01-1.58a11.3 11.3 0 0 0 5.41 1.38h.01c6.25 0 11.33-5.08 11.33-11.33 0-3.03-1.18-5.87-3.32-8.02" />
    </svg>
  );
}

/** Enquiry CTA: opens WhatsApp when a number is configured, otherwise falls back to the given page. */
export function EnquiryLink({
  children,
  message = ENQUIRY_WA_MESSAGE,
  fallback = "/quote",
  className,
  onClick,
}: {
  children: ReactNode;
  message?: string;
  fallback?: "/quote" | "/contact";
  className?: string;
  onClick?: () => void;
}) {
  const number = useWhatsAppNumber();
  if (!number)
    return (
      <Link to={fallback} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  return (
    <a
      href={waLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export function FloatingWhatsApp() {
  const number = useWhatsAppNumber();

  return (
    <a
      href={waLink(number, DEFAULT_WA_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg ring-1 ring-border/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="size-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}
