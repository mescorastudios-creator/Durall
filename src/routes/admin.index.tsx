import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/admin/screens/Dashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Durall Admin" }] }),
  component: Dashboard,
});
