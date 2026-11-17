# @ticketing/mobile

Expo app (SDK 58) using [Expo Router](https://docs.expo.dev/router/introduction): every file in `src/app` is a route.

```bash
pnpm dev                        # Metro dev server
pnpm ios | android | web        # start and open on a platform
pnpm lint
pnpm exec expo install <pkg>    # always use this to add dependencies
```

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` (production by default). For a local `apps/server`, use `http://localhost:5173`. Both `.env` and `.env.local` (optional overrides) are ignored. Restart Metro with `--clear` after changing the URL.
