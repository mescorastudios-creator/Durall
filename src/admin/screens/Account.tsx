import { useState, type FormEvent } from "react";
import { History } from "lucide-react";
import type { ActivityEntry } from "@/admin/api/inbox";
import { changePassword, updateOwnName } from "@/admin/api/session";
import { useAdmin } from "@/admin/context";
import { ROLES, SECTIONS } from "@/admin/permissions";
import { Badge, Button, Card, EmptyState, Field, PageHeader, TextInput } from "@/admin/ui/controls";
import { errorMessage, useToast } from "@/admin/ui/overlay";

const stamp = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "3 minutes ago", "yesterday", then the date. */
export function ago(iso: string): string {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  if (Math.abs(minutes) < 1) return "just now";
  if (Math.abs(hours) < 1) return relative.format(Math.round(minutes), "minute");
  if (Math.abs(days) < 1) return relative.format(Math.round(hours), "hour");
  if (Math.abs(days) < 7) return relative.format(Math.round(days), "day");
  return stamp.format(new Date(iso));
}

export function ActivityList({
  entries,
  compact,
}: {
  entries: ActivityEntry[];
  compact?: boolean;
}) {
  if (!entries.length) {
    return (
      <EmptyState
        icon={<History className="h-7 w-7" aria-hidden="true" />}
        title="Nothing yet"
        body="Every save, upload and sign-in is listed here, with who did it."
      />
    );
  }
  return (
    <ol className="grid">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex items-baseline gap-3 border-b border-navy/6 py-2.5 last:border-b-0"
        >
          <span
            className="w-24 shrink-0 text-xs text-slate tabular-nums"
            title={stamp.format(new Date(entry.at))}
          >
            {ago(entry.at)}
          </span>
          <span className="min-w-0 flex-1 text-sm text-navy">
            {entry.summary}
            {!compact ? <span className="text-slate"> — {entry.userEmail}</span> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function ActivityScreen({ entries }: { entries: ActivityEntry[] }) {
  return (
    <>
      <PageHeader title="Activity" description="The latest 200 changes, newest first." />
      <Card>
        <ActivityList entries={entries} />
      </Card>
    </>
  );
}

export function AccountScreen() {
  const { member, configured } = useAdmin();
  const toast = useToast();
  const [name, setName] = useState(member?.name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  if (!configured || !member) {
    return (
      <>
        <PageHeader title="My Account" />
        <EmptyState
          title="Accounts need the database"
          body="Connect it, then sign in to see your account here."
        />
      </>
    );
  }
  const role = ROLES.find((r) => r.key === member.role)!;

  const saveName = async () => {
    setSavingName(true);
    try {
      await updateOwnName({ data: { name } });
      toast({ tone: "success", title: "Name saved" });
    } catch (reason) {
      toast({ tone: "error", title: "Not saved", body: errorMessage(reason) });
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    if (password.length < 10) return setError("Use at least 10 characters.");
    if (password !== String(data.get("again") ?? ""))
      return setError("The two passwords do not match.");
    setError(null);
    setSavingPassword(true);
    try {
      await changePassword({ data: { password } });
      form.reset();
      toast({ tone: "success", title: "Password changed" });
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <PageHeader title="My Account" description={member.email} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Profile">
          <div className="grid gap-5">
            <Field label="Name" hint="Shown in the activity log.">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={name}
                  autoComplete="name"
                  onChange={(event) => setName(event.target.value)}
                />
              )}
            </Field>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate">Role</span>
              <Badge tone={member.role === "owner" ? "info" : "neutral"}>{role.label}</Badge>
              <span className="text-xs text-slate">{role.note}</span>
            </div>
            {member.role === "editor" ? (
              <p className="text-xs leading-relaxed text-slate">
                You can edit:{" "}
                {member.sections.map((s) => SECTIONS.find((x) => x.key === s)?.label).join(", ") ||
                  "nothing yet — ask the owner."}
              </p>
            ) : null}
            <div>
              <Button
                variant="primary"
                busy={savingName}
                disabled={!name.trim() || name === member.name}
                onClick={() => void saveName()}
              >
                Save Name
              </Button>
            </div>
          </div>
        </Card>
        <Card title="Password">
          <form onSubmit={savePassword} className="grid gap-5" noValidate>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={member.email}
              readOnly
              hidden
            />
            <Field label="New password" hint="At least 10 characters.">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                />
              )}
            </Field>
            <Field label="Repeat the password" error={error}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  name="again"
                  type="password"
                  autoComplete="new-password"
                />
              )}
            </Field>
            <div>
              <Button type="submit" variant="primary" busy={savingPassword}>
                {savingPassword ? "Saving…" : "Change Password"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
