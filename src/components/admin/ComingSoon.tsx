import { Hammer } from "lucide-react";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border bg-card p-12 text-center">
      <Hammer className="mx-auto size-10 text-primary" />
      <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-muted-foreground">Coming in the next update.</p>
    </div>
  );
}
