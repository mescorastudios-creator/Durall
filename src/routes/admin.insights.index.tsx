import { createFileRoute } from "@tanstack/react-router";
import { listArticles } from "@/admin/api/content";
import { ArticlesList } from "@/admin/screens/Articles";
import { ScreenSkeleton } from "@/admin/ui/controls";

export const Route = createFileRoute("/admin/insights/")({
  loader: () => listArticles(),
  head: () => ({ meta: [{ title: "Insights — Durall Admin" }] }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { articles } = Route.useLoaderData();
  return <ArticlesList articles={articles} />;
}
