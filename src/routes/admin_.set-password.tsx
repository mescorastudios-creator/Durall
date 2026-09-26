import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import adminCss from "@/admin/admin.css?url";
import { AuthFrame } from "@/admin/AuthFrame";
import { completePasswordSetup } from "@/admin/api/session";
import { Button, ButtonLink, Field, Notice, TextInput } from "@/admin/ui/controls";
import { errorMessage } from "@/admin/ui/overlay";

/**
 * Where invitation and password-reset emails land. Supabase sends the proof
 * in one of three shapes (a ?code, a ?token_hash, or tokens in the #hash);
 * whichever it is goes to the server with the new password, and never into
 * storage in the browser.
 */
export const Route = createFileRoute("/admin_/set-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set Your Password — Durall Admin" },
      { name: "robots", content: "noindex, nofollow" },
      // The link carries a one-time token; keep it out of Referer headers.
      { name: "referrer", content: "no-referrer" },
    ],
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: SetPasswordPage,
});

type Proof = {
  code?: string;
  tokenHash?: string;
  type?: "invite" | "recovery" | "signup" | "magiclink" | "email";
  accessToken?: string;
  refreshToken?: string;
};

function readProof(): { proof: Proof; invite: boolean; problem: string | null } {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const problem = hash.get("error_description") ?? search.get("error_description");
  const type = (search.get("type") ?? hash.get("type") ?? undefined) as Proof["type"];
  const proof: Proof = {
    ...(search.get("code") ? { code: search.get("code")! } : {}),
    ...(search.get("token_hash") ? { tokenHash: search.get("token_hash")! } : {}),
    ...(type ? { type } : {}),
    ...(hash.get("access_token") ? { accessToken: hash.get("access_token")! } : {}),
    ...(hash.get("refresh_token") ? { refreshToken: hash.get("refresh_token")! } : {}),
  };
  // Take the token out of the address bar and history straight away.
  window.history.replaceState(null, "", window.location.pathname);
  return { proof, invite: type === "invite" || type === "signup", problem };
}

/* Read once per page load and kept here, because reading also scrubs the
 * token from the URL: a second read (React's development double-render)
 * would find nothing. */
let captured: ReturnType<typeof readProof> | null = null;
const proofOnce = () => (captured ??= readProof());

function SetPasswordPage() {
  const { proof, invite, problem } = useMemo(proofOnce, []);
  const hasProof = Boolean(proof.code || proof.tokenHash || proof.accessToken);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (problem || !hasProof) {
    return (
      <AuthFrame
        title="This Link Has Expired"
        intro="Invitation and reset links work once, for a limited time."
      >
        <Notice tone="warning">
          {problem ?? "The link is missing its code."} Ask the site owner for a new invitation, or
          request a new reset link from the sign-in page.
        </Notice>
        <ButtonLink to="/admin/login" variant="primary" className="mt-6">
          Go to Sign In
        </ButtonLink>
      </AuthFrame>
    );
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const again = String(form.get("again") ?? "");
    if (password.length < 10) return setError("Use at least 10 characters.");
    if (password !== again) return setError("The two passwords do not match.");
    setError(null);
    setBusy(true);
    try {
      const name = String(form.get("name") ?? "").trim();
      await completePasswordSetup({ data: { ...proof, password, ...(name ? { name } : {}) } });
      window.location.assign("/admin");
    } catch (reason) {
      setError(errorMessage(reason));
      setBusy(false);
    }
  };

  return (
    <AuthFrame
      title={invite ? "Welcome to Durall Admin" : "Set a New Password"}
      intro={
        invite
          ? "Choose your password to finish setting up your account."
          : "Choose a new password for your account."
      }
    >
      <form onSubmit={submit} className="grid gap-5" noValidate>
        {invite ? (
          <Field label="Your name" hint="Shown to the rest of the team in the activity log.">
            {({ id, describedBy }) => (
              <TextInput id={id} name="name" autoComplete="name" aria-describedby={describedBy} />
            )}
          </Field>
        ) : null}
        <Field
          label="New password"
          hint="At least 10 characters. A short sentence is easy to remember."
        >
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field label="Repeat the password" error={error}>
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              name="again"
              type="password"
              autoComplete="new-password"
              required
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
            />
          )}
        </Field>
        <Button type="submit" variant="primary" busy={busy} className="w-full">
          {busy ? "Saving…" : "Save Password"}
        </Button>
      </form>
    </AuthFrame>
  );
}
