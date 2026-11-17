# ADR-003: Managing Accounts with Better Auth on Our API

**Status:** Accepted  
**Date:** 2026-11-17

## Decision

We have decided to manage accounts with **Better Auth**, mounted on the API ([ADR-002](002-hono-cloudflare-d1.md)) under `/api/auth/*`, with **email and password** sign-in. Its tables live in D1 next to ours, and the mobile app talks to it through the Better Auth client with its Expo plugin.

## Background

Users need an account to keep their favorites and tickets across devices. The account data must stay in our database so that later features can link it to our own tables.

On mobile, the session must survive app restarts and be stored securely, not in plain storage.

## Considerations

We evaluated three approaches:

- **Hosted auth (Clerk, Auth0, Supabase Auth):** Ready-made screens and providers, but users live in a third-party service, with its pricing and its SDK in both apps.
- **Hand-written auth:** Full control, but password hashing, sessions, expiry and rate limiting are easy to get wrong.
- **Better Auth:** An open-source TypeScript library running inside our Worker, with a Drizzle adapter for D1, an Expo plugin and built-in rate limiting.

## Consequences

- Users, sessions and accounts are rows in D1 (`user`, `session`, `account`, `verification`), managed through our Drizzle migrations.
- The Worker builds Better Auth for each request, because the D1 binding only exists inside a request. The base URL comes from the request, so there is nothing to configure per environment.
- `BETTER_AUTH_SECRET` is never committed: `.env` in dev, `wrangler secret put` in production.
- The server only trusts requests whose origin is the app's scheme (`ticketing://`), plus Expo Go in development.
- On the phone, the Expo plugin keeps the session cookie in SecureStore (Keychain on iOS, Keystore on Android).
- Auth routes are rate-limited per IP (`cf-connecting-ip`). Counters are stored in D1, because each Worker instance has its own memory.
- Sign-up asks for an email and a password only: the email stands in for the name Better Auth requires.
- There is no email verification, password reset or social sign-in yet.

## Ownership

The development team is responsible for the auth configuration, the secret and the Better Auth upgrades.

## Review

This decision will be revisited if we need social sign-in, multi-factor authentication or a single account shared with other products.
