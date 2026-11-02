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

Rows keep their local ids, so running it against a non-empty table fails on duplicate keys.
