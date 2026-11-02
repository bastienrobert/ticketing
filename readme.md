# Ticketing

pnpm + Turborepo monorepo.

| App                            | Stack                                      | Dev URL                 |
| ------------------------------ | ------------------------------------------ | ----------------------- |
| [`apps/mobile`](apps/mobile)   | Expo (React Native), Expo Router           | Metro on `:8081`        |
| [`apps/server`](apps/server)   | Hono on Cloudflare Workers, built by Vite  | `http://localhost:5173` |

Architecture decisions live in [`docs/adr`](docs/adr).

## Setup

Requires Node 24+ and pnpm 12 (`devEngines` downloads the pinned version if needed).

```bash
pnpm install
```

## Commands

```bash
pnpm dev     # run mobile + server in parallel (Turborepo TUI)
pnpm build   # build every app that has a build script
```

## Dependencies

Install from the root, targeting an app:

```bash
pnpm -F @ticketing/server add <pkg>
pnpm -F @ticketing/mobile exec expo install <pkg>   # SDK-compatible versions
```
