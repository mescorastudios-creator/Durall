import { useId, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ImageIcon, Plus, Trash2 } from "lucide-react";
import { ICONS, iconOf } from "@/content/icons";
import type { Cta, ImageRef, Photo, Seo, TwoTone } from "@/content/types";
import { cn } from "@/lib/utils";
import { describeRef } from "@/admin/lib/media";
import {
  Button,
  Checkbox,
  Field,
  IconButton,
  INPUT,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "@/admin/ui/controls";
import { MediaPicker } from "./MediaPicker";
import { getIn, setIn, type FieldSpec, type SectionSpec } from "./spec";
import { Card } from "@/admin/ui/controls";

/* ── The form ────────────────────────────────────────────────────────────── */

/** Draws a list of sections as cards, each field bound to its path in `value`. */
export function SchemaForm<T>({
  sections,
  value,
  onChange,
  disabled,
}: {
  sections: readonly SectionSpec[];
  value: T;
  onChange: (next: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-5">
      {sections.map((section) => (
        <Card
          key={section.id}
          id={section.id}
          title={section.title}
          description={section.description}
        >
          <FieldGrid
            fields={section.fields}
            value={value}
            onChange={(next) => onChange(next as T)}
            disabled={disabled}
          />
        </Card>
      ))}
    </div>
  );
}

/** A two-column grid of fields; long ones span both columns. */
export function FieldGrid({
  fields,
  value,
  onChange,
  disabled,
}: {
  fields: readonly FieldSpec[];
  value: unknown;
  onChange: (next: unknown) => void;
  disabled?: boolean | undefined;
}) {
  return (
    <fieldset disabled={disabled} className="grid min-w-0 gap-x-5 gap-y-5 md:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.path + field.label}
          className={cn("min-w-0", spansBoth(field) && "md:col-span-2")}
        >
          <FieldControl
            spec={field}
            value={getIn(value, field.path)}
            onChange={(next) => onChange(setIn(value, field.path, next))}
          />
        </div>
      ))}
    </fieldset>
  );
}

function spansBoth(field: FieldSpec) {
  if (field.wide) return true;
  return [
    "textarea",
    "lines",
    "rich",
    "strings",
    "list",
    "group",
    "optional",
    "seo",
    "photo",
    "image",
    "logo",
    "checkboxes",
    "custom",
    "cta",
    "twoTone",
  ].includes(field.kind);
}

/* ── One field ───────────────────────────────────────────────────────────── */

export function FieldControl({
  spec,
  value,
  onChange,
}: {
  spec: FieldSpec;
  value: unknown;
  onChange: (next: unknown) => void;
}): ReactNode {
  const text = typeof value === "string" ? value : "";
  switch (spec.kind) {
    case "text":
    case "email":
    case "date":
      return (
        <Field label={spec.label} hint={spec.hint}>
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              type={spec.kind === "text" ? "text" : spec.kind}
              value={text}
              maxLength={spec.kind === "text" ? spec.max : undefined}
              placeholder={spec.kind === "text" ? spec.placeholder : undefined}
              spellCheck={spec.kind === "email" ? false : undefined}
              autoComplete="off"
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </Field>
      );
    case "textarea":
    case "lines":
    case "rich":
      return (
        <Field
          label={spec.label}
          hint={
            spec.hint ??
            (spec.kind === "lines"
              ? "Each new line here starts a new line on the page."
              : spec.kind === "rich"
                ? "Use **bold**, *italic* and [link text](https://…) for formatting."
                : undefined)
          }
        >
          {({ id, describedBy }) => (
            <TextArea
              id={id}
              aria-describedby={describedBy}
              rows={spec.rows ?? (spec.kind === "lines" ? 3 : 4)}
              value={text}
              placeholder={spec.kind === "textarea" ? spec.placeholder : undefined}
              autoComplete="off"
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </Field>
      );
    case "number":
      return (
        <Field label={spec.label} hint={spec.hint}>
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              type="number"
              inputMode="decimal"
              step={spec.step ?? 1}
              min={spec.min}
              max={spec.max}
              value={typeof value === "number" ? value : ""}
              onChange={(event) =>
                onChange(event.target.value === "" ? 0 : Number(event.target.value))
              }
              className="tabular-nums"
            />
          )}
        </Field>
      );
    case "select":
      return (
        <Field label={spec.label} hint={spec.hint}>
          {({ id, describedBy }) => (
            <Select
              id={id}
              aria-describedby={describedBy}
              value={text}
              onChange={(event) => onChange(event.target.value)}
            >
              {spec.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      );
    case "checkboxes": {
      const chosen = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div role="group" aria-label={spec.label} className="grid gap-2">
          <p className="text-[0.8125rem] font-medium text-navy">{spec.label}</p>
          {spec.hint ? <p className="text-xs text-slate">{spec.hint}</p> : null}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {spec.options.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                checked={chosen.includes(option.value)}
                onChange={(on) =>
                  onChange(
                    on ? [...chosen, option.value] : chosen.filter((item) => item !== option.value),
                  )
                }
              />
            ))}
          </div>
        </div>
      );
    }
    case "toggle":
      return (
        <Toggle
          label={spec.label}
          description={spec.description ?? spec.hint}
          checked={Boolean(value)}
          onChange={onChange}
        />
      );
    case "twoTone":
      return (
        <TwoToneField
          label={spec.label}
          hint={spec.hint}
          value={value as TwoTone}
          onChange={onChange}
        />
      );
    case "cta":
      return (
        <CtaField
          label={spec.label}
          hint={spec.hint}
          optional={spec.optional}
          value={(value as Cta) ?? { label: "", href: "" }}
          onChange={onChange}
        />
      );
    case "link":
      return (
        <Field label={spec.label} hint={spec.hint ?? LINK_HINT}>
          {({ id, describedBy }) => (
            <LinkInput
              id={id}
              describedBy={describedBy}
              value={text}
              onChange={onChange}
              placeholder={spec.placeholder}
            />
          )}
        </Field>
      );
    case "photo":
      return (
        <PhotoField
          label={spec.label}
          hint={spec.hint}
          value={value as Photo}
          onChange={onChange}
        />
      );
    case "image":
      return (
        <ImageField
          label={spec.label}
          hint={spec.hint}
          value={value as ImageRef}
          onChange={(ref) => onChange(ref)}
        />
      );
    case "logo":
      return (
        <LogoField
          label={spec.label}
          hint={spec.hint}
          value={value as LogoValue}
          onChange={onChange}
        />
      );
    case "icon":
      return <IconField label={spec.label} value={text} onChange={onChange} />;
    case "strings":
      return (
        <StringsField
          spec={spec}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      );
    case "list":
      return (
        <ListField
          spec={spec}
          value={Array.isArray(value) ? (value as unknown[]) : []}
          onChange={onChange}
        />
      );
    case "group":
      return (
        <div className="grid gap-3">
          <p className="font-display text-[0.8125rem] font-medium text-navy">{spec.label}</p>
          {spec.hint ? <p className="-mt-2 text-xs text-slate">{spec.hint}</p> : null}
          <div className="rounded-xl border border-navy/8 bg-paper/60 p-4">
            <FieldGrid fields={spec.fields} value={value} onChange={onChange} />
          </div>
        </div>
      );
    case "optional":
      return (
        <div className="grid gap-3">
          <Toggle
            label={spec.toggleLabel}
            description={spec.hint}
            checked={value !== null && value !== undefined}
            onChange={(on) => onChange(on ? spec.create() : null)}
          />
          {value !== null && value !== undefined ? (
            <div className="rounded-xl border border-navy/8 bg-paper/60 p-4">
              <FieldGrid fields={spec.fields} value={value} onChange={onChange} />
            </div>
          ) : null}
        </div>
      );
    case "seo":
      return <SeoField value={value as Seo} onChange={onChange} />;
    case "custom":
      return spec.render(value, onChange);
    default:
      return null;
  }
}

/* ── Compound fields ─────────────────────────────────────────────────────── */

export const LINK_HINT =
  "A page (/about), a section (/about#approach), or a full address (https://…, mailto:…).";

/** Every page and section on the site, offered as suggestions in link fields. */
const SITE_LINKS = [
  "/",
  "/about",
  "/about#philosophy",
  "/about#approach",
  "/projects",
  "/expertise",
  "/expertise#systems",
  "/expertise#process",
  "/partners",
  "/partners#international-systems",
  "/partners#practices",
  "/insights",
  "/careers",
  "/careers#openings",
  "/contact",
  "#philosophy",
  "#contact",
];

export function LinkInput({
  id,
  describedBy,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  describedBy: string | undefined;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string | undefined;
}) {
  const listId = useId();
  const unsafe = value !== "" && !/^(\/|#|https?:\/\/|mailto:|tel:)/i.test(value);
  return (
    <>
      <TextInput
        id={id}
        aria-describedby={describedBy}
        aria-invalid={unsafe || undefined}
        list={listId}
        value={value}
        placeholder={placeholder ?? "/contact"}
        spellCheck={false}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value.trim())}
      />
      <datalist id={listId}>
        {SITE_LINKS.map((link) => (
          <option key={link} value={link} />
        ))}
      </datalist>
      {unsafe ? (
        <p role="alert" className="text-xs font-medium text-[#b42318]">
          Start with /, #, https://, mailto: or tel: — anything else will not link.
        </p>
      ) : null}
    </>
  );
}

function TwoToneField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string | undefined;
  value: TwoTone | undefined;
  onChange: (next: TwoTone) => void;
}) {
  const current = value ?? { text: "", muted: "" };
  return (
    <div role="group" aria-label={label} className="grid gap-3 sm:grid-cols-2">
      <Field label={label} hint={hint ?? "The first part, in navy."}>
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            aria-describedby={describedBy}
            value={current.text}
            autoComplete="off"
            onChange={(event) => onChange({ ...current, text: event.target.value })}
          />
        )}
      </Field>
      <Field label="Second part" hint="Set in grey after the first. Leave empty for none.">
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            aria-describedby={describedBy}
            value={current.muted}
            autoComplete="off"
            onChange={(event) => onChange({ ...current, muted: event.target.value })}
          />
        )}
      </Field>
    </div>
  );
}

function CtaField({
  label,
  hint,
  optional,
  value,
  onChange,
}: {
  label: string;
  hint?: string | undefined;
  optional?: boolean | undefined;
  value: Cta;
  onChange: (next: Cta) => void;
}) {
  return (
    <div role="group" aria-label={label} className="grid gap-3 sm:grid-cols-2">
      <Field
        label={`${label}: text`}
        hint={hint ?? (optional ? "Leave empty to hide the button." : undefined)}
      >
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            aria-describedby={describedBy}
            value={value.label}
            autoComplete="off"
            onChange={(event) => onChange({ ...value, label: event.target.value })}
          />
        )}
      </Field>
      <Field label={`${label}: goes to`} hint={LINK_HINT}>
        {({ id, describedBy }) => (
          <LinkInput
            id={id}
            describedBy={describedBy}
            value={value.href}
            onChange={(href) => onChange({ ...value, href })}
          />
        )}
      </Field>
    </div>
  );
}

/* ── Images ──────────────────────────────────────────────────────────────── */

export function ImageField({
  label,
  hint,
  value,
  onChange,
  onPickAlt,
  children,
}: {
  label: string;
  hint?: string | undefined;
  value: ImageRef | null | undefined;
  onChange: (next: ImageRef) => void;
  /** Called with the library's alt text for the image just picked. */
  onPickAlt?: (alt: string) => void;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const described = describeRef(value);
  return (
    <div role="group" aria-label={label} className="grid gap-2">
      <p className="text-[0.8125rem] font-medium text-navy">{label}</p>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-navy/10 bg-white p-3">
        <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-lg bg-glass">
          {described?.thumb ? (
            <img
              src={described.thumb}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-navy/30" aria-hidden="true" />
          )}
        </div>
        {/* Wide enough for a name before the button wraps below it on phones. */}
        <div className="min-w-[9rem] flex-1">
          <p className="truncate text-sm font-medium text-navy">{described?.name ?? "No image"}</p>
          {described?.size ? (
            <p className="text-xs text-slate tabular-nums">{described.size}</p>
          ) : null}
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          {value ? "Change Image" : "Choose Image"}
        </Button>
      </div>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-slate">{hint}</p> : null}
      {/* Mounted only while open: a page has dozens of image fields, and
          each picker loads the whole library. */}
      {open ? (
        <MediaPicker
          open
          onClose={() => setOpen(false)}
          current={value}
          onPick={(image) => {
            onChange(image.ref);
            if (image.alt) onPickAlt?.(image.alt);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

export function PhotoField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string | undefined;
  value: Photo | undefined;
  onChange: (next: Photo) => void;
}) {
  const current = value ?? { image: { kind: "asset", key: "heroParikrama" }, alt: "" };
  return (
    <ImageField
      label={label}
      hint={hint}
      value={current.image}
      onChange={(image) => onChange({ ...current, image })}
      onPickAlt={(alt) => onChange({ ...current, alt: current.alt || alt })}
    >
      <Field
        label="Description for screen readers (alt text)"
        hint="Say what the photograph shows, in a sentence."
      >
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            aria-describedby={describedBy}
            value={current.alt}
            autoComplete="off"
            placeholder="A pavilion framed by full-height sliding glass…"
            onChange={(event) => onChange({ ...current, alt: event.target.value })}
          />
        )}
      </Field>
    </ImageField>
  );
}

type LogoValue = { image: ImageRef; height: number } | null;

function LogoField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string | undefined;
  value: LogoValue;
  onChange: (next: LogoValue) => void;
}) {
  if (!value) {
    return (
      <div className="grid gap-2">
        <p className="text-[0.8125rem] font-medium text-navy">{label}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-navy/15 bg-white p-3">
          <p className="text-sm text-slate">
            No logo file: the name is set in type instead (see “Style without a logo”).
          </p>
          <Button
            size="sm"
            onClick={() =>
              onChange({ image: { kind: "asset", key: "logoGlasmarte" }, height: 1.5 })
            }
          >
            Add Logo
          </Button>
        </div>
        {hint ? <p className="text-xs text-slate">{hint}</p> : null}
      </div>
    );
  }
  return (
    <ImageField
      label={label}
      hint={hint ?? "SVG or a trimmed PNG/WebP works best."}
      value={value.image}
      onChange={(image) => onChange({ ...value, image })}
    >
      <div className="flex flex-wrap items-end gap-3">
        <Field
          label="Height on the page (rem)"
          hint="1rem is 16px. Most logos sit between 1 and 3."
          className="w-56"
        >
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              type="number"
              step={0.05}
              min={0.5}
              max={5}
              value={value.height}
              onChange={(event) => onChange({ ...value, height: Number(event.target.value) || 1 })}
              className="tabular-nums"
            />
          )}
        </Field>
        <Button size="sm" variant="ghost" onClick={() => onChange(null)}>
          Remove Logo
        </Button>
      </div>
    </ImageField>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */

function IconField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = iconOf(value);
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <p id={id} className="text-[0.8125rem] font-medium text-navy">
        {label}
      </p>
      <button
        type="button"
        aria-labelledby={id}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(INPUT, "flex min-h-10 items-center gap-2.5 text-left")}
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-navy/10 bg-paper">
          <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
        </span>
        <span className="flex-1 truncate text-sm">{value || "Choose an icon"}</span>
        <ChevronDown className="h-4 w-4 text-slate" aria-hidden="true" />
      </button>
      {open ? (
        <div
          role="listbox"
          aria-labelledby={id}
          className="grid grid-cols-6 gap-1.5 rounded-xl border border-navy/10 bg-white p-2 sm:grid-cols-8"
        >
          {Object.entries(ICONS).map(([name, Glyph]) => (
            <button
              key={name}
              type="button"
              role="option"
              aria-selected={name === value}
              title={name}
              aria-label={name}
              onClick={() => {
                onChange(name);
                setOpen(false);
              }}
              className={cn(
                "admin-focus grid aspect-square place-items-center rounded-lg transition-colors duration-150",
                name === value ? "bg-accent-blue text-white" : "text-navy hover:bg-navy/6",
              )}
            >
              <Glyph className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Lists ───────────────────────────────────────────────────────────────── */

function move<T>(list: readonly T[], from: number, to: number): T[] {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item as T);
  return copy;
}

function RowTools({
  index,
  count,
  fixed,
  onMove,
  onRemove,
  what,
}: {
  index: number;
  count: number;
  fixed?: boolean | undefined;
  onMove: (to: number) => void;
  onRemove: () => void;
  what: string;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <IconButton
        label={`Move ${what} up`}
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <IconButton
        label={`Move ${what} down`}
        disabled={index === count - 1}
        onClick={() => onMove(index + 1)}
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      {!fixed ? (
        <IconButton label={`Remove ${what}`} onClick={onRemove} className="hover:text-[#b42318]">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      ) : null}
    </div>
  );
}

function StringsField({
  spec,
  value,
  onChange,
}: {
  spec: Extract<FieldSpec, { kind: "strings" }>;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const single = spec.label.replace(/s$/, "").toLowerCase();
  return (
    <div role="group" aria-label={spec.label} className="grid gap-2">
      <p className="text-[0.8125rem] font-medium text-navy">{spec.label}</p>
      {spec.hint ? <p className="-mt-1 text-xs text-slate">{spec.hint}</p> : null}
      <ol className="grid gap-2">
        {value.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-2.5 w-5 shrink-0 text-right text-xs text-slate tabular-nums">
              {index + 1}
            </span>
            {spec.item === "textarea" ? (
              <TextArea
                aria-label={`${spec.label} ${index + 1}`}
                value={item}
                rows={3}
                autoComplete="off"
                onChange={(event) =>
                  onChange(value.map((v, i) => (i === index ? event.target.value : v)))
                }
              />
            ) : (
              <TextInput
                aria-label={`${spec.label} ${index + 1}`}
                value={item}
                autoComplete="off"
                onChange={(event) =>
                  onChange(value.map((v, i) => (i === index ? event.target.value : v)))
                }
              />
            )}
            <RowTools
              index={index}
              count={value.length}
              fixed={spec.fixed || value.length <= (spec.min ?? 0)}
              what={single}
              onMove={(to) => onChange(move(value, index, to))}
              onRemove={() => onChange(value.filter((_, i) => i !== index))}
            />
          </li>
        ))}
      </ol>
      {!spec.fixed ? (
        <div>
          <Button size="sm" variant="ghost" onClick={() => onChange([...value, ""])}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {spec.addLabel ?? `Add ${single}`}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function ListField({
  spec,
  value,
  onChange,
}: {
  spec: Extract<FieldSpec, { kind: "list" }>;
  value: unknown[];
  onChange: (next: unknown[]) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(value.length <= 1 ? 0 : null);
  const single = spec.label.replace(/ies$/, "y").replace(/s$/, "").toLowerCase();
  const titleOf = spec.itemTitle as (item: unknown, index: number) => string;
  const full = spec.max !== undefined && value.length >= spec.max;
  return (
    <div role="group" aria-label={spec.label} className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[0.8125rem] font-medium text-navy">{spec.label}</p>
        <p className="text-xs text-slate tabular-nums">
          {value.length} {value.length === 1 ? "item" : "items"}
          {spec.fixed ? " · fixed by the layout" : ""}
        </p>
      </div>
      {spec.hint ? <p className="-mt-1 text-xs text-slate">{spec.hint}</p> : null}
      <ol className="grid gap-2">
        {value.map((item, index) => {
          const open = openIndex === index;
          const title = titleOf(item, index) || `${spec.label} ${index + 1}`;
          return (
            <li key={index} className="rounded-xl border border-navy/10 bg-white">
              <div className="flex items-center gap-1 py-1 pr-1 pl-2">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="admin-focus flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 text-left"
                >
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4 shrink-0 text-slate transition-transform duration-150",
                      open ? "rotate-0" : "-rotate-90",
                    )}
                  />
                  <span className="w-5 shrink-0 text-xs text-slate tabular-nums">{index + 1}</span>
                  <span className="truncate text-sm font-medium text-navy">{title}</span>
                </button>
                <RowTools
                  index={index}
                  count={value.length}
                  fixed={spec.fixed}
                  what={single}
                  onMove={(to) => {
                    onChange(move(value, index, to));
                    if (open) setOpenIndex(to);
                  }}
                  onRemove={() => {
                    onChange(value.filter((_, i) => i !== index));
                    setOpenIndex(null);
                  }}
                />
              </div>
              {open ? (
                <div className="border-t border-navy/8 p-4">
                  <FieldGrid
                    fields={spec.fields}
                    value={item}
                    onChange={(next) => onChange(value.map((v, i) => (i === index ? next : v)))}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      {!spec.fixed && !full ? (
        <div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onChange([...value, spec.create ? spec.create() : {}]);
              setOpenIndex(value.length);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {spec.addLabel ?? `Add ${single}`}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

/* ── SEO ─────────────────────────────────────────────────────────────────── */

function SeoField({ value, onChange }: { value: Seo | undefined; onChange: (next: Seo) => void }) {
  const current = value ?? { title: "", description: "", image: null };
  const titleLength = current.title.length;
  const descriptionLength = current.description.length;
  return (
    <div className="grid gap-5">
      <Field
        label="Title in search results and browser tabs"
        hint={`${titleLength} characters · 50–60 reads best.`}
      >
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            aria-describedby={describedBy}
            value={current.title}
            autoComplete="off"
            onChange={(event) => onChange({ ...current, title: event.target.value })}
          />
        )}
      </Field>
      <Field
        label="Description in search results"
        hint={`${descriptionLength} characters · 120–160 reads best.`}
      >
        {({ id, describedBy }) => (
          <TextArea
            id={id}
            aria-describedby={describedBy}
            rows={3}
            value={current.description}
            onChange={(event) => onChange({ ...current, description: event.target.value })}
          />
        )}
      </Field>
      <Toggle
        label="Own image when shared"
        description="Off: links to this page share the site's default image."
        checked={current.image !== null}
        onChange={(on) =>
          onChange({
            ...current,
            image: on ? { image: { kind: "asset", key: "heroParikrama" }, alt: "" } : null,
          })
        }
      />
      {current.image ? (
        <PhotoField
          label="Share image"
          hint="Shown when the page is shared on LinkedIn, WhatsApp and the like. Landscape works best."
          value={current.image}
          onChange={(image) => onChange({ ...current, image })}
        />
      ) : null}
      <SearchPreview title={current.title} description={current.description} />
    </div>
  );
}

function SearchPreview({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-navy/8 bg-paper/60 p-4">
      <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-slate uppercase">
        Search preview
      </p>
      <p className="mt-2 truncate text-[1.0625rem] text-[#1a0dab]">{title || "Page title"}</p>
      <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-[#4d5156]">
        {description || "The page description appears here."}
      </p>
    </div>
  );
}
