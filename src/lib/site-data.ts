import {
  Globe,
  AppWindow,
  Smartphone,
  PenTool,
  ShoppingCart,
  BrainCircuit,
  Workflow,
  Search,
  Megaphone,
  Palette,
  Code2,
  Wrench,
  LayoutTemplate,
  Plug,
  Layers,
  Gauge,
  ShieldCheck,
  Cloud,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: LucideIcon;
  category: string;
  description: string;
  deliverables: string[];
};

const s = (
  slug: string,
  title: string,
  icon: LucideIcon,
  category: string,
  short: string,
  deliverables: string[],
): Service => ({
  slug,
  title,
  icon,
  category,
  short,
  deliverables,
  description: `${short} We plan, design and build every ${title.toLowerCase()} project around your business goals, so the result is fast, reliable, and easy for your customers to use.`,
});

export const services: Service[] = [
  s(
    "website-development",
    "Website Design & Development",
    Globe,
    "Build",
    "Modern, fast business websites that turn visitors into customers.",
    [
      "Custom responsive design",
      "Content management",
      "SEO-ready structure",
      "Contact & lead forms",
    ],
  ),
  s(
    "web-applications",
    "Web Application Development",
    AppWindow,
    "Build",
    "Powerful browser-based tools built for your workflows.",
    [
      "Dashboards & portals",
      "User roles & permissions",
      "Secure data handling",
      "Scalable architecture",
    ],
  ),
  s(
    "mobile-apps",
    "Mobile Application Development",
    Smartphone,
    "Build",
    "Polished iOS and Android apps your customers will love.",
    ["Cross-platform apps", "Native-feel interfaces", "Push notifications", "App store launch"],
  ),
  s(
    "college-projects",
    "College Projects",
    GraduationCap,
    "Build",
    "Guided, well-documented final-year and academic projects for students.",
    [
      "Project idea & scope guidance",
      "Working source code",
      "Project report & documentation",
      "Explanation & demo support",
    ],
  ),
  s(
    "ui-ux-design",
    "UI/UX Design",
    PenTool,
    "Design",
    "Interfaces that look premium and feel effortless.",
    ["User research", "Wireframes & prototypes", "Design systems", "Usability testing"],
  ),
  s(
    "ecommerce",
    "E-commerce Development",
    ShoppingCart,
    "Build",
    "Online stores built to sell, from catalogue to checkout.",
    ["Product catalogue", "Secure payments", "Order management", "Inventory tracking"],
  ),
  s(
    "ai-solutions",
    "AI Integration & AI Applications",
    BrainCircuit,
    "Intelligence",
    "Practical AI that saves time and creates new value.",
    ["AI chat assistants", "Document processing", "Smart recommendations", "Custom AI workflows"],
  ),
  s(
    "automation",
    "Business Process Automation",
    Workflow,
    "Intelligence",
    "Automate repetitive tasks and connect your tools.",
    ["Workflow mapping", "Tool integrations", "Automated reports", "Notification flows"],
  ),
  s(
    "seo",
    "Search Engine Optimization",
    Search,
    "Growth",
    "Get found by local customers searching for you.",
    ["Technical SEO audit", "On-page optimization", "Local SEO", "Performance reporting"],
  ),
  s(
    "digital-marketing",
    "Digital Marketing",
    Megaphone,
    "Growth",
    "Campaigns that reach the right people at the right time.",
    ["Social media strategy", "Paid ads", "Content planning", "Analytics"],
  ),
  s(
    "branding",
    "Branding & Graphic Design",
    Palette,
    "Design",
    "A memorable identity that builds trust.",
    ["Logo & identity", "Brand guidelines", "Marketing collateral", "Social media kits"],
  ),
  s(
    "custom-software",
    "Custom Software Development",
    Code2,
    "Build",
    "Software shaped precisely around how you work.",
    ["Requirement analysis", "Custom modules", "Data migration", "Long-term support"],
  ),
  s(
    "maintenance",
    "Website Maintenance & Support",
    Wrench,
    "Care",
    "Keep your site updated, secure and running smoothly.",
    ["Regular updates", "Content changes", "Backups", "Priority support"],
  ),
  s(
    "landing-pages",
    "Landing Page Development",
    LayoutTemplate,
    "Build",
    "Focused, high-converting pages for campaigns and launches.",
    ["Conversion-focused copy layout", "A/B ready", "Fast loading", "Lead capture"],
  ),
  s(
    "api-development",
    "API Development & Integration",
    Plug,
    "Build",
    "Connect your systems with clean, secure APIs.",
    ["REST & webhook APIs", "Third-party integrations", "Documentation", "Monitoring"],
  ),
  s(
    "saas",
    "SaaS Product Development",
    Layers,
    "Build",
    "From idea to a launched, subscription-ready product.",
    ["MVP planning", "Multi-tenant architecture", "Billing integration", "Product analytics"],
  ),
  s(
    "speed-optimization",
    "Website Speed Optimization",
    Gauge,
    "Care",
    "Faster pages, happier visitors, better rankings.",
    ["Performance audit", "Image & code optimization", "Caching", "Core Web Vitals"],
  ),
  s(
    "security",
    "Website Security & Maintenance",
    ShieldCheck,
    "Care",
    "Protect your website and your customers' data.",
    ["Security audit", "SSL & hardening", "Malware monitoring", "Recovery plans"],
  ),
  s(
    "cloud-devops",
    "Cloud Deployment & DevOps",
    Cloud,
    "Care",
    "Reliable hosting, deployments and infrastructure.",
    ["Cloud setup", "CI/CD pipelines", "Monitoring & alerts", "Scaling strategy"],
  ),
];

/** Official email for College Projects enquiries. Empty = use the email saved in Admin Settings (hidden if none). */
export const COLLEGE_PROJECTS_EMAIL = "zexovadigital@gmail.com";

export const serviceCategories = ["Build", "Design", "Intelligence", "Growth", "Care"] as const;

export const processSteps = [
  ["Discovery & Consultation", "We learn about your business, goals and customers."],
  ["Requirement Analysis", "We define features, scope and success criteria."],
  ["Strategy & Planning", "A clear roadmap, timeline and technical plan."],
  ["UI/UX Design", "Wireframes and polished designs for your approval."],
  ["Development", "Clean, scalable build with regular progress updates."],
  ["Testing & QA", "Thorough testing across devices and browsers."],
  ["Client Review", "You review everything and we refine the details."],
  ["Launch & Deployment", "A smooth, monitored go-live."],
  ["Maintenance & Improvement", "Ongoing support and continuous improvement."],
] as const;

export const industries = [
  ["Retail & Shops", "Online stores, catalogues and local visibility."],
  ["Restaurants & Cafés", "Menus, ordering and reservations."],
  ["Healthcare & Clinics", "Appointments and patient information."],
  ["Education & Coaching", "Course sites and learning portals."],
  ["Real Estate", "Property listings and lead capture."],
  ["Professional Services", "Credible sites for consultants and firms."],
  ["Fitness & Wellness", "Bookings, memberships and schedules."],
  ["Manufacturing", "Product catalogues and B2B inquiries."],
  ["Hospitality & Travel", "Bookings and destination showcases."],
  ["Startups", "MVPs and launch-ready products."],
] as const;

export const technologies: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue"],
  Backend: ["Node.js", "Python", "PostgreSQL", "REST APIs", "GraphQL"],
  Mobile: ["React Native", "Flutter", "Swift", "Kotlin"],
  "AI & Automation": ["OpenAI", "Gemini", "LangChain", "Zapier", "n8n"],
  "Cloud & DevOps": ["AWS", "Cloudflare", "Docker", "GitHub Actions", "Vercel"],
  Design: ["Figma", "Adobe Illustrator", "Photoshop", "After Effects"],
};

export const techTicker = Object.values(technologies).flat();

export const packages = [
  {
    name: "Starter",
    tag: "For new local businesses",
    features: ["Up to 5-page website", "Mobile-friendly design", "Contact form", "Basic SEO setup"],
  },
  {
    name: "Growth",
    tag: "For growing brands",
    featured: true,
    features: [
      "Up to 12 pages",
      "Content management",
      "Advanced SEO",
      "Analytics & integrations",
      "3 months support",
    ],
  },
  {
    name: "Custom",
    tag: "Apps, AI & software",
    features: [
      "Web or mobile application",
      "AI & automation",
      "Custom integrations",
      "Dedicated project manager",
    ],
  },
];

export const faqs = [
  [
    "How long does a website take?",
    "Most business websites take 2–6 weeks depending on size and content readiness. Applications take longer; we share a clear timeline after discovery.",
  ],
  [
    "Do I need to create an account to work with you?",
    "No. Just send an inquiry or request a quote and we'll reach out to you.",
  ],
  [
    "How is pricing decided?",
    "Every project is different, so we provide a tailored quote after understanding your requirements.",
  ],
  [
    "Will my website work on mobile?",
    "Yes. Everything we build is designed for phones, tablets and desktops.",
  ],
  [
    "Can you redesign my existing website?",
    "Absolutely. We can modernise your current site while keeping what already works.",
  ],
  [
    "Do you provide support after launch?",
    "Yes. We offer maintenance and support plans to keep your site secure and up to date.",
  ],
  [
    "Can you add AI or automation to my business?",
    "Yes. We build practical AI assistants and automations that fit your existing tools.",
  ],
] as const;

export const whyUs = [
  ["Business-first thinking", "Every decision is tied to your goals, not trends."],
  ["Premium design quality", "Interfaces that build trust from the first click."],
  ["Modern technology", "Fast, secure and scalable by default."],
  ["Transparent process", "Clear timelines and regular updates."],
  ["Local business focus", "We understand what local businesses need to grow."],
  ["Long-term partnership", "Support and improvements long after launch."],
] as const;
