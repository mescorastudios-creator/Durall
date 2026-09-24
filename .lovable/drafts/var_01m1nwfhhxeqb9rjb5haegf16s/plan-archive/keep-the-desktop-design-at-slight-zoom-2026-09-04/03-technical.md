## Technical notes

- Swap `xl:` (80rem) for `lg:` (64rem) on the Durall desktop composition classes in `Philosophy.tsx`, `Projects.tsx`, `Process.tsx`, `Contact.tsx`, `DurallFooter.tsx`, `ConnectorLine.tsx`. Contact's `xl:hidden` / `hidden xl:block` pair becomes `lg:hidden` / `hidden lg:block`.
- `Projects.tsx` grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; the arrow block's `xl:` offsets become `lg:`.
- `Process.tsx` matchMedia: pin at `(min-width: 64rem) and (min-height: 44rem)`, fallback at the complementary `(max-width: 63.999rem), (max-height: 43.999rem)`; keep `invalidateOnRefresh` and the existing offset-based marker measurement untouched.
- Contact's overlay stays container-query driven (`@container`, `cqw` units), so no absolute values change — only the gate width.
- Verify in Chromium at 1024, 1150, 1280, 1440, 1920 and at short heights (720, 800): desktop composition present from 1024 up, no horizontal overflow, process marker aligned to the active dot, pin-spacer height equal to viewport height x 4 when pinned.
