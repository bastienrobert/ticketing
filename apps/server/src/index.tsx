import { and, asc, eq, getTableColumns } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'

import { createAuth } from './auth'
import {
  events as eventsSchema,
  favorites as favoritesSchema,
} from './db/schema'

const app = new Hono<{
  Bindings: CloudflareBindings
  Variables: { userId: string }
}>()

app.get('/', (c) => {
  return c.json({ health: 'ok' })
})

app.get('/events', async (c) => {
  const events = await drizzle(c.env.DB)
    .select()
    .from(eventsSchema)
    .orderBy(asc(eventsSchema.startsAt))

  return c.json(events)
})

app.on(['GET', 'POST'], '/api/auth/*', (c) => {
  return createAuth(c.env, c.req.raw).handler(c.req.raw)
})

// favorites belong to the signed-in account: the app sends its session cookie
app.use('/favorites/*', async (c, next) => {
  const session = await createAuth(c.env, c.req.raw).api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) return c.json({ error: 'Unauthorized' }, 401)

  c.set('userId', session.user.id)
  await next()
})

// the whole events, so the app can show its favorites offline
app.get('/favorites', async (c) => {
  const favorites = await drizzle(c.env.DB)
    .select(getTableColumns(eventsSchema))
    .from(favoritesSchema)
    .innerJoin(eventsSchema, eq(favoritesSchema.eventId, eventsSchema.id))
    .where(eq(favoritesSchema.userId, c.var.userId))
    .orderBy(asc(eventsSchema.startsAt))

  return c.json(favorites)
})

// PUT and DELETE are idempotent: the app can replay a change whose response was lost
app.put('/favorites/:eventId{[0-9]+}', async (c) => {
  const db = drizzle(c.env.DB)
  const eventId = Number(c.req.param('eventId'))

  const [event] = await db
    .select({ id: eventsSchema.id })
    .from(eventsSchema)
    .where(eq(eventsSchema.id, eventId))

  if (!event) return c.json({ error: 'Not Found' }, 404)

  await db
    .insert(favoritesSchema)
    .values({ userId: c.var.userId, eventId })
    .onConflictDoNothing()

  return c.body(null, 204)
})

app.delete('/favorites/:eventId{[0-9]+}', async (c) => {
  await drizzle(c.env.DB)
    .delete(favoritesSchema)
    .where(
      and(
        eq(favoritesSchema.userId, c.var.userId),
        eq(favoritesSchema.eventId, Number(c.req.param('eventId'))),
      ),
    )

  return c.body(null, 204)
})

export default app
