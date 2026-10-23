import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  BarChart3,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Settings,
  Tag,
  Menu,
  Rocket,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import zmark from "@/assets/zmark.png";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin | ZEXOVA DIGITAL" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/chats", label: "Direct Chats", icon: MessagesSquare },
  { to: "/admin/projects", label: "Portfolio Projects", icon: FolderKanban },
  { to: "/admin/startups", label: "Startup Projects", icon: Rocket },
  { to: "/admin/pricing", label: "Pricing & Packages", icon: Tag },
  { to: "/admin/blogs", label: "Blogs & Articles", icon: FileText },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Admin Settings", icon: Settings },
] as const;

type State = "loading" | "signed_out" | "not_admin" | "admin";

function AdminLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState<State>("loading");
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const check = async (s: Session | null) => {
      setSession(s);
      if (!s) return setState("signed_out");
      let isAdmin = false;
      const { data: claimData } = await supabase.rpc("claim_first_admin");
      if (claimData) {
        isAdmin = true;
      } else {
        const { data: roleData } = await supabase.rpc("has_role", {
          _user_id: s.user.id,
          _role: "admin",
        });
        isAdmin = Boolean(roleData);
      }
      setState(isAdmin ? "admin" : "not_admin");
    };
    supabase.auth.getSession().then(({ data }) => check(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") check(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin", replace: true });
  };

  if (state === "loading")
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  if (state === "signed_out") return <AdminLogin />;
  if (state === "not_admin")
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="text-muted-foreground">
          {session?.user.email} is not the site administrator.
        </p>
        <Button onClick={signOut}>Sign out</Button>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-card transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-2 border-b px-5 py-4">
          <img src={zmark} alt="" className="h-7 w-auto" />
          <span className="font-display font-extrabold">
            ZEXOVA <span className="text-gradient">ADMIN</span>
          </span>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: "exact" in n }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-primary/10 !text-primary font-semibold" }}
            >
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t p-3">
          <p className="truncate px-3 pb-2 text-xs text-muted-foreground">{session?.user.email}</p>
          <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-3 border-b bg-card px-4 py-3 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu />
          </Button>
          <span className="font-display font-bold">Admin</span>
        </header>
        <div className="mx-auto max-w-6xl p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const toEmail = (username: string) =>
  `${username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")}@zexova.admin`;

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: toEmail(username),
      password,
    });
    if (error) toast.error("Wrong username or password");
    setBusy(false);
  };

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-hero px-6 text-foreground">
      <form onSubmit={submit} className="glass w-full max-w-sm space-y-4 rounded-2xl p-8">
        <img src={zmark} alt="" className="mx-auto h-10 w-auto" />
        <h1 className="text-center text-xl font-bold">Admin sign in</h1>
        <div className="space-y-2">
          <Label htmlFor="un">Username</Label>
          <Input
            id="un"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pw">Password</Label>
          <Input
            id="pw"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>
          {busy ? "Please wait…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
