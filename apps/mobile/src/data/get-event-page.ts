import { eventsRepository } from '~/repositories/events.repository'
import { favoritesRepository } from '~/repositories/favorites.repository'

import { eventAdapter } from './adapters/events.adapters'

import type { EventPageData } from '~/app/events/[id]'

/** Find one event for its sheet; `null` when the id is unknown or the payload unusable. */
export async function getEventPage(
  eventId: number,
  signal: AbortSignal,
): Promise<EventPageData | null> {
  const favorite = favoritesRepository.find(eventId)
  if (favorite) return eventAdapter(favorite)

  const events = await eventsRepository.getAll(signal)

  if (!Array.isArray(events)) return null

  const event = events.find((candidate) => candidate.id === eventId)

  if (!event) return null

  return eventAdapter(event)
}
