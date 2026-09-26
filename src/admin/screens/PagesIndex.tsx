import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers } from "lucide-react";
import { PAGES } from "@/content/pages";
import { PAGE_FORMS } from "@/admin/specs/pages";
import { Card, PageHeader } from "@/admin/ui/controls";

/** Every page on the site, and the sections several pages share. */
export function PagesIndex() {
  return (
    <>
      <PageHeader
        title="Pages"
        description="The words and images on each page of the site. Projects, articles, roles and partners have their own screens."
      />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((page) => {
          const sections = PAGE_FORMS[page.key].filter((s) => s.fields.length && s.id !== "seo");
          return (
            <li key={page.key}>
              <Link
                to="/admin/pages/$page"
                params={{ page: page.key }}
                className="admin-focus group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-5 transition-[border-color,box-shadow] duration-150 hover:border-navy/25 hover:shadow-[0_8px_24px_-12px_rgb(5_8_52/0.25)]"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-display text-base font-medium text-navy">{page.label}</span>
                  <ArrowRight
                    className="h-4 w-4 text-navy/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-navy"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1 text-xs text-slate" translate="no">
                  {page.path}
                </span>
                <span className="mt-4 line-clamp-2 text-xs leading-relaxed text-slate-deep">
                  {sections.map((s) => s.title).join(" · ")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6">
        <Card
          title="Shared Sections"
          description="Sections that appear on more than one page, so they are edited once: the five-stage process (Home and Expertise) and the enquiry on glass (Home and About)."
          actions={
            <Link
              to="/admin/pages/$page"
              params={{ page: "shared" }}
              className="admin-focus inline-flex min-h-9 items-center gap-2 rounded-full border border-navy/15 bg-white px-3.5 text-xs font-medium text-navy hover:border-navy/35"
            >
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              Edit Shared Sections
            </Link>
          }
        />
      </div>
    </>
  );
}
