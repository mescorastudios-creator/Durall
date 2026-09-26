import { createFileRoute } from "@tanstack/react-router";
import { MediaScreen } from "@/admin/screens/Media";

export const Route = createFileRoute("/admin/media")({
  head: () => ({ meta: [{ title: "Media — Durall Admin" }] }),
  component: MediaScreen,
});
