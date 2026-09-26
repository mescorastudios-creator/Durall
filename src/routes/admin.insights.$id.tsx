import { createFileRoute, notFound } from "@tanstack/react-router";
import { listArticles } from "@/admin/api/content";
import { ArticleEditor, newArticle } from "@/admin/screens/Articles";
import { ScreenSkeleton } from "@/admin/ui/controls";

/** One article's editor; "new" starts a blank one. */
export const Route = createFileRoute("/admin/insights/$id")({
  loader: async ({ params }) => {
    const { articles } = await listArticles();
    const categories = [...new Set(articles.map((a) => a.category).filter(Boolean))].sort();
    if (params.id === "new") return { article: newArticle(), categories, isNew: true };
    const article = articles.find((a) => a.id === params.id);
    if (!article) throw notFound();
    return { article, categories, isNew: false };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.article.title || "New Article"} — Durall Admin` }],
  }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { article, categories, isNew } = Route.useLoaderData();
  return (
    <ArticleEditor
      key={article.id || "new"}
      article={article}
      categories={categories}
      isNew={isNew}
    />
  );
}
