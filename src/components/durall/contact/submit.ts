export type EnquiryValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type SubmitResult = { ok: true } | { ok: false; message: string };

/**
 * The single point to swap for a real submission.
 *
 * There is no backend, so this stands in for one: it takes a realistic amount
 * of time, and it can genuinely fail, which is what makes the form's loading
 * and error states reachable rather than decorative. Replace the body with a
 * `fetch` to whatever endpoint the enquiries should reach — the form only
 * cares about the `SubmitResult` shape.
 *
 * Two ways to reach the failure path deliberately:
 *   - go offline; the check below is real, not simulated
 *   - append `?simulateError` to the URL, for demoing the error state
 */
export async function submitEnquiry(_values: EnquiryValues): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return {
      ok: false,
      message:
        "That didn’t send — you appear to be offline. Check your connection and try again; nothing you typed has been lost.",
    };
  }

  if (typeof window !== "undefined" && window.location.search.includes("simulateError")) {
    return {
      ok: false,
      message:
        "That didn’t send — our enquiry service is not responding. Try again in a moment, or email us directly using the address alongside this form.",
    };
  }

  return { ok: true };
}
