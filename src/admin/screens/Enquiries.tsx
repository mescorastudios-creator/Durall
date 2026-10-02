import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Download, Mail, Search, Trash2 } from "lucide-react";
import { deleteEnquiry, updateEnquiry, type Enquiry } from "@/admin/api/inbox";
import { useAdmin } from "@/admin/context";
import {
  Badge,
  Button,
  buttonClass,
  EmptyState,
  Field,
  PageHeader,
  Select,
  TextArea,
  TextInput,
} from "@/admin/ui/controls";
import { Dialog, errorMessage, useConfirm, useToast } from "@/admin/ui/overlay";
import { cn } from "@/lib/utils";

const STATUSES = [
  { key: "new", label: "New", tone: "info" },
  { key: "read", label: "Read", tone: "neutral" },
  { key: "replied", label: "Replied", tone: "success" },
  { key: "archived", label: "Archived", tone: "neutral" },
] as const;

const SOURCES = {
  contact: "Contact page",
  home: "Home page",
  about: "About page",
  partners: "Partners page",
  expertise: "Expertise page",
} as const;

const stamp = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

/* Enquiries are typed by the public. A cell starting with = + - @ (or a
 * tab/CR before one) is run as a formula by Excel and Sheets, so those get
 * a leading apostrophe and open as plain text. */
const formulaSafe = (v: string) => (/^[=+\-@\t\r]/.test(v) ? `'${v}` : v);

function csvOf(rows: Enquiry[]) {
  const cells = (values: string[]) =>
    values.map((v) => `"${formulaSafe(v).replace(/"/g, '""').replace(/\r?\n/g, " ")}"`).join(",");
  return [
    cells([
      "Received",
      "Status",
      "Form",
      "Name",
      "Email",
      "Phone",
      "Location",
      "Studio",
      "Project type",
      "Subject",
      "Message",
      "Notes",
    ]),
    ...rows.map((r) =>
      cells([
        r.createdAt,
        r.status,
        SOURCES[r.source],
        r.name,
        r.email,
        r.phone,
        r.location,
        r.studio,
        r.projectType,
        r.subject,
        r.message,
        r.notes,
      ]),
    ),
  ].join("\n");
}

export function EnquiriesScreen({ enquiries: initial }: { enquiries: Enquiry[] }) {
  const { configured } = useAdmin();
  const [enquiries, setEnquiries] = useState(initial);
  const [filter, setFilter] = useState<"open" | Enquiry["status"] | "all">("open");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const router = useRouter();

  const needle = query.trim().toLowerCase();
  const shown = useMemo(
    () =>
      enquiries.filter(
        (e) =>
          (filter === "all" ||
            (filter === "open" ? e.status !== "archived" : e.status === filter)) &&
          (!needle ||
            `${e.name} ${e.email} ${e.phone} ${e.location} ${e.studio} ${e.subject} ${e.message}`
              .toLowerCase()
              .includes(needle)),
      ),
    [enquiries, filter, needle],
  );
  const counts = useMemo(
    () =>
      Object.fromEntries(
        STATUSES.map((s) => [s.key, enquiries.filter((e) => e.status === s.key).length]),
      ),
    [enquiries],
  );
  const open = enquiries.find((e) => e.id === openId) ?? null;

  const replace = (next: Enquiry) =>
    setEnquiries((list) => list.map((e) => (e.id === next.id ? next : e)));

  const exportCsv = () => {
    const blob = new Blob([csvOf(shown)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `durall-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Messages from the enquiry forms on the Home, About and Contact pages."
        actions={
          <Button onClick={exportCsv} disabled={!shown.length}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Show"
          className="inline-flex flex-wrap rounded-full bg-navy/6 p-1"
        >
          {(
            [
              ["open", `Inbox (${enquiries.length - (counts["archived"] ?? 0)})`],
              ...STATUSES.map((s) => [s.key, `${s.label} (${counts[s.key] ?? 0})`] as const),
              ["all", "All"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                "admin-focus min-h-8 rounded-full px-3 text-xs font-medium transition-colors duration-150",
                filter === key ? "bg-white text-navy shadow-sm" : "text-slate hover:text-navy",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate"
          />
          <TextInput
            type="search"
            aria-label="Search enquiries"
            placeholder="Search names, emails, messages…"
            value={query}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={<Mail className="h-7 w-7" aria-hidden="true" />}
          title={
            !configured
              ? "Enquiries arrive once the database is connected"
              : enquiries.length
                ? "Nothing here"
                : "No enquiries yet"
          }
          body={
            !configured
              ? "Until then, the forms tell visitors to write to the email address on the Contact page."
              : enquiries.length
                ? "Try another filter or search."
                : "Messages sent from the site’s forms will appear here."
          }
        />
      ) : (
        <ul className="grid gap-2">
          {shown.map((enquiry) => {
            const status = STATUSES.find((s) => s.key === enquiry.status)!;
            return (
              <li key={enquiry.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(enquiry.id)}
                  className={cn(
                    "admin-focus grid w-full gap-1 rounded-2xl border bg-white p-4 text-left transition-[border-color] duration-150 hover:border-navy/25 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] sm:items-center sm:gap-4",
                    enquiry.status === "new" ? "border-accent-blue/40" : "border-navy/10",
                  )}
                >
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate text-sm text-navy",
                        enquiry.status === "new" && "font-semibold",
                      )}
                    >
                      {enquiry.name}
                    </span>
                    <span className="block truncate text-xs text-slate">{enquiry.email}</span>
                  </span>
                  <span className="min-w-0 truncate text-sm text-slate-deep">
                    {enquiry.subject || enquiry.projectType || enquiry.message || "No message"}
                  </span>
                  <span className="flex items-center gap-2 sm:justify-end">
                    <span className="text-xs whitespace-nowrap text-slate tabular-nums">
                      {stamp.format(new Date(enquiry.createdAt))}
                    </span>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {open ? (
        <EnquiryDialog
          key={open.id}
          enquiry={open}
          onClose={() => setOpenId(null)}
          onSaved={replace}
          onDeleted={(id) => {
            setEnquiries((list) => list.filter((e) => e.id !== id));
            setOpenId(null);
            void router.invalidate();
          }}
        />
      ) : null}
    </>
  );
}

function EnquiryDialog({
  enquiry,
  onClose,
  onSaved,
  onDeleted,
}: {
  enquiry: Enquiry;
  onClose: () => void;
  onSaved: (next: Enquiry) => void;
  onDeleted: (id: string) => void;
}) {
  const { editable } = useAdmin();
  const toast = useToast();
  const confirm = useConfirm();
  // Opening a new one marks it read.
  const [status, setStatus] = useState<Enquiry["status"]>(
    enquiry.status === "new" ? "read" : enquiry.status,
  );
  const [notes, setNotes] = useState(enquiry.notes);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (enquiry.status !== "new" || !editable) return;
    void updateEnquiry({ data: { id: enquiry.id, status: "read", notes: enquiry.notes } }).then(
      () => onSaved({ ...enquiry, status: "read" }),
      () => undefined,
    );
    // Once, when this enquiry is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enquiry.id]);

  const save = async () => {
    setBusy(true);
    try {
      await updateEnquiry({ data: { id: enquiry.id, status, notes } });
      onSaved({ ...enquiry, status, notes });
      toast({ tone: "success", title: "Enquiry updated" });
      onClose();
    } catch (error) {
      toast({ tone: "error", title: "Not saved", body: errorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    const ok = await confirm({
      title: "Delete this enquiry?",
      body: "It is removed for everyone and cannot be brought back. Archive it instead to keep a record.",
      confirmLabel: "Delete Enquiry",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteEnquiry({ data: { id: enquiry.id } });
      toast({ tone: "success", title: "Enquiry deleted" });
      onDeleted(enquiry.id);
    } catch (error) {
      toast({ tone: "error", title: "Not deleted", body: errorMessage(error) });
    }
  };

  const subject = encodeURIComponent(`Re: ${enquiry.subject || "Your enquiry to Durall Systems"}`);

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title={enquiry.name}
      description={`${SOURCES[enquiry.source]} · ${stamp.format(new Date(enquiry.createdAt))}`}
      footer={
        <>
          {editable ? (
            <Button
              variant="ghost"
              onClick={() => void remove()}
              className="mr-auto text-[#b42318] hover:bg-[#b42318]/8 hover:text-[#b42318]"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </Button>
          ) : null}
          <a
            href={`mailto:${enquiry.email}?subject=${subject}`}
            className={buttonClass("secondary")}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Reply by Email
          </a>
          {editable ? (
            <Button variant="primary" busy={busy} onClick={() => void save()}>
              Save
            </Button>
          ) : null}
        </>
      }
    >
      <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {(
          [
            ["Email", enquiry.email],
            ["Phone", enquiry.phone],
            ["Project location", enquiry.location],
            ["Studio / company", enquiry.studio],
            ["Project type", enquiry.projectType],
            ["Subject", enquiry.subject],
          ] as const
        )
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-xs text-slate">{label}</dt>
              <dd className="mt-0.5 break-words text-navy">{value}</dd>
            </div>
          ))}
      </dl>
      {enquiry.message ? (
        <div className="mt-5 rounded-xl bg-paper p-4">
          <p className="text-xs text-slate">Message</p>
          <p className="mt-1.5 text-sm leading-relaxed break-words whitespace-pre-line text-navy">
            {enquiry.message}
          </p>
        </div>
      ) : null}
      <fieldset disabled={!editable} className="mt-5 grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <Field label="Status">
          {({ id }) => (
            <Select
              id={id}
              value={status}
              onChange={(event) => setStatus(event.target.value as Enquiry["status"])}
            >
              {STATUSES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Notes for the team" hint="Only seen here.">
          {({ id, describedBy }) => (
            <TextArea
              id={id}
              aria-describedby={describedBy}
              rows={2}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          )}
        </Field>
      </fieldset>
    </Dialog>
  );
}
