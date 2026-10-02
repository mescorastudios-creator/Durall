import { createFileRoute, notFound, Outlet, redirect } from "@tanstack/react-router";
import adminCss from "@/admin/admin.css?url";
import { getContentStatus } from "@/admin/api/content";
import { ADMIN_ENABLED } from "@/admin/enabled";
import { getAdminState } from "@/admin/api/session";
import { AdminContext } from "@/admin/context";
import { AdminShell } from "@/admin/Shell";
import { Button, ButtonLink, Card, ScreenSkeleton } from "@/admin/ui/controls";
import { errorMessage, OverlayProviders } from "@/admin/ui/overlay";

/**
 * The admin panel's frame. Rendered in the browser only (`ssr: false`): it
 * is an application behind a login, with nothing for a server render or a
 * search engine to see. Everything under /admin is marked noindex, kept out
 * of robots.txt, and never cached by the CDN (src/server.ts).
 */
export const Route = createFileRoute("/admin")({
  ssr: false,
  // Switched off for now (src/admin/enabled.ts): every page under /admin
  // answers "not found" until it is turned back on.
  beforeLoad: () => {
    if (!ADMIN_ENABLED) throw notFound();
  },
  head: () => ({
    meta: [{ title: "Admin — Durall Systems" }, { name: "robots", content: "noindex, nofollow" }],
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  loader: async () => {
    const state = await getAdminState();
    // Connected but not signed in: to the login. Not connected at all: the
    // panel opens as a read-only preview with the setup steps.
    if (state.configured && !state.member) throw redirect({ to: "/admin/login" });
    const status = state.member ? await getContentStatus() : { configured: false, imported: false };
    return { ...state, imported: status.imported };
  },
  staleTime: 60_000,
  pendingComponent: () => (
    <div className="admin-root grid min-h-dvh place-items-center p-6">
      <div className="w-full max-w-3xl">
        <ScreenSkeleton />
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="admin-root grid min-h-dvh place-items-center p-6">
      <Card title="The admin panel could not open" className="w-full max-w-lg">
        <p className="text-sm leading-relaxed text-slate-deep">{errorMessage(error)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
          <ButtonLink to="/admin/login">Sign In</ButtonLink>
        </div>
      </Card>
    </div>
  ),
  component: AdminLayout,
});

function AdminLayout() {
  const state = Route.useLoaderData();
  const signedIn = Boolean(state.member);
  return (
    <AdminContext.Provider
      value={{
        configured: state.configured,
        serviceKey: state.serviceKey,
        imported: state.imported,
        member: state.member,
        editable: state.configured && state.imported && signedIn,
        uploads: state.configured && state.serviceKey && signedIn,
      }}
    >
      <OverlayProviders>
        <AdminShell>
          <Outlet />
        </AdminShell>
      </OverlayProviders>
    </AdminContext.Provider>
  );
}
