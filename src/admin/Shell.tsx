import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  Handshake,
  History,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  PanelTop,
  Phone,
  Settings,
  Users,
  X,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { countNewEnquiries } from "./api/inbox";
import { signOut } from "./api/session";
import { useAdmin } from "./context";
import { can, ROLES, type Section } from "./permissions";

type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<LucideProps>;
  section?: Section;
  ownerOnly?: boolean;
  exact?: boolean;
};

const NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    heading: "Content",
    items: [
      { to: "/admin/pages", label: "Pages", icon: FileText, section: "pages" },
      { to: "/admin/projects", label: "Projects", icon: Building2, section: "projects" },
      { to: "/admin/insights", label: "Insights", icon: Newspaper, section: "insights" },
      { to: "/admin/careers", label: "Careers", icon: Briefcase, section: "careers" },
      { to: "/admin/partners", label: "Partners", icon: Handshake, section: "partners" },
    ],
  },
  {
    heading: "Library",
    items: [
      { to: "/admin/media", label: "Media", icon: Images, section: "media" },
      { to: "/admin/enquiries", label: "Enquiries", icon: Inbox, section: "enquiries" },
    ],
  },
  {
    heading: "Site",
    items: [
      {
        to: "/admin/navigation",
        label: "Navigation & Footer",
        icon: PanelTop,
        section: "navigation",
      },
      { to: "/admin/company", label: "Company & Contact", icon: Phone, section: "company" },
      { to: "/admin/settings", label: "Site Settings", icon: Settings, section: "settings" },
    ],
  },
  {
    heading: "Team",
    items: [
      { to: "/admin/team", label: "Users & Access", icon: Users, ownerOnly: true },
      { to: "/admin/activity", label: "Activity", icon: History },
    ],
  },
];

function DurallMark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 4h7a8 8 0 0 1 0 16H4V4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M14 12h7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function useVisibleNav() {
  const { member, configured } = useAdmin();
  return NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      // Preview (no database): every screen can be looked at.
      if (!configured) return true;
      if (item.ownerOnly) return member?.role === "owner";
      return item.section ? can(member, item.section) : true;
    }),
  })).filter((group) => group.items.length);
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const groups = useVisibleNav();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { member, configured } = useAdmin();
  const unread = useQuery({
    queryKey: ["admin", "enquiries", "unread"],
    queryFn: () => countNewEnquiries(),
    enabled: configured && can(member, "enquiries"),
    refetchInterval: 60_000,
  });

  return (
    <nav aria-label="Admin" className="grid gap-5">
      {groups.map((group) => (
        <div key={group.heading}>
          <p className="px-3 pb-1.5 font-display text-[0.625rem] font-medium tracking-[0.14em] text-white/40 uppercase">
            {group.heading}
          </p>
          <ul className="grid gap-0.5">
            {group.items.map((item) => {
              const active = item.exact
                ? pathname === item.to || pathname === `${item.to}/`
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
              const Icon = item.icon;
              const badge = item.to === "/admin/enquiries" ? (unread.data?.count ?? 0) : 0;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-full px-3 text-[0.8125rem] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                      active
                        ? "bg-white/12 text-white"
                        : "text-white/65 hover:bg-white/6 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={1.6} />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {badge ? (
                      <span className="rounded-full bg-accent-blue px-2 py-0.5 text-[0.6875rem] font-medium text-white tabular-nums">
                        {badge}
                        <span className="sr-only"> new</span>
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function AccountBlock() {
  const { member } = useAdmin();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const role = ROLES.find((r) => r.key === member?.role)?.label;

  return (
    <div className="grid gap-2 border-t border-white/10 pt-4">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-10 items-center gap-3 rounded-full px-3 text-[0.8125rem] font-medium text-white/65 transition-colors duration-150 hover:bg-white/6 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" strokeWidth={1.6} />
        View Site
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      {member ? (
        <div className="flex items-center gap-2 rounded-2xl bg-white/6 p-2">
          <Link
            to="/admin/account"
            className="flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-xl px-1.5 focus-visible:outline-2 focus-visible:outline-white"
          >
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 font-display text-xs font-medium text-white uppercase"
            >
              {(member.name || member.email).slice(0, 1)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.8125rem] font-medium text-white">
                {member.name || member.email}
              </span>
              <span className="block text-[0.6875rem] text-white/50">{role}</span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            disabled={leaving}
            onClick={async () => {
              setLeaving(true);
              await signOut();
              await router.navigate({ to: "/admin/login" });
              // A clean slate: nothing from the session stays in memory.
              window.location.reload();
            }}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" strokeWidth={1.6} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Brand() {
  return (
    <Link
      to="/admin"
      className="flex min-h-10 items-center gap-2.5 rounded-full px-2 focus-visible:outline-2 focus-visible:outline-white"
    >
      <DurallMark className="h-5 w-5 text-white" />
      <span
        translate="no"
        className="font-display text-sm font-bold tracking-[0.16em] text-white uppercase"
      >
        Durall
      </span>
      <span className="rounded-full bg-white/12 px-2 py-0.5 font-display text-[0.625rem] font-medium tracking-[0.12em] text-white/75 uppercase">
        Admin
      </span>
    </Link>
  );
}

/** Phone and tablet: the sidebar becomes a drawer behind a Menu button. */
function MobileBar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-navy px-3 lg:hidden">
      <Brand />
      <button
        type="button"
        aria-expanded={open}
        aria-controls="admin-drawer"
        onClick={() => setOpen(true)}
        className="flex min-h-10 items-center gap-2 rounded-full px-3 text-[0.8125rem] font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
        Menu
      </button>
      <dialog
        id="admin-drawer"
        ref={ref}
        aria-label="Admin menu"
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onClick={(event) => {
          if (event.target === ref.current) setOpen(false);
        }}
        className="admin-root m-0 mr-auto h-dvh max-h-dvh w-[min(20rem,86vw)] max-w-none overflow-y-auto overscroll-contain bg-navy p-4 text-white open:flex open:flex-col"
      >
        <div className="mb-5 flex items-center justify-between">
          <Brand />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full text-white/80 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1">
          <NavList onNavigate={() => setOpen(false)} />
        </div>
        <div className="mt-6">
          <AccountBlock />
        </div>
      </dialog>
    </div>
  );
}

function PreviewBanner() {
  const { configured, imported, member } = useAdmin();
  if (configured && imported) return null;
  const message = !configured
    ? "Preview: the database is not connected, so you can look around but nothing can be saved. See the Dashboard for the setup steps."
    : member?.role === "owner"
      ? "Read-only until the site’s content is imported. Import it from the Dashboard to start editing."
      : "Read-only until the owner imports the site’s content.";
  return (
    <div
      role="status"
      className="border-b border-[#e8b44c]/40 bg-[#fdf6e7] px-4 py-2.5 text-center text-xs font-medium text-[#6b4300] sm:px-6"
    >
      {message}
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-root min-h-dvh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-full bg-white px-4 py-2 text-sm font-medium text-navy focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3"
      >
        Skip to Content
      </a>
      {/* The column is navy all the way down; the bar inside it sticks. */}
      <div className="hidden bg-navy lg:block">
        <aside className="admin-scroll sticky top-0 flex h-dvh flex-col gap-6 overflow-y-auto px-3 py-5">
          <Brand />
          <div className="flex-1">
            <NavList />
          </div>
          <AccountBlock />
        </aside>
      </div>
      <div className="min-w-0">
        <MobileBar />
        <PreviewBanner />
        <main
          id="admin-main"
          tabIndex={-1}
          className="min-w-0 px-4 pt-6 pb-16 sm:px-6 lg:px-10 lg:pt-8"
        >
          <div className="mx-auto max-w-[72rem]">{children}</div>
        </main>
      </div>
    </div>
  );
}
