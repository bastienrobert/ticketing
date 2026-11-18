# @ticketing/mobile

Expo app (SDK 58) using [Expo Router](https://docs.expo.dev/router/introduction): every file in `src/app` is a route.

```bash
pnpm dev                        # Metro dev server
pnpm ios | android              # development build: compile, install and open
pnpm lint
pnpm test                       # unit tests (Jest), in src/__tests__ mirroring src
pnpm exec expo install <pkg>    # always use this to add dependencies
```

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` (production by default). For a local `apps/server`, use `http://localhost:5173`. Both `.env` and `.env.local` (optional overrides) are ignored. Restart Metro with `--clear` after changing the URL.

## Local database

SQLite on the phone ([expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite) + [Drizzle](https://orm.drizzle.team/docs/connect-expo-sqlite)), schema in `src/db/schema.ts`.
The root layout applies the migrations at launch (`useMigrations`).

```bash
pnpm db:generate   # migration in src/db/migrations after editing the schema
```

`babel.config.js` and `metro.config.js` exist only to bundle those `.sql` migrations.

## Apple Pay

Buying a ticket opens the Apple Pay sheet from a local native module: `modules/apple-pay` (Swift and PassKit), autolinked by Expo. The payment is mocked: the module accepts the authorization after one second and nothing is charged.

Expo Go doesn't embed the project's own modules, so the button only shows in a development build.

After a purchase, the event goes to the default calendar. iOS asks for write-only access on the first purchase; iOS reads the reason it shows from `src/data/messages/native/fr.json` (`locales` in `app.json`), translated at build time since the JS isn't running yet.
