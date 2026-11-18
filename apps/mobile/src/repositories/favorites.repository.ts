import { asc, eq } from 'drizzle-orm'

import { favorites } from '~/db/schema'
import { ApiError, fetchApi } from '~/lib/api'
import { db } from '~/lib/db'

let controller = new AbortController()

async function pull(signal: AbortSignal) {
  const events = await fetchApi('/favorites', { signal })

  if (signal.aborted || !Array.isArray(events)) return

  db.transaction((tx) => {
    tx.delete(favorites).run()
    if (events.length > 0) tx.insert(favorites).values(events).run()
  })
}

export const favoritesRepository = {
  getAll() {
    return db.select().from(favorites).orderBy(asc(favorites.startsAt)).all()
  },

  getIds() {
    return db
      .select({ id: favorites.id })
      .from(favorites)
      .all()
      .map(({ id }) => id)
  },

  find(eventId: number) {
    const [favorite] = db
      .select()
      .from(favorites)
      .where(eq(favorites.id, eventId))
      .all()

    return favorite
  },

  async sync() {
    try {
      await pull(controller.signal)
      return true
    } catch (error) {
      return error instanceof ApiError
    }
  },

  async add(eventId: number) {
    await fetchApi(`/favorites/${eventId}`, {
      method: 'PUT',
      signal: controller.signal,
    })
    await pull(controller.signal)
  },

  async remove(eventId: number) {
    await fetchApi(`/favorites/${eventId}`, {
      method: 'DELETE',
      signal: controller.signal,
    })
    await pull(controller.signal)
  },

  clear() {
    controller.abort()
    controller = new AbortController()

    db.delete(favorites).run()
  },
}
