import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { FloatingWhatsApp } from "@/components/site/WhatsApp";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-hero px-4 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-gradient text-8xl font-extrabold">404</h1>
        <h2 className="mt-4 text-2xl font-bold">This page drifted off the grid</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="bg-brand shadow-glow inline-flex rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ZEXOVA DIGITAL — Powering Local Businesses" },
      {
        name: "description",
        content: "Websites, apps, AI and automation for growing local businesses.",
      },
      { property: "og:site_name", content: "ZEXOVA DIGITAL" },
      { property: "og:title", content: "ZEXOVA DIGITAL — Powering Local Businesses" },
      {
        property: "og:description",
        content: "Websites, apps, AI and automation for growing local businesses.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zexovadigital.online" },
      { property: "og:image", content: "https://zexovadigital.online/og-image.png" },
      { property: "og:image:secure_url", content: "https://zexovadigital.online/og-image.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "ZEXOVA DIGITAL Logo and Services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ZEXOVA DIGITAL — Powering Local Businesses" },
      {
        name: "twitter:description",
        content: "Websites, apps, AI and automation for growing local businesses.",
      },
      { name: "twitter:image", content: "https://zexovadigital.online/og-image.png" },
      { name: "twitter:image:alt", content: "ZEXOVA DIGITAL" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "image_src", href: "https://zexovadigital.online/og-image.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const themeScript = `try{if(localStorage.getItem('zx-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

const organizationSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ZEXOVA DIGITAL",
  alternateName: "Zexova",
  url: "https://zexovadigital.online",
  logo: "https://zexovadigital.online/logo.png",
  image: "https://zexovadigital.online/og-image.png",
  description: "Websites, apps, AI and automation for growing local businesses.",
  telephone: "+91 73059 28297",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91 86102 24226",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil"],
    },
  ],
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationSchema }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isAdmin = useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") });
  if (isAdmin)
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster richColors position="top-center" />
      </QueryClientProvider>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
