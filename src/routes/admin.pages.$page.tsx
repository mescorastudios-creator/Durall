import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadPage, loadShared, savePage, saveShared } from "@/admin/api/content";
import { SectionedEditor } from "@/admin/screens/SectionedEditor";
import { PAGE_FORMS, SHARED_FORM } from "@/admin/specs/pages";
import { ScreenSkeleton } from "@/admin/ui/controls";
import { isPageKey, PAGES } from "@/content/pages";
import type { PageKey, PageMap, SharedContent } from "@/content/types";

/** One page's editor, or the shared sections ("shared"). */
export const Route = createFileRoute("/admin/pages/$page")({
  loader: async ({ params }) => {
    if (params.page === "shared") {
      const { shared } = await loadShared();
      return { kind: "shared" as const, content: shared };
    }
    if (!isPageKey(params.page)) throw notFound();
    const { page } = await loadPage({ data: params.page });
    return { kind: "page" as const, key: params.page, content: page };
  },
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.page === "shared" ? "Shared Sections" : (PAGES.find((p) => p.key === params.page)?.label ?? "Page")} — Durall Admin`,
      },
    ],
  }),
  pendingComponent: ScreenSkeleton,
  component: PageEditor,
});

function PageEditor() {
  const data = Route.useLoaderData();
  if (data.kind === "shared") {
    return (
      <SectionedEditor<SharedContent>
        key="shared"
        title="Shared Sections"
        description="Edited here once, shown on every page that carries them."
        back={{ to: "/admin/pages", label: "All pages" }}
        sections={SHARED_FORM}
        initial={data.content}
        save={async (content) => (await saveShared({ data: { content } })).shared}
      />
    );
  }
  const key: PageKey = data.key;
  const page = PAGES.find((p) => p.key === key)!;
  return (
    <SectionedEditor<PageMap[PageKey]>
      key={key}
      title={`${page.label} Page`}
      back={{ to: "/admin/pages", label: "All pages" }}
      sections={PAGE_FORMS[key]}
      initial={data.content}
      viewPath={page.path}
      save={async (content) => (await savePage({ data: { key, content } })).page}
    />
  );
}
