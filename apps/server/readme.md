# @ticketing/server

[Hono](https://hono.dev) API on Cloudflare Workers, served in dev by Vite with `@cloudflare/vite-plugin`. Entry point: `src/index.tsx`.

```bash
pnpm dev           # http://localhost:5173
pnpm build
pnpm preview       # build, then serve with the Workers runtime
pnpm run deploy    # build, then wrangler deploy (`pnpm deploy` is a pnpm built-in)
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

First run: `pnpm db:migrate && pnpm db:seed`. In prod, `wrangler deploy` creates the D1 (no `database_id` needed), then `pnpm wrangler d1 migrations apply DB --remote`.
