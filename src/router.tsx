import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { revealTypes, supportsReveal } from "./lib/page-transition";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Start fetching a page as the pointer rests on its link (or a finger
    // lands on it), so most of the wait is over before the click.
    defaultPreload: "intent",
    // The circle reveal between pages (lib/page-transition.ts). `false` on
    // the server and in browsers without view transition types.
    defaultViewTransition: supportsReveal() ? { types: revealTypes } : false,
  });

  return router;
};
