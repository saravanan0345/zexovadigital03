import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/blogs")({
  component: () => <ComingSoon title="Blogs & Articles" />,
});
