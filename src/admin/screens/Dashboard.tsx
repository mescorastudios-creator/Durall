import { useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CircleAlert,
  Database,
  FilePlus2,
  ImageUp,
  Inbox,
  Newspaper,
  type LucideProps,
} from "lucide-react";
import { importSiteContent, loadAllContent, type AllContent } from "@/admin/api/content";
import { countNewEnquiries, listActivity } from "@/admin/api/inbox";
import { useAdmin } from "@/admin/context";
import { can } from "@/admin/permissions";
import { Button, ButtonLink, Card, Notice, PageHeader, Skeleton } from "@/admin/ui/controls";
import { errorMessage, useConfirm, useToast } from "@/admin/ui/overlay";
import { ActivityList } from "./Account";

type Todo = { text: string; to: string; detail?: string };

/** Placeholders and gaps the site shipped with, until each is fixed. */
function todosOf(content: AllContent): Todo[] {
  const todos: Todo[] = [];
  const placeholderDetail = content.settings.contact.details.filter((d) =>
    /example\.com|\+00|0000/.test(`${d.value} ${d.href}`),
  );
  if (placeholderDetail.length) {
    todos.push({
      text: "Replace the placeholder email and phone number",
      detail: placeholderDetail.map((d) => d.value).join(", "),
      to: "/admin/company",
    });
  }
  if (/example\.com/.test(content.settings.contact.careersEmail)) {
    todos.push({
      text: "Set the real careers email address",
      detail: content.settings.contact.careersEmail,
      to: "/admin/company",
    });
  }
  // The roles the site ships with are samples, and the Careers page says so
  // in a note under the list until that note is cleared.
  if (/sample/i.test(content.pages.careers.roles.note)) {
    todos.push({
      text: "Replace the sample roles on the Careers page, then clear the note under the list",
      detail: content.pages.careers.roles.note,
      to: "/admin/careers",
    });
  }
  const socials = content.settings.footer.social.filter((link) => !/^https?:/i.test(link.href));
  if (socials.length) {
    todos.push({
      text: "Add the addresses of your social profiles",
      detail: socials.map((s) => s.label).join(", "),
      to: "/admin/navigation",
    });
  }
  const legal = content.settings.footer.legal.filter((item) => !item.href);
  if (legal.length) {
    todos.push({
      text: "Link the legal pages in the footer",
      detail: `${legal.map((l) => l.label).join(" and ")} are plain text for now`,
      to: "/admin/navigation",
    });
  }
  const cases = content.projects.filter((p) => p.placeholder && p.status === "published");
  if (cases.length) {
    todos.push({
      text: `Write up ${cases.length} case ${cases.length === 1 ? "study" : "studies"}`,
      detail: cases.map((p) => p.name).join(", "),
      to: "/admin/projects",
    });
  }
  const drafts = content.articles.filter((a) => a.status === "draft");
  if (drafts.length) {
    todos.push({
      text: `Finish ${drafts.length} draft ${drafts.length === 1 ? "article" : "articles"}`,
      to: "/admin/insights",
    });
  }
  return todos;
}

function Stat({
  label,
  value,
  detail,
  to,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  detail: string;
  to: string;
  icon: ComponentType<LucideProps>;
}) {
  return (
    <Link
      to={to}
      className="admin-focus group flex flex-col rounded-2xl border border-navy/10 bg-white p-5 transition-[border-color,box-shadow] duration-150 hover:border-navy/25 hover:shadow-[0_8px_24px_-12px_rgb(5_8_52/0.25)]"
    >
      <span className="flex items-center justify-between text-slate">
        <span className="text-xs font-medium">{label}</span>
        <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.6} />
      </span>
      <span className="mt-3 font-display text-[2rem] leading-none font-medium text-navy tabular-nums">
        {value}
      </span>
      <span className="mt-2 text-xs text-slate">{detail}</span>
    </Link>
  );
}

function SetupSteps() {
  const variable = "rounded bg-navy/6 px-1.5 py-0.5 font-mono text-[0.75rem] text-navy";
  return (
    <Card
      title="Connect the Database"
      description="The panel is in preview: everything can be opened, nothing can be saved, and the site shows the content it shipped with. About ten minutes, once."
    >
      <ol className="grid list-decimal gap-3 pl-5 text-sm leading-relaxed text-slate-deep marker:font-medium marker:text-navy">
        <li>
          Create a free project at{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent-blue hover:underline"
          >
            supabase.com
          </a>
          .
        </li>
        <li>
          In its SQL Editor, run the files in <code className={variable}>supabase/migrations/</code>{" "}
          from this project, in order: <code className={variable}>0001_cms.sql</code>,{" "}
          <code className={variable}>0002_enquiry_phone_location.sql</code>, then{" "}
          <code className={variable}>0003_section_access.sql</code>.
        </li>
        <li>
          Under Authentication → Sign In / Providers, switch off{" "}
          <strong className="font-medium text-navy">“Allow new users to sign up”</strong>.
        </li>
        <li>
          Under Authentication → Users, add your own account. The first account becomes the owner.
        </li>
        <li>
          Add{" "}
          <code className={variable} translate="no">
            SUPABASE_URL
          </code>
          ,{" "}
          <code className={variable} translate="no">
            SUPABASE_ANON_KEY
          </code>{" "}
          and{" "}
          <code className={variable} translate="no">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          to the Netlify site’s environment variables (and to{" "}
          <code className={variable}>.env.local</code> to work locally), then redeploy.
        </li>
        <li>Sign in at /admin and press “Import the Site’s Content” here.</li>
      </ol>
    </Card>
  );
}

function ImportCard() {
  const toast = useToast();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);
  const run = async () => {
    const ok = await confirm({
      title: "Import the site’s content?",
      body: "Copies every page, project, article, role, partner and setting the site shipped with into the database. From then on, what you edit here is what the site shows.",
      confirmLabel: "Import Content",
    });
    if (!ok) return;
    setBusy(true);
    try {
      await importSiteContent({ data: { overwrite: false } });
      toast({ tone: "success", title: "Content imported", body: "Editing is switched on." });
      window.location.reload();
    } catch (error) {
      toast({ tone: "error", title: "Import failed", body: errorMessage(error) });
      setBusy(false);
    }
  };
  return (
    <Card
      title="One Last Step: Import the Site’s Content"
      description="The database is connected but empty. Import the content the site shipped with to start editing it."
      actions={
        <Button variant="primary" busy={busy} onClick={() => void run()}>
          <Database className="h-4 w-4" aria-hidden="true" />
          {busy ? "Importing…" : "Import the Site’s Content"}
        </Button>
      }
    />
  );
}

export function Dashboard() {
  const { member, configured, imported, editable } = useAdmin();
  const content = useQuery({ queryKey: ["admin", "all-content"], queryFn: () => loadAllContent() });
  const activity = useQuery({
    queryKey: ["admin", "activity", 8],
    queryFn: () => listActivity({ data: { limit: 8 } }),
    enabled: configured && Boolean(member),
  });
  const unread = useQuery({
    queryKey: ["admin", "enquiries", "unread"],
    queryFn: () => countNewEnquiries(),
    enabled: configured && can(member, "enquiries"),
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = member?.name.split(" ")[0];
  const data = content.data;
  const todos = data ? todosOf(data) : [];
  const published = data?.projects.filter((p) => p.status === "published").length ?? 0;
  const articles = data?.articles.filter((a) => a.status === "published").length ?? 0;
  const roles = data?.roles.filter((r) => r.open).length ?? 0;

  return (
    <>
      <PageHeader
        title={member ? `${greeting}${firstName ? `, ${firstName}` : ""}` : "Durall Admin"}
        description="Everything on the Durall website, in one place."
        actions={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-focus inline-flex min-h-10 items-center gap-2 rounded-full border border-navy/15 bg-white px-4 text-[0.8125rem] font-medium text-navy hover:border-navy/35"
          >
            View Site
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        }
      />
      <div className="grid gap-5">
        {!configured ? <SetupSteps /> : null}
        {configured && !imported && member?.role === "owner" ? <ImportCard /> : null}
        {configured && !imported && member?.role !== "owner" ? (
          <Notice tone="warning">
            The owner has not imported the site’s content yet, so the panel is read-only.
          </Notice>
        ) : null}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {content.isLoading || !data ? (
            Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[8.5rem]" />)
          ) : (
            <>
              <Stat
                label="Projects"
                value={published}
                detail={`published · ${data.projects.length - published} drafts`}
                to="/admin/projects"
                icon={Building2}
              />
              <Stat
                label="Articles"
                value={articles}
                detail={`published · ${data.articles.length - articles} drafts`}
                to="/admin/insights"
                icon={Newspaper}
              />
              <Stat
                label="Open roles"
                value={roles}
                detail={`${data.roles.length - roles} closed`}
                to="/admin/careers"
                icon={Briefcase}
              />
              <Stat
                label="New enquiries"
                value={configured ? (unread.data?.count ?? "–") : "–"}
                detail={configured ? "waiting for a reply" : "once connected"}
                to="/admin/enquiries"
                icon={Inbox}
              />
            </>
          )}
        </div>

        <div
          className={
            editable || (configured && member)
              ? "grid items-start gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
              : "grid gap-5"
          }
        >
          <Card
            title="Needs Attention"
            description="Placeholders and gaps from launch, listed until each one is fixed."
          >
            {content.isLoading ? (
              <div className="grid gap-2">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : todos.length ? (
              <ul className="-my-1 grid grid-cols-[minmax(0,1fr)]">
                {todos.map((todo) => (
                  <li key={todo.text} className="min-w-0">
                    <Link
                      to={todo.to}
                      className="admin-focus group flex min-w-0 items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-paper"
                    >
                      <CircleAlert
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#c27a12]"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-navy">{todo.text}</span>
                        {todo.detail ? (
                          <span className="block truncate text-xs text-slate">{todo.detail}</span>
                        ) : null}
                      </span>
                      <ArrowRight
                        className="mt-0.5 h-4 w-4 shrink-0 text-navy/30 group-hover:text-navy"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate">
                Nothing outstanding. Every placeholder has been replaced.
              </p>
            )}
          </Card>

          <div className="grid gap-5">
            {editable ? (
              <Card title="Quick Actions">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {can(member, "insights") ? (
                    <ButtonLink
                      to="/admin/insights/$id"
                      params={{ id: "new" }}
                      className="justify-start"
                    >
                      <FilePlus2 className="h-4 w-4" aria-hidden="true" />
                      Write an Article
                    </ButtonLink>
                  ) : null}
                  {can(member, "projects") ? (
                    <ButtonLink
                      to="/admin/projects/$id"
                      params={{ id: "new" }}
                      className="justify-start"
                    >
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                      Add a Project
                    </ButtonLink>
                  ) : null}
                  {can(member, "media") ? (
                    <ButtonLink to="/admin/media" className="justify-start">
                      <ImageUp className="h-4 w-4" aria-hidden="true" />
                      Upload Images
                    </ButtonLink>
                  ) : null}
                  {can(member, "pages") ? (
                    <ButtonLink
                      to="/admin/pages/$page"
                      params={{ page: "home" }}
                      className="justify-start"
                    >
                      <FilePlus2 className="h-4 w-4" aria-hidden="true" />
                      Edit the Home Page
                    </ButtonLink>
                  ) : null}
                </div>
              </Card>
            ) : null}
            {configured && member ? (
              <Card
                title="Recent Activity"
                actions={
                  <Link
                    to="/admin/activity"
                    className="admin-focus rounded text-xs font-medium text-accent-blue hover:underline"
                  >
                    See all
                  </Link>
                }
              >
                {activity.isLoading ? (
                  <Skeleton className="h-32" />
                ) : (
                  <ActivityList entries={activity.data?.entries ?? []} />
                )}
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
