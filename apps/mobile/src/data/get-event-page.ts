import { eventAdapter } from './adapters/events.adapters'
import { fetchApi } from '~/lib/api'

import type { EventPageData } from '~/app/events/[id]'

/** Find one event for its sheet; `null` when the id is unknown or the payload unusable. */
export async function getEventPage(
  eventId: number,
  signal: AbortSignal,
): Promise<EventPageData | null> {
  const events = await fetchApi('/events', signal)

  if (!Array.isArray(events)) return null

  const event = events.find((candidate) => candidate.id === eventId)

  if (!event) return null

  return eventAdapter(event)
}
