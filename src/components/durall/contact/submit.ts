import { sendEnquiry } from "@/content/enquiry";

export type EnquiryValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
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
