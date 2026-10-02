import { useEffect, useState } from "react";
import { Check, Link2, Linkedin, Mail } from "lucide-react";

export type ContentsEntry = { id: string; label: string };

const LABEL = "font-display text-[0.6875rem] font-bold tracking-eyebrow text-navy uppercase";

/**
 * Which section is being read: the one crossing a band a little above the
 * middle of the screen. An IntersectionObserver rather than a scroll
 * listener, so nothing runs per frame.
 */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-38% 0px -58% 0px" },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
    // `key` stands for `ids`, which is a new array on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}

/** The article's sections as links, the one being read marked. */
export function Contents({ heading, entries }: { heading: string; entries: ContentsEntry[] }) {
  const active = useActiveSection(entries.map((entry) => entry.id));
  if (entries.length < 2) return null;

  return (
    <nav aria-label={heading}>
      <p className={LABEL}>{heading}</p>
      <ol className="mt-4 grid gap-1 border-l border-navy/12">
        {entries.map((entry) => {
          const current = entry.id === active;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={current ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-4 font-body text-sm leading-snug text-pretty transition-colors duration-[var(--dur-short)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue ${
                  current
                    ? "border-accent-blue text-navy"
                    : "border-transparent text-slate hover:text-navy"
                }`}
              >
                {entry.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** The same list folded away above the text on narrow screens. */
export function ContentsDisclosure({
  heading,
  entries,
}: {
  heading: string;
  entries: ContentsEntry[];
}) {
  if (entries.length < 2) return null;
  return (
    <details className="group border-y border-navy/12">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue [&::-webkit-details-marker]:hidden">
        <span className={LABEL}>{heading}</span>
        <span
          aria-hidden="true"
          className="font-display text-lg leading-none text-navy transition-[rotate] duration-[var(--dur-short)] group-open:rotate-45 motion-reduce:transition-none"
        >
          +
        </span>
      </summary>
      <ol className="grid gap-1 pb-4">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className="block py-2 font-body text-sm leading-snug text-slate hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
            >
              {entry.label}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}

const SHARE_ITEM =
  "inline-flex min-h-11 items-center gap-2.5 font-body text-sm text-slate transition-colors duration-[var(--dur-short)] hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue";

/**
 * Copy the link, or send it on by LinkedIn or email. The address is the
 * page's own, taken once the page is in the browser; before that the links
 * carry the path, so the server and browser render the same markup.
 */
export function Share({
  title,
  path,
  labels,
}: {
  title: string;
  path: string;
  labels: { share: string; copyLink: string; copied: string };
}) {
  const [url, setUrl] = useState(path);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(new URL(path, window.location.origin).toString());
  }, [path]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard refused (an old browser, or no permission): select-and-copy
      // from the address bar still works, so there is nothing to recover.
    }
  };

  return (
    <div>
      <p className={LABEL}>{labels.share}</p>
      <ul className="mt-3 grid gap-0.5">
        <li>
          <button type="button" onClick={copy} className={`${SHARE_ITEM} cursor-pointer`}>
            {copied ? (
              <Check className="h-4 w-4 text-accent-blue" aria-hidden="true" />
            ) : (
              <Link2 className="h-4 w-4" aria-hidden="true" />
            )}
            {copied ? labels.copied : labels.copyLink}
          </button>
          <span aria-live="polite" className="sr-only">
            {copied ? labels.copied : ""}
          </span>
        </li>
        <li>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={SHARE_ITEM}
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
            className={SHARE_ITEM}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email
          </a>
        </li>
      </ul>
    </div>
  );
}
