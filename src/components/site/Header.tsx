import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import zmark from "@/assets/zmark.png";
import { Button } from "@/components/ui/button";
import { EnquiryLink } from "./WhatsApp";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/process", label: "Process" },
  { to: "/industries", label: "Industries" },
  { to: "/technologies", label: "Technologies" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="ZEXOVA DIGITAL home">
      <motion.img
        initial={{ opacity: 0, rotate: -12, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        src={zmark}
        alt=""
        width={375}
        height={197}
        className="h-8 w-auto"
      />
      <span className="font-display text-lg font-extrabold leading-none tracking-tight">
        ZEXOVA <span className="text-gradient">DIGITAL</span>
      </span>
    </Link>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("zx-theme", next ? "dark" : "light");
  };
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b bg-background/80 backdrop-blur-xl" : "bg-transparent"}`}
    >
      <div
        className={`mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4 ${scrolled ? "" : "dark text-foreground"}`}
      >
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="nav-link text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "active text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="hero" className="hidden sm:inline-flex">
            <EnquiryLink>Start Your Project</EnquiryLink>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b bg-background lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {nav.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 font-medium hover:bg-accent"
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <Button asChild variant="hero" className="mt-2">
                <EnquiryLink onClick={() => setOpen(false)}>Start Your Project</EnquiryLink>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
