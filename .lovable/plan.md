# Plan: lock down admin login, keep current backend

## Context

The instructions you pasted are for a **Next.js** app pointed at a different backend project (`pymnvjzhgcyzerhvczlf`). This project is a **Vite + React** app on Lovable Cloud, already connected to backend `ihegjzwlvthfqwredssj` with all your posts, pages, media, SEO settings, sitemaps, RLS, and auth wired up.

Switching backends would erase every post, page, image, SEO setting, and admin user and break the SEO/sitemap work we just did. I will **not** do that. The pasted publishable key, DB connection string, MCP URLs, and `npm install @supabase/ssr` / `shadcn add` commands are Next.js-only and do not apply here — I will ignore them.

If you truly want to move to that other backend, say so explicitly and we'll plan a data export/import first.

## What I will change

1. **Remove signup from the login page** (`src/pages/Auth.tsx`)
   - Delete the "Need an account? Sign up" toggle and all signup code paths.
   - Page becomes sign-in only. Pre-fill stays for your admin email.
   - No automatic account creation on failed sign-in.

2. **Disable public sign-ups at the backend**
   - Set `disable_signup: true` so the API rejects new account creation even if someone calls it directly.
   - Keep email auth on, leaked-password protection on.

3. **Replace the "Not authorized" screen with a clean redirect** (`src/components/admin/AdminLayout.tsx`)
   - Signed-in but non-admin users get signed out and sent to `/auth` with a toast: "Admin access required." No dead-end page.
   - Signed-out users still go straight to `/auth` (unchanged).

4. **Guarantee your admin account stays admin**
   - Insert (idempotent) the `admin` role for `shinhasarder2343@gmail.com` and `mdshinhasarder466@gmail.com` if their user rows already exist, so you never get locked out.

## What I will NOT do (and why)

- Create `.env.local` with `NEXT_PUBLIC_*` vars — Vite ignores them, and exposing a different project's key in this repo would break the live site.
- Run `npm install @supabase/ssr` or `npx shadcn add @supabase/supabase-client-nextjs` — those are Next.js packages and would conflict with the existing client.
- Run `supabase login` / `supabase link` / DB connection string — Lovable Cloud manages this; raw DB URLs and CLI linking aren't used here.
- Add the Supabase MCP server config — MCP connectors are managed in the Connectors panel, not via `.env` or `~/.copilot/mcp-config.json`. If you want MCP, I can point you to that panel.
- Create a new `posts` table with `bigint` id — your existing `posts` table uses `uuid` and is already populated; recreating it would wipe content.

## Technical details

- Files edited: `src/pages/Auth.tsx`, `src/components/admin/AdminLayout.tsx`.
- Backend: `configure_auth` call to set `disable_signup=true`; one small `INSERT ... ON CONFLICT DO NOTHING` into `user_roles` for the two admin emails (only if their `auth.users` row exists).
- No schema changes, no new tables, no new secrets, no package changes.

## Acceptance

- `/auth` shows only a Sign In form — no signup link, no signup mode.
- Trying to sign up via API returns an error.
- Logging in as a non-admin redirects to `/auth` with a toast, never the "Not authorized" page.
- Logging in as `shinhasarder2343@gmail.com` lands on `/admin` with full access.
- All existing posts, pages, media, sitemaps, and SEO settings remain intact.