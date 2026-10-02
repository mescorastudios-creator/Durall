# Admin panel

The site's content is edited at **/admin**. Pages, projects, articles,
careers, partners, images, navigation, contact details and settings are
all editable there, and enquiries from the site's forms arrive there.

> **Switched off for now.** While the site is being reworked,
> `ADMIN_ENABLED` in `src/admin/enabled.ts` is `false`: every page is served
> from the bundled content in `src/content/seed`, and /admin answers "page
> not found". The enquiry forms still save to the database. Set it to `true`
> to connect the panel and the database again. What is saved in the database
> will be older than the bundled content by then, and it wins over it, so
> the old copy shows on the site until the content is imported again over
> the top. `importSiteContent` accepts `overwrite: true` for that; the
> Dashboard's import button does not send it yet.

## Setting it up (once)

1. Create a free project at [supabase.com](https://supabase.com).
2. In its **SQL Editor**, run each file in `supabase/migrations/` in order
   (`0001_cms.sql`, then `0002_enquiry_phone_location.sql`, then
   `0003_section_access.sql`). Each is safe to run more than once, so a
   project set up earlier only needs the files it has not run yet.
3. **Authentication → Sign In / Providers:** switch off *Allow new users to sign up*.
4. **Authentication → URL Configuration:** set the Site URL to the live
   domain, and add `https://<your-domain>/admin/set-password` (plus
   `http://localhost:8080/admin/set-password` for development) to the
   Redirect URLs, so invitation and reset emails land in the panel.
5. **Authentication → Users → Add user:** create your own account. The
   first account becomes the **owner**.
6. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`
   (Project Settings → API) to the Netlify site's environment variables, and
   to `.env.local` for development (see `.env.example`). Redeploy.
7. Sign in at `/admin` and press **Import the Site's Content** on the
   Dashboard. Editing is switched on from then.

Until step 7 the site shows the content bundled in `src/content/seed/`, and
`/admin` opens as a read-only preview.

## Accounts

- **Owner:** exactly one. Can do everything and is the only person who sees
  *Users & Access*, where they invite people, choose their access, disable or
  remove them, and can hand ownership to someone else.
- **Admin:** every content and settings section, no account management.
- **Editor:** only the sections the owner ticks. Both the site's server and
  the database's row-level security (0003) enforce this, including drafts,
  enquiries and each part of the site settings. Editors see only their own
  entries in the activity log.

There is no sign-up. People join by invitation email only.

## How it fits together

| Where | What |
| --- | --- |
| `src/content/types.ts` | The shape of all editable content |
| `src/content/seed/` | The content the site shipped with, and the fallback |
| `src/content/api.ts` | What each public page loads (server functions) |
| `src/server/` | Server-only: Supabase clients, the content store, sign-in checks, CDN cache |
| `src/admin/api/` | The admin panel's server functions (every write checks the session) |
| `src/admin/specs/` | The edit forms, one list of fields per page |
| `src/routes/admin*.tsx` | The admin screens |
| `supabase/migrations/` | Tables, row-level security and the image bucket |

Public pages are cached at Netlify's CDN and purged on every save, so edits
are live within seconds. The admin panel, and anything with a session, is
never cached.

## Still to do: the security step

- Two-step sign-in (TOTP) for the owner and admins; stricter login limits;
  session time-outs.
- Version history and restore; draft previews on the site; scheduled
  publishing.
- Security headers (CSP); an email notification for new enquiries.
