import { sendEnquiry } from "@/content/enquiry";

export type EnquiryValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

/* Hand-rolled rather than schema-driven: react-hook-form and zod were both
 * removed from the project as unused, and four fields do not justify adding
 * them back. Each rule returns the message the reader sees, or null. The
 * home page's form checks its name and email with the same two. */
export const RULES: Record<keyof EnquiryValues, (value: string) => string | null> = {
  name: (v) =>
    v.trim().length === 0
      ? "Enter your name so we know who we’re replying to."
      : v.trim().length < 2
        ? "That looks too short — enter your full name."
        : null,
  email: (v) =>
    v.trim().length === 0
      ? "Enter an email address so we can reply."
      : // Deliberately permissive: the only thing worth rejecting client-side
        // is an address that cannot be delivered to at all. Anything stricter
        // turns into false rejections of valid addresses.
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? null
        : "That doesn’t look like a complete email address — check for a missing @ or domain.",
  subject: (v) => (v.trim().length === 0 ? "Add a subject so we can route your enquiry." : null),
  // Any note will do: a short one still reaches the team, and a length rule
  // only turned real enquiries away.
  message: (v) => (v.trim().length === 0 ? "Tell us a little about the project." : null),
};

export type SubmitResult = { ok: true } | { ok: false; message: string };

/**
 * Sends the /contact form to the enquiries inbox (content/enquiry.ts).
 *
 * Two ways to reach the failure path deliberately:
 *   - go offline; the check below is real, not simulated
 *   - append `?simulateError` to the URL, for demoing the error state
 */
export async function submitEnquiry(values: EnquiryValues, honeypot = ""): Promise<SubmitResult> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return {
      ok: false,
      message:
        "That didn’t send — you appear to be offline. Check your connection and try again; nothing you typed has been lost.",
    };
  }

  if (typeof window !== "undefined" && window.location.search.includes("simulateError")) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      ok: false,
      message:
        "That didn’t send — our enquiry service is not responding. Try again in a moment, or email us directly using the address alongside this form.",
    };
  }

  try {
    return await sendEnquiry({ data: { source: "contact", ...values, website: honeypot } });
  } catch {
    return {
      ok: false,
      message:
        "That didn’t send — our enquiry service is not responding. Try again in a moment, or email us directly using the address alongside this form.",
    };
  }
}
