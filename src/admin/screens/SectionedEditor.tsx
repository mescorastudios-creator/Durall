import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import type { SectionSpec } from "@/admin/form/spec";
import { SchemaForm } from "@/admin/form/fields";
import { SaveBar, useEditor } from "@/admin/lib/editor";
import { buttonClass, PageHeader } from "@/admin/ui/controls";

/**
 * A document edited as a column of section cards, with a table of contents
 * beside it on wide screens: the pages, the shared sections and the three
 * settings screens all use this.
 */
export function SectionedEditor<T>({
  title,
  description,
  back,
  sections,
  initial,
  save,
  viewPath,
  before,
}: {
  title: string;
  description?: ReactNode;
  back?: { to: string; label: string };
  sections: readonly SectionSpec[];
  initial: T;
  save: (value: T) => Promise<T>;
  viewPath?: string;
  before?: ReactNode;
}) {
  const editor = useEditor(initial, save);
  return (
    <>
      <SaveBar
        title={title}
        dirty={editor.dirty}
        saving={editor.saving}
        editable={editor.editable}
        onSave={() => void editor.submit()}
        onDiscard={() => void editor.discard()}
        extra={
          viewPath ? (
            <a
              href={viewPath}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("ghost", "sm")}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              View on Site
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null
        }
      />
      <PageHeader title={title} description={description} back={back} />
      {before}
      <div className="grid items-start gap-6 xl:grid-cols-[11rem_minmax(0,1fr)]">
        <nav aria-label="Sections on this screen" className="sticky top-20 hidden xl:block">
          <ol className="grid gap-0.5 border-l border-navy/10">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="admin-focus -ml-px block border-l border-transparent py-1.5 pl-3 text-xs text-slate transition-colors duration-150 hover:border-navy/40 hover:text-navy"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <SchemaForm
          sections={sections}
          value={editor.draft}
          onChange={editor.setDraft}
          disabled={!editor.editable}
        />
      </div>
    </>
  );
}
