import { Link } from "@tanstack/react-router";
import { services } from "@/lib/site-data";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "./Header";
import { settingsQuery } from "@/lib/site-content";

export function Footer() {
  const { data: st } = useQuery(settingsQuery);
  const contact = st
    ? (
        [
          ["Phone", st.phone, st.phone && `tel:${st.phone.replace(/[^\d+]/g, "")}`],
          [
            "WhatsApp",
            st.whatsapp,
            st.whatsapp && `https://wa.me/${st.whatsapp.replace(/\D/g, "")}`,
          ],
          ["Email", st.email, st.email && `mailto:${st.email}`],
          ["Address", st.address, null],
          ["Hours", st.hours, null],
        ] as const
      ).filter(([, v]) => v)
    : [];
  const socials = st
    ? (
        [
          ["Facebook", st.facebook],
          ["Instagram", st.instagram],
          ["LinkedIn", st.linkedin],
          ["X", st.x_twitter],
          ["YouTube", st.youtube],
        ] as const
      ).filter(([, v]) => v)
    : [];
  return (
    <footer className="dark border-t bg-navy text-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">
            {st?.tagline || "Powering Local Businesses with websites, apps, AI and automation."}
          </p>
          {socials.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {socials.map(([l, u]) => (
                <a
                  key={l}
                  href={u!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {l}
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h4 className="text-sm font-semibold">Services</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="hover:text-foreground"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/process" className="hover:text-foreground">
                Our Process
              </Link>
            </li>
            <li>
              <Link to="/industries" className="hover:text-foreground">
                Industries
              </Link>
            </li>
            <li>
              <Link to="/technologies" className="hover:text-foreground">
                Technologies
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-foreground">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Get in touch</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/quote" className="hover:text-foreground">
                Request a Quote
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-foreground">
                Packages
              </Link>
            </li>
            {contact.map(([l, v, href]) => (
              <li key={l}>
                {href ? (
                  <a href={href} className="hover:text-foreground">
                    <span className="text-muted-foreground/80">{l}: </span>
                    {v}
                  </a>
                ) : (
                  <span>
                    <span className="text-muted-foreground/80">{l}: </span>
                    {v}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} ZEXOVA DIGITAL. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
