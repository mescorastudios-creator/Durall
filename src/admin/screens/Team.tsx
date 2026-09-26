import { useState, type FormEvent } from "react";
import { useRouter } from "@tanstack/react-router";
import { Crown, MailPlus, MoreHorizontal, ShieldCheck, UserPlus } from "lucide-react";
import {
  inviteMember,
  removeMember,
  resendInvite,
  setMemberDisabled,
  transferOwnership,
  updateMember,
  type TeamMember,
} from "@/admin/api/team";
import { useAdmin } from "@/admin/context";
import { ROLES, SECTIONS, type Section } from "@/admin/permissions";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Field,
  Notice,
  PageHeader,
  TextInput,
} from "@/admin/ui/controls";
import { Dialog, errorMessage, useConfirm, useToast } from "@/admin/ui/overlay";
import { cn } from "@/lib/utils";

const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

type Access = { name: string; role: "admin" | "editor"; sections: Section[] };

export function TeamScreen({ members }: { members: TeamMember[] }) {
  const { member: me, configured } = useAdmin();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [inviting, setInviting] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  if (!configured) {
    return (
      <>
        <PageHeader title="Users & Access" />
        <EmptyState
          title="Accounts need the database"
          body="Once it is connected, the first account created becomes the owner, and the owner invites everyone else from here."
        />
      </>
    );
  }
  if (me?.role !== "owner") {
    return (
      <>
        <PageHeader title="Users & Access" />
        <Notice tone="warning">Only the site owner can manage accounts.</Notice>
      </>
    );
  }

  const act = async (label: string, run: () => Promise<unknown>) => {
    setMenuFor(null);
    try {
      await run();
      toast({ tone: "success", title: label });
      await router.invalidate();
    } catch (error) {
      toast({ tone: "error", title: "That did not work", body: errorMessage(error) });
    }
  };

  return (
    <>
      <PageHeader
        title="Users & Access"
        description="Everyone who can sign in to this panel. You are the owner: only you can invite people, choose what they may edit, and remove them."
        actions={
          <Button variant="primary" onClick={() => setInviting(true)}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Invite Someone
          </Button>
        }
      />
      <Card>
        <ul className="-my-2 divide-y divide-navy/8">
          {members.map((member) => {
            const role = ROLES.find((r) => r.key === member.role)!;
            const isMe = member.id === me.id;
            return (
              <li key={member.id} className="flex flex-wrap items-center gap-3 py-3.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-medium uppercase",
                    member.role === "owner" ? "bg-navy text-white" : "bg-navy/8 text-navy",
                  )}
                >
                  {(member.name || member.email).slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-navy">
                    <span className="truncate">{member.name || member.email}</span>
                    {isMe ? <span className="text-xs font-normal text-slate">(you)</span> : null}
                  </p>
                  <p className="truncate text-xs text-slate">
                    {member.email}
                    {member.role === "editor"
                      ? ` · ${member.sections.length ? member.sections.map((s) => SECTIONS.find((x) => x.key === s)?.label).join(", ") : "No sections yet"}`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {member.disabled ? <Badge tone="danger">Disabled</Badge> : null}
                  {member.invited ? <Badge tone="warning">Invited</Badge> : null}
                  <Badge tone={member.role === "owner" ? "info" : "neutral"}>
                    {member.role === "owner" ? (
                      <Crown className="h-3 w-3" aria-hidden="true" />
                    ) : null}
                    {role.label}
                  </Badge>
                  <span className="hidden text-xs text-slate md:inline">
                    {member.lastSignIn
                      ? `Last in ${when.format(new Date(member.lastSignIn))}`
                      : "Never signed in"}
                  </span>
                </div>
                {member.role !== "owner" ? (
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-expanded={menuFor === member.id}
                      aria-label={`Actions for ${member.name || member.email}`}
                      onClick={() => setMenuFor(menuFor === member.id ? null : member.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    {menuFor === member.id ? (
                      <div className="admin-fade-in absolute top-full right-0 z-10 mt-1 grid w-56 gap-0.5 rounded-xl border border-navy/10 bg-white p-1.5 shadow-[0_12px_32px_-8px_rgb(5_8_52/0.3)]">
                        <MenuItem
                          onClick={() => {
                            setEditing(member);
                            setMenuFor(null);
                          }}
                        >
                          Change Access
                        </MenuItem>
                        {member.invited ? (
                          <MenuItem
                            onClick={() =>
                              void act("Invitation sent again", () =>
                                resendInvite({ data: { email: member.email } }),
                              )
                            }
                          >
                            Resend Invitation
                          </MenuItem>
                        ) : null}
                        <MenuItem
                          onClick={() =>
                            void act(
                              member.disabled ? "Account re-enabled" : "Account disabled",
                              () =>
                                setMemberDisabled({
                                  data: { id: member.id, disabled: !member.disabled },
                                }),
                            )
                          }
                        >
                          {member.disabled ? "Enable Account" : "Disable Account"}
                        </MenuItem>
                        <MenuItem
                          onClick={async () => {
                            setMenuFor(null);
                            const ok = await confirm({
                              title: `Make ${member.name || member.email} the owner?`,
                              body: "They get full control, including accounts. You become an admin and can no longer manage accounts. Only they can hand ownership back.",
                              confirmLabel: "Transfer Ownership",
                              danger: true,
                            });
                            if (ok)
                              await act("Ownership transferred", () =>
                                transferOwnership({ data: { id: member.id } }),
                              );
                            if (ok) window.location.reload();
                          }}
                        >
                          Make Owner
                        </MenuItem>
                        <MenuItem
                          danger
                          onClick={async () => {
                            setMenuFor(null);
                            const ok = await confirm({
                              title: `Remove ${member.name || member.email}?`,
                              body: "Their account is deleted and they can no longer sign in. What they edited stays on the site.",
                              confirmLabel: "Remove Account",
                              danger: true,
                            });
                            if (ok)
                              await act("Account removed", () =>
                                removeMember({ data: { id: member.id } }),
                              );
                          }}
                        >
                          Remove Account
                        </MenuItem>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <span
                    className="grid h-9 w-9 place-items-center text-navy/40"
                    title="The owner’s account cannot be changed here"
                  >
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
      <div className="mt-5">
        <Notice title="How access works">
          Admins can edit every section and setting. Editors can open only the sections you tick for
          them. Nobody but you can see this screen.
        </Notice>
      </div>

      <AccessDialog
        open={inviting}
        title="Invite Someone"
        submitLabel="Send Invitation"
        withEmail
        onClose={() => setInviting(false)}
        onSubmit={async (access, email) => {
          await inviteMember({ data: { ...access, email: email! } });
          toast({
            tone: "success",
            title: "Invitation sent",
            body: `${email} will get an email to set a password.`,
          });
          setInviting(false);
          await router.invalidate();
        }}
      />
      <AccessDialog
        open={Boolean(editing)}
        key={editing?.id ?? "none"}
        title={`Access for ${editing?.name || editing?.email || ""}`}
        submitLabel="Save Access"
        initial={
          editing
            ? {
                name: editing.name,
                role: editing.role === "admin" ? "admin" : "editor",
                sections: editing.sections,
              }
            : undefined
        }
        onClose={() => setEditing(null)}
        onSubmit={async (access) => {
          await updateMember({ data: { ...access, id: editing!.id } });
          toast({ tone: "success", title: "Access updated" });
          setEditing(null);
          await router.invalidate();
        }}
      />
    </>
  );
}

function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "admin-focus min-h-9 rounded-lg px-3 text-left text-[0.8125rem] transition-colors duration-150",
        danger ? "text-[#b42318] hover:bg-[#b42318]/8" : "text-navy hover:bg-navy/6",
      )}
    >
      {children}
    </button>
  );
}

function AccessDialog({
  open,
  title,
  submitLabel,
  withEmail,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  submitLabel: string;
  withEmail?: boolean;
  initial?: Access | undefined;
  onClose: () => void;
  onSubmit: (access: Access, email?: string) => Promise<void>;
}) {
  const [access, setAccess] = useState<Access>(
    initial ?? { name: "", role: "editor", sections: [] },
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (withEmail && !/^\S+@\S+\.\S+$/.test(email)) return setError("Enter their email address.");
    if (access.role === "editor" && !access.sections.length) {
      return setError("Tick at least one section, or make them an admin.");
    }
    setError(null);
    setBusy(true);
    try {
      await onSubmit(access, email);
      setAccess({ name: "", role: "editor", sections: [] });
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={title} size="lg">
      <form onSubmit={submit} className="grid gap-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          {withEmail ? (
            <Field label="Email">
              {({ id }) => (
                <TextInput
                  id={id}
                  name="email"
                  type="email"
                  inputMode="email"
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="name@durall.com…"
                  data-autofocus
                />
              )}
            </Field>
          ) : null}
          <Field label="Name">
            {({ id }) => (
              <TextInput
                id={id}
                value={access.name}
                autoComplete="off"
                onChange={(event) => setAccess({ ...access, name: event.target.value })}
              />
            )}
          </Field>
        </div>
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-[0.8125rem] font-medium text-navy">Role</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ROLES.filter((r) => r.key !== "owner").map((role) => (
              <label
                key={role.key}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy/10 bg-white p-3 hover:border-navy/25 has-[:checked]:border-accent-blue/50 has-[:checked]:bg-accent-blue/[0.04]"
              >
                <input
                  type="radio"
                  name="role"
                  checked={access.role === role.key}
                  onChange={() => setAccess({ ...access, role: role.key as Access["role"] })}
                  className="mt-0.5 accent-[var(--color-accent-blue)]"
                />
                <span>
                  <span className="block text-[0.8125rem] font-medium text-navy">{role.label}</span>
                  <span className="block text-xs text-slate">{role.note}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {access.role === "editor" ? (
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-[0.8125rem] font-medium text-navy">
              Sections they can edit
            </legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SECTIONS.map((section) => (
                <Checkbox
                  key={section.key}
                  label={section.label}
                  checked={access.sections.includes(section.key)}
                  onChange={(on) =>
                    setAccess({
                      ...access,
                      sections: on
                        ? [...access.sections, section.key]
                        : access.sections.filter((s) => s !== section.key),
                    })
                  }
                />
              ))}
            </div>
          </fieldset>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm font-medium text-[#b42318]">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap justify-end gap-2 border-t border-navy/8 pt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" busy={busy}>
            {withEmail ? <MailPlus className="h-4 w-4" aria-hidden="true" /> : null}
            {busy ? "Saving…" : submitLabel}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
