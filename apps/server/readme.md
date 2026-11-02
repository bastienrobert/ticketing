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
