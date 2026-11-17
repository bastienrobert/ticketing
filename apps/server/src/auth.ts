import { expo } from '@better-auth/expo'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/d1'

import * as schema from './db/schema'

/** Better Auth for one request: the D1 binding only exists inside a request on Workers. */
export function createAuth(env: CloudflareBindings, request: Request) {
  return betterAuth({
    database: drizzleAdapter(drizzle(env.DB), { provider: 'sqlite', schema }),
    // a request only reaches the Worker through its own domains, so its origin is the Worker's URL
    baseURL: new URL(request.url).origin,
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: { enabled: true },
    // the app's scheme from app.json; the Expo plugin also trusts Expo Go (`exp://`) in development
    trustedOrigins: ['ticketing://'],
    plugins: [expo()],
  })
}
