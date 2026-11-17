# ADR-002: Hosting the API on Cloudflare Workers with Hono, D1 and Drizzle

**Status:** Accepted  
**Date:** 2026-11-02

## Decision

We have decided to build the API with **Hono on Cloudflare Workers**, store data in **Cloudflare D1** (SQLite) and access it with **Drizzle ORM**. The schema lives in `apps/server/src/db/schema.ts`; drizzle-kit generates the SQL migrations and Wrangler applies them.

## Background

The mobile app needs a shared events catalogue served over HTTP, and later accounts and favorites. The team is small and does not want to run servers or a database host.

We want the same language on both sides and a local setup close to production.

## Considerations

We evaluated three approaches:

- **Backend-as-a-Service (Supabase, Firebase):** Fast to start, but business logic moves into a vendor console and SDK, and the API contract is the vendor's.
- **Node server (Express, Fastify) with Postgres:** Familiar, but a server and a database to host, patch and scale.
- **Hono on Workers with D1:** TypeScript, web-standard `Request`/`Response`, no server to manage, a SQLite database bound to the Worker, and local development on the Workers runtime through `@cloudflare/vite-plugin`.

For data access, Drizzle declares a typed schema in TypeScript, generates plain SQL migrations and has a thin runtime that works on D1, where heavier ORMs need adapters.

## Consequences

- One language (TypeScript) across mobile and server.
- In dev, D1 is a local SQLite under `.wrangler/state`, filled by `pnpm db:seed` from OpenAgenda.
- Every schema change goes through `pnpm db:generate` and a committed migration.
- Prod migrations run in `predeploy`, before `wrangler deploy`: the deploy command must stay `pnpm run deploy`.
- D1 is SQLite: no Postgres-specific features, and Workers have CPU and memory limits per request.
- D1 ties us to Cloudflare; Hono itself runs on other runtimes.

## Ownership

The development team is responsible for the schema, the migrations and the deployment pipeline.

## Review

This decision will be revisited if data volume, query needs or Workers limits outgrow D1.
