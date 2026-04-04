# Feature Patterns

When the feature you're building involves any of the patterns below, **read the linked doc before writing code**. These patterns are designed for the local SQLite dev environment and upgrade cleanly to production services later.

## Authentication (login, sign-up, user sessions)

**Read:** `AUTH_PATTERNS.md`

Use the cookie + DB auth abstraction in `app/lib/auth.ts`. All consumer code imports from this single file. DO NOT use NextAuth, Clerk, better-auth, Supabase Auth, or any external auth provider during prototyping — they require infrastructure unavailable locally.

**For scenarios:** Include User and Session seed rows. Add `"session": {"cookieValue": "<token>"}` at the scenario top level to auto-log the user in. Omit `session` for a logged-out scenario.

**Upgrade path:** See `AUTH_UPGRADE.md` — only `app/lib/auth.ts` internals change; consumer code stays the same.

## External Services (payments, email, maps, weather APIs, etc.)

If the user has dev/test credentials (e.g., Stripe test keys):

- Store them in `.codeyam/config.json` under `environmentVariables`
- Restart the dev server — credentials are injected into `process.env`

If no credentials are available:

- Build with real API calls in the code
- Mock responses per scenario using `externalApis` in scenario registration (Step 8)

## File Storage / Uploads

For local prototyping, store files in the `public/uploads/` directory and serve them as static assets. Use `fs.writeFile` in API routes. For production, swap to S3/Cloudflare R2/Supabase Storage.

## Email / Notifications

For prototyping, log emails to the console or write them to a `/api/dev/sent-emails` endpoint that stores in the database. For production, swap to Resend/SendGrid/Postmark.

---

_This list will grow as new patterns are added. Each pattern follows the same principle: build with a simple local implementation, upgrade to a production service later by swapping one file._
