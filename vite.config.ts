// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // The admin panel's loaders and loading states import its API, form
    // kit and editors. Left in the route files they ship in the entry bundle
    // of every public page, so for /admin they are split out with the screen.
    router: {
      codeSplittingOptions: {
        splitBehavior: ({ routeId }: { routeId: string }) =>
          routeId.startsWith("/admin")
            ? [["loader"], ["component"], ["pendingComponent"], ["errorComponent"]]
            : undefined,
      },
    },
  },
  // Target Netlify Functions instead of the default Cloudflare Workers preset.
  nitro: {
    preset: "netlify",
  },
  // Lets the local server be shared through an ngrok tunnel (`ngrok http 8080`).
  // Vite refuses requests for any hostname it doesn't know, and a tunnel's is
  // new each time; a leading dot allows every subdomain.
  vite: {
    server: { allowedHosts: [".ngrok-free.app", ".ngrok-free.dev", ".ngrok.app"] },
    preview: { allowedHosts: [".ngrok-free.app", ".ngrok-free.dev", ".ngrok.app"] },
  },
});
