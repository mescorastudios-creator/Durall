import { createFileRoute } from "@tanstack/react-router";
import { PagesIndex } from "@/admin/screens/PagesIndex";

export const Route = createFileRoute("/admin/pages/")({
  head: () => ({ meta: [{ title: "Pages — Durall Admin" }] }),
  component: PagesIndex,
});
