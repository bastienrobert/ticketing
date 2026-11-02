import { asc } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'

import { events as eventsSchema } from './db/schema'

const app = new Hono<{ Bindings: CloudflareBindings }>()

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

export default app
