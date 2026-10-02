import { createFileRoute } from "@tanstack/react-router";
import { siteOrigin } from "@/content/head";
import { PAGES } from "@/content/pages";
import { publishedArticles, publishedProjects } from "@/content/select";
import { contentStore } from "@/server/store";

/** Every public page, project and article, for search engines. */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const store = contentStore();
        const [projects, articles] = await Promise.all([store.projects(), store.articles()]);
        const paths = [
          ...PAGES.map((page) => page.path),
          ...publishedProjects(projects).map((project) => `/projects/${project.slug}`),
          ...publishedArticles(articles).map((article) => `/insights/${article.slug}`),
        ];
        const origin = siteOrigin();
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n")}
</urlset>
`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
