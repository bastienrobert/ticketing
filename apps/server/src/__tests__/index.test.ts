import { drizzle } from 'drizzle-orm/d1'
import { migrate } from 'drizzle-orm/d1/migrator'
import { afterAll, describe, expect, it } from 'vitest'
import { getPlatformProxy } from 'wrangler'

import { events } from '../db/schema'
import app from '../index'

// an in-memory D1 for each run, migrated from scratch: the local dev database is never touched
const proxy = await getPlatformProxy<CloudflareBindings>({ persist: false })
const env = {
  ...proxy.env,
  BETTER_AUTH_SECRET: 'test-secret-only-used-by-vitest-runs',
}
afterAll(() => proxy.dispose())

await migrate(drizzle(env.DB), { migrationsFolder: 'migrations' })

const [event] = await drizzle(env.DB)
  .insert(events)
  .values({
    title: 'Événement démo',
    startsAt: new Date('2026-12-31T18:30:00Z'),
  })
  .returning()

function request(method: string, path: string, cookie = '') {
  return app.request(path, { method, headers: { cookie } }, env)
}

/** Create an account and return its session cookie, as the app sends it. */
async function signUp(email: string) {
  const response = await app.request(
    '/api/auth/sign-up/email',
    {
      method: 'POST',
      headers: { origin: 'ticketing://', 'content-type': 'application/json' },
      body: JSON.stringify({
        name: email,
        email,
        password: 'password-for-tests',
      }),
    },
    env,
  )

  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';')[0])
    .join('; ')
}

const ada = await signUp('ada@example.com')
const grace = await signUp('grace@example.com')

describe('favorites', () => {
  it.each([
    ['GET', '/favorites'],
    ['PUT', `/favorites/${event.id}`],
    ['DELETE', `/favorites/${event.id}`],
  ])('refuse %s %s sans session', async (method, path) => {
    expect((await request(method, path)).status).toBe(401)
  })

  it('returns 404 for an unknown event', async () => {
    expect((await request('PUT', '/favorites/999', ada)).status).toBe(404)
  })

  it('adds a favorite only once, even if replayed', async () => {
    await request('PUT', `/favorites/${event.id}`, ada)
    const replayed = await request('PUT', `/favorites/${event.id}`, ada)
    const favorites = await request('GET', '/favorites', ada)

    expect(replayed.status).toBe(204)
    expect(await favorites.json()).toEqual([
      expect.objectContaining({ id: event.id, title: 'Événement démo' }),
    ])
  })

  it('keeps each account’s favorites separate', async () => {
    await request('PUT', `/favorites/${event.id}`, ada)
    await request('DELETE', `/favorites/${event.id}`, grace)

    expect(await (await request('GET', '/favorites', grace)).json()).toEqual([])
    expect(await (await request('GET', '/favorites', ada)).json()).toHaveLength(
      1,
    )
  })
})
