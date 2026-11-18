# @ticketing/server

[Hono](https://hono.dev) API on Cloudflare Workers, served in dev by Vite with `@cloudflare/vite-plugin`. Entry point: `src/index.tsx`.

```bash
pnpm dev           # http://localhost:5173
pnpm build
pnpm preview       # build, then serve with the Workers runtime
pnpm run deploy    # remote D1 migrations, then wrangler deploy; build first (`pnpm deploy` is a pnpm built-in)
pnpm cf-typegen    # regenerate CloudflareBindings after editing wrangler.jsonc
```

Type bindings with `new Hono<{ Bindings: CloudflareBindings }>()`.

## Database

Cloudflare D1 (binding `DB`), accessed with [Drizzle](https://orm.drizzle.team). In dev it's a local SQLite under `.wrangler/state`, shared by `pnpm dev` and the scripts below.

```bash
pnpm db:generate   # SQL migration in ./migrations from src/db/schema.ts
pnpm db:migrate    # apply migrations to the local DB
pnpm db:seed       # replace local events with 100 upcoming Shotgun events from OpenAgenda (all of France)
```

First run in dev: `pnpm db:migrate && pnpm db:seed`.

## Auth

Email + password accounts with [Better Auth](https://www.better-auth.com) (`src/auth.ts`), mounted on `/api/auth/*`, with the Expo plugin for the app. Its tables (`user`, `session`, `account`, `verification`) live in `src/db/schema.ts`. Requests need an `Origin` header (the app sends `ticketing://`).

```text
POST /api/auth/sign-up/email   { name, email, password }   → 200 · 400 · 422
POST /api/auth/sign-in/email   { email, password }         → 200 · 401
POST /api/auth/sign-out                                    → 200
GET  /api/auth/get-session                                 → session or null
```

The base URL comes from each request (`src/auth.ts`), so there is nothing to set per environment. The secret is not committed:

```bash
cp .env.example .env                       # local, ignored by Git
openssl rand -base64 32                     # set BETTER_AUTH_SECRET in .env to this value
pnpm wrangler secret put BETTER_AUTH_SECRET # production, once
```

## Favorites

Routes for the signed-in account (401 otherwise); the app sends its session cookie. PUT and DELETE are idempotent, so the app can replay a change made offline.

```text
GET    /favorites            → favorite events, like /events
PUT    /favorites/:eventId   → 204 · 404 unknown event
DELETE /favorites/:eventId   → 204
```

## Deploy

```bash
pnpm build && pnpm run deploy
```

`predeploy` applies pending migrations to the remote D1 before `wrangler deploy`, so the schema is ready before the new code goes live; if a migration fails, nothing is deployed. pnpm runs `pre*` scripts by default.

### CD with Workers Builds

Connect the GitHub repo to the `ticketing-server` Worker (dashboard › Settings › Builds) with:

| Setting        | Value             |
| -------------- | ----------------- |
| Root directory | `apps/server`     |
| Build command  | `pnpm run build`  |
| Deploy command | `pnpm run deploy` |

Keep the deploy command on `pnpm run deploy`: the default `npx wrangler deploy` skips `predeploy`, so migrations would never run.

The API token Workers Builds generates has no D1 access, so the migration step fails with error `7403`. Add **Account › D1 › Edit** to that token (My Profile › API Tokens), or pick a token that has it under Settings › Builds › API token.

### Seed prod (first deploy only)

`pnpm db:seed` only writes to the local DB. To copy local events to an empty prod `events` table:

```bash
pnpm db:seed
pnpm wrangler d1 export DB --local --table events --no-schema --output seed.sql
pnpm wrangler d1 execute DB --remote --file seed.sql && rm seed.sql
```

Rows keep their local ids, so running it against a non-empty table fails on duplicate keys. To replace prod events (e.g. after adding columns), empty the table first:

```bash
pnpm wrangler d1 execute DB --remote --command "DELETE FROM events"
```
