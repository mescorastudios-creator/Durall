import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

/**
 * The browser entry: the framework's default, with one thing done first.
 *
 * The host adds a note to every page it serves: an HTML comment on a line of
 * its own inside <head>. React takes over the whole document and expects
 * <head> to hold exactly what the server rendered, so the stray line made it
 * give up on the server's page and build it again from nothing on every
 * load ("hydration failed"). On screen that was the opening sequence playing
 * wrongly: the page showed, vanished and animated in a second time, and
 * everything waiting on the page being ready (the opening film) started late.
 *
 * So anything in <head> that React did not write is removed before React
 * looks: loose text, and comments other than React's own short markers.
 * Elements are left alone; React already steps over scripts and styles that
 * other people add.
 */
function tidyHead() {
  for (const node of Array.from(document.head.childNodes)) {
    const strayText = node.nodeType === Node.TEXT_NODE;
    // React's markers are a few characters ("$", "/$", "html"…).
    const strayComment = node.nodeType === Node.COMMENT_NODE && (node.nodeValue ?? "").length > 12;
    if (strayText || strayComment) node.remove();
  }
}

tidyHead();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
