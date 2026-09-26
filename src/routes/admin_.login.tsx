import { useState, type FormEvent } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import adminCss from "@/admin/admin.css?url";
import { AuthFrame } from "@/admin/AuthFrame";
import { getAdminState, requestPasswordReset, signIn } from "@/admin/api/session";
import { Button, ButtonLink, Field, Notice, TextInput } from "@/admin/ui/controls";
import { errorMessage } from "@/admin/ui/overlay";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Sign In — Durall Admin" }, { name: "robots", content: "noindex, nofollow" }],
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  loader: async () => {
    const state = await getAdminState();
    if (state.member) throw redirect({ to: "/admin" });
    return state;
  },
  component: LoginPage,
});

function LoginPage() {
  const { configured } = Route.useLoaderData();
  const [mode, setMode] = useState<"sign-in" | "reset" | "reset-sent">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!configured) {
    return (
      <AuthFrame
        title="Not Connected Yet"
        intro="Signing in needs the database, which has not been connected to this site yet."
      >
        <Notice tone="warning" title="Database not connected">
          Add the Supabase keys to the site’s environment settings, then reload this page. Until
          then you can open the panel as a read-only preview.
        </Notice>
        <div className="mt-6">
          <ButtonLink to="/admin" variant="primary">
            Open the Preview
          </ButtonLink>
        </div>
      </AuthFrame>
    );
  }

  const submitSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    setBusy(true);
    try {
      await signIn({
        data: {
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        },
      });
      // A full load, so the panel starts with the new session's data.
      window.location.assign("/admin");
    } catch (reason) {
      setError(errorMessage(reason));
      setBusy(false);
    }
  };

  const submitReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    setBusy(true);
    try {
      await requestPasswordReset({ data: { email: String(form.get("email") ?? "") } });
      setMode("reset-sent");
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  if (mode === "reset-sent") {
    return (
      <AuthFrame
        title="Check Your Email"
        intro="If that address has an account, a link to set a new password is on its way."
      >
        <p className="text-sm text-slate">The link works once and expires after an hour.</p>
        <Button className="mt-6" onClick={() => setMode("sign-in")}>
          Back to Sign In
        </Button>
      </AuthFrame>
    );
  }

  if (mode === "reset") {
    return (
      <AuthFrame
        title="Reset Your Password"
        intro="Enter the email of your account and we will send a link to set a new password."
      >
        <form onSubmit={submitReset} className="grid gap-5" noValidate>
          <Field label="Email" error={error}>
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                spellCheck={false}
                required
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
                placeholder="name@durall.com…"
              />
            )}
          </Field>
          <Button type="submit" variant="primary" busy={busy} className="w-full">
            {busy ? "Sending…" : "Send Reset Link"}
          </Button>
          <Button variant="ghost" onClick={() => setMode("sign-in")}>
            Back to Sign In
          </Button>
        </form>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      title="Sign In"
      intro={
        <>For the Durall team. Accounts are created by the site owner — there is no sign-up.</>
      }
    >
      <form onSubmit={submitSignIn} className="grid gap-5" noValidate>
        <Field label="Email">
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              spellCheck={false}
              required
              aria-describedby={describedBy}
              placeholder="name@durall.com…"
            />
          )}
        </Field>
        <Field label="Password" error={error}>
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
            />
          )}
        </Field>
        <Button type="submit" variant="primary" busy={busy} className="w-full">
          {busy ? "Signing In…" : "Sign In"}
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode("reset");
            }}
            className="admin-focus rounded font-medium text-accent-blue hover:underline"
          >
            Forgot your password?
          </button>
          <Link to="/" className="admin-focus rounded text-slate hover:text-navy">
            Back to the site
          </Link>
        </div>
      </form>
    </AuthFrame>
  );
}
